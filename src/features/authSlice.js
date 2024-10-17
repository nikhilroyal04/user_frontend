import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(sessionStorage.getItem("user")) || null,
    isLoading: false,
    error: null,
    token: sessionStorage.getItem("token") || null,
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

      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
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
      state.user = null;
      state.token = null;

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
  },
});

export const { setLoading, setUser, setError, clearError, logout } =
  authSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "auth/login",
      credentials
    );
    dispatch(setUser(response.data.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Login failed"));
  }
};

// Automatically fetch user profile if token is in session
export const fetchUserProfile = () => async (dispatch) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    dispatch(setLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "get/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUser({ user: response.data, token }));
    } catch (error) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to fetch user profile"
        )
      );
    }
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};

export const selectAuthUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
