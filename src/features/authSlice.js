import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    error: null,
    token: sessionStorage.getItem("token") || null,
  },
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setToken: (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;

      sessionStorage.setItem("token", action.payload.token);
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      sessionStorage.removeItem("token");
    },
  },
});

export const { setLoading, setToken, setError, clearError, logout } = authSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(import.meta.env.VITE_BASE_URL + "auth/login", credentials);
    dispatch(setToken(response.data.data)); // Adjusted to only set token
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Login failed"));
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};

export const selectAuthToken = (state) => state.auth.token; // Adjusted to select token
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
