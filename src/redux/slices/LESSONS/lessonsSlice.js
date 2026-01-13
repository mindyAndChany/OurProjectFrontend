import { createSlice } from '@reduxjs/toolkit';

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
});

export const { setLessons } = lessonsSlice.actions;
export default lessonsSlice.reducer;
