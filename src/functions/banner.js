import axios from "axios";

export const createBanner = async (banner, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/banner`, banner, {
    headers: {
      authtoken,
    },
  });

export const getBanners = async () =>
  await axios.get(`${process.env.REACT_APP_API}/banners`);

export const removeBanner = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/banner/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const getRelatedBanners = async (identity) =>
  await axios.post(`${process.env.REACT_APP_API}/banners`, {
    identity,
  });

export const updateBanner = async (slug, banner, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/banner/${slug}`, banner, {
    headers: {
      authtoken,
    },
  });

export const getBanner = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/banner/${slug}`);
