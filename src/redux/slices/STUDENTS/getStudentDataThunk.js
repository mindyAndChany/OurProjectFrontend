import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getStudentDataThunk = createAsyncThunk(
  'getstudentData',
  async (categories) => {
    const encodedCategories = encodeURIComponent(categories);
    console.log(`${BACKEND_URL}/api/studentsData/getstudentData/${encodedCategories}`);
    
    // const res = await fetch(`${BACKEND_URL}/api/studentsData/getstudentData/${encodedCategories}`);
    const res = await fetch(`${BACKEND_URL}/api/studentsData/getstudentData/${encodedCategories}`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch studentData success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
