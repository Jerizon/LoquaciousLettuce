// THIS FILE CONTAINS THE ATOMIC DB FUNCTIONS FOR THE 'songs' TABLE ONLY. IT IS DRAWN IN BY THE 'index.js' FILE IN THIS SAME FOLDER.
const knex = require('knex')(require('../../knexfile'));
const models = require('../../db/models');

module.exports.getAll = (req, res) => {  // [ R ]
  models.Game.fetchAll()
    .then(games => {
      res.status(200).send(games);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(503).send(err);
    });
};

module.exports.getOne = (req, res) => {  // [ R ]
  models.Game.where({ id: req.params.id }).fetch() // 'body' = SOME NODE THING WHICH WILL AUTO-BE THERE
    .then(song => {
      if (!song) {
        throw song;
      }
      res.status(200).send(song);
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};


module.exports.create = (req, res) => {  // [ C ]
  console.log('bodyyyy---', req.body);
  models.Game.forge({
    profile_id: req.body.profileId,
    song_id: 1,
    score: req.body.score,
    difficulty: req.body.difficulty,

  })
    .save()
    .then(result => {
      res.send(201, result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};


module.exports.getAllGamesForUser = (req, res) => {
  console.log('REQ.PARAMS.PROFILE_ID = ', req.params.profile_id);
  models.Profile.where({ id: req.params.id })
  .fetchAll({
    withRelated: [{'games': function(qb) {
      qb.orderBy('score', 'DESC');
    }}],
  })
  .then(games => {
    if (!games) {
      throw games;
    }
    res.status(200).send(games);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};


module.exports.getHighscoreForUserForSong = (req, res) => {  // [ R ]
  console.log('REQ.BODY = ', req.body);
  models.Game.where({ profile_id: req.body.profile_id, song_id: req.body.song_id }).fetch() // 'body' = ALWAYS ON THE NODE REQUEST OBJECT
    .then(game => {
      if (!game) {
        throw game;
      }
      res.status(200).send(game);
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};


module.exports.getHighscoreForUserForSongForDifficulty = (req, res) => {
  console.log('REQ.BODY = ', req.body);
  models.Game.where({ profile_id: req.body.profile_id, song_id: req.body.song_id, difficulty: req.body.difficulty }).fetch() // 'body' = SOME NODE THING WHICH WILL AUTO-BE THERE
    .then(game => {
      if (!game) {
        throw game;
      }
      res.status(200).send(game);
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};


// module.exports.getAllGamesForSongAtDifficulty = (req, res) => {
//   console.log('REQ.BODY = ', req.body);
//   models.Game.where({ song_id: req.body.song_id, difficulty: req.body.difficulty }).fetchAll()
//     .then(game => {
//       if (!game) {
//         throw game;
// =======
module.exports.getAllForUser = (req, res) => {  // [ R ]
  models.Game.where({ profile_id: req.body.profile_id }).fetch() // 'body' = SOME NODE THING WHICH WILL AUTO-BE THERE
    .then(games => {
      if (!games) {
        throw games;
      }
      res.status(200).send(games);
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};


module.exports.getPlayerStats = (req, res) => {
  // QUERY DB TO GET THE PROFILE ID FROM THE PROFILE EMAIL
  let profile_id = 0;

  models.Profile.where({ email: req.params.email})
  .fetch()
  .then(profile => {
    profile_id = profile.id;
  })
  .then(games => {
    // QUERY DB TO GET GAMES WITH RELATED
    models.Game.where({profile_id: profile_id})
    .fetchAll({
      withRelated: ['profiles', 'songs'],
    })
    // CHAIN-INVOKE A SEPARATE PACKAGING FUNCTION WHICH:
    .then(games => {
      var stats = {
        topScoreDifficulty: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },

        numGamesDifficulty: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },

        averageScore: 0,

      };
    // CALCULATES:
      let len = games.models.length;
      let totalScores = 0;

      for (let i = 0; i < len; i++) {
      // NUMBER OF GAMES PER DIFF
        let dLevel = games.models[i].attributes.difficulty;
        stats.numGamesDifficulty[dLevel]++;
      // TOP SCORE PER DIFF
        if (stats.topScoreDifficulty[dLevel] < games.models[i].attributes.score) {
          stats.topScoreDifficulty[dLevel] = games.models[i].attributes.score;
        }
      // KEEP TRACK OF TOTAL TO DERIVE AVERAGE LATER
        totalScores += games.models[i].attributes.score;
      }
      // AVERAGE SCORE OF ALL GAMES
      stats.averageScore = (totalScores / len).toFixed(2);

      // ADDS THESE NEW PROPERTIES TO THE RESPONSE OBJECT
      games.unshift(stats);

      return games; // THIS IS REQUIRED BECAUSE THIS .then IS *NESTED*
    })
    .then(games => {
      if (!games) {
        throw games;
      }
      res.status(200).send({games});
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
  });
};


module.exports.getTopTenScoresForSongAtDifficulty = (req, res) => {
  console.log('REQ.BODY = ', req.body);
  models.Game.where({ song_id: req.body.songId, difficulty: req.body.difficulty })
  .orderBy('-score')
  .fetchAll({
    withRelated: ['profiles', 'songs'],
  })
  .then(games => {
    if (!games) {
      throw games;
    }
    res.status(200).send(games);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};

/*

module.exports.getAllSongsForUser = (req, res) => {
  console.log('GET ALL SONGS FOR USER REVERSE. PARAMS = ', req.params);
  models.Profile.where({id: req.params.id})
    .fetchAll({
      withRelated: [{'songs': function(qb) {
        qb.orderBy('songname', 'ASC');
      }}],
//      columns: ['display']  // I HAVE NOT BEEN ABLE TO GET THIS TO WORK :(
    })

*/
module.exports.getAllGamesForSongAtDifficulty = (req, res) => {
  console.log('REQ.BODY = ', req.body);
  models.Game.where({ song_id: req.body.songId, difficulty: req.body.difficulty }).fetchAll()
  .then(games => {
    if (!games) {
      throw games;
    }
    res.status(200).send(games);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};


// I DO NOT BELIEVE WE NEED TO UPDATE GAMES RECORDS (?)
/*
module.exports.update = (req, res) => {  // [ U ]
  models.Game.where({ profile_id: req.body.profile_id }).fetch()
    .then(game => {
      if (!game) {
        throw game;
      }
      return game.save(req.body, { method: 'update' });
    })
    .then(() => {
      res.sendStatus(201);
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};
*/

// NOT SURE WHEN WE WOULD USE THIS, BUT IT SHOULD WORK IF WE DO NEED IT

module.exports.deleteOne = (req, res) => {
  models.Game.where({ id: req.body.id }).fetch()
    .then(game => {
      if (!game) {
        throw game;
      }
      return game.destroy();
    })
    .then(() => {
      res.sendStatus(200);
    })
    .error(err => {
      res.status(503).send(err);
    })
    .catch(() => {
      res.sendStatus(404);
    });
};

////////////////////////////////////////////////////////////////////
///////////////  TEST FUNCTIONS FOR DB QUERIES  ////////////////////
////////////////////////////////////////////////////////////////////

module.exports.testAll = (req, res) => {
  models.Game.fetchAll()
    .then(games => {
      res.status(200).send(games);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(503).send(err);
    });
};

module.exports.testAdd = (req, res) => {
  models.Game.forge({
    profile_id: req.body.profile_id,
    song_id: req.body.song_id,
    score: req.body.score,
    difficulty: req.body.difficulty,
  })
    .save()
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
