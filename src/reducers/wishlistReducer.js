// export const wishlistReducer = (state = [], action) => {
//   switch (action.type) {
// case "USER_WISHLIST":
//   return action.payload;
// case "CLEAR_WISHLIST":
//   return [];
//     default:
//       return state;
//   }
// };

const initialState = {
  wishlist: null,
};

export const wishlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_WISHLIST":
      return {
        ...state,
        wishlist: action.payload,
      };
    case "CLEAR_WISHLIST":
      return [];
    default:
      return state;
  }
};
