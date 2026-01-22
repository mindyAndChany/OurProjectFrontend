import { createAsyncThunk } from "@reduxjs/toolkit";

// Adds a real (dated) lesson occurrence with optional cancellation info
// Payload shape:
// {
//   id: 0,
//   class_id: number,
//   date: "yyyy-MM-dd",
//   start_time: string,
//   end_time: string,
//   topic: string,
//   teacher_name: string,
//   is_cancelled: boolean,
//   cancellation_reason: string
// }
export const addRealyLessonThunk = createAsyncThunk(
  "lessons/addRealyLesson",
  async (lessonPayload, { rejectWithValue }) => {
    try {
      // Attempt to persist to backend if available
      const res = await fetch('http://localhost:4000/api/Lessons', {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonPayload),
      });

      if (res.ok) {
        const data = await res.json();
        // Expect backend to return the created lesson (possibly with real id)
        return data;
      }

      // If backend route not available, fall back to local update
      console.warn("addRealyLesson: backend not reachable, falling back to local state");
      return lessonPayload;
    } catch (err) {
      // Fallback to local update to keep UI responsive
      console.warn("addRealyLesson: network error, using local state", err);
      return lessonPayload;
      // Alternatively, to strictly error:
      // return rejectWithValue(err.message || 'Network error');
    }
  }
);
