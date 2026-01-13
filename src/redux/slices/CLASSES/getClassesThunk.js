import { createAsyncThunk } from "@reduxjs/toolkit";

export const getClassesThunk = createAsyncThunk(
  'classes/getClasses',
  async () => {
    const res = await fetch('https://ourprojectbackend-1.onrender.com/api/classes');

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch classes success");
      return data;
    } else {
      throw new Error('❌ failed to fetch classes');
    }
  }
);
