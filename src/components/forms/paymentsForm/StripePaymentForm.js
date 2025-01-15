import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../../../functions/stripe";

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setMessage("Stripe not loaded");
      setLoading(false);
      return;
    }

    // Call your backend to create a payment intent
    const response = await fetch(
      "http://localhost:8000/api/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // Example: $10.00
      }
    );

    const { clientSecret } = await response.json();

    // Confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(`Payment failed: ${result.error.message}`);
    } else if (result.paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default StripePaymentForm;
