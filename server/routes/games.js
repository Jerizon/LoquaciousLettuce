'use strict';
const express = require('express');
const router = express.Router();
const GameController = require('../controllers').Games;

router.route('/')
  .get(GameController.getAll)
  .post(GameController.create)
  ;

router.route('/:id')
  .get(GameController.getAllForUser)
  .delete(GameController.deleteOne)
  ;

module.exports = router;
