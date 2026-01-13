import { createAsyncThunk } from "@reduxjs/toolkit";

export const getStudentDataThunk = createAsyncThunk(
  'getstudentData',
  async (categories) => {
    const encodedCategories = encodeURIComponent(categories);
    const res = await fetch(`https://ourprojectbackend-1.onrender.com/api/studentsData/getstudentData/${encodedCategories}`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch studentData success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
