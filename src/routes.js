const express = require('express');

const MembersController = require('./controllers/member_controller');
const AuthController = require('./controllers/auth_controller');
const CardsController = require('./controllers/card_controller');

const AuthMiddleware = require('./middlewares/auth_middleware');

const MemberValidator = require('./validators/member_validator');

const routes = express.Router();


// Member routes
routes.get('/members', AuthMiddleware.verifyToken, MembersController.index);
routes.post('/register', MemberValidator.validateCreate, MembersController.create);

// Auth routes
routes.post('/login', AuthController.login);
routes.get('/verifyToken', AuthMiddleware.verifyToken, (request, response) => {
	return response.status(200).json({ message: 'The token is valid.' });
});

//Card routes
routes.get('/cards', AuthMiddleware.verifyToken, CardsController.index);

module.exports = routes;