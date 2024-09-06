import React, { useState } from "react";
// import classes from "./SideDrawer.module.css";
import "./SideDrawer.css";
import { Link } from "react-router-dom";
import Backdrop from "../Backdrop/Backdrop";
import { CloseOutlined } from "@ant-design/icons";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import { ReactComponent as Tickchecksvg } from "../../images/manageacUser/tickcheck.svg";
import { ReactComponent as Personsvg } from "../../images/headersvgs/Personsvg.svg";
import { useSelector } from "react-redux";

//small size left drawer - outer layer with children  (children is NavItems.js)
export default function SideDrawer(props) {
  const { user } = useSelector((state) => ({ ...state }));

  return (
    <>
      <Backdrop show={props.Open} closeModel={props.close} />
      <div className={`SideDrawer ${props.Open ? "Open" : "Close"}`}>
        {props.Drawer !== "Filter" && (
          <div className="SideDrawerHeader">
            <div className="sidedrawertop">
              <div class="logodiv">
                <div class="logo-txtsize">
                  <Logotextblack />
                </div>
              </div>
              <CloseOutlined onClick={props.close} className="clear" />
            </div>
            <div className="sidedrawergreet">
              {user && user.name ? (
                <>
                  <div class="namecont">
                    <p>Hello, {user && user.name && user && user.name}</p>
                  </div>
                  <div class="varifiedinfocont">
                    <div class="varifiedinfo">
                      <div class="personvarifiedsvg">
                        <Tickchecksvg />
                      </div>
                      <div class="varifiedinfotext">Varified Account</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="sidenavauthbtns">
                  <div className="noauthcont noauthbig">
                    <Link to="/login">
                      <button className="noauthbtn">
                        <div className="noauthsvg">
                          <Personsvg />
                        </div>
                        <p> Sign In </p>
                      </button>
                    </Link>
                    <Link to="/register">
                      <button className="noauthbtn regisbtn">
                        <div className="noauthsvg">
                          <Personsvg />
                        </div>
                        <p> Register </p>
                      </button>
                    </Link>
                  </div>
                  <div className="noauthmediam">
                    <div className="noauthcont">
                      <Link to="/login">
                        <button className="noauthbtn">
                          <div className="noauthsvg">
                            <Personsvg />
                          </div>
                          <p> Login </p>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {props.children}
      </div>
    </>
  );
}
