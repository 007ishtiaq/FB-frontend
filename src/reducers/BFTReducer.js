export const BFTReducer = (state = true, action) => {
  switch (action.type) {
    case "BFT":
      return action.payload;
    default:
      return state;
  }
};
