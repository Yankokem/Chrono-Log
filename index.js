const express = require('express');
const path = require('path');
const mysql = require('mysql');
const { error } = require('console');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'flashcard_game'
});

connection.connect(error =>{
    if(error) throw err;
    console.log('Connected to MySQL');
});

app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
});




