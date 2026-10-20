import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// מחיקה מרובה. מחזיר { deleted: [...], failed: [{ id_number, error }], deletedCount, failedCount }
// כל תלמידה נמחקת בנפרד בשרת — כשל באחת לא מבטל את האחרות.
export const deleteStudentsThunk = createAsyncThunk(
  'students/deleteStudents',
  async (idNumbers, { rejectWithValue }) => {
    try {
      const ids = [...new Set((Array.isArray(idNumbers) ? idNumbers : [])
        .map((v) => String(v ?? '').trim())
        .filter(Boolean))];
      if (ids.length === 0) return rejectWithValue('לא נבחרו תלמידות למחיקה');

      const res = await fetch(`${BACKEND_URL}/api/studentsData/deleteStudents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_numbers: ids }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        return rejectWithValue(error?.error || 'שגיאה במחיקת התלמידות');
      }

      const data = await res.json();
      return {
        deleted: Array.isArray(data?.deleted) ? data.deleted : [],
        failed: Array.isArray(data?.failed) ? data.failed : [],
        deletedCount: data?.deletedCount ?? 0,
        failedCount: data?.failedCount ?? 0,
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
