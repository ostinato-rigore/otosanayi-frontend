import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import api from "../lib/axios"; // axios instance

const useAuthStore = create((set, get) => ({
  user: null,
  userType: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: async (user, userType) => {
    await AsyncStorage.setItem("userType", userType);
    set({ user, userType, isAuthenticated: !!user });
  },

  fetchUser: async () => {
    set({ isLoading: true });

    try {
      const userType = await AsyncStorage.getItem("userType");

      if (!userType) {
        set({ user: null, userType: null, isAuthenticated: false });
        return;
      }

      const endpoint =
        userType === "Customer" ? "/customers/me" : "/mechanics/me";

      const res = await api.get(endpoint);

      if (res.status === 200 && res.data) {
        set({
          user: res.data,
          userType,
          isAuthenticated: true,
        });
        console.log("UserType set to:", userType, "isAuthenticated:", true);
      } else {
        set({
          user: null,
          userType: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error("fetchUser error:", error);
      set({ user: null, userType: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (type, credentials) => {
    set({ isLoading: true });

    try {
      const endpoint =
        type === "Customer" ? "/auth/login/customer" : "/auth/login/mechanic";

      const res = await api.post(endpoint, credentials);

      if (res.data?.user) {
        await AsyncStorage.setItem("userType", type);
        set({
          user: res.data.user,
          userType: type,
          isAuthenticated: true,
        });
      }

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        error: err?.response?.data || err.message,
      };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (type, data) => {
    set({ isLoading: true });

    try {
      const endpoint =
        type === "Customer"
          ? "/auth/register/customer"
          : "/auth/register/mechanic";

      const res = await api.post(endpoint, data);

      if (res.data?.user) {
        await AsyncStorage.setItem("userType", type);
        set({
          user: res.data.user,
          userType: type,
          isAuthenticated: false,
        });
      }

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Register failed:", err);
      return {
        success: false,
        error: err?.response?.data || err.message,
      };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await api.get("/auth/logout");
      await AsyncStorage.removeItem("userType");
    } catch (e) {
      console.warn("Logout error (ignored):", e);
    } finally {
      set({
        user: null,
        userType: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
