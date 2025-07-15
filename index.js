const express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error } = require('console');


const app = express();

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'flashcard_game'
});

connection.connect(error =>{
    if(error) throw error;
    console.log('Connected to MySQL');
});

app.get('/flashcards', (req, res) => {
    let query = 'SELECT * FROM flashcards';
    const params = [];
    
    if (req.query.category) {
        query += ' WHERE category = ?';
        params.push(req.query.category);
    }
    
    connection.query(query, params, (error, results) => {
        if (error) {
            console.error('Error fetching flashcards:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

//categories
app.get('/categories', (req, res) => {
    const query = 'SELECT DISTINCT category FROM flashcards';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching categories:', error);
            return res.status(500).json({ error: 'Database query error' });
        }
        const categories = results.map(row => row.category);
        res.json(categories);
    });
});

app.post('/flashcards', (req, res) => {
    const { question, answer, category } = req.body;
    const query = 'INSERT INTO flashcards (question, answer, category) VALUES (?, ?, ?)';
    
    connection.query(query, [question, answer, category], (error, results) => {
        if (error) {
            console.error('Error creating flashcard:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ 
            message: 'Flashcard created successfully',
            id: results.insertId 
        });
    });
});

app.put('/flashcards/:id', (req, res) => {
    const cardId = req.params.id;
    const { question, answer, category } = req.body;
    const query = 'UPDATE flashcards SET question = ?, answer = ?, category = ? WHERE id = ?';
    
    connection.query(query, [question, answer, category, cardId], (error, results) => {
        if (error) {
            console.error('Error updating flashcard:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        
        res.json({ message: 'Flashcard updated successfully' });
    });
});

app.delete('/flashcards/:id', (req, res) => {
    const cardId = req.params.id;
    const query = 'DELETE FROM flashcards WHERE id = ?';
    
    connection.query(query, [cardId], (error, results) => {
        if (error) {
            console.error('Error deleting flashcard:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        
        res.json({ message: 'Flashcard deleted successfully' });
    });
});



app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
});