import { createAsyncThunk } from '@reduxjs/toolkit';

export const getStudentByIdThunk = createAsyncThunk(
  'students/getById',
  async (id, { rejectWithValue }) => {
    try {
        //   const res = await fetch(`https://ourprojectbackend-1.onrender.com/api/studentsData/getstudentById/${id}`);
const res = await fetch(`http://localhost:4000/api/studentsData/getstudentById/${id}`);
    
if (!res.ok) throw new Error('Student not found');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }

);
