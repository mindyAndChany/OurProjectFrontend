import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getLessonsThunk = createAsyncThunk(
  'Lessons/getLessons',
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/Lessons`);

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch Lessons success");
      return data;
    } else {
      throw new Error('❌ failed to fetch Lessons');
    }
  }
);
