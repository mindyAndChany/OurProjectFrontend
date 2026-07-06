import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// Updates an existing lesson (e.g., to restore a cancelled lesson)
// Payload shape:
// {
//   id: number,
//   class_id: number,
//   date: "yyyy-MM-dd",
//   start_time: string,
//   end_time: string,
//   topic: string,
//   teacher_name: string,
//   is_cancelled: boolean,
//   cancellation_reason: string
// }
export const updateLessonThunk = createAsyncThunk(
  "lessons/updateLesson",
  async (lessonPayload, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = lessonPayload;
      
      if (!id) {
        console.warn("updateLesson: no id provided, falling back to add");
        return lessonPayload;
      }

      // Attempt to persist to backend if available
      const res = await fetch(`${BACKEND_URL}/api/Lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonPayload),
      });

      if (res.ok) {
        const data = await res.json();
        // Expect backend to return the updated lesson
        return data;
      }

      // If backend route not available, fall back to local update
      console.warn("updateLesson: backend not reachable, falling back to local state");
      return lessonPayload;
    } catch (err) {
      // Fallback to local update to keep UI responsive
      console.warn("updateLesson: network error, using local state", err);
      return lessonPayload;
    }
  }
);
