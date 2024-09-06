import React from "react";
import "./ItemActionDetails.css";

export default function ItemActionDetails({ returnForm }) {
  function showDate(orderDate) {
    const date = new Date(orderDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  return (
    <div className="actiondetailscont">
      <div className="actiondetailrow">
        <div className="actiondetail">
          Returned Quantity:{" "}
          <span className="qtyinfo">{returnForm.quantity}</span>
        </div>
        <div className="actiondetail">
          Return Authrizarion Number: <span>{returnForm.RequestNumber}</span>
        </div>
      </div>
      <div className="actiondetail">
        Reason For Return / Cancel: <span> {returnForm.reasonForReturn} </span>
      </div>
      <div className="actiondetail">
        Reason Details:<span> {returnForm.otherReasonText}</span>
      </div>
      <div className="actiondetailrow">
        <div className="actiondetail">
          Condition Of Product:
          <span>
            {" "}
            {returnForm.conditionOfProduct
              ? returnForm.conditionOfProduct
              : "No Condition select options"}
          </span>
        </div>
        <div className="actiondetail">
          Preferred Resolution of CashBack:{" "}
          <span>{returnForm.preferredResolution}</span>
        </div>
      </div>
      <div className="actiondetailrow">
        <div className="actiondetail">
          SUBMITTED AT :{" "}
          <span>{new Date(returnForm.createdAt).toLocaleString()}</span>
        </div>
        <div className="actiondetail">
          {returnForm.declaration === true && (
            <div className="confirminfo"> Confirmed </div>
          )}
        </div>
      </div>
    </div>
  );
}
