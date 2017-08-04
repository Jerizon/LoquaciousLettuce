const express = require('express');
const middleware = require('../middleware');
const models = require('../../db/models');
//const models = require('../db/models');
//const ProfileController = require('./controllers').Profiles;
const GameController = require('../controllers').Games;

const router = express.Router();

router.route('/')
  .get(middleware.auth.verify, (req, res) => {
    res.render('index.ejs');
  });

router.route('/login')
  .get((req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  })
  .post(middleware.passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

router.route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });

  })
  .post(middleware.passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.route('/profile')

  .get(middleware.auth.verify, (req, res) => {
    console.log('user id ----->', req.user.id)

      models.Game.where({ profile_id: req.user.id })
      .fetchAll()
      .then( (games) => {
        if (!games) {
          throw games;
        }
        var mods = games.models;
        var games = mods.map( (game) => {
          return {difficulty: game.attributes.difficulty, score: game.attributes.score};
        });
        var diffs = mods.map( (game) => {
          return game.attributes.difficulty;
        });
        console.log('diffs---->', diffs);

        console.log('games----->', games);
        var rank = diffs.reduce( (a, c) => {
          return a + c;
        }, 0);

        rankNum = Math.floor(rank/diffs.length);
        var rank;

        if (rankNum === 1) {
          rank = 'Super Beginner';
        } else if (rankNum === 2) {
          rank = 'Beginner';
        } else if (rankNum === 3) {
          rank = 'Intermediate';
        } else if (rankNum === 4) {
          rank = 'Advanced';
        } else if (rankNum === 5) {
          rank = 'Rock Star!';
        }

        var rankObj = {rankNum: rankNum, rank: rank};

        var stars = {};
        for (var i = 0; i < games.length; i++) {
          if (stars.hasOwnProperty(games[i].difficulty)) {
            stars[games[i].difficulty]++;
          } else {
            stars[games[i].difficulty] = 1;
          }
        }

        var scoresMean = [];
        for (var j = 1; j < 6; j++) {
          var sum = 0;
          var count = 0;
          for (var k = 0; k < games.length; k++) {
            if (games[k].difficulty === j) {
              sum+=games[k].score;
              count++;
            }
          }
          scoresMean.push(Math.floor(sum/count));
        }
        scoresMean = scoresMean.map( (score) => {
          if (isNaN(score)) {
            return 0;
          } else {
            return score;
          }
        })

        var stats = {stars: stars, scoresMean: scoresMean, rankObj: rankObj};
        console.log('here is access to stats KEVIIIIINNNNNNNNNNNN----------------->', stats);

        res.render('profile.ejs', {
          user: req.user,
          stats: stats
        });

      })
      .error(err => {
        res.status(500).send(err);
      })
      .catch(() => {
        res.sendStatus(404);
      });
  });

router.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

// router.get('/auth/google', middleware.passport.authenticate('google', {
//   scope: ['email', 'profile']
// }));

// router.get('/auth/google/callback', middleware.passport.authenticate('google', {
//   successRedirect: '/profile',
//   failureRedirect: '/login'
// }));

// router.get('/auth/facebook', middleware.passport.authenticate('facebook', {
//   scope: ['public_profile', 'email']
// }));

// router.get('/auth/facebook/callback', middleware.passport.authenticate('facebook', {
//   successRedirect: '/profile',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

router.get('/auth/spotify', middleware.passport.authenticate('spotify', {
  scope: ['user-read-private', 'user-read-email']
}));

router.get('/auth/spotify/callback', middleware.passport.authenticate('spotify', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));


router.route('/userInfo')
.get((req, res) => {
  console.log('req---the userrrrrrr', req.user);
  res.send(200, req.user);

  // res.status(200).send(req.user);

});



module.exports = router;
