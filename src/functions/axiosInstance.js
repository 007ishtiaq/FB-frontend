import axios from "axios";

let isInternetConnected = true;

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      isInternetConnected = false; // here no net
      return Promise.reject("No internet connection");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (!isInternetConnected) {
      isInternetConnected = true;
    }
    console.log("Response:", response.data); // here net is working
    return response;
  },
  (error) => {
    if (!isInternetConnected && error.message === "Network Error") {
      isInternetConnected = false;
    }
    console.error("Error:", error); // here no net
    return Promise.reject(error);
  }
);

export default axiosInstance;
