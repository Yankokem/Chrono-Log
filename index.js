const express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error } = require('console');


const app = express();

const PORT = 8000;

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

// Simple endpoint to get all flashcards
app.get('/flashcards', (req, res) => {
    const query = 'SELECT * FROM flashcards';
    connection.query(query, (error, results) => {
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



app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
});