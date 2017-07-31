const db = require('../');

const Game = db.Model.extend({
  tableName: 'games',
  profiles: function() {
    return this.belongsTo('Profile');
  },
  songs: function() {
    return this.belongsTo('Song');
  },
  highscores: function() {
    return this.hasMany('Highscore');
  },
});

module.exports = db.model('Game', Game);


/*
model.belongsTo(Target
[foreignKey] string
  This is the ForeignKey in this model. By default, the foreignKey is assumed to be the singular form of the Target model's tableName, followed by _id

model.hasOne(Target
[foreignKey] string
  This is the ForeignKey in the Target model. By default, the foreignKey is assumed to be the singular form of this model's tableName, followed by _id
*/