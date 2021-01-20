const express = require('express');
const routes = express.Router();

// Controllers importing
const API_IndexController = require('../../controllers/api')
const CreateUserController = require('../../controllers/api/CreateUserController')

// API Routes
routes.get('/', API_IndexController)
routes.post('/user/create', CreateUserController)

module.exports = routes;