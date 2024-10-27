import axios from "axios";
import { jwtDecode } from "jwt-decode";

const http = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decode = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decode.exp > currentTime;
  } catch (error) {
    console.log(error);
    return false;
  }
};

http.interceptors.request.use(
  (config) => {
    if (!config.url.includes("/users/login") && !config.url.includes("/users/register")) {
      const token = localStorage.getItem("jwtToken");
      if (isTokenValid(token)) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        alert("Token is invalid or expired. Please log in again.");
        localStorage.removeItem("jwtToken");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        error.message =error.response.data.message;
        localStorage.removeItem("jwtToken");
      }else if (error.status == 400) {
        if (error.response && error.response.data) {
          // Extract error messages and join them into a single string
          error.message = extractErrorMessages(
            error.response.data.error
          );
        }
      } else {
        error.message = `Error: ${error.response.status} - ${
          error.response.data.message || "An error occurred."
        }`;
      }
    } else if (error.code == "ERR_NETWORK") {
      error.message = "Network error or request failed. Please try again.";
    }
    return Promise.reject(error);
  }
);

const extractErrorMessages = (errors) => {
  // Assuming errors is an object with fields as keys and array of messages as values
  return Object.values(errors)
    .flat() // Flatten the array of messages
    .join(", "); // Join messages into a single string
};

export default http;
