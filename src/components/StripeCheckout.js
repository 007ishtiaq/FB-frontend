import React, { useState, useEffect } from "react";
import "./StripeCheckout.css";
import { ReactComponent as Chipsvg } from "./cardimgs/chip.svg";
import { ReactComponent as Visasvg } from "./cardimgs/visa.svg";
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
}) => {
  const { user, coupon } = useSelector((state) => ({ ...state }));

  // const inputStyle = {
  //   base: {
  //     fontSize: "16px",
  //     color: "#fff",
  //     "::placeholder": {
  //       color: "#aab7c4",
  //     },
  //   },
  //   invalid: {
  //     color: "#fff",
  //   },
  // };

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
      color: "#fff", // Red border for invalid input
      border: "1px solid #fa755a",
    },
    focus: {
      color: "#000",
      border: "1px solid #ff7800", // Blue border on focus
    },
    hover: {
      border: "1px solid #ff7800", // Darker border on hover
      boxshadow: "0 0 7px rgba(255, 165, 0, 0.5)",
    },
  };

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      setClientSecret(res.data.clientSecret);
    });
  }, [user, coupon]);

  return (
    <div className="container">
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
                {/* <span>Card Holder</span>
                <div className="card-holder-name">
                  {cardHolder || "Full Name"}
                </div> */}
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
                {/* <span>Expires</span> */}
                {/* <div className="expiration">MM/YY</div> */}
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
                    <CardCvcElement
                    // options={{
                    //   style: inputStyle,
                    // }}
                    />
                  </div>
                </div>
                <div className="logosvgopt paymentsvgs cardsvg">
                  <Visasvg />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="inputBox">
          <span>Card Holder</span>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            className="card-holder-input"
            placeholder="Full Name"
            required
          />
        </div> */}
      {/* <div className="inputBox">
          <span>Card Number</span>
          <CardNumberElement
            options={{ style: inputStyle }}
            onChange={handleChange}
          />
        </div> */}

      {/* <div className="inputBox">
          <span>CVV</span>
          <CardCvcElement
            options={{ style: inputStyle }}
            onChange={handleChange}
          />
        </div> */}
      {/* <button
          className="submit-button"
        >
          {processing ? "Processing..." : "Pay"}
        </button>  */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {succeeded && (
        <p className="result-message">
          Payment Successful! See your order history.
        </p>
      )}
    </div>
  );
};

export default StripeCheckout;
