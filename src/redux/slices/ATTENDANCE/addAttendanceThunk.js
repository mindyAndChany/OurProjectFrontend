import { createAsyncThunk } from "@reduxjs/toolkit";

// Upsert a single attendance record
// Body: { student_id, lesson_id, status }
// Returns saved record
export const addAttendanceThunk = createAsyncThunk(
  "attendance/add",
  async ({ student_id, lesson_id, status }) => {
    const res = await fetch("http://localhost:4000/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id, lesson_id, status }),
    });
    console.log(res);
    console.log( JSON.stringify({ student_id, lesson_id, status }));
    
    
    if (!res.ok) throw new Error("failed to add attendance");
    const saved = await res.json();
    return saved; // { id, student_id, lesson_id, status }
  }
);
