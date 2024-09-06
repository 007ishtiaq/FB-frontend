import React from "react";
import { Link } from "react-router-dom";
import "./NoItemFound.css";
import { ReactComponent as NoOrdersFoundsvg } from "../../../images/manageacUser/noorders.svg";
import { ReactComponent as Returnsvg } from "../../../images/cart/return.svg";

export default function NoItemFound() {
  return (
    <div className="emptyprodcont">
      <div className="Emptyorderssvg">
        <NoOrdersFoundsvg />
      </div>
      <p className="empttxtup">No Products Found!</p>
      <p className="empttxtsub">Explore more and shortlist some items</p>
      <div className="cartbtnscont">
        <Link to="/">
          <button>
            <div>
              <Returnsvg />
            </div>
            <span>Continue Shopping</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
