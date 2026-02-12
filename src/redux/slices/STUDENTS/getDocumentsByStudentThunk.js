import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// Fetch documents for a specific student by id_number
// Endpoint expectation: GET ${BACKEND_URL}/api/studentsData/getDocumentsByStudent/:id_number
// Returns: [{ name, url, type, uploadedAt, track }]
export const getDocumentsByStudentThunk = createAsyncThunk(
  'students/getDocumentsByStudent',
  async (id_number, { rejectWithValue }) => {
    try {
      const id = encodeURIComponent(id_number);
      const res = await fetch(`${BACKEND_URL}/api/studentsData/${id}/documents`);

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
