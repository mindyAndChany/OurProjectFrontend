import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getStudentDataThunk = createAsyncThunk(
  'getstudentData',
  async (categories) => {
    const url = `${BACKEND_URL}/api/studentsData/getstudentData/${categories}`;
    console.log("Fetching from URL:", url);
    
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch studentData success get");
      console.log("First student from server:", data[0]);
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
