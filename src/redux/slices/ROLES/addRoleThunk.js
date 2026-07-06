import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const addRoleThunk = createAsyncThunk(
  'roles/addRole',
  async (roleData) => {
    const url = `${BACKEND_URL}/api/roles`;
    console.log("Posting to URL:", url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("add role success");
      return data;
    } else {
      throw new Error('failed to add role');
    }
  }
);
