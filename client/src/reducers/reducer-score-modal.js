export default (state = {visibility: false, user: {username:'julia'}, score: 0}, action) => {
  switch (action.type) {
    case 'SHOW_MODAL' : {
      state = action.payload;
      break;
    }
    case 'CLOSE_MODAL' : {
      state = action.payload;
      break;
    }
  }
  return state;
};