import { createSlice } from '@reduxjs/toolkit';
import { addRealyLessonThunk } from './addRealyLessonThunk.js';

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
        console.log('addRealyLesson start');
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
      });
  },
});

export const { setLessons } = lessonsSlice.actions;
export default lessonsSlice.reducer;
