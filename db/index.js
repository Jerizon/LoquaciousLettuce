const knex = require('knex')(require('../knexfile'));
const db = require('bookshelf')(knex);

db.plugin('registry'); // THIS IS A PLUG-IN FOR BOOKSHELF WHICH GIVES IT THE ABILITY TO REFER TO DB MODELS WITH STRINGS

module.exports = db;

