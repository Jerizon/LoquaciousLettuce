const db = require('../');

const Song = db.Model.extend({
  tableName: 'songs',
  highscores: function() {
    return this.hasMany('Highscore');
  },
  games: function() {
    return this.hasMany('Game');
  },
  profiles: function() {
    return this.belongsTo('Profile'); // POSSIBLY SHOULD BE:
  },                               // ('Profile', 'display');
});

module.exports = db.model('Song', Song);
