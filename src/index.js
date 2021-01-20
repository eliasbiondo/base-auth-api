const express = require('express');
const env = require('dotenv');
const colors = require('colors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

const port = process.env.PORT || 3001;

app.listen(port, error => {
    console.log(`${
        error ? '\nThere was an error with the server starting'.bold.red : '\nServer started successfully!'.bold.green
    }`)
})