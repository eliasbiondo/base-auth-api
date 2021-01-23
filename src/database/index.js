const Sequelize = require('sequelize');
const databaseConfig = require('../config/database')

const User = require('../models/User');

const sequelize = new Sequelize(databaseConfig);

User.init(sequelize);

module.exports = sequelize;