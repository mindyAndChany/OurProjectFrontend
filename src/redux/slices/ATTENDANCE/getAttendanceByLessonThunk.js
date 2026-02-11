import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// Fetch attendance records for a given lesson
// Response expected: Array<{ id, student_id, lesson_id, status }>
export const getAttendanceByLessonThunk = createAsyncThunk(
  "attendance/getByLesson",
  async (lesson_id) => {
    const url = `${BACKEND_URL}/api/attendance/getByLesson/${lesson_id}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("failed to fetch attendance");
    const records = await res.json();
    return { lesson_id, records };
  }
);
