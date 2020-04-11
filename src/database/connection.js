const knex = require('knex');
const config = require('../../knexfile');

const connection = process.env.DEVELOPMENT_DATABASE_NAME ? knex(config.development) : knex(config.production);

module.exports = connection;
