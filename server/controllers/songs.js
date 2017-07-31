// THIS FILE CONTAINS THE ATOMIC DB FUNCTIONS FOR THE 'songs' TABLE ONLY. IT IS DRAWN IN BY THE 'index.js' FILE IN THIS SAME FOLDER.
const knex = require('knex')(require('../../knexfile'));
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
  models.Song.forge({ // 'forge' IS JUST A COMBINED 'new Song()' with '.save' OPERATION
    url: req.body.url,
    profile_id: req.body.profile_id,
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

  console.log('---', req.params.id);

  models.Song.where({ id: req.params.id }).fetch() // 'body' = SOME NODE THING WHICH WILL AUTO-BE THERE
    .then(song => {
      if (!song) {
        throw song;
      }
      res.status(201).send(song);
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


module.exports.getAllSongsForUser = (req, res) => {
  console.log('GET ALL SONGS FOR USER REVERSE. PARAMS = ', req.params);
  models.Profile.where({id: req.params.id})
    .fetchAll({
      withRelated: [{'songs': function(qb) {
        qb.orderBy('songname', 'ASC');
      }}],
//      columns: ['display']  // I HAVE NOT BEEN ABLE TO GET THIS TO WORK :(
    })
    .then(function(song) {
      if (!song) {
        throw song;
      }
      res.status(200).send(song);
    })
    .error(err => {
      res.status(500).send(err);
    })
    .catch(() => {
      console.log('NO SONGS FOUND FOR THAT USER');
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
    profile_id: req.body.profile_id,
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


module.exports.getOwner = (req, res) => {  // [ R ]
  console.log('PARAMS = ', req.params);
  models.Song.where({ profile_id: req.params.profile_id }).fetch({withRelated: ['profiles.display']}) // 'params' = SOME NODE THING WHICH WILL AUTO-BE THERE
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


// let qb = models.Song.query();

module.exports.relTest = (req, res) => {
  console.log('RELTEST');

//  knex.column('display').select().from('profiles').where({id: 7})

  models.Song.where({profile_id: 7})
  .query((qb) => {
    qb.orderBy('songname', 'ASC');
  })
  .fetchAll({

//    withRelated: [{'profiles': function(qb) {
//      qb.column('display');
//    }}]
//   })

//    withRelated: [{'profiles': function() {
//      qb.column('display').select().from('profiles').where({id: 7});
//    }}]
//  })

    withRelated: ['profiles']
  })
  .then(function(song) {

    console.log('DATABASE QUERY RETURNS: ');
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

// WORKING SQL STATEMENT:
// SELECT profiles.display, songs.songname FROM profiles INNER JOIN songs ON profiles.id=songs.profile_id AND profiles.id=7;

module.exports.relTest2 = (req, res) => {
  console.log('RELTEST2. PARAMS = ', req.params);
  
  models.Song.where({profile_id: req.params.profile_id})
    .query((qb) => {
      qb.orderBy('songname', 'ASC');
    })
    .fetchAll({
      withRelated: [{
        'profile': (qb) => {
          console.log('QB = ', qb);
          qb.select('display');
        }}]
    })
  .then(function(songs) {
    console.log('DATABASE QUERY RETURNS: ');
    if (!songs) {
      throw songs;
    }
    res.status(200).send(songs);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    console.log('DATABASE QUERY RETURNS: ');
    res.sendStatus(404);
  });
};


module.exports.testqb = (req, res) => {
  console.log('TESTQB');
  knex.column('display').select().from('profiles').where({id: 7})
  .then(function(song) {

    console.log('TESTQB RETURNS: ', song);
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
