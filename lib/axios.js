import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.21:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request interceptor: İstek gönderilmeden önce log ekle
api.interceptors.request.use(
  (config) => {
    console.log("Sending request to:", config.url);
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: 401 hatası için callback ekle
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.data);
    return response;
  },
  async (error, onUnauthorized) => {
    if (error.response) {
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );
      if (error.response.status === 401) {
        console.error("Unauthorized access - calling callback");
      } else if (error.response.status === 403) {
        console.error("Forbidden:", error.response.data);
      }
    } else if (error.request) {
      console.error("Network Error - no response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
