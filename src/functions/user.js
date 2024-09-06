import axios from "axios";

export const userCart = async (cart, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cart`,
    { cart },
    {
      headers: {
        authtoken,
      },
    }
  );

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
  await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {
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
  values
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/cash-order`,
    { couponApplied: couponTrueOrFalse, COD, values },
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
  values
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/order`,
    { couponApplied: couponTrueOrFalse, image, BFT, Wallet, Easypesa, values },
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
