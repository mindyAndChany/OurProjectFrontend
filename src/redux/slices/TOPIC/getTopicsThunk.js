import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTopicsThunk = createAsyncThunk(
  'Topics/getTopics',
  async () => {
    const res = await fetch('http://localhost:4000/api/topics');

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch topics success");
      return data;
    } else {
      throw new Error('❌ failed to fetch topics');
    }
  }
);
