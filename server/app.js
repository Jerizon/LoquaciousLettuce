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
  models.Profile.where({'email': 'kevinbondliu@gmail.com'})
  .fetch()
  .then(function(model) {
    res.send(model);
  });
});

// app.get('/signup', (req, res) => {
//   console.log('and do this too');
//   // res.send('It works!!!!!');
// });

// app.get('api/songs/1', (req,res)=> {
//   res.status(200).send('hi');
// })

app.use('/', routes.auth);
// app.use('/', routes.test);
app.use('/api', routes.api);
//app.use('/api/users', routes.users);
app.use('/api/profiles', routes.profiles);
app.use('/api/songs', routes.songs);
app.use('/api/games', routes.games);
app.use('/api/highscores', routes.highscores);

// has to be at the end of this file!!!!!!!!
app.use(middleware.auth.verify, (req, res) => { res.render('index'); });

module.exports = app;
