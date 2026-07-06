import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const addPermissionThunk = createAsyncThunk(
  'permissions/addPermission',
  async (permissionData) => {
    const url = `${BACKEND_URL}/api/permissions`;
    console.log("Posting to URL:", url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permissionData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("add permission success");
      return data;
    } else {
      throw new Error('failed to add permission');
    }
  }
);
