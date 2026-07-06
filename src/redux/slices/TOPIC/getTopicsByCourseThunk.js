import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getTopicsByCourseThunk = createAsyncThunk(
  'Topics/getTopicsByCourse',
  async (courseId) => {
    const res = await fetch(`${BACKEND_URL}/api/topics/course/${courseId}`);

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch topics by course success");
      return data;
    } else {
      throw new Error('❌ failed to fetch topics by course');
    }
  }
);
