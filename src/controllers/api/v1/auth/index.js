const ejs = require("ejs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

const User = require("../../../../models/User");
const fieldsValidator = require("../../../../helpers/fieldsValidator");
const tokenConfig = require("../../../../config/tokens");
const transporter = require("../../../../mail");

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

      return res.status(200).json({
        status: 200,
        message: "successfully authenticated",
        data: { id, full_name, username },
        token,
      });
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

        return res.status(200).json({
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
        return res.status(401).json({
          status: 401,
          error: "unauthorized",
          message:
            "You cannot request an email verification for user other than yourself.",
        });
      }

      // Getting the user data
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

      // Checking if user is already verified
      if (user.is_verified) {
        return res.status(400).json({
          status: 400,
          error: "email already confirmed",
        });
      }

      // Getting token expiration time
      let date = new Date();
      let exp = date.setMinutes(date.getMinutes() + 15);
      let exp_ = new Date(exp);

      // Generating the email verification token
      const token = jwt.sign({ id }, tokenConfig.mail.secret, {
        expiresIn: 900,
      });

      // Sending the verification email
      try {
        let email;

        try {
          const app_name = process.env.APP_NAME;
          const user_id = user.id;
          const user_email = user.email;

          // Building the custom email verification link setted on .env file (to fire the email verification by frontend)
          let email_verification_link = process.env.APP_CUSTOM_EMAIL_VERIFICATION_LINK;

          email_verification_link = email_verification_link.replace(":id:", user_id);
          email_verification_link = email_verification_link.replace(":email:", user_email);
          email_verification_link = email_verification_link.replace(":token:", token);

          // Building email by ejs template
          email = await ejs.renderFile(
            path.resolve(
              __dirname,
              "../../../../",
              "mail",
              "views/confirm_email.ejs"
            ),
            {
              app_name,
              user_id,
              token,
              email_verification_link,
            }
          );
        } catch (error) {
          console.log(error);

          return res.status(500).json({
            status: 500,
            error: "failed to send validation token to user's email",
            message:
              "Please, try again later. If the error persists, notify the website adminitrator.",
          });
        }

        // Sending email
        await transporter.sendMail({
          from: `'${process.env.APP_NAME} 👻' <${process.env.MAIL_USER}>`,
          to: user.email,
          subject: "📬 Please verify your email address",
          html: email,
        });

        return res.status(200).json({
          status: 200,
          message: `Email sent successfully.`,
          data: {
            from: process.env.MAIL_USER,
            to: user.email,
            exp,
            exp_,
          },
        });
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          status: 500,
          error: "failed to send validation token to user's email",
          message:
            "Please, try again later. If the error persists, notify the website adminitrator.",
        });
      }
    },

    async validate_token(req, res) {
      // Getting the id of target user setted by id parameter in URL -> (domain.com/api/v1/auth/users/:id/verify)
      const { id } = req.params;

      // Getting the email verification token from body request
      const { email_verification_token } = req.body;

      // Checking if exists an email verification token and sending and error response if false
      if (!email_verification_token) {
        return res
          .status(400)
          .json({ status: 401, error: "no email verification token provided" });
      }

      // Validating email verification token and sending an error response if token isn't valid
      let decoded;

      try {
        decoded = jwt.verify(email_verification_token, tokenConfig.mail.secret);
      } catch (error) {
        return res.status(400).json({
          status: 401,
          error: "invalid or expired email verificantion token",
        });
      }

      if (decoded.id != id) {
        return res.status(400).json({
          status: 401,
          error: "invalid or expired email verificantion token",
        });
      }

      // Getting the user data
      let user = {};

      try {
        user = await User.findByPk(id);
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          status: 500,
          error: "failed to get data",
          message:
            "Please, try again later. If the error persists, notify the website adminitrator.",
        });
      }

      // Checking if user is already verified
      if (user.dataValues.is_verified) {
        return res.status(400).json({
          status: 400,
          error: "email already confirmed",
        });
      }

      // confirming user's email
      try {
        user.is_verified = 1;
        await user.save();
        return res
          .status(200)
          .json({ status: 200, message: "email confirmed successfully" });
      } catch (error) {
        console.log(error);

        return res.status(500).json({
          status: 500,
          error: "failed to save data",
          message:
            "Please, try again later. If the error persists, notify the website adminitrator.",
        });
      }
    }
  },
  
  async get_users(req, res) {

    let users;
    
    try {
      users = await User.scope('withoutPassword').findAll();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: "failed to get data",
        message:
          "Please, try again later. If the error persists, notify the website adminitrator.",
      });
    }

    return res.status(200).json({status: 200, users})


  },

  async get_user(req, res) {

    const { id } = req.params

    let user;
    
    try {
      user = await User.scope('withoutPassword').findByPk( id );
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: "failed to get data",
        message:
          "Please, try again later. If the error persists, notify the website adminitrator.",
      });
    }
    
    return res.status(200).json({status: 200, user})
  }

};
