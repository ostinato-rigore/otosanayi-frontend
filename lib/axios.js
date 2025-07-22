import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

const api = axios.create({
  baseURL: "http://192.168.1.32:3000/api/v1",
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
    Alert.alert(
      "Request Error",
      error.message || "An error occurred while sending the request."
    );
    return Promise.reject(error);
  }
);

// Response interceptor: Hataları Alert ile göster
api.interceptors.response.use(
  (response) => {
    // console.log("Response received:", response.data);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Sunucudan dönen hata (örneğin, 401, 403)
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "An error occurred";
      if (error.response.status === 401) {
        // 401 Unauthorized: Kullanıcıyı login sayfasına yönlendir
        router.replace("/(auth)");
      } else if (error.response.status === 403) {
        console.error("Forbidden:", error.response.data);
        Alert.alert(
          "Forbidden",
          errorMessage || "You do not have permission to access this resource."
        );
      } else {
        // Alert.alert(
        //   "Server Error",
        //   `${error.response.status}: ${errorMessage}`
        // );
      }
    } else if (error.request) {
      // Ağ hatası (sunucuya ulaşılamadı)
      console.error("Network Error - no response received:", error.request);
      Alert.alert(
        "Network Error",
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } else {
      // Diğer hatalar
      console.error("Error:", error.message);
      // Alert.alert("Error", error.message || "An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default api;
