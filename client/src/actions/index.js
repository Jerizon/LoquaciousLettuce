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

//--------------------------------VIEWS/MODALS--------------------------------//


export const changeView = (view) => {
  console.log("View", view);
  return {
    type: 'CHANGE_VIEW',
    payload: view
  };
};


export const showModal = (obj) => {
  console.log("OPENED ---obj", obj);
  return {
    type: 'SHOW_MODAL',
    payload: obj
  };
};

export const closeModal = (obj) => {
  console.log("CLOSED --");
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

// export const totalSingleScore = (score) => {
//   console.log("score---", score);
//   return {
//     type: 'UPDATE_TOTAL_SCORE',
//     payload: view
//   };
// };



export const saveGame = (profileId, game) => {
  console.log('current game---', game);
  console.log('current profile---', profileId);
  console.log('diff---', game.difficulty);
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
  // axios.get('/') // get song first then store game
      axios.post('/api/games', {profileId: profileId, song: game.song, score: game.score, difficulty: level})
      .then( (result) => {
        console.log('result for save game', result.data);
        return axios.post('/api/games/getAllGamesForSongAtDifficultylevel', {songId: result.data.song_id, difficulty: result.data.difficultylevel})
      })
      .then( (result) => {
        //console.log('games------>', result.data);
        var ranked = result.data.sort( (a, b) => {
          return b.score - a.score;
        });
        var rankedTen = ranked.slice(0,10);
        console.log(rankedTen);

        var scores = rankedTen.map( (item) => {
          return item.score;
        });

        var profileIds = rankedTen.map( (item) => {
          return item.profile_id;
        });
        console.log('prof_idsss', profileIds);
        // then get users
          //return axios.get()
        //changeTopTenScoresUsers(result.data)
        return axios.get(`/api/profiles/profileIds`, {profileIds: profileIds})
        .then( (result) => {
          console.log(result.data);
        })

      })
      .catch( (error) => {
        console.error('failed to save game');
      })

      // then check all games and for game/difficulty level
        // need to sort by score and grab the top 10
          // and then get all users from taht and
            // all users info
}


//--------------------------------SCORELIST--------------------------------//

export const changeTopTenScoresUsers = (users) => {
  return {
    type: UPDATE_USERS_SCORES,
    payload: users
  }
}
// export const totalSingleScore = (score) => {
//   console.log("score---", score);
//   return {
//     type: 'UPDATE_TOTAL_SCORE',
//     payload: view
//   };
// };



/**************CHANGE USERS LIST (TOP TEN)***************/
//need to make a current song reducer;???

export const getTopTenScores = (profileID, game) => {
  console.log('current game---', game);
  console.log('current profile---', profileID);
  axios.put('/api/games/1')
  .then( (result)=> {
    console.log('song result--', result.data);
    //console.log(result.data)
  })
  .catch( (error) => {
    console.error('failed test--', error);
  });
};





// needs to query db
export const changeUsersList = () => (dispatch, getState) => {
  axios.get('/score')
  .then((result) => { // want to get array back
    console.log('-----result data-----', result.data);
    return dispatch(updateUsersScores(result.data));
  })
  .catch((error) => {
    console.error('Failed to get top ten scores and users', error);
  });
};

























