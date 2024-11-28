import React, { useState, useEffect } from "react";
import "./CookieBanner.css";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner">
      <p>
        We use cookies to enhance your experience on our website. By continuing
        to browse, you agree to our{" "}
        <Link to="/CookiePolicy" target="_blank" rel="noopener noreferrer">
          Cookie Policy
        </Link>
        .
      </p>
      <button
        className="cookie-banner-btn mybtn btnprimary"
        onClick={handleAccept}
      >
        Accept
      </button>
    </div>
  );
};

export default CookieBanner;
