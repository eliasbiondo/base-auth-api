/*    Current url : domain.com/api/v1/auth    */
/*    Current url : domain.com/api/v1/auth    */
/*    Current url : domain.com/api/v1/auth    */

// Importing required packages & controllers
const express = require('express');
const router = express.Router();
const auth = require('../../../../controllers/api/v1/auth')

// Routes
router.post('/users', auth.store)

module.exports = router;