const env = require("dotenv").config();

module.exports = {
    session: {
        secret: process.env.JWT__SESSION_ENCRYPTATION_KEY
    },
    mail: {
        secret: process.env.JWT__MAIL_CONFIRM_ENCRYPTATION_KEY
    }
}