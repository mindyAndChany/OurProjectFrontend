import { createAsyncThunk } from "@reduxjs/toolkit";

export const getStudentDataThunk = createAsyncThunk(
  'getstudentData',
  async (categories) => {
    const encodedCategories = encodeURIComponent(categories);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/studentsData/getstudentData/${encodedCategories}`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch studentData success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
