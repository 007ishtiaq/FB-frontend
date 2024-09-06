export const NoNetModalReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_NETMODAL_VISIBLE":
      return action.payload;
    default:
      return state;
  }
};
