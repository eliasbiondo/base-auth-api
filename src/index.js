const express = require("express");
const env = require("dotenv").config();
const colors = require("colors");

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
