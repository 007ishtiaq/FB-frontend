import axios from "axios";

export const getShippings = async () =>
  await axios.get(`${process.env.REACT_APP_API}/shippings`);

export const removeShipping = async (shippingId, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/shipping/${shippingId}`, {
    headers: {
      authtoken,
    },
  });

export const createShipping = async (shipping, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/shipping`,
    { shipping },
    {
      headers: {
        authtoken,
      },
    }
  );
