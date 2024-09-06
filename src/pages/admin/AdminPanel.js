import React from "react";
import "../user/ManageMyAcccount.css";
import AdminsideNav from "../../components/nav/AdminsideNav";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import OrderstoDispatch from "./AdminDashboard/OrderstoDispatch";
import CompletedOrders from "./AdminDashboard/CompletedOrders";
import ReturnedOrders from "./AdminDashboard/ReturnedOrders";
import RejectedOrders from "./AdminDashboard/RejectedOrders";
import AllProducts from "./product/AllProducts";
import ProductCreate from "./product/ProductCreate";
import FlashSale from "./product/FlashSale";
import CategoryCreate from "./category/CategoryCreate";
import SubCreate from "./sub/SubCreate";
import Sub2Create from "./sub2/Sub2Create";
import BrandCreate from "./brand/BrandCreate";
import ColorCreate from "./color/ColorCreate";
import BannerCreate from "./Slider&Banners/BannerCreate";
import CreateShippingPage from "./shipping/CreateShippingPage";
import CreateCouponPage from "./coupon/CreateCouponPage";
import StaticText from "./statictext/StaticText";
import PasswordReset from "./passwordreset/PasswordReset";
import Allactivites from "./activities/Allactivites";
import ContactForms from "./activities/ContactForms";
import SubmittedComments from "./activities/SubmittedComments";
import SubmittedQuestions from "./activities/SubmittedQuestions";
import OptinEmails from "./activities/OptinEmails";
import Transectiontable from "./transectiontable/Transectiontable";

import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AdminPanel() {
  let query = useQuery();
  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <AdminsideNav />
        <div class="navrightside">
          {query.get("page") === "AdminDashboard" && <AdminDashboard />}
          {query.get("page") === "OrderstoDispatch" && <OrderstoDispatch />}
          {query.get("page") === "CompletedOrders" && <CompletedOrders />}
          {query.get("page") === "ReturnedOrders" && <ReturnedOrders />}
          {query.get("page") === "RejectedOrders" && <RejectedOrders />}
          {query.get("page") === "AllProducts" && <AllProducts />}
          {query.get("page") === "ProductCreate" && <ProductCreate />}
          {query.get("page") === "FlashSale" && <FlashSale />}
          {query.get("page") === "CategoryCreate" && <CategoryCreate />}
          {query.get("page") === "SubCreate" && <SubCreate />}
          {query.get("page") === "Sub2Create" && <Sub2Create />}
          {query.get("page") === "BrandCreate" && <BrandCreate />}
          {query.get("page") === "ColorCreate" && <ColorCreate />}
          {query.get("page") === "BannerCreate" && <BannerCreate />}
          {query.get("page") === "CreateShipping" && <CreateShippingPage />}
          {query.get("page") === "CreateCoupon" && <CreateCouponPage />}
          {query.get("page") === "StaticText" && <StaticText />}
          {query.get("page") === "PasswordReset" && <PasswordReset />}
          {query.get("page") === "Allactivites" && <Allactivites />}
          {query.get("page") === "ContactForms" && <ContactForms />}
          {query.get("page") === "SubmittedComments" && <SubmittedComments />}
          {query.get("page") === "SubmittedQuestions" && <SubmittedQuestions />}
          {query.get("page") === "OptinEmails" && <OptinEmails />}
          {query.get("page") === "Transections" && <Transectiontable />}
        </div>
      </div>
    </div>
  );
}
