import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getClassesThunk = createAsyncThunk(
  'classes/getClasses',
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/classes`);

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch classes success");
      return data;
    } else {
      throw new Error('❌ failed to fetch classes');
    }
  }
);
