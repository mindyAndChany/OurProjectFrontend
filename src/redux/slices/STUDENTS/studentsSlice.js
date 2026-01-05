import { createSlice } from "@reduxjs/toolkit";
import { getStudentDataThunk } from "./getStudentDataThunk.js";

export const INITIAL_STATE_STUDENTS = {
  studentsData: []  // כאן מאחסנים את מערך התלמידים
};

export const studentSlice = createSlice({
  name: 'student',
  initialState: INITIAL_STATE_STUDENTS,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStudentDataThunk.pending, (state) => {
      console.log("getStudentData start");
    });

    builder.addCase(getStudentDataThunk.fulfilled, (state, action) => {
      state.studentsData = action.payload;  // שמירת כל מערך התלמידים
      console.log("studentsData:", state.studentsData);
    });

    builder.addCase(getStudentDataThunk.rejected, (state, action) => {
      console.log("getStudentData error:", action.error);
    });
  }
});

export default studentSlice.reducer;
