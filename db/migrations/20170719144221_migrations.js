
exports.up = function(knex, Promise) {
  return Promise.all([

// HIGHSCORES TABLE:
    knex.schema.createTableIfNotExists('highscores', function(table) {
      table.increments('id').unsigned().primary();                               // 'CASCADE' IS A RAW SQL TERM.
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE'); // 'CASCADE' INFOZ: https://www.codeproject.com/Articles/620086/CASCADE-in-SQL-Server-with-example
      table.integer('song_id').references('songs.id').onDelete('CASCADE');       // BASIC IDEA: USING 'CASCADE' CAUSES CHILD RECORDS TO ALSO BE DELETED WHEN A PARENT RECORD IS DELETED.
      table.integer('game_id').references('games.id').onDelete('CASCADE');       // BASIC IDEA: USING 'CASCADE' CAUSES CHILD RECORDS TO ALSO BE DELETED WHEN A PARENT RECORD IS DELETED.
      table.integer('highscore');
      table.integer('difficulty');
    }),

// SONGS TABLE:
    knex.schema.createTableIfNotExists('songs', function(table) {
      table.increments('id').unsigned().primary();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
      table.string('url');
      table.string('songname');
      table.float('bpm', 3);
      table.integer('key');
      table.integer('highscore');
      table.text('pattern');
    }),

// GAMES TABLE:
    knex.schema.createTableIfNotExists('games', function(table) {
      table.increments('id').unsigned().primary();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE'); // 'CASCADE' INFOZ: https://www.codeproject.com/Articles/620086/CASCADE-in-SQL-Server-with-example
      table.integer('song_id').references('songs.id').onDelete('CASCADE');       // BASIC IDEA: USING 'CASCADE' CAUSES CHILD RECORDS TO ALSO BE DELETED WHEN A PARENT RECORD IS DELETED.
      table.integer('difficulty');
      table.integer('score');
    }),

  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('highscores'),
    knex.schema.dropTable('games'),
    knex.schema.dropTable('songs'),
  ]);
};
