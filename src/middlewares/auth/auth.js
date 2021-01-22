const jwt = require('jsonwebtoken');
const jsonwebtokenConfig = require('../../config/token.json');
const Invalidated_token = require('../../models/invalidated_tokens');

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

        Invalidated_token.findOne(
            {where: 
                {
                    token
                }
            }
        ).then((invalidated_token) => {
            if (invalidated_token) {
                return res.status(401).json({code: 401, error: 'The token provided was invalidated due to a password change!'})
            }

            req.token = token;
            req.userId = decoded.id;
            req.tokenIat = decoded.iat;
            req.tokenExp = decoded.exp;
            next();
        })

    })
}