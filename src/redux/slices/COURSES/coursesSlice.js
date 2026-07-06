import { createSlice } from '@reduxjs/toolkit';
import { getCoursesThunk } from './getCoursesThunk.js';

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
  extraReducers: (builder) => {
    builder
      .addCase(getCoursesThunk.pending, () => {
        console.log("getCourses start");
      })
      .addCase(getCoursesThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        console.log("courses loaded:", state.data.length);
      })
      .addCase(getCoursesThunk.rejected, (state, action) => {
        console.log("getCourses error:", action.error);
      });
  },
});

export const { setCourses } = coursesSlice.actions;
export default coursesSlice.reducer;
