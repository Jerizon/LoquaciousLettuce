const models = require('../models');

const dummySongData = {
  profile_id: [1, 2, 3, 4, 5, 7, 7, 7, 9, 2, ],
  url: ['Close.mp3', 'Def.mp3', 'Face.mp3', 'Close.mp3', 'Def.mp3', 'Face.mp3', 'Close.mp3', 'Def.mp3', 'Face.mp3', 'Close.mp3', ],
  songname: ['Close', 'Def', 'Face', 'The Lay Of Luthien', 'The Fall Of Beren', 'All Small Beasts Should Have Bows In Their Tails', 'The Green Dragon', 'Maldoror Is Ded Ded Ded', 'Chewing On Shadows', 'As Above So Below'],
  bpm: [120, 123, 100, 134, 90, 96, 111, 118.6, 120.2, 128.0, ],
  key: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ],
  highscore: [3410, 3560, 3770, 2980, 2760, 3110, 2660, 3000, 2450, 3990, ],
  pattern: ['141a33567a9a76545aa65', '98863a57888a578a96643a', '87126987598759a8765817876a0860', '1098650138760876a98759765a76', 'a9876a81876654a315643a16543a2', '29034850289760a08969867a453a21', '0120997a09819087369875a7641654a6aa', '10921879865867a4532a341a', '109384608768187a09860196a0918a709609', 'a187a917a4567`13a47516a10a6108a6a', ],
};

const dummyGameData = {
  profile_id: [1, 2, 3, 3, 3, 6, 8, 8, 9, 10, ],
  song_id: [7, 7, 7, 7, 5, 2, 9, 8, 7, 1, ],
  score: [2660, 1990, 2100, 2280, 2760, 3560, 2450, 3000, 2660, 3410, ],
  difficulty: [4, 3, 2, 3, 3, 2, 5, 1, 2, 3, ],
};

const dummyHighscoreData = {
  profile_id: [5, 6, 5, 5, 3, 2, 2, 10, 5, 2, ],
  song_id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ],
  game_id: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, ],
  highscore: [3410, 3560, 3770, 2980, 2760, 3110, 2660, 3000, 2450, 3990, ],
  difficulty: [1, 3, 5, 4, 2, 3, 3, 3, 4, 1, ],
};

// DEFINE FUNCTIONS FOR INSERTING SEED DATA (PROFILES ARE HANDLED SEPARATELY)
let createSongs = (knex, i) => {
  return knex('songs').insert({
//    id: 1,
    profile_id: dummySongData.profile_id[i],
    url: dummySongData.url[i],
    songname: dummySongData.songname[i],
    bpm: dummySongData.bpm[i],
    key: dummySongData.key[i],
    highscore: dummySongData.highscore[i],
    pattern: dummySongData.pattern[i],
  });
};

let createGames = (knex, i) => {
  return knex('games').insert({
//    id: 1,
    profile_id: dummyGameData.profile_id[i],
    song_id: dummyGameData.song_id[i],
    score: dummyGameData.score[i],
    difficulty: dummyGameData.difficulty[i],
  });
};

let createHighscores = (knex, i) => {
  return knex('highscores').insert({
//    id: 1,
    profile_id: dummyHighscoreData.profile_id[i],
    song_id: dummyHighscoreData.song_id[i],
    game_id: dummyHighscoreData.game_id[i],
    highscore: dummyHighscoreData.highscore[i],
    difficulty: dummyHighscoreData.difficulty[i],
  });
};

exports.seed = (knex, Promise) => {
  // DELETE EXISTING ENTRIES
  return knex('highscores').del()
  .then(()=>{
    return knex('games').del();
  })
  .then(()=> {
    return knex('songs').del();
  })
// THEN PUT NEW ONES BACK IN
  .then(() => {
    let records = [];
    for (let i = 0; i < 10; i++) {
      records.push(createSongs(knex, i));
    }
    for (let i = 0; i < 10; i++) {
      records.push(createGames(knex, i));
    }
    for (let i = 0; i < 10; i++) {
      records.push(createHighscores(knex, i));
    }
    return Promise.all(records);
  }).catch((err) => {
    console.log('err:', err);
  });
};