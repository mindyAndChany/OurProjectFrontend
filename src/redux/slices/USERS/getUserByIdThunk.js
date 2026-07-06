import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getUserByIdThunk = createAsyncThunk(
  'users/getUserById',
  async (id) => {
    const url = `${BACKEND_URL}/api/users/${id}`;
    console.log("Fetching from URL:", url);
    
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch user by id success");
      return data;
    } else {
      throw new Error('failed to fetch user');
    }
  }
);
