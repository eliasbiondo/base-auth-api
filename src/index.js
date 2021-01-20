// Modules importing
const express = require('express');
const env = require('dotenv'); env.config();
const colors = require('colors');


// General files importing
const notFoundErrorHandler = require('./controllers/404Handler')
const sequelize = require('./database/index')


// General app settings
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// App routers import
const APIRouter = require('./routes/api')


// App routes define
app.use('/api', APIRouter);
app.use(notFoundErrorHandler);

// Database general settings
sequelize.authenticate().then(() => {
    console.log('Database started successfully'.bold.green)
}).catch(error => {
    console.log('There was an error with the database connection: \n'.bold.red + error)
})

// Server settings
const port = process.env.PORT || 3001;
app.listen(port, error => {
    console.log(`${
        error ? '\nThere was an error with the server starting'.bold.red : '\nServer started successfully!'.bold.green
    }`);
})