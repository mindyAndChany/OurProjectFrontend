import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateWeeklyLessonThunk = createAsyncThunk(
  'updateWeeklyLesson',
  async (lesson) => {
    const res = await fetch(`http://localhost:4000/api/weekly-schedules/${lesson.id}`, {
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
