// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const dbstring = process.env.MONGO_URI;

mongoose.connect(dbstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Connection Successful');
});

connection.on('error', (err) => {
    console.error('Connection Unsuccessful', err);
});
