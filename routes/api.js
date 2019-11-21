const route = require('express').Router();

route.post('/register', AuthController.register);

module.exports = route;
