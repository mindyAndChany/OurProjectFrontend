import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// Upsert a single attendance record
// Body: { student_id, lesson_id, status }
// Returns saved record
export const updateAttendanceThunk = createAsyncThunk(
  "attendance/update",
  async ({ id, status, lesson_id, student_id }) => {
    const res = await fetch(`${BACKEND_URL}/api/attendance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    console.log(res);
    console.log( JSON.stringify({  status }));
    
    
    if (!res.ok) throw new Error("failed to update attendance");
    const saved = await res.json();
    return saved; // { id, student_id, lesson_id, status }
  }
);
