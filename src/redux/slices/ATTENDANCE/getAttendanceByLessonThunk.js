import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch attendance records for a given lesson
// Response expected: Array<{ id, student_id, lesson_id, status }>
export const getAttendanceByLessonThunk = createAsyncThunk(
  "attendance/getByLesson",
  async (lesson_id) => {
    const url = `http://localhost:4000/api/attendance?lesson_id=${encodeURIComponent(lesson_id)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("failed to fetch attendance");
    const records = await res.json();
    return { lesson_id, records };
  }
);
