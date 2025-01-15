import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StripeCheckout.css";
import { ReactComponent as Chipsvg } from "./cardimgs/chip.svg";
import { ReactComponent as Visasvg } from "./cardimgs/visa.svg";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";

const StripeCheckout = () => {
  const { user, coupon } = useSelector((state) => ({ ...state }));

  const [isFlipped, setIsFlipped] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [cardData, setCardData] = useState({
    number: "#### #### #### ####",
    expiry: "MM/YY",
    cvv: "***",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      setClientSecret(res.data.clientSecret);
    });
  }, [user, coupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const cardElement = elements.getElement(CardNumberElement);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Customer Name", // Add billing details
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  const handleCardDataChange = (event, field) => {
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
      setCardData((prev) => ({
        ...prev,
        [field]: event.complete
          ? event.value || field === "cvv"
            ? "***"
            : ""
          : prev[field],
      }));
    }
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className={`card ${isFlipped ? "flipped" : ""}`}>
          <div className="front">
            <div className="logosvgopt paymentsvgs cardsvg">
              <Visasvg />
              <Chipsvg />
            </div>
            <div className="card-number-box">
              {cardData.number || "#### #### #### ####"}
            </div>
            <div className="flexbox">
              <div className="box">
                <span>Card Holder</span>
                <div className="card-holder-name">Customer Name</div>
              </div>
              <div className="box">
                <span>Expires</span>
                <div className="expiration">{cardData.expiry || "MM/YY"}</div>
              </div>
            </div>
          </div>
          <div className="back">
            <div className="stripe"></div>
            <div className="box">
              <span>CVV</span>
              <div className="cvv-box">{cardData.cvv || "***"}</div>
              <div className="logosvgopt paymentsvgs cardsvg">
                <Visasvg />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputBox">
          <span>Card Number</span>
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
            onChange={(e) => handleCardDataChange(e, "number")}
          />
        </div>
        <div className="inputBox">
          <span>Expiration Date</span>
          <CardExpiryElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
            onChange={(e) => handleCardDataChange(e, "expiry")}
          />
        </div>
        <div className="inputBox">
          <span>CVV</span>
          <CardCvcElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
            onFocus={() => setIsFlipped(true)}
            onBlur={() => setIsFlipped(false)}
            onChange={(e) => handleCardDataChange(e, "cvv")}
          />
        </div>
        <button
          className="submit-button"
          disabled={processing || succeeded || !stripe}
        >
          {processing ? "Processing..." : "Pay"}
        </button>
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        {succeeded && (
          <p className="result-message">
            Payment Successful!{" "}
            <Link to="/user/history">See your order history.</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default StripeCheckout;
