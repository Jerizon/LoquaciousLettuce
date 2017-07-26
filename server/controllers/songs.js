// THIS FILE CONTAINS THE ATOMIC DB FUNCTIONS FOR THE 'songs' TABLE ONLY. IT IS DRAWN IN BY THE 'index.js' FILE IN THIS SAME FOLDER.

const models = require('../../db/models');

module.exports.getAll = (req, res) => {  // [ R ]
  models.Song.fetchAll()
    .then(songs => {
      res.status(200).send(songs);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(503).send(err);
    });
};

// WHY WERE SOME OF THESE METHODS COMMENTED OUT?

module.exports.create = (req, res) => {  // [ C ]
  models.Song.forge({
    url: req.body.url,
    owner: req.body.owner,
    songname: req.body.songname,
    bpm: req.body.bpm,
    key: req.body.key,
    highscore: req.body.highscore,
    pattern: req.body.pattern,
  })
    .save()
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports.getOne = (req, res) => {  // [ R ]
  models.Song.where({ id: req.body.id }).fetch() // 'body' = SOME NODE THING WHICH WILL AUTO-BE THERE
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

// THIS FUNCTION WOULD BE USED TO UPDATE THE HIGH SCORE AND/OR PATTERN ON A PARTICULAR SONG

module.exports.update = (req, res) => {  // [ U ]
  models.Song.where({ id: req.body.id }).fetch()
    .then(song => {
      if (!song) {
        throw song;
      }
      return song.save(req.body, { method: 'update' });
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

// NOT SURE WHEN WE WOULD USE THIS, BUT IT SHOULD WORK IF WE DO NEED IT

module.exports.deleteOne = (req, res) => {  // [ D ]
  models.Song.where({ id: req.body.id }).fetch()
    .then(song => {
      if (!song) {
        throw song;
      }
      return song.destroy();
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

module.exports.getAllSongsForUser = (req, res) => {  // [ R ]
  console.log('PARAMS = ', req.params);
  models.Song.where({ owner: req.params.owner }).fetchAll() // 'params' = SOME NODE THING WHICH WILL AUTO-BE THERE
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


////////////////////////////////////////////////////////////////////
///////////////  TEST FUNCTIONS FOR DB QUERIES  ////////////////////
////////////////////////////////////////////////////////////////////

module.exports.testAll = (req, res) => {  // [ R ]
  models.Song.fetchAll()
    .then(songs => {
      res.status(200).send(songs);
    })
    .catch(err => {
      // This code indicates an outside service (the database) did not respond in time
      res.status(503).send(err);
    });
};

module.exports.testAdd = (req, res) => {  // [ C ]
  models.Song.forge({
    url: req.body.url,
    owner: req.body.owner,
    songname: req.body.songname,
    bpm: req.body.bpm,
    key: req.body.key,
    highscore: req.body.highscore,
    pattern: req.body.pattern,
  })
    .save()
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
