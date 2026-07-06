import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getPermissionsThunk = createAsyncThunk(
  'permissions/getPermissions',
  async () => {
    const url = `${BACKEND_URL}/api/permissions`;
    console.log("Fetching from URL:", url);
    
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch permissions success");
      return data;
    } else {
      throw new Error('failed to fetch permissions');
    }
  }
);
