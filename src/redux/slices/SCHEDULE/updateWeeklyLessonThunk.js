import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateWeeklyLessonThunk = createAsyncThunk(
  'updateWeeklyLesson',
  async (lesson) => {
    const res = await fetch(`${BACKEND_URL}/api/weekly-schedules/${lesson.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lesson),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw new Error('failed to update');
    }
  }
);
