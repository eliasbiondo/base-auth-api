/*    Current url : domain.com/api/v1/auth    */
/*    Current url : domain.com/api/v1/auth    */
/*    Current url : domain.com/api/v1/auth    */

// Importing required packages & controllers
const express = require('express');
const router = express.Router();
const auth = require('../../../../controllers/api/v1/auth')

// Importing middlewares
const is_authenticated = require("../../../../middlewares/is_authenticated");
const is_verified = require("../../../../middlewares/is_verified");
const is_mod_or_admin = require("../../../../middlewares/is_mod_or_admin");
const is_admin = require("../../../../middlewares/is_admin");
const is_own_target = require("../../../../middlewares/is_own_target");
const is_own_target_or_mod_or_admin = require("../../../../middlewares/is_own_target_or_mod_or_admin");

// Routes
router.post('/', auth.signin);
router.post('/users', auth.signup);
router.post('/users/:id/verify/request-token', is_authenticated, is_own_target_or_mod_or_admin, auth.verify.request_token);
router.post('/users/:id/verify/validate-token', is_authenticated, is_own_target, auth.verify.validate_token);

router.get('/users', is_authenticated, is_verified, is_mod_or_admin, auth.get_users);
router.get('/users/:id', is_authenticated, is_verified, is_own_target_or_mod_or_admin, auth.get_user);


module.exports = router;