import { createAsyncThunk } from "@reduxjs/toolkit";

export const getStudentDataThunk = createAsyncThunk(
  'getstudentData',
  async (categories) => {
    const encodedCategories = encodeURIComponent(categories);
    console.log(`http://localhost:4000/api/studentsData/getstudentData/${encodedCategories}`);
    
    // const res = await fetch(`http://localhost:4000/api/studentsData/getstudentData/${encodedCategories}`);
    const res = await fetch(`http://localhost:4000/api/studentsData/getstudentData/${encodedCategories}`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch studentData success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
