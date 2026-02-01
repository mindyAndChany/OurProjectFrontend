import { createAsyncThunk } from "@reduxjs/toolkit";

export const addStudentsThunk = createAsyncThunk(
  'students/addStudents',
  async (studentsArray, { rejectWithValue }) => {
    try {
      console.log("thunk trying");
      
      const res = await fetch(`http://localhost:4000/api/studentsData/addStudents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentsArray)
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }

      const data = await res.json();
      console.log("addStudentsThunk success");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
