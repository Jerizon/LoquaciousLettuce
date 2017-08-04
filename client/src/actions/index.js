import axios from 'axios';
var Promise = require('bluebird');


//--------------------------------USER--------------------------------//


export const selectUser = (user) => { // function that is the action creator
  console.log('You clicked on user: ', user.username);
  return {
    type: 'USER_SELECTED',
    payload: user
  };
};


export const setCurrentUser = (username) => {
  return {
    type: 'SET_CURRENT_USER',
    payload: username
  };
};

export const getCurrentUser = () => (dispatch, getState) => {
  console.log('--getting user info request');
  axios.get('/userInfo')
  .then((result) => {
    console.log('--result here', result);
    return dispatch(setCurrentUser(result.data));
  })
  .catch((error) => {
    console.error('Error getting current user: ', error);
  });
};

export const getAllGamesForUser = (currentUserId) => (dispatch, getState) => {
  axios.get(`/api/games/getAllGamesForUser/{currentUserId}`)
  .then((result) => {
    console.log('games for user---', result.data);
  })
}

//--------------------------------VIEWS/MODALS--------------------------------//


export const changeView = (view) => {
  console.log("View", view);
  return {
    type: 'CHANGE_VIEW',
    payload: view
  };
};


export const showModal = (obj) => (dispatch, getState) => {
  console.log("OPENED ---obj", obj);

  axios.get('/api/profiles/' + obj.user.id)
  .then( (result) => {
    return axios.get('api/games/getPlayerStats/' + result.data.email)
  })
  .then( (result) => {
    // console.log('stats--', result.data);
    // console.log('stars', result.data.games[0].numGamesDifficulty);
    // console.log('scores', result.data.games[0].topScoreDifficulty);

    var modalStats = obj;
    modalStats['stats'] = result.data;
    return dispatch( {
      type: 'SHOW_MODAL',
      payload: modalStats
    } )
  })
  .catch( (error) => {
    console.error(error);
  })
};


export const closeModal = (obj) => {
  console.log("CLOSED -->>>>>>>>>>>", obj);
  // query again can i do by name or id
  obj['stats'] = { games: [{
    averageScore: 1, numGamesDifficulty: {}, topScoreDifficulty: {} }, {}] };
  return {
    type: 'CLOSE_MODAL',
    payload: obj
  };
};


//--------------------------------MUSIC--------------------------------//

export const setTracks = (object) => {
  console.log('object', object);
  return {
    type: 'GET_TRACKS',
    payload: object
  };
};

export const addLibrary = (object) => {
  console.log('add object', object);
  return {
    type: 'ADD_LIBRARY',
    payload: object
  };
};

export const getTracks = (url, options) => (dispatch, getState) => {
  axios.get(url, options)
    .then((data) => {
      console.log('THIS IS THE DATA', data);
      var storage = data.data.tracks.items;
      var count = 0;
      var SpotifyIDstorage = [];
      data.data['BPMItems'] = [];
      for (var i = 0; i < storage.length; i ++) {
        data.data.BPMItems.push(
          axios('https://api.spotify.com/v1/audio-features/' + storage[i].id, options)
            .then((data) => {
              return data.data;
            })
        );
      }
      Promise.all(data.data.BPMItems)
        .then(function(result) {
          data.data.BPMItems = result;
          return data.data;
        })
        .then((data)=> {
          return dispatch(setTracks(data));
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const setYoutube = (object) => {
  console.log('setting youtube', object);
  return {
    type: 'ADD_YOUTUBE',
    payload: object
  };
};

export const getYoutube = (options) => (dispatch, getState) => {
  axios.get('https://www.googleapis.com/youtube/v3/search', options)
    .then(result => {
      console.log('hello', result);
      // www.youtubeinmp3.com/fetch/?video=
      // var youtubeLinker = "https://www.youtube.com/watch?v=" + result.data.items[0].id.videoId;
      var youtubeLink = '//www.youtubeinmp3.com/widget/button/?video=https://www.youtube.com/watch?v=' + result.data.items[0].id.videoId;
      return dispatch(setYoutube(youtubeLink));
    })
    .catch(error => {
      console.log(error);
    });
};

export const changeSong = (song) => {
  console.log('song', song);
  return {
    type: 'CHANGE_SONG',
    payload: song
  };
};


export const changeBlob = (blob) => {
  console.log('blob', blob);
  return {
    type: 'CHANGE_BLOB',
    payload: blob
  };
};

//--------------------------------GAME--------------------------------//


export const changeDifficulty = (difficulty) => {
  console.log('difficulty', difficulty);
  return {
    type: 'CHANGE_DIFFICULTY',
    payload: difficulty
  };
};

export const getBPM = (bpm) => {
  console.log('heres the bpm', bpm);
  return {
    type: 'CHANGE_BPM',
    payload: bpm
  };
};

export const changePlayers = (playerCount) => {
  console.log('playerCount', playerCount);
  return {
    type: 'CHANGE_PLAYERS',
    payload: playerCount
  };
};

export const getGame = () => {
  return {
    type: 'GET_GAME',
    payload: ''
  };
};

export const selectMode = (playerMode) => {
  console.log("You chose", playerMode);
  return {
    type: 'MODE_SELECTED',
    payload: playerMode
  };
};


//--------------------------------SCORELIST--------------------------------//


export const saveGame = (profileId, game) => (dispatch, getState) => {
  console.log('in the saveGame function');
  var level = 0;
  if (game.difficulty === 'super_beginner') {
    level = 1;
  } else if (game.difficulty === 'beginner') {
    level = 2;
  } else if (game.difficulty === 'intermediate') {
    level = 3;
  } else if (game.difficulty === 'advanced') {
    level = 4;
  } else if (game.difficulty === 'rockstar') {
    level = 5;
  }

  console.log('game when end---', game);
  var score = game.scoreP1 || game.score;
  console.log('GAME SET ----->', profileId, game.song, score, level);

  axios.post('/api/games', {profileId: profileId, song: game.song, score: score, difficulty: level})
  .then( (result) => {
    console.log('ughnksdhjfnksd', result.data);
    return axios.post('/api/games/getTopTenScoresForSongAtDifficulty', {songId: result.data.song_id, difficulty: result.data.difficulty})
  })
  .then( (result) => {
    return dispatch(changeTopTen(result.data));
  })
  .catch( (error) => {
    console.error('failed to save game and grab top scores');
  });
};

export const changeTopTen = (games) => {
  return {
    type: 'UPDATE_TOP_TEN',
    payload: games
  };
};

export const getTopGames = (game) => (dispatch,getState) => {
  console.log('in the getTopGames function!!!!! julia');
  var level = 0;
  if (game.difficulty === 'super beginner') {
    level = 1;
  } else if (game.difficulty === 'beginner') {
    level = 2;
  } else if (game.difficulty === 'intermediate') {
    level = 3;
  } else if (game.difficulty === 'advanced') {
    level = 4;
  } else if (game.difficulty === 'rockstar') {
    level = 5;
  }
  axios.post(`/api/songs/nameUrl`, {url: game.song})
  .then( (result) => {
    return axios.post('/api/games/getTopTenScoresForSongAtDifficulty', {songId: result.data.id, difficulty: level})
  })
  .then( (result) => {
    return dispatch(changeTopTen(result.data));
  })
  .catch( (error) => {
    console.error('failed to get top scores');
  })
}









