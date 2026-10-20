import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// מחיקת תלמידה לפי ת.ז. מחזיר { id_number, deleted: true }
export const deleteStudentThunk = createAsyncThunk(
  'students/deleteStudent',
  async (idNumber, { rejectWithValue }) => {
    try {
      const id = String(idNumber ?? '').trim();
      if (!id) return rejectWithValue('חסר מספר זהות למחיקה');

      const res = await fetch(`${BACKEND_URL}/api/studentsData/deleteStudent/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        return rejectWithValue(error?.error || 'שגיאה במחיקת התלמידה');
      }

      const data = await res.json();
      return { ...data, id_number: data?.id_number ?? id };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
