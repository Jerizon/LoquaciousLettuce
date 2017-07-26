'use strict';
const express = require('express');
const router = express.Router();
const SongController = require('../controllers').Songs;

router.route('/')
  .get(SongController.getAll)
  .post(SongController.create)
  ;
  
router.route('/getAllSongsForUser/:owner')
  .get(SongController.getAllSongsForUser)
  ;

router.route('/:id')
  .get(SongController.getOne)
  .put(SongController.update)
  .delete(SongController.deleteOne)
  ;

module.exports = router;
