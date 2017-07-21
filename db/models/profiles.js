const db = require('../');

const Profile = db.Model.extend({
  tableName: 'profiles',
  auths: function() {
    return this.hasMany('Auth');
  },
  highscores: function() {
    return this.hasMany('Highscore');
  },
  games: function() {
    return this.hasMany('Game');
  },
});

module.exports = db.model('Profile', Profile);
