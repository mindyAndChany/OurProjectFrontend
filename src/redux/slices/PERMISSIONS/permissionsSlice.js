import { createSlice } from "@reduxjs/toolkit";
import { getPermissionsThunk } from "./getPermissionsThunk.js";
import { getPermissionByIdThunk } from "./getPermissionByIdThunk.js";
import { addPermissionThunk } from "./addPermissionThunk.js";
import { updatePermissionThunk } from "./updatePermissionThunk.js";
import { deletePermissionThunk } from "./deletePermissionThunk.js";

export const INITIAL_STATE_PERMISSIONS = {
  permissions: [],
  selectedPermission: null,
  loading: false,
  error: null,
};

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: INITIAL_STATE_PERMISSIONS,
  reducers: {
    clearSelectedPermission: (state) => {
      state.selectedPermission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all permissions
      .addCase(getPermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("getPermissions start");
      })
      .addCase(getPermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        console.log("permissions:", state.permissions);
      })
      .addCase(getPermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("getPermissions error:", action.error);
      })
      
      // Get permission by ID
      .addCase(getPermissionByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPermissionByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPermission = action.payload;
      })
      .addCase(getPermissionByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add permission
      .addCase(addPermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("addPermission start");
      })
      .addCase(addPermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions.push(action.payload);
        console.log("addPermission success:", action.payload);
      })
      .addCase(addPermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("addPermission error:", action.error);
      })
      
      // Update permission
      .addCase(updatePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("updatePermission start");
      })
      .addCase(updatePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPermission = action.payload;
        const index = state.permissions.findIndex(p => p.id === updatedPermission.id);
        if (index !== -1) {
          state.permissions[index] = updatedPermission;
        }
        if (state.selectedPermission && state.selectedPermission.id === updatedPermission.id) {
          state.selectedPermission = updatedPermission;
        }
        console.log("updatePermission success:", updatedPermission);
      })
      .addCase(updatePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("updatePermission error:", action.error);
      })
      
      // Delete permission
      .addCase(deletePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("deletePermission start");
      })
      .addCase(deletePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = state.permissions.filter(p => p.id !== action.payload);
        if (state.selectedPermission && state.selectedPermission.id === action.payload) {
          state.selectedPermission = null;
        }
        console.log("deletePermission success");
      })
      .addCase(deletePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("deletePermission error:", action.error);
      });
  },
});

export const { clearSelectedPermission } = permissionsSlice.actions;
