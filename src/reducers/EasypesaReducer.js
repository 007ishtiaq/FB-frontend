export const EasypesaReducer = (state = false, action) => {
  switch (action.type) {
    case "Easypesa":
      return action.payload;
    default:
      return state;
  }
};
