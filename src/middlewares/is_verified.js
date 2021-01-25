const User = require("../models/User");

module.exports = async (req, res, next) => {

    const { id } = req.user;

    let user = {};

    try {
        user = await User.findOne({where: {id}})
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: "failed to validate data",
            message:
              "Please, try again later. If the error persists, notify the website adminitrator.",
          });
    }

    if (!user.is_verified) {
        return res.status(401).json({status: 401, error: "restrict route", message: "Verify your email address before continue."})
    }

    next();

}