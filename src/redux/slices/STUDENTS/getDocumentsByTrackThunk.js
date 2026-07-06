import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// Fetch documents by track (מסלול)
// Endpoint expectation: GET ${BACKEND_URL}/api/studentsData/getDocumentsByTrack/:track
// Returns: [{ id_number, name, url, type, uploadedAt, track }]
export const getDocumentsByTrackThunk = createAsyncThunk(
  'students/getDocumentsByTrack',
  async (track, { rejectWithValue }) => {
    try {
      const encodedTrack = encodeURIComponent(track);
      const res = await fetch(`${BACKEND_URL}/api/studentsData/track/${encodedTrack}/documents`);

      if (!res.ok) {
        let error;
        try { error = await res.json(); } catch { error = { message: 'Failed to fetch documents by track' }; }
        return rejectWithValue(error);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
