const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/index');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

User.sync({force: false});

module.exports = User;