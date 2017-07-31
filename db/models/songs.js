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
    return this.belongsTo('Profile'); 
  },
});

module.exports = db.model('Song', Song);

/*
model.belongsTo(Target
[foreignKey] string
  This is the ForeignKey in this model. By default, the foreignKey is assumed to be the singular form of the Target model's tableName, followed by _id

model.hasOne(Target
[foreignKey] string
  This is the ForeignKey in the Target model. By default, the foreignKey is assumed to be the singular form of this model's tableName, followed by _id
*/