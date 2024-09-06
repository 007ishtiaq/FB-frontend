import axios from "axios";

export const createProduct = async (product, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/product`, product, {
    headers: {
      authtoken,
    },
  });

export const getProductsByCount = async (count) =>
  await axios.get(`${process.env.REACT_APP_API}/products/${count}`);

export const removeProduct = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const getProduct = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/product/${slug}`);

export const getProductAdmin = async (slug, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/productAdmin/${slug}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );

export const updateProduct = async (slug, product, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/product/${slug}`, product, {
    headers: {
      authtoken,
    },
  });

// export const getProducts = async (sort, order, page) =>
//   await axios.post(`${process.env.REACT_APP_API}/products`, {
//     sort,
//     order,
//     page,
//   });
export const getReviews = async (productslug, page) =>
  await axios.post(`${process.env.REACT_APP_API}/reviews`, {
    productslug,
    page,
  });

// export const getFlashproducts = async () =>
//   await axios.post(`${process.env.REACT_APP_API}/products/flash`);

export const getcurrentFlash = async () =>
  await axios.post(`${process.env.REACT_APP_API}/products/currentflash`);

export const checkFlash = async (slug) =>
  await axios.post(`${process.env.REACT_APP_API}/product/checkflash/${slug}`);

// export const resetFlash = async (date) =>
//   await axios.post(`${process.env.REACT_APP_API}/product/flashreset/`, {
//     date,
//   });

export const getProductsCount = async () =>
  await axios.get(`${process.env.REACT_APP_API}/products/total`);

export const productStar = async (productId, reviewinfo, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/product/review/${productId}`,
    { reviewinfo },
    {
      headers: {
        authtoken,
      },
    }
  );

export const getRatedproducts = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/ratedAll`, {
    headers: {
      authtoken,
    },
  });

export const getSimilar = async (productSlug) =>
  await axios.get(
    `${process.env.REACT_APP_API}/product/Similar/${productSlug}`
  );

// export const getRelated = async (productId) =>
//   await axios.get(`${process.env.REACT_APP_API}/product/related/${productId}`);

export const fetchProductsByFilter = async (arg) =>
  await axios.post(`${process.env.REACT_APP_API}/search/filters`, arg);

export const getHighestPrice = async () =>
  await axios.get(`${process.env.REACT_APP_API}/search/highestprice`);
