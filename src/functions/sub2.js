import axios from "axios";

export const getSubs2 = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subs2`);

export const getSub2 = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/sub2/${slug}`);

export const removeSub2 = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/sub2/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateSub2 = async (slug, sub2, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/sub2/${slug}`, sub2, {
    headers: {
      authtoken,
    },
  });

export const createSub2 = async (sub2, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/sub2`, sub2, {
    headers: {
      authtoken,
    },
  });
