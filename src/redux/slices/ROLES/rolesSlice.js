import { createSlice } from "@reduxjs/toolkit";
import { getRolesThunk } from "./getRolesThunk.js";
import { getRoleByIdThunk } from "./getRoleByIdThunk.js";
import { addRoleThunk } from "./addRoleThunk.js";
import { updateRoleThunk } from "./updateRoleThunk.js";
import { deleteRoleThunk } from "./deleteRoleThunk.js";

export const INITIAL_STATE_ROLES = {
  roles: [],
  selectedRole: null,
  loading: false,
  error: null,
};

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: INITIAL_STATE_ROLES,
  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all roles
      .addCase(getRolesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("getRoles start");
      })
      .addCase(getRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        console.log("roles:", state.roles);
      })
      .addCase(getRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("getRoles error:", action.error);
      })
      
      // Get role by ID
      .addCase(getRoleByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRole = action.payload;
      })
      .addCase(getRoleByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Add role
      .addCase(addRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("addRole start");
      })
      .addCase(addRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
        console.log("addRole success:", action.payload);
      })
      .addCase(addRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("addRole error:", action.error);
      })
      
      // Update role
      .addCase(updateRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("updateRole start");
      })
      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload;
        const index = state.roles.findIndex(r => r.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.selectedRole && state.selectedRole.id === updatedRole.id) {
          state.selectedRole = updatedRole;
        }
        console.log("updateRole success:", updatedRole);
      })
      .addCase(updateRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("updateRole error:", action.error);
      })
      
      // Delete role
      .addCase(deleteRoleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("deleteRole start");
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(r => r.id !== action.payload);
        if (state.selectedRole && state.selectedRole.id === action.payload) {
          state.selectedRole = null;
        }
        console.log("deleteRole success");
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log("deleteRole error:", action.error);
      });
  },
});

export const { clearSelectedRole } = rolesSlice.actions;
