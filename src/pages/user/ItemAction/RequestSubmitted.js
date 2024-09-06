import React, { useEffect } from "react";
import UsersideNavCopy from "../../../components/nav/UsersideNavCopy";
import "./RequestSubmitted.css";
import { ReactComponent as Tickchecksvg } from "../../../images/manageacUser/tickcheck.svg";
import { Link } from "react-router-dom";

export default function RequestSubmitted({ match }) {
  const { requestType, requestNum } = match.params;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div class="manageacmaincont">
      <div class="manageaccont">
        <UsersideNavCopy />
        <div class="navrightside">
          <div className="requestinfocont">
            <div className="requestinfo">
              <div className="submittedhead">
                <div className="submittedtag">
                  <Tickchecksvg />
                </div>
                <p className="submittedtitle">Request Submitted</p>
              </div>

              <p className="requestinfohead">
                Item {requestType} Request Submitted Successfully
              </p>
              <p>
                Request Number : "
                <span className="requestinfohead requestNum">{requestNum}</span>
                "
              </p>
              <p>You will receive confirmation email shortly </p>
            </div>
            <div className="actionbtns">
              <Link to="/ManageMyAc?page=userOrders">
                <button className="mybtn btnsecond custommyorder">
                  My Orders
                </button>
              </Link>
              <Link to="/">
                <button className="mybtn btnprimary custommyorder">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
