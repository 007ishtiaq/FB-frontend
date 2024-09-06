import React, { useState, useEffect } from "react";
import { ReactComponent as Tickchecksvg } from "../../images/manageacUser/tickcheck.svg";
import "./UsersideNav.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../functions/user";

export default function UsersideNav() {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <div class="navleftside">
      <div class="namecont">
        <p>Hello, {user && user.name ? user && user.name : ""}</p>
      </div>
      <div class="varifiedinfocont">
        <div class="varifiedinfo">
          <div class="personvarifiedsvg">
            <Tickchecksvg />
          </div>
          <div class="varifiedinfotext">Varified Account</div>
        </div>
      </div>
      <Link
        to="/ManageMyAc?page=Manageac"
        class="manageacheading clsremove Manageac"
      >
        Manage My Account
      </Link>
      <ul class="manageacul">
        <Link to="/ManageMyAc?page=userProfile">
          <li class="manageacli clsremove userProfile"> My Profile</li>
        </Link>
        <Link to="/ManageMyAc?page=userAddress">
          <li class="manageacli clsremove userAddress">Address Book</li>
        </Link>
        <Link to="/ManageMyAc?page=passwordReset">
          <li class="manageacli clsremove passwordReset">Password Reset</li>
        </Link>
      </ul>
      <Link
        to="/ManageMyAc?page=userOrders"
        class="manageacheading clsremove active userOrders"
      >
        My Orders
      </Link>
      <ul class="manageacul">
        <Link to="/ManageMyAc?page=userReturns">
          <li class="manageacli clsremove userReturns">My Returns</li>
        </Link>
        <Link to="/ManageMyAc?page=userCancellations">
          <li class="manageacli clsremove userCancellations">
            My Cancellations
          </li>
        </Link>
      </ul>
      <Link
        to="/ManageMyAc?page=userReviews"
        class="manageacheading clsremove userReviews"
      >
        My Reviews
      </Link>
      <Link
        to="/ManageMyAc?page=userWishlist"
        class="manageacheading clsremove userWishlist"
      >
        My Wishlist
      </Link>
    </div>
  );
}
