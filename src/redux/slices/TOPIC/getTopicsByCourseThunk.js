import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTopicsByCourseThunk = createAsyncThunk(
  'Topics/getTopicsByCourse',
  async (courseId) => {
    const res = await fetch(`http://localhost:4000/api/topics/course/${courseId}`);

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch topics by course success");
      return data;
    } else {
      throw new Error('❌ failed to fetch topics by course');
    }
  }
);
