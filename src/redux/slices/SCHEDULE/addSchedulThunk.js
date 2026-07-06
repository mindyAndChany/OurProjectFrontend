import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const addWeeklyLessonThunk = createAsyncThunk(
  'WeeklySchedule/addLesson',
  async (lessonData) => {
    const res = await fetch(`${BACKEND_URL}/api/weekly-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lessonData),
    });
    if (!res.ok) throw new Error('❌ failed to add weekly lesson');
    return await res.json();
      // החזר תגובה מפורטת ל־frontend
    res.status(500).json({
      error: 'Failed to add weekly schedule',
      details: error?.message ?? error,
    });
  }
);
