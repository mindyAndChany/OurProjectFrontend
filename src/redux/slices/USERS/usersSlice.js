import { createSlice } from "@reduxjs/toolkit";
import { getUsersThunk } from "./getUsersThunk.js";
import { getUserByIdThunk } from "./getUserByIdThunk.js";
import { addUserThunk } from "./addUserThunk.js";
import { updateUserThunk } from "./updateUserThunk.js";
import { deleteUserThunk } from "./deleteUserThunk.js";

export const INITIAL_STATE_USERS = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState: INITIAL_STATE_USERS,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("getUsers start");
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        console.log("users:", state.users);
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("getUsers error:", action.error);
      })
      
      // Get user by ID
      .addCase(getUserByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add user
      .addCase(addUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("addUser start");
      })
      .addCase(addUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        console.log("addUser success:", action.payload);
      })
      .addCase(addUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("addUser error:", action.error);
      })
      
      // Update user
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("updateUser start");
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
        if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
        console.log("updateUser success:", updatedUser);
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("updateUser error:", action.error);
      })
      
      // Delete user
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("deleteUser start");
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null;
        }
        console.log("deleteUser success");
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("deleteUser error:", action.error);
      });
  },
});

export const { clearSelectedUser } = usersSlice.actions;
