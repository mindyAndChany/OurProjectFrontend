import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// payload should be: { name: string, course_id: number }
export const addTopicThunk = createAsyncThunk(
  'Topics/addTopic',
  async (topicData) => {
    const res = await fetch(`${BACKEND_URL}/api/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });

    if (!res.ok) throw new Error('❌ failed to create topic');
    return await res.json();
  }
);
