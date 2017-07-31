import UsersData from './reducer-sample-data';
var sampleScores =  UsersData.map( (user) => {
  return user.score;
});

export default (state = sampleScores, action) => {
  switch (action.type) {
    case 'UPDATE_TOP_TEN_USERS_SCORES':
      state = action.payload;
      break;
  }
  return state;
};