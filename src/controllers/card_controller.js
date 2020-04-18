const connection = require('../database/connection');

module.exports = {
	async index(request, response) {
		const cards = await connection('cards').select(
			'id',
      'url',
      'status',
      'member_id'
		);

		const [ count ] = await connection('cards').count();

		response.header('X-Total-Count', count['count(*)']);

		return response.json(cards);
	},

	async create(request, response) {
    userId = request.decoded.user.id;

    const data = await connection('cards').insert({
      member_id: userId
    })

    return response.status(200).json({data});
    
    // const { username, email, password, cpf, rg, classNumber, gender, phoneNumber, birthdate } = request.body;

		// const passwordHash = bcrypt.hashSync(password, 10);

		// const data = await connection('members').insert({
		// 	username: username,
		// 	email: email,
		// 	password: passwordHash,
		// 	cpf: cpf,
		// 	rg: rg,
		// 	class_number: classNumber,
		// 	gender: gender,
		// 	phone_number: phoneNumber,
		// 	birthdate: birthdate
		// });

		// return response.status(200).json();
	}
};
