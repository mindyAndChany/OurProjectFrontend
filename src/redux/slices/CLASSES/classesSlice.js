import { createSlice } from '@reduxjs/toolkit';

const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    data: [], // [{ id, course_id, name, year, teacher_name, base_schedule }]
  },
  reducers: {
    setClasses(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setClasses } = classesSlice.actions;
export default classesSlice.reducer;
