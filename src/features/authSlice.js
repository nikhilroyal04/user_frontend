import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(sessionStorage.getItem("user")) || null,
    isLoading: false,
    error: null,
    token: sessionStorage.getItem("token") || null, // Initialize token from sessionStorage
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Set user and token in session storage
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      // Clear user and token from session storage
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
  },
});

// Export actions for use in components
export const { setLoading, setUser, setError, clearError, logout } = authSlice.actions;

// Async function for user login
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + "auth/login", credentials);
    dispatch(setUser(response.data.data)); // Dispatch setUser to update state and sessionStorage
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Login failed")); // Handle errors
  }
};

// Async function for user logout
export const logoutUser = () => (dispatch) => {
  dispatch(logout()); // Dispatch logout to clear state and sessionStorage
};

// Selectors to access the auth state
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer; // Export the reducer
