import axios from "axios";

export const getSubs = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subs`);

export const getSub = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/sub/${slug}`);

export const removeSub = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/sub/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updateSub = async (slug, sub, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/sub/${slug}`, sub, {
    headers: {
      authtoken,
    },
  });

export const createSub = async (sub, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/sub`, sub, {
    headers: {
      authtoken,
    },
  });

export const getSubsSub2 = async (_id) =>
  await axios.get(`${process.env.REACT_APP_API}/subs/sub2/${_id}`);

export const getSubsJson = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/getsubsjson`, {
    headers: {
      authtoken,
    },
  });

export const uploadsubsjson = async (jsonData, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/uploadsubsjson`, jsonData, {
    headers: {
      authtoken,
      "Content-Type": "application/json",
    },
  });
