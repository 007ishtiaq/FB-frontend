import React, { useState, useEffect, Suspense, lazy } from "react";
import "./Header.css";
import { Badge } from "antd";
import { Link } from "react-router-dom";
import firebase from "firebase/app"; // Import only the core Firebase module
import "firebase/auth"; // Import the Firebase Authentication module
import { Detector } from "react-detect-offline";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "../forms/Search";
import { ReactComponent as Logosign } from "../../images/headersvgs/logosign.svg";
import { ReactComponent as Logotextblack } from "../../images/headersvgs/logotextblack.svg";
import { ReactComponent as Cartsvg } from "../../images/headersvgs/Cartsvg.svg";
import { ReactComponent as Personsvg } from "../../images/headersvgs/Personsvg.svg";
import { getRelatedStaticText } from "../../functions/staticText";
import BurdermenuSmall from "../SliderDiv/categoriesPanal/BurdermenuSmall";
import "../SliderDiv/SliderDiv.css";
import { ReactComponent as Callsvg } from "../../images/contactUs/calloutlined.svg";
import { ReactComponent as Mailsvg } from "../../images/contactUs/mail.svg";
import { ReactComponent as Helpsvg } from "../../images/headersvgs/help.svg";
import { ReactComponent as Earnsvg } from "../../images/headersvgs/earn.svg";

const Header = () => {
  const [staticTexts, setStaticTexts] = useState([]);
  const [contactinfo, setContactinfo] = useState([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [netconnection, setNetconnection] = useState(true);
  const [hideOnlineText, setHideOnlineText] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let dispatch = useDispatch();
  let { user, cart } = useSelector((state) => ({ ...state }));

  let history = useHistory();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const accountDiv = document.getElementById("accounthoverdiv");

      if (accountDiv && !accountDiv.contains(event.target)) {
        // Clicked outside the account dropdown, hide it
        setShowAccountDropdown(false);
      }
    };
    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getRelatedStaticText("topcouponbar").then((t) => setStaticTexts(t.data));
    getRelatedStaticText("contactpageinfo").then((t) => setContactinfo(t.data));
  }, []);

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    dispatch({
      type: "CLEAR_WISHLIST",
      payload: null,
    });
    history.push("/login");
  };

  function copyToClipboard() {
    var textToCopy = document.querySelector(".top_tag_Center strong").innerText;
    var tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.setAttribute(
      "value",
      staticTexts && staticTexts.length > 0 && staticTexts[0].info2
    );
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert(
      "Copied to clipboard: " + staticTexts &&
        staticTexts.length > 0 &&
        staticTexts[0].info2
    );
  }

  const showaccountdiv = () => {
    setShowAccountDropdown((prev) => !prev);
  };

  const htmlToRender = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  const AccountDropdown = lazy(() => import("./AccountDropdown"));

  return (
    <>
      <div class="headermain">
        <div class="top-header">
          <div class="newsleft helperlinkcont">
            <Earnsvg className="mailsvgcont"></Earnsvg>
            <p class="top_tag_Center" onClick={copyToClipboard}>
              {htmlToRender(
                staticTexts && staticTexts.length > 0 && staticTexts[0].info1
              )}
            </p>
          </div>
          <div class="newsright">
            <div className="helperlinkcont">
              <Callsvg></Callsvg>
              <p className="top_tag_Right">
                {contactinfo && contactinfo.length > 0 && contactinfo[0].info1}
              </p>
            </div>
            <div className="seprator">{"|"}</div>
            <Link to="/ContactUs" className="helperlinkcont">
              <Mailsvg className="mailsvgcont"></Mailsvg>
              <p class="top_tag_Right">Contact Now </p>
            </Link>
            <div className="seprator">{"|"}</div>
            <Link to="/HelpCenter" className="helperlinkcont">
              <Helpsvg></Helpsvg>
              <p class="top_tag_Right"> Help Center</p>
            </Link>
          </div>
        </div>

        <div id="Mainheader" className="middlemainheader">
          <div class="middle-header">
            <div class="binder">
              {windowWidth <= 700 && <BurdermenuSmall />}
              <Link to="/">
                <div class="logodiv">
                  <div class="logo-svgsize">
                    <Logosign />
                  </div>
                  <div class="logo-txtsize">
                    <Logotextblack />
                  </div>
                </div>
              </Link>
            </div>

            <Search />

            <div class={`middleheaderrightside ${user ? "authis" : "noauth"}`}>
              <div class="dynamictextdiv">
                {user ? (
                  <p className="namegreeting">Hi, {user.email && user.name}</p>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {user && (
                <div
                  id="accounthoverdiv"
                  className={showAccountDropdown && "active"}
                  onClick={showaccountdiv}
                >
                  <div className="cartsvg">
                    <Personsvg />
                  </div>
                  {showAccountDropdown && (
                    <Suspense fallback={" "}>
                      <AccountDropdown user={user} logout={logout} />
                    </Suspense>
                  )}
                </div>
              )}
              <div id="cartbtn" class="cartbtndiv">
                <Link to="/cart">
                  <Badge count={cart.length} offset={[-3, 8]}>
                    <>
                      <div className="noauthbig">
                        <div id="carthoverdiv">
                          <div className="cartsvg">
                            <Cartsvg />
                          </div>
                        </div>
                      </div>
                      <div className="noauthmediam">
                        <div className="noauthcont">
                          <Link to="/cart">
                            <button className="noauthbtn">
                              <div className="noauthsvg">
                                <Cartsvg />
                              </div>
                              <p> Cart </p>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </>
                  </Badge>
                </Link>
              </div>
            </div>
          </div>
          <div
            className={` netnotifier ${
              netconnection ? "connected" : "notconnected"
            } ${hideOnlineText ? "hideonline" : "showonline"}
             `}
          >
            <Detector
              render={({ online }) => {
                if (online) {
                  setNetconnection(true);
                  setTimeout(() => {
                    setHideOnlineText(true);
                  }, 1800);
                } else {
                  setNetconnection(false);
                  setHideOnlineText(false);
                }
                return online ? <p> Online Back </p> : <p> No Connection </p>;
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
