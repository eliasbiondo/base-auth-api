/*    Current url : domain.com/api/v1/auth    */
/*    Current url : domain.com/api/v1/auth    */
/*    Current url : domain.com/api/v1/auth    */

// Importing required packages & controllers
const express = require('express');
const router = express.Router();
const auth = require('../../../../controllers/api/v1/auth')

// Importing middlewares
const authenticate = require("../../../../middlewares/authenticate");
const is_verified = require("../../../../middlewares/is_verified");
const has_moderator_level = require("../../../../middlewares/has_moderator_level");
const has_admin_level = require("../../../../middlewares/has_admin_level");

// Routes
router.post('/', auth.signin);
router.post('/users', auth.signup);
router.post('/users/:id/verify/request-token', authenticate, auth.verify.request_token) // email address verification
router.post('/users/:id/verify/validate-token', auth.verify.validate_token) // email address verification


module.exports = router;