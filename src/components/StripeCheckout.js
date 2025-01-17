import React, { useState, useEffect } from "react";
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

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const inputStyle = {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
    },
  };

  useEffect(() => {
    createPaymentIntent(user.token, coupon).then((res) => {
      setClientSecret(res.data.clientSecret);
    });
  }, [user, coupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardHolder,
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
    } catch (err) {
      setError("Payment processing failed. Please try again.");
      setProcessing(false);
    }
  };

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className="card">
          <div className="front">
            <div className="logosvgopt paymentsvgs cardsvg">
              <Visasvg />
              <Chipsvg />
            </div>
            <div className="inputBox">
              <span>Card Number</span>
              <CardNumberElement
                options={{ style: inputStyle }}
                onChange={handleChange}
              />
            </div>
            <div className="card-number-box">#### #### #### ####</div>
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
                  <span>Expiration Date</span>
                  <CardExpiryElement
                    options={{ style: inputStyle }}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card flipped">
          <div className="back">
            <div className="stripe"></div>
            <div className="box">
              <span>CVV</span>
              <div className="cvv-box">
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
                />
              </div>
              <div className="logosvgopt paymentsvgs cardsvg">
                <Visasvg />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
          disabled={processing || disabled || succeeded}
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
            Payment Successful! See your order history.
          </p>
        )} */}
      </form>
    </div>
  );
};

export default StripeCheckout;
