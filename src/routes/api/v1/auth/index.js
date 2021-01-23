// Current url = domain.com/api/v1/auth 

const express = require('express');
const router = express.Router();

// Controllers
const auth = require('../../../../controllers/api/v1/auth')

router.post('/users', auth.store)

module.exports = router;