import React, { useState, useEffect } from "react";
import { ReactComponent as Tickchecksvg } from "../../images/manageacUser/tickcheck.svg";
import { ReactComponent as Downerrow } from "../../images/manageacUser/downbtn.svg";
import "./UsersideNav.css";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../functions/user";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UsersideNav() {
  // const [currentActive, setCurrentActive] = useState("");

  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const location = useLocation(); // Get the current location

  let query = useQuery();

  useEffect(() => {
    // setCurrentActive(query.get("page"));

    const Allactives = document.querySelectorAll(".clsremove");
    Allactives.forEach((Elemactive) => {
      Elemactive.classList.remove("active");
    });

    let mypage = document.querySelector(`.${query.get("page")}`);

    if (mypage !== null) {
      let default_active = document.querySelector(`.${query.get("page")}`);
      default_active.classList.add("active");
    } else {
      history.push("/404");
    }

    console.log(location.pathname.split("?")[0]);
  }, [query.get("page")]);

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
        <div className="menumain">
          <p>Manage My Account</p>
          <Downerrow className="Downerrowsvg" />
        </div>
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
        class="manageacheading clsremove userOrders"
      >
        <div className="menumain">
          <p>My Orders</p>
          <Downerrow className="Downerrowsvg" />
        </div>
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
