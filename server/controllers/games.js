// THIS FILE CONTAINS THE ATOMIC DB FUNCTIONS FOR THE 'games' TABLE ONLY. IT IS DRAWN IN BY THE 'index.js' FILE IN THIS SAME FOLDER.

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

module.exports.getAllGamesForUser = (req, res) => {  // [ R ]
  console.log('REQ.PARAMS.PROFILE_ID = ', req.params.profile_id);
  models.Game.where({ profile_id: req.params.profile_id }).fetchAll() // 'body' = SOME NODE THING WHICH WILL AUTO-BE THERE
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


module.exports.getAllGamesForSongAtDifficulty = (req, res) => {
  console.log('REQ.BODY = ', req.body);
  models.Game.where({ song_id: req.body.song_id, difficulty: req.body.difficulty }).fetchAll()
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
