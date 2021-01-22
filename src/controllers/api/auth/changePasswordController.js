const User = require('../../../models/users');
const Invalidated_token = require('../../../models/invalidated_tokens')
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    
    const user = await User.findOne({where: {id: req.userId}})
    
    if (!user) {
        return res.status(400).json({code: 400, error: 'User id not found!'})
    }
    
    const { newpassword } = req.body;
    
    if (!newpassword) {
        return res.status(400).json({code: 400, error: 'No new password provided!'})
    }

    const {token, tokenExp} = req;

    const expires_in = new Date(tokenExp * 1000);

    Invalidated_token.create({
        token,
        expires_in
    }).then(async () => {

        const hashedNewPassword = await bcrypt.hash(newpassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({'status': 'success', 'message': 'password changed successfully', id: user.id})

    }).catch(error => {
        res.status(400).json({code: 400, error: 'There was an error while invalidating the token. The password cannot to be changed! Try again'})
    })


}