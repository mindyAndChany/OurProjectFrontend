import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }) => {
    const url = `${BACKEND_URL}/api/users/${id}`;
    console.log("Updating URL:", url);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("update user success");
      return data;
    } else {
      throw new Error('failed to update user');
    }
  }
);
