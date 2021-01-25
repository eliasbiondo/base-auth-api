const User = require("../models/User");

module.exports = async (req, res, next) => {

    const { id } = req.user;

    let user = {};

    try {
        user = await User.findByPk(id)
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: "failed to validate data",
            message:
              "Please, try again later. If the error persists, notify the website adminitrator."
          });
    }

    user = user.dataValues;

    if (user.permission_level < 10) {
        return res.status(401).json({status: 401, error: "restrict route", message: "You don't have the necessary permission to access this route."})
    }

    next();

}