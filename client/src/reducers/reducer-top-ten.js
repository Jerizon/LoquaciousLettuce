import UsersData from './reducer-sample-data';

export default (state = UsersData, action) => {
  console.log('here');
  switch (action.type) {
    case 'UPDATE_TOP_TEN': {
      state = action.payload;
      break;
    }
  }
  return state;
};

