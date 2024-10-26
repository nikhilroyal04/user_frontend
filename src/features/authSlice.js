import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  error: null,
  otpKey: localStorage.getItem("otp_key") || null, // Store OTP key temporarily
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setLoginSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    setLogout: (state) => {
      state.isLoading = false;
      state.error = null;
      state.otpKey = null; 
      localStorage.removeItem("otp_key");
    },
    setLoginError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setOtpVerificationSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem("otp_key");
    },
    setOtpVerificationError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setOtpKey: (state, action) => {
      state.otpKey = action.payload;
      localStorage.setItem("otp_key", action.payload);
    },
    setForgotPasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
      state.forgotPasswordSuccess = true;
    },
    resetForgotPasswordSuccess: (state) => {
      state.forgotPasswordSuccess = false; // Reset success state
    },
  },
});

export const {
  setLoginLoading,
  setLoginSuccess,
  setLogout,
  setLoginError,
  setOtpVerificationSuccess,
  setOtpVerificationError,
  setOtpKey,
  setForgotPasswordSuccess,
  resetForgotPasswordSuccess,
} = authSlice.actions;

export const verifyOtp = (otp, otp_key, email) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "user/verify",
      { otp, otp_key, email }
    );

    dispatch(setLoginSuccess());
    dispatch(setOtpVerificationSuccess());

    const token = response.data.data.token;

    localStorage.setItem("token",token);
    // Return success status and any relevant message
    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    const errorMessage =
      error.response?.message ||
      "OTP verification failed. Please try again.";
    dispatch(setOtpVerificationError(errorMessage));

    // Return the error response for better error handling in the component
    return { success: false, message: errorMessage };
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "user/login",
      credentials
    );

    // Dispatch success actions
    dispatch(setLoginSuccess());

    const userData = response.data.data.user; 
    localStorage.setItem("user", JSON.stringify(userData)); 

    // Return success status and any relevant message
    return { success: true, message: "Login successful", data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Invalid credentials. Please try again.";
    dispatch(setLoginError(errorMessage));

    // Return the error response for better error handling in the component
    return { success: false, message: errorMessage };
  }
};

export const signUp = (formData) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "user/sign-up",
      formData
    );

    const userData = response.data.data; 
    const otp_key = userData.otp_key; 

    dispatch(setOtpKey(otp_key));
    dispatch(setLoginSuccess());

    // Return the response so that the component can access it
    return { success: true, message: "Signup successful", data: userData };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Signup failed. Please try again.";
    dispatch(setLoginError(errorMessage));

    // Return the error response for better error handling in the component
    return { success: false, message: errorMessage };
  }
};

export const resendOtp = (email) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "user/resendotp",
      { email, type: "VERIFICATION" }
    );

    dispatch(setLoginSuccess());

    // Step to update the OTP key in localStorage
    const newOtpKey = response.data.otp_key;
    localStorage.setItem("otp_key", newOtpKey);

    // Return success status and any relevant message
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to resend OTP. Please try again.";
    dispatch(setLoginError(errorMessage));

    // Return the error response for better error handling in the component
    return { success: false, message: errorMessage };
  }
};

export const sendForgotPasswordEmail = (email) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "user/forgot-password",
      { email }
    );

    dispatch(setForgotPasswordSuccess());
    // Optional: Show a toast notification here

    const otp_key = response.data.otp_key;

    localStorage.setItem("otp_key", otp_key);
    // Return success status and any relevant message
    return { success: true, message: response.data.message };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to send email. Please try again.";
    dispatch(setLoginError(errorMessage));

    // Return the error response for better error handling in the component
    return { success: false, message: errorMessage };
  }
};

export const changePassword = (newPassword) => async (dispatch) => {
  dispatch(setLoginLoading());
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      import.meta.env.VITE_BASE_URL + "user/change-password",
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Set the authorization header
        },
      }
    );

    dispatch(setLoginSuccess());
    // Optionally handle success notifications or actions
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to change password. Please try again.";
    dispatch(setLoginError(errorMessage));
    return { success: false, message: errorMessage };
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("otp_key");
  dispatch(setLogout());
};

export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectOtpKey = (state) => state.auth.otpKey;

export default authSlice.reducer;
