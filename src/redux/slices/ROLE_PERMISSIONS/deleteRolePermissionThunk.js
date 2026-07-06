import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const deleteRolePermissionThunk = createAsyncThunk(
  'rolePermissions/deleteRolePermission',
  async ({ roleId, permissionId }) => {
    const url = `${BACKEND_URL}/api/role-permissions/${roleId}/${permissionId}`;
    console.log("Deleting from URL:", url);
    
    const res = await fetch(url, {
      method: 'DELETE',
    });

    if (res.ok) {
      console.log("delete role permission success");
      return { roleId, permissionId };
    } else {
      throw new Error('failed to delete role permission');
    }
  }
);
