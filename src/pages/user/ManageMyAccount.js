import React, { useEffect } from "react";
import UsersideNav from "../../components/nav/UsersideNav";
import "./ManageMyAcccount.css";
import ManageAcMain from "./ManageAc_main/ManageAcMain";
import UserProfile from "./UserProfile/UserProfile";
import AddressBook from "./UserAddress/AddressBook";
import UserOrders from "./UserOrders/MyOrders";
import OrdersCancelled from "./UserOrders/OrdersCancelled";
import OrdersReturned from "./UserOrders/OrdersReturned";
import UserReviews from "./UserReviews/MyReviews";
import UserWishlist from "./UserWishlist/MyWishlist";
import Password from "./Password";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ManageMyAccount() {
  let query = useQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <UsersideNav />
        <div class="navrightside">
          {query.get("page") === "Manageac" && <ManageAcMain />}
          {query.get("page") === "userProfile" && <UserProfile />}
          {query.get("page") === "userAddress" && <AddressBook />}
          {query.get("page") === "userOrders" && <UserOrders />}
          {query.get("page") === "userReturns" && <OrdersReturned />}
          {query.get("page") === "userCancellations" && <OrdersCancelled />}
          {query.get("page") === "userReviews" && <UserReviews />}
          {query.get("page") === "userWishlist" && <UserWishlist />}
          {query.get("page") === "passwordReset" && <Password />}
        </div>
      </div>
    </div>
  );
}

// these are on app.js
// path="/admin/order/:id" component={OrderDetail}
// path="/order/:id/itemCancel/:itemid" component={ItemCancel}
// path = "/order/:id/itemReturn/:itemid" component = { ItemReturn };
// path="/Request/:requestType/RequestNum/:requestNum" component={RequestSubmitted}
