import { createSlice } from '@reduxjs/toolkit';
// import { addRealyteacherThunk } from './addRealyteacherThunk.js';
import { getTeachersThunk } from './getTeachersThunk.js';

const teachersSlice = createSlice({
  name: 'teachers',
  initialState: {
    data: [], // [{ id, class_id, date, start_time, end_time, topic, topic }]
  },
  reducers: {
    setteachers(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(addRealyteacherThunk.pending, (state) => {
      //   console.log('addRealyteacher start', state.data);
      // })
      // .addCase(addRealyteacherThunk.fulfilled, (state, action) => {
      //   const newteacher = action.payload;
      //   // Replace existing teacher for same class/date/time if exists
      //   const idx = state.data.findIndex(
      //     (l) =>
      //       String(l.class_id) === String(newteacher.class_id) &&
      //       l.date === newteacher.date &&
      //       l.start_time === newteacher.start_time
      //   );
      //   if (idx !== -1) {
      //     state.data[idx] = newteacher;
      //   } else {
      //     state.data.push(newteacher);
      //   }
      //   console.log('addRealyteacher success:', newteacher);
      // })
      // .addCase(addRealyteacherThunk.rejected, (state, action) => {
      //   console.log('addRealyteacher error:', action.error);
      // })
      .addCase(getTeachersThunk.pending, (state) => {
        console.log("getteachers start");
      })
      .addCase(getTeachersThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        console.log("teachers loaded:", state.data.length);
      })
      .addCase(getTeachersThunk.rejected, (state, action) => {
        console.log("getteachers error:", action.error);
      });
  },
});

export const { setteachers } = teachersSlice.actions;
export default teachersSlice.reducer;
