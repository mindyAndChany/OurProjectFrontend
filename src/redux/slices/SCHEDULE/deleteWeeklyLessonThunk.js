import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const deleteWeeklyLessonThunk = createAsyncThunk(
  'deleteWeeklyLesson',
  async (lessonId) => {
    const res = await fetch(`${BACKEND_URL}/api/weekly-schedules/${lessonId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return data?.id ?? lessonId;
      }
      return lessonId;
    } else {
      throw new Error('failed to delete');
    }
  }
);
