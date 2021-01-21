const User = require('../../../models/user');
const bcrypt = require('bcrypt');
const tokenGenerator = require('../../../helpers/tokenGenerator');

module.exports = async (req, res) => {
    
    const user = await User.findOne({where: {id: req.userId}})
    
    if (!user) {
        return res.status(400).json({code: 400, error: 'User id not found!'})
    }
    
    const { newpassword } = req.body;
    
    if (!newpassword) {
        return res.status(400).json({code: 400, error: 'No new password provided!'})
    }

    const hashedNewPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({'status': 'success', id: user.id})
}