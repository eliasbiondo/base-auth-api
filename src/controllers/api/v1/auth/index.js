const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenConfig = require("../../../../config/tokens");
const nodemailer = require("nodemailer");
const transporter = require("../../../../config/mail");
const env = require("dotenv").config();

const User = require("../../../../models/User");
const fieldsValidator = require("../../../../helpers/fieldsValidator");

module.exports = {
  async signin(req, res) {
    // Validanting inputs
    const { valid_fields, invalid_fields } = fieldsValidator(req.body, [
      "email",
      "password",
    ]);

    // Returning an error response, detailing the reason for refusal if there's one or more invalid fields
    if (Object.keys(invalid_fields).length > 0) {
      return res.status(400).json({ status: 400, error: { invalid_fields } });
    }

    // Destructuring valid fields
    let { email, password } = valid_fields;

    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res
          .status(401)
          .json({ status: 400, error: "invalid email or password" });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res
          .status(401)
          .json({ status: 400, error: "invalid email or password" });
      }

      const { id, full_name, username, permission_level, is_verified } = user;

      const token = jwt.sign(
        { id, full_name, username, email, permission_level, is_verified },
        tokenConfig.session.secret,
        {
          expiresIn: 86400,
        }
      );

      return res
        .status(200)
        .json({ status: 200, message: "authenticated successfully", token });
    } catch (error) {
      console.log(error);
    }
  },

  async signup(req, res) {
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

    // Returning an error response, detailing the reason for refusal if there's one or more invalid fields
    if (Object.keys(invalid_fields).length > 0) {
      return res.status(400).json({ status: 400, error: { invalid_fields } });
    }

    // Destructuring valid fields
    let {
      username,
      email,
      password,
      full_name,
      birthday,
      profile_img,
    } = valid_fields;

    // Checking if the username or email address already exists
    try {
      let user = await User.findOne({
        where: {
          username,
        },
      });

      if (user) {
        return res.status(400).json({
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
        return res.status(400).json({
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
      profile_img,
    })
      .then((data) => {
        let { id, full_name, username, email } = data;

        // generating auth token
        const token = jwt.sign(
          { id, full_name, username, email, permission_level: 1 },
          tokenConfig.session.secret,
          {
            expiresIn: 86400,
          }
        );

        return res
          .status(200)
          .json({
            status: 200,
            message: "User created successfully",
            data: { id, full_name, username, email },
            token,
          });
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

  verify: {
    async request_token(req, res) {
      // Getting the id of current logged user setted by "authenticate" middleware
      const { id } = req.user;

      // Getting the id of target user setted by id parameter in URL -> (domain.com/api/v1/auth/users/:id/verify)
      const target_id = req.params.id;

      // Checking if logged user is another than target user. If true, sending an error response.
      if (id != target_id) {
        return res
          .status(401)
          .json({
            status: 401,
            error: "unauthorized",
            message:
              "You cannot request an email verification for user other than yourself.",
          });
      }

      // Checking if user has already done the email verification
      let user = {};

      try {
        user = (await User.findByPk(id)).dataValues;
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          status: 500,
          error: "failed to validate data",
          message:
            "Please, try again later. If the error persists, notify the website adminitrator.",
        });
      }

      if (user.is_verified) {
        return res.status(400).json({
          status: 400,
          error: "user already verified",
          message: "You have already done the email verification.",
        });
      }

      const token = jwt.sign({id}, tokenConfig.mail.secret, {
        expiresIn: 900
      });

      try {
        let mail = await transporter.sendMail({
          to: user.email,
          subject: "Please verify your email address",
          html: `
            <h1>Email Verification</h1>
            <p>${process.env.APP_NAME} needs to confirm your email address is valid. Please click the link below to confirm your email address.</p>
            <p> <a href="${process.env.APP_HOST}/api/v1/auth/users/${id}/verify/confirmation?token=${token}">Verify Email</a> </p>
            <p> Sincerely, ${process.env.APP_NAME} </p>
          `
        })

        console.log("Message sent: %s", mail.messageId);

        return res.status(200).json({status: 200, message: `email validation token sent successfully to ${user.email}`, expiration_time: "15 minutes"})

      } catch (error) {
        console.log(error);

        return res.status(500).json({
          status: 500,
          error: "failed to send email validation token",
          message:
            "Please, try again later. If the error persists, notify the website adminitrator.",
        });
      }
      


    },

    async validate_token(req, res) {
      res.status(200)
    },

    async web_email_validator(req, res) {
      const { token } = req.query

      if ( !token ) {
        res.status(400).send("<h1>No token provided.</h1>");
      }

      try {
        const { id } = jwt.verify(token, tokenConfig.mail.secret);

        const user = await User.findByPk(id)

        user.is_verified = 1;

        await user.save();

        return res.status(200).send("<h1>Email confirmed successfully.</h1>")

      } catch (error) {
        return res.status(401).send("<h1>Failed to verify the email address.</h1>");
      }

    }


  }
    
};
