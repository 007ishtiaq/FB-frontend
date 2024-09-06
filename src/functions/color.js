import axios from "axios";

export const removeColor = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/Color/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const createColor = async (Color, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/Color`, Color, {
    headers: {
      authtoken,
    },
  });

export const getColors = async () =>
  await axios.get(`${process.env.REACT_APP_API}/Colors`);
