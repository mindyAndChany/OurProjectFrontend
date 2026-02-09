import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteWeeklyLessonThunk = createAsyncThunk(
  'deleteWeeklyLesson',
  async (lessonId) => {
    const res = await fetch(`http://localhost:4000/api/weekly-schedules/${lessonId}`, {
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
