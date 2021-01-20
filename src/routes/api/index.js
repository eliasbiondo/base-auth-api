const express = require('express');
const router = express.Router();

// Middlewares
const createUserInputsValidator = require('../../middlewares/auth/createUserInputsValidator');

// Controllers
const signUpController = require('../../controllers/api/auth/signUpController');
const singInController = require('../../controllers/api/auth/signInController');



router.get('/', (req, res) => res.status(200).json({status: 'online'}));
router.post('/auth/signup', createUserInputsValidator, signUpController);
router.post('/auth/signin', singInController)

module.exports = router;