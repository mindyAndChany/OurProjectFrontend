import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getTopicsThunk = createAsyncThunk(
  'Topics/getTopics',
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/topics`);

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch topics success");
      return data;
    } else {
      throw new Error('❌ failed to fetch topics');
    }
  }
);
