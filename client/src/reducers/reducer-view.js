export default (state = 'players', action) => {
  switch (action.type) {
    case 'CHANGE_VIEW' : {
      state = action.payload;
      break;
    }
  }
  return state;
};