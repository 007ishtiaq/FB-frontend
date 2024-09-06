import axios from "axios";

export const createStaticText = async (statictextdata, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/admin/statictext`,
    statictextdata,
    {
      headers: {
        authtoken,
      },
    }
  );

export const getStaticTexts = async () =>
  await axios.get(`${process.env.REACT_APP_API}/admin/statictexts`);

export const removeStaticText = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/admin/statictext/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const getRelatedStaticText = async (identity) =>
  await axios.post(`${process.env.REACT_APP_API}/admin/statictexts/`, {
    identity,
  });

export const updateStaticText = async (slug, banner, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/statictext/${slug}`,
    banner,
    {
      headers: {
        authtoken,
      },
    }
  );

export const getStaticText = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/statictext/${slug}`);
