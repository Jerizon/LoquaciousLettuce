import {combineReducers} from 'redux';
import test from './example.js';
import topTenScoresUsersReducer from './reducer-top-ten-scores-users'; // change back to reducer-users when fixed null case and undefined
import TopTenScoresUsersReducer from './reducer-top-ten-scores-users';
import TopTenScoresReducer from './reducer-top-ten-scores';
import GameReducer from './reducer-game';
import ViewReducer from './reducer-view';
import ShowScoreModalReducer from './reducer-score-modal';
import SelectedUserReducer from './reducer-selected-user';
import MusicReducer from './reducer-music';
import LibraryReducer from './reducer-library';
import CurrentUserReducer from './reducer-current-user';
import ActiveProfileReducer from './reducer-active-profile';
// import totalScoreSingleReducer from './reducer-total-score-single';
import YoutubeReducer from './reducer-youtube';


//combined reducers comines all the files inside the reduce file and allReducer becomes the storage
const allReducers = combineReducers({
  //individual sub-storage
  topTenScoresUsers: TopTenScoresUsersReducer,
  selectedUser: SelectedUserReducer,
  game: GameReducer,
  view: ViewReducer,
  showScoreModal: ShowScoreModalReducer,
  music: MusicReducer,
  library: LibraryReducer,
  currentUser: CurrentUserReducer,
  activeProfileReducer: ActiveProfileReducer,
  youtube: YoutubeReducer,
  topTenScores: TopTenScoresReducer
});

export default allReducers;
