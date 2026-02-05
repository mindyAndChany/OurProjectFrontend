import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch documents for a specific student by id_number
// Endpoint expectation: GET http://localhost:4000/api/studentsData/getDocumentsByStudent/:id_number
// Returns: [{ name, url, type, uploadedAt, track }]
export const getDocumentsByStudentThunk = createAsyncThunk(
  'students/getDocumentsByStudent',
  async (id_number, { rejectWithValue }) => {
    try {
      const id = encodeURIComponent(id_number);
      const res = await fetch(`http://localhost:4000/api/studentsData/getDocumentsByStudent/${id}`);

      if (!res.ok) {
        let error;
        try { error = await res.json(); } catch { error = { message: 'Failed to fetch documents' }; }
        return rejectWithValue(error);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
