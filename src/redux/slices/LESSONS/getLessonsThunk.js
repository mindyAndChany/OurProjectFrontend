import { createAsyncThunk } from "@reduxjs/toolkit";

export const getLessonsThunk = createAsyncThunk(
  'Lessons/getLessons',
  async () => {
    const res = await fetch('http://localhost:4000/api/Lessons');

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch Lessons success");
      return data;
    } else {
      throw new Error('❌ failed to fetch Lessons');
    }
  }
);
