import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updatePermissionThunk = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, permissionData }) => {
    const url = `${BACKEND_URL}/api/permissions/${id}`;
    console.log("Updating URL:", url);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permissionData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("update permission success");
      return data;
    } else {
      throw new Error('failed to update permission');
    }
  }
);
