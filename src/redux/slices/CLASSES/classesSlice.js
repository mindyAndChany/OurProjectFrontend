import { createSlice } from '@reduxjs/toolkit';
import { getClassesThunk } from './getClassesThunk.js';

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
  extraReducers: (builder) => {
    builder
      .addCase(getClassesThunk.pending, (state) => {
        console.log("getClasses start");
      })
      .addCase(getClassesThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        console.log("classes loaded:", state.data.length);
      })
      .addCase(getClassesThunk.rejected, (state, action) => {
        console.log("getClasses error:", action.error);
      });
  },
});

export const { setClasses } = classesSlice.actions;
export default classesSlice.reducer;
