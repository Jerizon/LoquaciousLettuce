'use strict';
const express = require('express');
const router = express.Router();
const HighscoreController = require('../controllers').Highscores;

router.route('/')
  .get(HighscoreController.getAll)
  .post(HighscoreController.create)
  ;

router.route('/:id')
  .get(HighscoreController.getAllForUser)
  .get(HighscoreController.getForUserBySong)
  .get(HighscoreController.getAllForUserByLevel)
  .delete(HighscoreController.deleteOne)
  ;

module.exports = router;
