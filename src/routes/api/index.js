const express = require('express');
const router = express.Router();

// Middlewares
const createUserInputsValidator = require('../../middlewares/auth/createUser_InputsValidator');
const auth = require('../../middlewares/auth/auth');

// Controllers
const signUpController = require('../../controllers/api/auth/signUpController');
const singInController = require('../../controllers/api/auth/signInController');
const changePassowordController = require('../../controllers/api/auth/changePasswordController');



router.get('/', (req, res) => res.status(200).json({status: 'online'}));
router.post('/auth/signup', createUserInputsValidator, signUpController);
router.post('/auth/signin', singInController)
router.post('/auth/changepassword', auth, changePassowordController)

module.exports = router;