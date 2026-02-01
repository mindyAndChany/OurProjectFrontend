import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateStudentThunk = createAsyncThunk(
  'students/updateStudent',
  async (editedStudent, { rejectWithValue }) => {
    try {
      const id=editedStudent.id_number;
      console.log("id",id);
      
      console.log("updatethunk trying");
      
      const res = await fetch(`http://localhost:4000/api/studentsData/updateStudent/${id}`, {
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
