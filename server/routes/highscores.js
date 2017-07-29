'use strict';
const express = require('express');
const router = express.Router();
const HighscoreController = require('../controllers').Highscores;

router.route('/')
  .get(HighscoreController.getAll)
  .post(HighscoreController.create)
  ;

router.route('/:id')
  .get(HighscoreController.getForUserBySong)
  .get(HighscoreController.getAllForUserByLevel)
  .delete(HighscoreController.deleteOne)
  ;

router.route('/getAllHighscoresForUser/:profile_id')
  .get(HighscoreController.getAllHighscoresForUser)
  ;

/* // MOVED THIS FUNCTION INTO THE GAMES CONTROLLER INSTEAD
router.route('/getHighscore_OnePlayer_OneSong_AnyDifficulty')
  .get(HighscoreController.getHighscore_OnePlayer_OneSong_AnyDifficulty)
  ;
*/

module.exports = router;
