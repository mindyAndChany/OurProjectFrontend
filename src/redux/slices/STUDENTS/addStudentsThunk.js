import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const addStudentsThunk = createAsyncThunk(
  'students/addStudents',
  async (studentsArray, { rejectWithValue }) => {
    try {
      console.log("thunk trying");
      
      const res = await fetch(`${BACKEND_URL}/api/studentsData/addStudents`, {
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
