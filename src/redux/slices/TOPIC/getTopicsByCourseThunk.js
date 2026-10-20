import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getTopicsByCourseThunk = createAsyncThunk(
  'Topics/getTopicsByCourse',
  async (courseId) => {
    const res = await fetch(`${BACKEND_URL}/api/topics/course/${courseId}`);

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch topics by course success");
      // מחזירים גם את הקורס שהתבקש: רשימה של קורס 7/8 מכילה גם נושאים משותפים של 19,
      // ולכן אסור לגזור את המפתח מהפריט הראשון בתשובה.
      return { courseId, topics: Array.isArray(data) ? data : [] };
    } else {
      throw new Error('❌ failed to fetch topics by course');
    }
  }
);
