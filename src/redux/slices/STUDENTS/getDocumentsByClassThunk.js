import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch documents by class (כיתה)
// Endpoint expectation: GET http://localhost:4000/api/studentsData/getDocumentsByClass/:className
// Returns: [{ id_number, name, url, type, uploadedAt, className, track }]
export const getDocumentsByClassThunk = createAsyncThunk(
  'students/getDocumentsByClass',
  async (className, { rejectWithValue }) => {
    try {
      const encodedClass = encodeURIComponent(className);
      const res = await fetch(`http://localhost:4000/api/studentsData/class/${encodedClass}/documents`);

      if (!res.ok) {
        let error;
        try { error = await res.json(); } catch { error = { message: 'Failed to fetch documents by class' }; }
        return rejectWithValue(error);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
