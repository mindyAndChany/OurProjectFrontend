import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTeachersThunk = createAsyncThunk(
  'Teachers/getTeachers',
  async () => {
    const res = await fetch('http://localhost:4000/api/Topics');

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch Teachers success");
      return data;
    } else {
      throw new Error('❌ failed to fetch Teachers');
    }
  }
);
