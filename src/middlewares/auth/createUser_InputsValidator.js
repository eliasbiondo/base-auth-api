module.exports = (req, res, next) => {

    let {username, email, password} = req.body;

    if (username.replace(' ', '').length < 1) {
        return res.status(400).json({'code': 400, 'error': 'The username field cannot be null!'})
    }

    if (email.replace(' ', '').length < 1) {
        return res.status(400).json({'code': 400, 'error': 'The email field cannot be null!'})
    }

    if (password.replace(' ', '').length < 1) {
        return res.status(400).json({'code': 400, 'error': 'The password field cannot be null!'})
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({'code': 400, 'error': 'Invalid email adress!'})
    }

    if (password.replace(' ', '').length < 6) {
        return res.status(400).json({'code': 400, 'error': 'The password field must have six or more characthers!'})
    }

    next();

}