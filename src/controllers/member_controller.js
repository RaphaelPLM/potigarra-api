const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports = {
	async index(request, response) {
		const members = await connection('members').select(
			'id',
			'username',
			'email',
			'cpf',
			'rg',
			'class_number',
			'gender',
			'phone_number',
			'birthdate'
		);

		const [ count ] = await connection('members').count();

		response.header('X-Total-Count', count['count(*)']);

		return response.json(members);
	},

	async create(request, response) {
		const { username, email, password, cpf, rg, classNumber, gender, phoneNumber, birthdate } = request.body;

		console.log('Request body: ', request.body);

		const passwordHash = bcrypt.hashSync(password, 10);

		const data = await connection('members').insert({
			username: username,
			email: email,
			password: passwordHash,
			cpf: cpf,
			rg: rg,
			class_number: classNumber,
			gender: gender,
			phone_number: phoneNumber,
			birthdate: birthdate
		});
	}
};
