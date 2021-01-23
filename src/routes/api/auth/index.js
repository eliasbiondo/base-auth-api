const express = require('express');
const router = express.Router();

const authController = require("../../../controllers/api/authController");

router.post('/users', authController.store)

module.exports = router;