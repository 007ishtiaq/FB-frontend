import React, { useState, useEffect } from "react";
import "./StripeCheckout.css";
import { ReactComponent as Chipsvg } from "./cardimgs/chip.svg";
import { ReactComponent as Visasvg } from "./cardimgs/visa.svg";
import { ReactComponent as Infosvg } from "../images/info.svg";
import { ReactComponent as Passwordlock } from "../images/manageacUser/passwordlock.svg";
import { useSelector } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";

const StripeCheckout = ({
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  setClientSecret,
  handleCardChange,
  cardHolder,
  setCardHolder,
  error,
  succeeded,
  setNoNetModal,
}) => {
  const { user, coupon } = useSelector((state) => ({ ...state }));
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Track internet status
  const [componentKey, setComponentKey] = useState(Date.now()); // Unique key for remounting

  const inputStyle = {
    base: {
      fontSize: "16px",
      color: "#fff",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "4px",
    },
    invalid: {
      color: "#fff",
      border: "1px solid #fa755a",
    },
    focus: {
      color: "#000",
      border: "1px solid #ff7800",
    },
    hover: {
      border: "1px solid #ff7800",
      boxShadow: "0 0 7px rgba(255, 165, 0, 0.5)",
    },
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setComponentKey(Date.now()); // Change key to remount component
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNoNetModal(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setNoNetModal]);

  useEffect(() => {
    if (isOnline) {
      createPaymentIntent(user.token, coupon).then((res) => {
        setClientSecret(res.data.clientSecret);
      });
    }
  }, [isOnline, user, coupon, setClientSecret]);

  return (
    <div key={componentKey} className="container">
      <div className="msgcontainer">
        {error && (
          <div className="card-error codnotification" role="alert">
            <div className="squreinfo">
              <Infosvg />
            </div>
            <div className="infodivp">{error}</div>
          </div>
        )}
        {succeeded && (
          <div className="card-succsess codnotification" role="alert">
            <div className="squreinfo">
              <Infosvg />
            </div>
            <div className="infodivp">Payment Charged Successfully!</div>
          </div>
        )}
      </div>
      <div className="card-container">
        <div className="card">
          <div className="front">
            <div className="logosvgopt cardfrontsvg">
              <Chipsvg />
              <Visasvg className="cardfrontsvgvisa" />
            </div>
            <div className="card-number-box">
              <div className="inputBox">
                <span>Card Number</span>
                <div className="inputWrapper">
                  <CardNumberElement
                    options={{
                      style: inputStyle,
                    }}
                    onChange={handleCardChange}
                  />
                </div>
              </div>
            </div>
            <div className="flexbox">
              <div className="box">
                <div className="inputBox">
                  <span>Card Holder</span>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="card-holder-input"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>
              <div className="box">
                <div className="inputBox">
                  <span>Expiration</span>
                  <div className="inputWrapper">
                    <CardExpiryElement
                      options={{
                        style: inputStyle,
                      }}
                      onChange={handleCardChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flipped">
            <div className="back">
              <div className="stripe"></div>
              <div className="box">
                <span>CVV</span>
                <div className="cvv-box">
                  <div className="inputWrapper cvvWrapper">
                    <CardCvcElement onChange={handleCardChange} />
                  </div>
                </div>
                <div className="cardvisasvg">
                  <Visasvg />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="codnotification" role="alert">
        <div className="locksvg">
          <Passwordlock />
        </div>
        <div className="infodivp">
          Your card information is securely processed by Stripe and is not
          stored on our site.
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
