import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { searchReducer } from "./searchReducer";
import { cartReducer } from "./cartReducer";
import { wishlistReducer } from "./wishlistReducer";
import { NoNetModalReducer } from "./NoNetModalReducer";
import { MobileSideNav } from "./MobileSideNav";
import { couponReducer } from "./couponReducer";
import { BFTReducer } from "./BFTReducer";
import { WalletReducer } from "./WalletReducer";
import { EasypesaReducer } from "./EasypesaReducer";
import { CODReducer } from "./CODReducer";

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
  noNetModal: NoNetModalReducer,
  mobileSideNav: MobileSideNav,
  coupon: couponReducer,
  BFT: BFTReducer,
  Wallet: WalletReducer,
  Easypesa: EasypesaReducer,
  COD: CODReducer,
  wishlist: wishlistReducer,
});

export default rootReducer;
