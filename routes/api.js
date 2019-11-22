const route = require('express').Router();

route.post('/register', AuthController.register);
route.post('/login', AuthController.login);

module.exports = route;
