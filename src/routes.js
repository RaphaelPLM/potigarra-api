const express = require('express');

const MembersController = require('./controllers/member_controller');
const AuthController = require('./controllers/auth_controller');

const AuthMiddleware = require('./middlewares/auth_middleware');

const routes = express.Router();

routes.get('/members', AuthMiddleware.verifyToken, MembersController.index);
routes.post('/register', MembersController.create);

routes.post('/login', AuthController.login);

module.exports = routes;
