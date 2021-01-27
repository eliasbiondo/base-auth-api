// Importing required packages
const jwt = require("jsonwebtoken");

// Importing required files
const tokenConfig = require("../config/tokens");

module.exports = (req, res, next) => {
  // Getting the authorization header from request
  const { authorization } = req.headers;

  // Checking if authorization header is null or undefined
  if (!authorization) {
    return res.status(401).json({ status: 401, error: "no token provided" });
  }

  // Checking the authorization header structure before validate token
  const splittedAuthHeader = authorization.split(" ");

  if (splittedAuthHeader.length != 2) {
    return res.status(401).json({ status: 401, error: "invalid token format" });
  }

  if (splittedAuthHeader[0] != "Bearer") {
    return res.status(401).json({ status: 401, error: "invalid token schema" });
  }

  // Validating token
  const token = splittedAuthHeader[1];

  try {
    const decoded = jwt.verify(token, tokenConfig.session.secret);

    const { id, full_name, username, email } = decoded;

    req.user = {
      id,
      full_name,
      username,
      email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ status: 401, error: "invalid token" });
  }
};
