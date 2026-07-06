import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateStudentThunk = createAsyncThunk(
  'students/updateStudent',
  async (editedStudent, { rejectWithValue }) => {
    try {
      const id=editedStudent.id_number;
      console.log("id",id);
      
      console.log("updatethunk trying");
      
      const res = await fetch(`${BACKEND_URL}/api/studentsData/updateStudent/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedStudent)
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error);
      }

      const data = await res.json();
      console.log("editStudentsThunk success");
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
