import UsersData from './reducer-sample-data';

export default (state = UsersData, action) => {
  switch (action.type) {

    case 'UPDATE_TOP_TEN_USERS':
      state = action.payload;
      break;
  }

  return state;
};