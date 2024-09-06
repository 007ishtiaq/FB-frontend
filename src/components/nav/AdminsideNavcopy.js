import React, { useState, useEffect } from "react";
import { ReactComponent as Tickchecksvg } from "../../images/manageacUser/tickcheck.svg";
import "./UsersideNav.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../functions/user";

export default function AdminsideNavcopy({ currentActive }) {
  const [userName, setUserName] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const Allactives = document.querySelectorAll(".clsremove");
    Allactives.forEach((Elemactive) => {
      Elemactive.classList.remove("active");
    });
    const default_active = document.querySelector(`.${currentActive}`);
    default_active.classList.add("active");
  }, [currentActive]);

  useEffect(() => {
    if (user && user.token) {
      getUserProfile(user.token).then((a) => {
        setUserName(a.data.Name.substring(0, 12));
      });
    }
  }, [user]);

  return (
    <div class="navleftside">
      <div class="namecont">
        <p>Hello, {userName}</p>
      </div>
      {user && user.role === "admin" && (
        <div class="varifiedinfocont">
          <div class="varifiedinfo">
            <div class="personvarifiedsvg">
              <Tickchecksvg />
            </div>
            <div class="varifiedinfotext">Admin Account</div>
          </div>
        </div>
      )}
      <Link
        to="/AdminPanel?page=AdminDashboard"
        class="manageacheading clsremove AdminDashboard"
      >
        Admin Dashboard
      </Link>
      <ul class="manageacul">
        <Link to="/AdminPanel?page=OrderstoDispatch">
          <li class="manageacli clsremove OrderstoDispatch">
            Orders to Dispatch
          </li>
        </Link>
        <Link to="/AdminPanel?page=CompletedOrders">
          <li class="manageacli clsremove CompletedOrders">Completed Orders</li>
        </Link>
        <Link to="/AdminPanel?page=RejectedOrders">
          <li class="manageacli clsremove RejectedOrders">Cancelled Orders</li>
        </Link>
        <Link to="/AdminPanel?page=ReturnedOrders">
          <li class="manageacli clsremove ReturnedOrders">Returned Orders</li>
        </Link>
      </ul>
      <Link
        to="/AdminPanel?page=AllProducts"
        class="manageacheading clsremove AllProducts"
      >
        All products
      </Link>
      <ul class="manageacul">
        <Link to="/AdminPanel?page=ProductCreate">
          <li class="manageacli clsremove ProductCreate">Create Product</li>
        </Link>
        <Link to="/AdminPanel?page=FlashSale">
          <li class="manageacli clsremove FlashSale">Flash sale</li>
        </Link>
      </ul>
      <Link
        to="/AdminPanel?page=Transections"
        class="manageacheading clsremove Transections"
      >
        Transection Table
      </Link>
      <Link
        to="/AdminPanel?page=Allactivites"
        class="manageacheading clsremove Allactivites"
      >
        Activity / Approve
      </Link>
      <ul class="manageacul">
        <Link to="/AdminPanel?page=ContactForms">
          <li class="manageacli clsremove ContactForms">Contact Forms</li>
        </Link>
        <Link to="/AdminPanel?page=SubmittedComments">
          <li class="manageacli clsremove SubmittedComments">
            Submitted Comments
          </li>
        </Link>
        <Link to="/AdminPanel?page=SubmittedQuestions">
          <li class="manageacli clsremove SubmittedQuestions">
            Submitted Questions
          </li>
        </Link>
        <Link to="/AdminPanel?page=OptinEmails">
          <li class="manageacli clsremove OptinEmails">Opt-In Emails</li>
        </Link>
      </ul>

      <Link
        to="/AdminPanel?page=CategoryCreate"
        class="manageacheading clsremove CategoryCreate"
      >
        Create Category
      </Link>
      <ul class="manageacul">
        <Link to="/AdminPanel?page=SubCreate">
          <li class="manageacli clsremove SubCreate">Sub Level 1</li>
        </Link>
        <Link to="/AdminPanel?page=Sub2Create">
          <li class="manageacli clsremove Sub2Create">Sub Level 2</li>
        </Link>
        <Link to="/AdminPanel?page=BrandCreate">
          <li class="manageacli clsremove BrandCreate">Create Brands</li>
        </Link>
        <Link to="/AdminPanel?page=ColorCreate">
          <li class="manageacli clsremove ColorCreate">Create Colors</li>
        </Link>
      </ul>
      <Link
        to="/AdminPanel?page=BannerCreate"
        class="manageacheading clsremove BannerCreate"
      >
        Create Banner
      </Link>
      <ul class="manageacul">
        <Link to="/AdminPanel?page=StaticText">
          <li class="manageacli clsremove StaticText">Static Text & Promo</li>
        </Link>
      </ul>

      <Link
        to="/AdminPanel?page=CreateShipping"
        class="manageacheading clsremove CreateShipping"
      >
        Shipping Charges
      </Link>
      <Link
        to="/AdminPanel?page=CreateCoupon"
        class="manageacheading clsremove CreateCoupon"
      >
        Create Coupon
      </Link>

      <Link
        to="/AdminPanel?page=PasswordReset"
        class="manageacheading clsremove PasswordReset"
      >
        Password Reset
      </Link>
    </div>
  );
}
