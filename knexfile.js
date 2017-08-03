const config = require('config');
const pg = require('pg');


pg.defaults.ssl = true;
module.exports = config['knex'];
