import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder } from "../../functions/paypal";

const PaypalCheckout = () => {
  const handleCreateOrder = async () => {
    try {
      const response = await createPayPalOrder({
        amount: "100.00", // Transaction amount
        currency: "USD",
      });

      return response.data.id; // Return PayPal Order ID
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      return null;
    }
  };

  return (
    <div className="paypalpaymentcont">
      <PayPalScriptProvider
        options={{
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT,
          "disable-funding": "paylater", // Disable Pay Later
        }}
      >
        <PayPalButtons
          createOrder={handleCreateOrder}
          onApprove={(data, actions) => {
            alert(`Transaction completed! Order ID: ${data.orderID}`);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalCheckout;
