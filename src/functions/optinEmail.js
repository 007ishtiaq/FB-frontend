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
