import { createSlice } from '@reduxjs/toolkit';
import { getTopicsThunk } from './getTopicsThunk.js';
import { addTopicThunk } from './addTopicThunk.js';
import { getTopicsByCourseThunk } from './getTopicsByCourseThunk.js';

const topicSlice = createSlice({
  name: 'topics',
  initialState: {
    data: [],
    byCourse: {}, // { [courseId]: Topic[] }
  },
  reducers: {
    setTopics(state, action) {
      state.data = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTopicsThunk.pending, () => {
        console.log('getTopics start');
      })
      .addCase(getTopicsThunk.fulfilled, (state, action) => {
        state.data = action.payload || [];
        console.log('topics loaded:', state.data.length);
      })
      .addCase(getTopicsThunk.rejected, (state, action) => {
        console.log('getTopics error:', action.error);
      })
      .addCase(addTopicThunk.pending, (state) => {
        console.log('addTopic start', state.data);
      })
      .addCase(addTopicThunk.fulfilled, (state, action) => {
        const newTopic = action.payload;
        state.data.push(newTopic);
        const cid = String(newTopic.course_id ?? newTopic.courseId);
        if (cid) {
          state.byCourse[cid] = [...(state.byCourse[cid] || []), newTopic];
        }
        console.log('addTopic success:', newTopic);
      })
      .addCase(addTopicThunk.rejected, (state, action) => {
        console.log('addTopic error:', action.error);
      })
      .addCase(getTopicsByCourseThunk.pending, () => {
        console.log('getTopicsByCourse start');
      })
      .addCase(getTopicsByCourseThunk.fulfilled, (state, action) => {
        const topics = action.payload || [];
        if (topics.length > 0) {
          const cid = String(topics[0].course_id ?? topics[0].courseId);
          if (cid) {
            state.byCourse[cid] = topics;
          }
        }
        console.log('topics by course loaded:', topics.length);
      })
      .addCase(getTopicsByCourseThunk.rejected, (state, action) => {
        console.log('getTopicsByCourse error:', action.error);
      });
  },
});

export const { setTopics } = topicSlice.actions;
export default topicSlice.reducer;
