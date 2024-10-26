import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedUser: null, // Added to store the selected user data
  },
  reducers: {
    setUserData: (state, action) => {
      state.data = action.payload.users;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.isLoading = false;
      state.error = null;
    },
    setUserLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setUserError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedUser: (state, action) => {
      // Added reducer to set selected user
      state.selectedUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUserData, setUserLoading, setUserError, setSelectedUser } =
  userSlice.actions;

// Fetch all users
export const fetchUserData =
  (page = 1) =>
  async (dispatch) => {
    dispatch(setUserLoading());
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "user/getAllUsers",
        {
          params: {
            page,
            limit: 20,
          },
        }
      );
      const { users, totalPages } = response.data.data;

      dispatch(
        setUserData({
          users,
          totalPages,
          currentPage: page,
        })
      );
    } catch (error) {
      dispatch(setUserError(error.message));
    }
  };

// Fetch user by ID
export const fetchUserById = (id) => async (dispatch) => {
  dispatch(setUserLoading());
  try {
    const response = await axios.get(
      import.meta.env.VITE_BASE_URL + `user/getUser/${id}`
    );
    dispatch(setSelectedUser(response.data.data)); // Store the selected user data
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Add a new user
export const addUser = (newUser) => async (dispatch) => {
  try {
    await axios.post(import.meta.env.VITE_BASE_URL + "user/addUser", newUser);
    // Re-fetch users after adding a new one
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Edit a user
export const editUser = (updatedUser) => async (dispatch) => {
  console.log("data", updatedUser);
  try {
    await axios.put(
      import.meta.env.VITE_BASE_URL + `user/updateUser/${updatedUser.id}`,
      updatedUser,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Re-fetch users after updating
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Delete a user
export const deleteUser = (id) => async (dispatch) => {
  try {
    await axios.delete(import.meta.env.VITE_BASE_URL + `user/deleteUser/${id}`);
    // Re-fetch users after deletion
    dispatch(fetchUserData());
  } catch (error) {
    dispatch(setUserError(error.message));
  }
};

// Selectors
export const selectUserData = (state) => state.user.data;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectTotalPages = (state) => state.user.totalPages;
export const selectSelectedUser = (state) => state.user.selectedUser;

export default userSlice.reducer;
