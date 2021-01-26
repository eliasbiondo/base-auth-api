const nodemailer = require("nodemailer");
const mail_config = require("../config/mail");

module.exports = nodemailer.createTransport(mail_config)