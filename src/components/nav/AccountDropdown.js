// AccountDropdown.js
import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Adminsvg } from "../../images/acnav/admin.svg";
import { ReactComponent as Managesvg } from "../../images/acnav/manage.svg";
import { ReactComponent as Orderssvg } from "../../images/acnav/orders.svg";
import { ReactComponent as Reviewssvg } from "../../images/acnav/reviews.svg";
import { ReactComponent as Wishlistsvg } from "../../images/acnav/wishlist.svg";
import { ReactComponent as Returnssvg } from "../../images/acnav/returns.svg";

const AccountDropdown = ({ user, logout }) => {
  return (
    <div id="accountdiv" class="accountlistdiv">
      <div class="accountlist">
        <div class="accountlistbtndiv">
          {user && (
            <Link to="" class="accountlistbtn" onClick={logout}>
              <span>Logout</span>{" "}
            </Link>
          )}
        </div>

        {user && (
          <dv>
            {user && user.role === "admin" && (
              <>
                <Link
                  to="/AdminPanel?page=AdminDashboard"
                  class="accountlistlinks"
                >
                  <div className="acsvg">
                    <Adminsvg />
                  </div>
                  Admin Dashboard
                </Link>
              </>
            )}
            <Link to="/ManageMyAc?page=Manageac" class="accountlistlinks">
              <div className="acsvg">
                <Managesvg />
              </div>
              Manage My Acccount
            </Link>
            <Link to="/ManageMyAc?page=userOrders" class="accountlistlinks">
              <div className="acsvg">
                <Orderssvg />
              </div>
              My Orders
            </Link>
            <Link to="/ManageMyAc?page=userReviews" class="accountlistlinks">
              <div className="acsvg">
                <Reviewssvg />
              </div>
              My Reviews
            </Link>
            <Link to="/ManageMyAc?page=userWishlist" class="accountlistlinks">
              <div className="acsvg">
                <Wishlistsvg />
              </div>
              My Wishlist
            </Link>
            <Link
              to="/ManageMyAc?page=userCancellations"
              class="accountlistlinks"
            >
              <div className="acsvg">
                <Returnssvg />
              </div>
              My Returns & Cancellations
            </Link>
          </dv>
        )}
      </div>
    </div>
  );
};

export default AccountDropdown;
