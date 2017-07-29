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

module.exports.getAllSongsForUser = (req, res) => {  // [ R ]
  console.log('PARAMS = ', req.params);
  models.Song.where({ profile_id: req.params.profile_id }).fetchAll() // 'params' = SOME NODE THING WHICH WILL AUTO-BE THERE
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


/*
new User({id: 2}).fetch({
  withRelated: [{'account': function(qb) {
    qb.column('id', 'balance', 'total');
  }}],
  columns: ['id', 'name', 'accountId']
})

*/

let qb = models.Song.query();

module.exports.relTest = (req, res) => {
  console.log('RELTEST');

//  knex.column('display').select().from('profiles').where({id: 7})

  models.Song.where({profile_id: 7}).fetchAll({

//    withRelated: [{'profiles': function(qb) {
//      qb.column('display');
//    }}]
//   })

    withRelated: [{'profiles': function() {
      qb.column('display').select().from('profiles').where({id: 7});
    }}]
  })

//    withRelated: ['profiles']
//   })


/////////////////////////////////////////////////////////////
//////////////////  VINCENT'S CODE  /////////////////////////
/////////////////////////////////////////////////////////////
/*
MODELS.SONG.WHERE (spec)


module.exports.getPartyInfoCustomer = (req, res) => {
  models.Party.where({id: res.party_id})
    .query((qb) => {
      qb.orderBy('wait_time', 'ASC');
    })
    .fetchAll({
      withRelated: ['queue', {
        'profile': (qb) => {
          qb.select('id', 'first', 'last', 'email', 'phone');
        }}],
      columns: ['id', 'queue_id', 'wait_time', 'profile_id', 'party_size', 'first_name', 'phone_number']
    })
    
*/

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
  console.log('RELTEST2');
  
//  models.Song.query('SELECT', 'profiles.display,', 'songs.songname', 'FROM', 'profiles', 'INNER JOIN', 'songs', 'ON', 'profiles.id', '=', 'songs.profile_id', 'AND', 'profiles.id', '=', '7')
  models.Song.query({songname: 'Face'})
  .fetch()
  .then(function(data) {

    console.log('DATABASE QUERY RETURNS: ');
    if (!data) {
      throw data;
    }
    res.status(200).send(data);
  })
  .error(err => {
    res.status(500).send(err);
  })
  .catch(() => {
    res.sendStatus(404);
  });
};


module.exports.testqb = (req, res) => {
  console.log('TESTQB');
  
//  knex.select('display').from('profiles').where({id: 7})
  knex.column('display').select().from('profiles').where({id: 7})
//  models.Song.query('where', 'songname', '=', 'Face').fetch()
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
