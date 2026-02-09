import { createAsyncThunk } from "@reduxjs/toolkit";

// payload should be: { name: string, course_id: number }
export const addTopicThunk = createAsyncThunk(
  'Topics/addTopic',
  async (topicData) => {
    const res = await fetch('http://localhost:4000/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData),
    });

    if (!res.ok) throw new Error('❌ failed to create topic');
    return await res.json();
  }
);
