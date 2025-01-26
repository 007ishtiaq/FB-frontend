import axios from "axios";
import { auth } from "../firebase"; // Import Firebase auth
import { store } from "../redux/store"; // Import Redux store
import { LOGGED_IN_USER } from "../redux/constants"; // Adjust path accordingly

export const userCart = async (cart, newsletter, authtoken) => {
  try {
    return await axios.post(
      `${process.env.REACT_APP_API}/user/cart`,
      { cart, newsletter },
      {
        headers: { authtoken },
      }
    );
  } catch (error) {
    if (error.response?.status === 401) {
      // If token is expired, refresh it and retry request
      const user = auth.currentUser;
      if (user) {
        const newToken = await user.getIdToken(true); // Refresh token
        return await axios.post(
          `${process.env.REACT_APP_API}/user/cart`,
          { cart, newsletter },
          {
            headers: { authtoken: newToken },
          }
        );
      }
    }
    throw error; // If another error, return it
  }
};

export const getUserCart = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });

export const emptyUserCart = async (authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/user/cart`, {
    headers: {
      authtoken,
    },
  });

export const saveUserAddress = async (authtoken, values) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/address`,
    { values },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUserAddress = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/address`, {
    headers: {
      authtoken,
    },
  });

export const saveUserProfile = async (authtoken, values) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/user/profile`,
      { values },
      {
        headers: {
          authtoken,
        },
      }
    );
    return response.data; // Assuming the response contains the data property
  } catch (error) {
    console.error("Error in saveUserProfile:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export const getUserProfile = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/user/profile`, {
    headers: {
      authtoken,
    },
  });

export const validateCoupon = async (authtoken, coupon) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart/couponValidate`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  );

export const applyCoupon = async (authtoken, coupon) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart/coupon`,
    { coupon },
    {
      headers: {
        authtoken,
      },
    }
  );
export const removeCoupon = async (authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart/removecoupon`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );

export const createOrder = async (stripeResponse, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/stripe/order`,
    { stripeResponse },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getUserOrders = async (authtoken, page) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/orders`,
    { page },
    {
      headers: {
        authtoken,
      },
    }
  );
export const getUserCancelledOrders = async (authtoken, page) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cancelledorders`,
    { page },
    {
      headers: {
        authtoken,
      },
    }
  );
export const getUserReturnedOrders = async (authtoken, page) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/returnedorders`,
    { page },
    {
      headers: {
        authtoken,
      },
    }
  );
export const getOrder = async (id, authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/order/${id}`, {
    headers: {
      authtoken,
    },
  });

export const getWishlist = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/getwishlist`, {
    headers: {
      authtoken,
    },
  });

export const wishlistByPage = async (data, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/getwishlistbypage`, data, {
    headers: {
      authtoken,
    },
  });

export const removeWishlist = async (productId, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/user/wishlist/${productId}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );

export const addToWishlist = async (productId, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/wishlist`,
    { productId },
    {
      headers: {
        authtoken,
      },
    }
  );

export const createCashOrderForUser = async (
  authtoken,
  COD,
  couponTrueOrFalse,
  values,
  paymentId,
  newsletter
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cash-order`,
    { couponApplied: couponTrueOrFalse, COD, values, paymentId, newsletter },
    {
      headers: {
        authtoken,
      },
    }
  );
export const createOrderForUser = async (
  authtoken,
  image,
  BFT,
  Wallet,
  Easypesa,
  couponTrueOrFalse,
  values,
  newsletter
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    {
      couponApplied: couponTrueOrFalse,
      image,
      BFT,
      Wallet,
      Easypesa,
      values,
      newsletter,
    },
    {
      headers: {
        authtoken,
      },
    }
  );

export const createCancellation = async (id, itemid, cancelForm, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/product/cancel`,
    { id, itemid, cancelForm },
    {
      headers: {
        authtoken,
      },
    }
  );

export const createReturn = async (id, itemid, returnForm, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/product/return`,
    { id, itemid, returnForm },
    {
      headers: {
        authtoken,
      },
    }
  );

export const subscribeNewsletter = async (authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/newsletterSubscribe`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );

export const checkNewsSub = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/checknewsSubs`, {
    headers: {
      authtoken,
    },
  });
