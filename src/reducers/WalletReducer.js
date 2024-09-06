export const WalletReducer = (state = false, action) => {
  switch (action.type) {
    case "Wallet":
      return action.payload;
    default:
      return state;
  }
};
