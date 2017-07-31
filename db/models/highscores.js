const db = require('../');

const Highscore = db.Model.extend({
  tableName: 'highscores',
  profiles: function() {
    return this.belongsTo('Profile');
  },
  songs: function() {
    return this.belongsTo('Song');
  },
  games: function() {
    return this.belongsTo('Game');
  },
});

module.exports = db.model('Highscore', Highscore);


/*
model.belongsTo(Target
[foreignKey] string
  This is the ForeignKey in this model. By default, the foreignKey is assumed to be the singular form of the Target model's tableName, followed by _id

model.hasOne(Target
[foreignKey] string
  This is the ForeignKey in the Target model. By default, the foreignKey is assumed to be the singular form of this model's tableName, followed by _id
*/