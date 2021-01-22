const express = require('express');
const colors = require('colors');
const env = require('dotenv'); env.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const notFoundHelper = require('./helpers/notFound')
const apiRouter = require('./routes/api/index')
const sequelize = require('./database/index')

app.use('/api', apiRouter);
app.use(notFoundHelper);

sequelize.authenticate().then(() => {
    console.log('The database connection has been established successfully!'.bold.green);
}).catch(error => {
    console.log('There was an error with the database connection: '.bold.red + error)
})

const port = process.env.PORT || 3001;

app.listen(port, error => {
    console.log(
        `${error ? '\nThere was an error while server starting!'.bold.red : '\nServer starded successfully'.bold.green}`
    )
})