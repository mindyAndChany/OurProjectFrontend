import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const deleteWeeklyLessonThunk = createAsyncThunk(
  'deleteWeeklyLesson',
  // מקבל מזהה יחיד או מערך מזהים. תמיד מחזיר { deletedIds: [...], failedIds: [...] }
  async (lessonIds) => {
    const ids = (Array.isArray(lessonIds) ? lessonIds : [lessonIds]).filter(
      (id) => id !== undefined && id !== null
    );

    const results = await Promise.all(
      ids.map(async (lessonId) => {
        try {
          const res = await fetch(`${BACKEND_URL}/api/weekly-schedules/${lessonId}`, {
            method: 'DELETE',
          });
          if (!res.ok) return { id: lessonId, ok: false, status: res.status };
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            return { id: data?.id ?? lessonId, ok: true };
          }
          return { id: lessonId, ok: true };
        } catch {
          return { id: lessonId, ok: false, status: 0 };
        }
      })
    );

    const deletedIds = results.filter((r) => r.ok).map((r) => r.id);
    const failedIds = results.filter((r) => !r.ok).map((r) => r.id);
    return { deletedIds, failedIds };
  }
);
