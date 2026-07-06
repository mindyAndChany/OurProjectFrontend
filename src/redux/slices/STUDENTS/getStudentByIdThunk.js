import { createAsyncThunk } from '@reduxjs/toolkit';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getStudentByIdThunk = createAsyncThunk(
  'students/getById',
  async (id, { rejectWithValue }) => {
    try {
        //   const res = await fetch(`${BACKEND_URL}/api/studentsData/getstudentById/${id}`);
      const res = await fetch(`${BACKEND_URL}/api/studentsData/getstudentById/${id}`);
    
if (!res.ok) throw new Error('Student not found');
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }

);
