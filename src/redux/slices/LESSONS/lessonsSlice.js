import { createSlice } from '@reduxjs/toolkit';
import { addRealyLessonThunk } from './addRealyLessonThunk.js';
import { getLessonsThunk } from './getLessonsThunk.js';
import { updateLessonThunk } from './updateLessonThunk.js';

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    data: [], // [{ id, class_id, date, start_time, end_time, topic, teacher_name }]
  },
  reducers: {
    setLessons(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRealyLessonThunk.pending, (state) => {
        console.log('addRealyLesson start',state.data);
      })
      .addCase(addRealyLessonThunk.fulfilled, (state, action) => {
        const newLesson = action.payload;
        // Replace existing lesson for same class/date/time if exists
        const idx = state.data.findIndex(
          (l) =>
            String(l.class_id) === String(newLesson.class_id) &&
            l.date === newLesson.date &&
            l.start_time === newLesson.start_time
        );
        if (idx !== -1) {
          state.data[idx] = newLesson;
        } else {
          state.data.push(newLesson);
        }
        console.log('addRealyLesson success:', newLesson);
      })
      .addCase(addRealyLessonThunk.rejected, (state, action) => {
        console.log('addRealyLesson error:', action.error);
      })
      .addCase(updateLessonThunk.pending, (state) => {
        console.log('updateLesson start');
      })
      .addCase(updateLessonThunk.fulfilled, (state, action) => {
        const updatedLesson = action.payload;
        // Find and update the lesson by id, or by class_id/date/time
        const idx = state.data.findIndex(
          (l) =>
            (updatedLesson.id && l.id === updatedLesson.id) ||
            (String(l.class_id) === String(updatedLesson.class_id) &&
             l.date === updatedLesson.date &&
             l.start_time === updatedLesson.start_time)
        );
        if (idx !== -1) {
          state.data[idx] = updatedLesson;
        } else {
          // If not found, add it (fallback)
          state.data.push(updatedLesson);
        }
        console.log('updateLesson success:', updatedLesson);
      })
      .addCase(updateLessonThunk.rejected, (state, action) => {
        console.log('updateLesson error:', action.error);
      })
      .addCase(getLessonsThunk.pending, (state) => {
              console.log("getLessons start");
            })
            .addCase(getLessonsThunk.fulfilled, (state, action) => {
              state.data = action.payload;
              console.log("Lessons loaded:", state.data.length);
            })
            .addCase(getLessonsThunk.rejected, (state, action) => {
              console.log("getLessons error:", action.error);
            });
  },
});

export const { setLessons } = lessonsSlice.actions;
export default lessonsSlice.reducer;
