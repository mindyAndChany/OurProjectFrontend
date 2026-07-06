import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const addUserThunk = createAsyncThunk(
  'users/addUser',
  async (userData) => {
    const url = `${BACKEND_URL}/api/users`;
    console.log("Posting to URL:", url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("add user success");
      return data;
    } else {
      throw new Error('failed to add user');
    }
  }
);
