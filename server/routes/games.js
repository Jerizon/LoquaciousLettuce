'use strict';
const express = require('express');
const router = express.Router();
const GameController = require('../controllers').Games;

router.route('/')
  .get(GameController.getAll)
  .post(GameController.create)
  ;

router.route('/getAllGamesForSongAtDifficulty')
  .post(GameController.getAllGamesForSongAtDifficulty)
  ;

router.route('/:id')
  .get(GameController.getOne)
  .delete(GameController.deleteOne)
  ;


router.route('/getAllGamesForUser/:profile_id')

// All games for one user with highest score for each difficulty level, number of games played at each difficulty level, and the average of all that player's scores
router.route('/getPlayerStats/:email')
  .get(GameController.getPlayerStats)
  ;

router.route('/getAllGamesForUser/:id')
  .get(GameController.getAllGamesForUser)
  ;

// Top ten scores (all players), ordered DESC by score per song per difficulty with profile data
router.route('/getTopTenScoresForSongAtDifficulty')
  .post(GameController.getTopTenScoresForSongAtDifficulty)
  ;

// Highest score by one player on one song on any Difficulty
router.route('/getHighscoreForUserForSong')
  .post(GameController.getHighscoreForUserForSong)
  ;

// Highest score by one player on one Difficulty on any song
router.route('/getHighscoreForUserForSongForDifficulty')
  .post(GameController.getHighscoreForUserForSongForDifficulty)
  ;


module.exports = router;
