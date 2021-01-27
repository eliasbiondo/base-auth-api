const { request } = require('express');
const User = require("../models/User");

module.exports = async (req, res, next) => {
    
    // Getting the current logged user info from request (setted by authentication token middleware)
    let requester = req.user;

    // Getting data about requester user from database
    try {
        requester.data = (await User.findByPk(requester.id)).dataValues;
    } catch (error) {
        return res.status(500).json({
        status: 500,
        error: "failed to validate data",
        message:
            "Please, try again later. If the error persists, notify the website adminitrator.",
        });
    }

    // Setting the role of requester user
    requester.permission_level = requester.data.permission_level;

    if ( requester.permission_level < 8) {
        requester.role = "default";
        req.user.role = "default";
    } else if (requester.permission_level < 10) {
        requester.role = "moderator";
        req.user.role = "moderator";
    } else {
        requester.role = "administrator"
        req.user.role = "administrator";
    }

    // Getting the target id (setted by URL -> domain.com/api/v1/auth/users/:id)
    const target_id = req.params.id;

    // Sending an error response if requester_id != target_id
    if (requester.id != target_id) {
        return res.status(401).json({
            status: 401,
            error: "restrict route",
            message: "You don't have the necessary permission to access this route.",
            });
    }

    next();

}