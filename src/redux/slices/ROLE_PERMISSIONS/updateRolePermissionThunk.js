import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateRolePermissionThunk = createAsyncThunk(
  'rolePermissions/updateRolePermission',
  async ({ roleId, permissionId, rolePermissionData }) => {
    const url = `${BACKEND_URL}/api/role-permissions/${roleId}/${permissionId}`;
    console.log("Updating URL:", url);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rolePermissionData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("update role permission success");
      return data;
    } else {
      throw new Error('failed to update role permission');
    }
  }
);
