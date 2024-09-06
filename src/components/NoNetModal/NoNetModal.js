import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import "./NoNetModal.css";
import { ReactComponent as NoInternetSvg } from "../../images/nointernet.svg";
import { ReactComponent as CloseSvg } from "../../images/close.svg";

export default function NoNetModal({
  classDisplay,
  setNoNetModal,
  handleRetry,
}) {
  const dispatch = useDispatch();

  if (classDisplay === "open-popup") {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "visible";
  }

  return ReactDOM.createPortal(
    <>
      <div
        className={`modalwrapper ${classDisplay}`}
        onClick={() => {
          setNoNetModal(false);
          //below code not for 6 auth pages
          dispatch({
            type: "SET_NETMODAL_VISIBLE",
            payload: false,
          });
        }}
      ></div>
      <div class={`netpopup ${classDisplay}`}>
        <div className="modalcont">
          <div className="ClosesvgCont">
            <CloseSvg
              onClick={() => {
                setNoNetModal(false);
                //below code not for 6 auth pages
                dispatch({
                  type: "SET_NETMODAL_VISIBLE",
                  payload: false,
                });
              }}
            />
          </div>
          <div className="NoInternetSvgCont">
            <NoInternetSvg />
          </div>
          <div className="textsidecont">
            <h2>Lost Connection</h2>
            <p>whoops... no internet connection found. check your connection</p>
            <button
              className="mybtn btnprimary"
              type="button"
              onClick={() => {
                setNoNetModal(false);

                setTimeout(() => {
                  handleRetry();
                }, 500);
                //below code not for 6 auth pages
                dispatch({
                  type: "SET_NETMODAL_VISIBLE",
                  payload: false,
                });
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("netPortal")
  );
}
