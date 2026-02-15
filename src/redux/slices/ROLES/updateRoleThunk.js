import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateRoleThunk = createAsyncThunk(
  'roles/updateRole',
  async ({ id, roleData }) => {
    const url = `${BACKEND_URL}/api/roles/${id}`;
    console.log("Updating URL:", url);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("update role success");
      return data;
    } else {
      throw new Error('failed to update role');
    }
  }
);
