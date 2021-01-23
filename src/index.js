// Importing required packages
const express = require("express");
const env = require("dotenv").config();
const colors = require("colors");

// Importing required files
const sequelize = require("./database");

// App & server settings
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3001;
app.listen(port, (error) => {
  console.log(`
    ${
      error
        ? "\nThere was an error while server starting: \n".bold.red + error
        : "\nServer started successfully".bold.green
    }
    `);
});

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "The database connection has been established successfully".bold.green
    );
  })
  .catch((error) => {
    console.log("Unable to connect to the database: \n".bold.red, error);
  });
