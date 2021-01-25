const jwt = require("jsonwebtoken");
const tokenConfig = require("../config/token.json");

module.exports = (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({status: 401, error: "no token provided"})
    }

    const splittedAuthHeader = authorization.split(" ");

    if (splittedAuthHeader.length != 2) {
        return res.status(401).json({status: 401, error: "invalid token format"})
    }

    if (splittedAuthHeader[0] != "Bearer") {
        return res.status(401).json({status: 401, error: "invalid token schema"})
    }

    const token = splittedAuthHeader[1];

    try {
        const decoded = jwt.verify(token, tokenConfig.secret)

        const { id, full_name, username, email } = decoded;

        req.user = {
            id,
            full_name,
            username,
            email
        }

        next();


    } catch (error) {
        return res.status(401).json({status: 401, error: "invalid token"})
    }

}