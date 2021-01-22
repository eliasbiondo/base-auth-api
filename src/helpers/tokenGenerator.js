const jwt = require('jsonwebtoken');
const token = require('../config/token.json')

function tokenGenerator(params = {}) {
    return jwt.sign(params, token.secret, { 
        expiresIn: 86400
    })
}

module.exports = tokenGenerator;