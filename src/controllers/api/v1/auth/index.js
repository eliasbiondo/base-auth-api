const bcrypt = require("bcrypt");

const User = require("../../../../models/User");
const fieldsValidator = require("../../../../helpers/fieldsValidator");

module.exports = {
  async store(req, res) {
    // Validanting inputs
    const { valid_fields, invalid_fields } = fieldsValidator(req.body, [
      "username",
      "email",
      "password",
      "full_name",
      `${
        req.body.birthday || req.body.birthday == "" ? "birthday" : undefined
      }`, // It'll only be validated if declared in the request body
      `${
        req.body.profile_img || req.body.profile_img == ""
          ? "profile_img"
          : undefined
      }`, // It'll only be validated if declared in the request body
    ]);

    // Returning an error response, detailing the reason for the refusal if there's one or more invalid fields
    if (Object.keys(invalid_fields).length > 0) {
      return res
        .status(400)
        .json({ status: 400, error: { invalid_fields } });
    }

    // Destructuring valid fields
    let { username, email, password, full_name, birthday, profile_img } = valid_fields;

    // Checking if the username or email address already exists
    try {

      let user = await User.findOne({
        where: {
          username,
        },
      });

      if (user) {
        return res
          .status(400)
          .json({
            status: 400,
            error: "username already exists",
            message:
              "This username has already been taken, so it's no longer avaiable. Please, pick another one.",
          });
      }

      user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        return res
          .status(400)
          .json({
            status: 400,
            error: "email already exists",
            message:
              "This email address has already been registered. If you are the owner of this e-mail but you have not created this account, you must notify the website administrator. If you just forgot your password, you can retrieve it in the 'I forgot my password' section.",
          });
      }
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        status: 500,
        error: "failed to validate data",
        message:
          "Please, try again later. If the error persists, notify the website adminitrator.",
      });
    }

    // encrypting password
    password = await bcrypt.hash(password, 10);

    // storing user in database
    User.create({
        username,
        email,
        password,
        full_name,
        birthday,
        profile_img
    })
      .then((data) => {
        data.password = undefined;
        return res.status(200).json(data);
      })
      .catch((error) => {
        console.log(error);

        return res.status(500).json({
          status: 500,
          error:
            "Failed to record data. Please, try again later. If the error persists, notify the website adminitrator.",
        });
      });
  },
};
