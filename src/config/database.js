const env = require('dotenv'); env.config();

module.exports = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    }
}