'use strict';
const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const routes = require('./routes');
const db = require('../db');
const models = require('../db/models');
const app = express();

app.use(middleware.morgan('dev'));
app.use(middleware.cookieParser());
app.use(middleware.bodyParser.urlencoded({extended: false}));
app.use(middleware.bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//var sessionStart = middleware.auth.session;
// console.log('SESSSIION DOT STOREEEEE ', sessionStart.store);
// sessionStart.store.auth('1f5bf94b621a2a7ca2be18a02309d78e', function() {
//   console.log('Redis client connected');
// });
app.use(middleware.auth.session);
app.use(middleware.passport.initialize());
app.use(middleware.passport.session());
app.use(middleware.flash());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/tokenhere', (req, res) => {
  models.Profile.where({'first': 'Kevin'})
  .fetch()
  .then(function(model) {
    res.send(model);
  });
});

// // need to add post handle route to get displayname into profiles table
// // lets try it here

// app.post('/signup', (req, res) => {
//   models.Profile.where({'email': req.email})
//   .
// })

app.use('/', routes.auth);
app.use('/', routes.test);
app.use('/api', routes.api);
app.use('/api/profiles', routes.profiles);
app.use('/api/songs', routes.songs);
app.use('/api/games', routes.games);
app.use('/api/highscores', routes.highscores);

module.exports = app;
