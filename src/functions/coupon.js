import axios from "axios";

export const getCoupons = async () =>
  await axios.get(`${process.env.REACT_APP_API}/coupons`);

export const removeCoupon = async (couponId, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/coupon/${couponId}`, {
    headers: {
      authtoken,
    },
  });

export const createCoupon = async (coupon, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/coupon`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getCouponsJson = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/getcouponsjson`, {
    headers: {
      authtoken,
    },
  });

export const uploadCouponsjson = async (jsonData, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/uploadcouponsjson`, jsonData, {
    headers: {
      authtoken,
      "Content-Type": "application/json",
    },
  });
