require('dotenv').config({path: './.env'});

// Update with your config settings.

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			database: process.env.DEVELOPMENT_DATABASE_NAME,
			user: process.env.DEVELOPMENT_DATABASE_USER,
			password: process.env.DEVELOPMENT_DATABASE_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: './src/database/migrations'
		}
	},

	staging: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
};
