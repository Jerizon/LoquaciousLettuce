'use strict';
const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers').Profiles; // THIS 'Profiles' COMES FROM 'server/controllers/index.js'

router.route('/')
  .get(ProfileController.getAll)
  // .post(ProfileController.create)
  ;

router.route('/:id') // NOTE: PAYLOAD DATA ARE EMBEDDED IN THE req OBJECT, BUT ALSO NOTE THAT IN THIS CASE, THE ID NUMBER IS PART OF THE URL (SEE 'server/controllers/profiles.js' TO SEE HOW THIS IS USED)
  .get(ProfileController.getOne)
  .put(ProfileController.update)
  // .delete(ProfileController.deleteOne)
  ;

router.route('/getProfilesByList')
  .post(ProfileController.getProfilesByList)
  // .post(ProfileController.create)
  ;

module.exports = router;
