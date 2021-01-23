const Sequelize = require('sequelize');
const databaseConfig = require('../config/database')

const User = require('../models/user');

const sequelize = new Sequelize(databaseConfig);

User.init(sequelize);

module.exports = sequelize;