// Importing required files
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // Getting the user id from request (setted by authentication token middleware)
  const { id } = req.user;

  let user = {};

  // Getting data about user from database
  try {
    user = await User.findOne({ where: { id } });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: "failed to validate data",
      message:
        "Please, try again later. If the error persists, notify the website adminitrator.",
    });
  }

  // Checking if user has not yet confirmed it email adress.
  if (!user.is_verified) {
    return res.status(401).json({
      status: 401,
      error: "restrict route",
      message: "Confirm your email address before continue.",
    });
  }

  next();
};
