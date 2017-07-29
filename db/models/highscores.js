const db = require('../');

const Highscore = db.Model.extend({
  tableName: 'highscores',
  profiles: function() {
    return this.hasOne('Profile');
  },
  songs: function() {
    return this.hasOne('Song');
  },
  games: function() {
    return this.hasOne('Game');
  },
  games: function() {
    return this.hasOne('difficulty');
  },
});

module.exports = db.model('Highscore', Highscore);
