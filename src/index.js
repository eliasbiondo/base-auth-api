const express = require("express");
const colors = require("colors");
const env = require("dotenv").config();

const sequelize = require("./database");
const authApiRouter = require("./routes/api/auth")
const notFoundHelper = require("./helpers/notFound");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/auth', authApiRouter);
app.use(notFoundHelper);

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
