const jwt = require('jsonwebtoken');
const jsonwebtokenConfig = require('../../config/token.json')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({code: 401, error: 'No token provided!'})
    }

    const splittedAuthHeader = authHeader.split(' ');

    if (splittedAuthHeader.length != 2) {
        return res.status(401).json({code: 401, error: 'Invalid token structure!'})
    }

    const [scheme, token] = splittedAuthHeader;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({code: 401, error: 'Invalid token scheme!'})
    }

    jwt.verify(token, jsonwebtokenConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({code: 401, error: 'Invalid token!'})
        }

        req.userId = decoded.id;
        next();
    })
}