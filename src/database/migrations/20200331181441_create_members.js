exports.up = function(knex) {
	return knex.schema.createTable('members', function(table) {
		table.increments('id').primary();

		table.string('username').notNullable();
		table.string('email').unique().notNullable();
		table.string('password').notNullable();
		table.string('cpf').unique().notNullable();
		table.string('rg').unique().notNullable();
		table.string('class_number').notNullable();
		table.string('gender').notNullable();
		table.string('phone_number').notNullable();
		table.date('birthdate').notNullable();

		table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('members');
};
