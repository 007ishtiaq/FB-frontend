import axios from "axios";

export const createPayPalOrder = (orderData) =>
  axios.post(`${process.env.REACT_APP_API}/paypal-create-order`, orderData);
