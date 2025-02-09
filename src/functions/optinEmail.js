import axios from "axios";

export const createOptinEmail = async (optinEmail) =>
  await axios.post(`${process.env.REACT_APP_API}/optinEmailcreate`, {
    optinEmail,
  });

export const getOptinEmails = async (authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API}/optinEmailslist`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );

export const getOptinsJson = async (authtoken) =>
  await axios.get(`${process.env.REACT_APP_API}/getoptinsjson`, {
    headers: {
      authtoken,
    },
  });

export const uploadOptinsjson = async (jsonData, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/uploadoptinsjson`, jsonData, {
    headers: {
      authtoken,
      "Content-Type": "application/json",
    },
  });
