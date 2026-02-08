import { createAsyncThunk } from "@reduxjs/toolkit";

// Upload profile photo and documents for a specific student by id_number
// Expects backend at: POST http://localhost:4000/api/studentsData/uploadFiles/:id
// Body: multipart/form-data with fields: profilePhoto (single), documents (multiple)
// Response: { id_number, photoUrl, documents: [{ name, url }] }
export const uploadStudentFilesThunk = createAsyncThunk(
  'students/uploadStudentFiles',
  async ({ id_number, profilePhoto, documents }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (profilePhoto) {
        // Do not override filename so Cloudinary can preserve original Hebrew name
        formData.append('profilePhoto', profilePhoto);
      }
      if (Array.isArray(documents)) {
        documents.forEach((doc) => {
          // Keep original filename; server now returns display name
          formData.append('documents', doc);
        });
      }
      // Helpful debug: show appended keys and filenames
      const debugEntries = [];
      for (const [key, value] of formData.entries()) {
        debugEntries.push([key, value && value.name ? value.name : String(value)]);
      }
      console.log('uploadStudentFiles formData entries:', debugEntries);

      const res = await fetch(`http://localhost:4000/api/studentsData/uploadFiles/${id_number}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let error;
        try {
          error = await res.json();
        } catch {
          try {
            const text = await res.text();
            error = { message: text || 'Upload failed' };
          } catch {
            error = { message: 'Upload failed' };
          }
        }
        return rejectWithValue(error);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
