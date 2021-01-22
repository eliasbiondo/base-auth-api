const User = require('../../../models/users');
const bcrypt = require('bcrypt');
const tokenGenerator = require('../../../helpers/tokenGenerator');

module.exports = async (req, res) => {

    const {username, email, password} = req.body;

    const isTheUsernameAlreadyRegistered = await User.findOne({
        where: { username }
    })

    const isTheEmailAlreadyRegistered = await User.findOne({
        where: { email }
    })

    if (isTheUsernameAlreadyRegistered || isTheEmailAlreadyRegistered) {
        return res.status(400).json({'code': 400, 'error': 'The username or email already exists!'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    User.create({
        username,
        email,
        password: hashedPassword
    }).then((user) => {
        user.password = undefined;
        res.status(200).json({user, token: tokenGenerator({id: user.id})})
    }).catch(error => {
        res.status(400).json({error: 'Failed to create user!'})
    })
}