const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/index');

const Invalidated_token = sequelize.define('invalidated_token', {
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expires_in: {
    type: DataTypes.DATE,
    allowNull: false
  },
})

Invalidated_token.sync({force: false});

module.exports = Invalidated_token;