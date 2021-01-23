const env = require('dotenv').config();

module.exports = {
    dialect: 'mysql',
    host: 'localhost',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    define: {
        timestamps: true,
        underscored: true
    }
}