const express = require("express");
const colors = require("colors");
const env = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3001;
app.listen(port, (error) => {
  console.log(
    `${
      error
        ? "\nThere was an error while server starting.".bold.red
        : "\nServer starded successfully.".bold.green
    }`
  );
});

const sequelize = require("./database");
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "The database connection has been established successfully.".bold.green
    );
  })
  .catch((error) => {
    console.log("Unable to connect to the database: \n \n".bold.red, error);
  });
