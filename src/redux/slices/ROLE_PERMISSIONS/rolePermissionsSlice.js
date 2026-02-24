import { createSlice } from "@reduxjs/toolkit";
import { getRolePermissionsThunk } from "./getRolePermissionsThunk.js";
import { getRolePermissionByIdThunk } from "./getRolePermissionByIdThunk.js";
import { addRolePermissionThunk } from "./addRolePermissionThunk.js";
import { updateRolePermissionThunk } from "./updateRolePermissionThunk.js";
import { deleteRolePermissionThunk } from "./deleteRolePermissionThunk.js";

export const INITIAL_STATE_ROLE_PERMISSIONS = {
  rolePermissions: [],
  selectedRolePermission: null,
  loading: false,
  error: null,
};

export const rolePermissionsSlice = createSlice({
  name: 'rolePermissions',
  initialState: INITIAL_STATE_ROLE_PERMISSIONS,
  reducers: {
    clearSelectedRolePermission: (state) => {
      state.selectedRolePermission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all role permissions
      .addCase(getRolePermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("getRolePermissions start");
      })
      .addCase(getRolePermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePermissions = action.payload;
        console.log("rolePermissions:", state.rolePermissions);
      })
      .addCase(getRolePermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("getRolePermissions error:", action.error);
      })
      
      // Get role permission by ID
      .addCase(getRolePermissionByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRolePermissionByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRolePermission = action.payload;
      })
      .addCase(getRolePermissionByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add role permission
      .addCase(addRolePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("addRolePermission start");
      })
      .addCase(addRolePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rolePermissions.push(action.payload);
        console.log("addRolePermission success:", action.payload);
      })
      .addCase(addRolePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("addRolePermission error:", action.error);
      })
      
      // Update role permission
      .addCase(updateRolePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("updateRolePermission start");
      })
      .addCase(updateRolePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRolePermission = action.payload;
        const index = state.rolePermissions.findIndex(
          rp => rp.role_id === updatedRolePermission.role_id && 
                rp.permission_id === updatedRolePermission.permission_id
        );
        if (index !== -1) {
          // יצירת מערך חדש כדי ל-React יזהה את השינוי
          state.rolePermissions = [
            ...state.rolePermissions.slice(0, index),
            updatedRolePermission,
            ...state.rolePermissions.slice(index + 1)
          ];
        }
        console.log("updateRolePermission success:", updatedRolePermission);
      })
      .addCase(updateRolePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("updateRolePermission error:", action.error);
      })
      
      // Delete role permission
      .addCase(deleteRolePermissionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("deleteRolePermission start");
      })
      .addCase(deleteRolePermissionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { roleId, permissionId } = action.payload;
        state.rolePermissions = state.rolePermissions.filter(
          rp => !(rp.role_id === roleId && rp.permission_id === permissionId)
        );
        console.log("deleteRolePermission success");
      })
      .addCase(deleteRolePermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("deleteRolePermission error:", action.error);
      });
  },
});

export const { clearSelectedRolePermission } = rolePermissionsSlice.actions;
