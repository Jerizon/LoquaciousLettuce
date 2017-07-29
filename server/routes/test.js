'use strict';
const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers').Profiles;
const SongController = require('../controllers').Songs;
const GameController = require('../controllers').Games;
const HighscoreController = require('../controllers').Highscores;

router.route('/')
  .get(ProfileController.testAll)
  ;

router.route('/testp')
  .get(ProfileController.testAll)
  ;
  
router.route('/tests')
  .get(SongController.testAll)
  .post(SongController.testAdd)
  ;
  
router.route('/testg')
  .get(GameController.testAll)
  .post(GameController.testAdd)
  ;
  
router.route('/testh')
  .get(HighscoreController.testAll)
  .post(HighscoreController.testAdd)
  ;

router.route('/testqb')
  .get(SongController.testqb)
  ;

module.exports = router;
