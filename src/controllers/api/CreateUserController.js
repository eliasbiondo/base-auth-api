const CreateUserController = (req, res) => {
    const {fullName, email, password} = req.body;

    // Input validations
    if (fullName.replace(/ /g, '').length < 1) {
        
        res.status(400).json({
            status: 'failed',
            reason: "fullName can't be a nulled value"
        })

        return;

    } else if (email.replace(/ /g, '').length < 1) {

        res.status(400).json({
            status: 'failed',
            reason: "email can't be a nulled value"
        })

        return;

    } else if (password.replace(/ /g, '').length < 1) {
        
        res.status(400).json({
            status: 'failed',
            reason: "password can't be a nulled value"
        })

        return;

    }

    // Database record values

    const User = require('../../models/User');

    User
        .create({
            fullName,
            email,
            password
        }).then(() => {
            res.status(200).json({
                status: 'success', 
                credentials: {
                    fullName,
                    email,
                    password
                }
            })
        }).catch(error => {
            console.log(error);
            res.status(400).json({
                status: 'failed'
            })
        })
};

module.exports = CreateUserController;