import React, { useEffect, useState } from "react";
import "./GoToTop.css";
import { ReactComponent as Arrowupsvg } from "../../images/homepage/arrowup.svg";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [btnActive, setbtnActive] = useState(false);

  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenToScroll = () => {
    let heightToHidden = 300;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
      setTimeout(() => {
        setbtnActive(true);
      }, 100);
    } else {
      setIsVisible(false);
      setbtnActive(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <div className="topbtncont">
      {isVisible && (
        <div className={`top-btn ${btnActive && "active"}`} onClick={goToBtn}>
          <Arrowupsvg className="errowupicon" />
        </div>
      )}
    </div>
  );
};

export default GoToTop;
