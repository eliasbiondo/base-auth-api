const User = require('../../../models/users');
const bcrypt = require('bcrypt');
const tokenGenerator = require('../../../helpers/tokenGenerator');

module.exports = async (req, res) => {
    const {email, password} = req.body;

    if (!email) {
        return res.status(400).json({code: 400, error: 'The email field cannot be null!'})
    }

    if (!password) {
        return res.status(400).json({code: 400, error: 'The password field cannot be null!'})
    }

    User.findOne({
        where: {
            email
        }
    }).then( (user) => {

        if (!user) {
            return res.status(400).json({code: 400, error: 'Invalid email or password!'})
        }

        const hashedPassword = user.password;
        
        bcrypt.compare(password, hashedPassword).then( result => {
            if (!result) {
                return res.status(400).json({code: 400, error: 'Invalid email or password!'})
            }

            user.password = undefined;

            res.status(200).json({
                user,
                token: tokenGenerator({id: user.id})
            })
        });
    })

}