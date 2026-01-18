import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    data: [], // [{ id, name, type }]
  },
  reducers: {
    setCourses(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setCourses } = coursesSlice.actions;
export default coursesSlice.reducer;
