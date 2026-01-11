import { createSlice } from "@reduxjs/toolkit";
import { getStudentDataThunk } from "./getStudentDataThunk.js";
import { addStudentsThunk } from "./addStudentsThunk.js";

export const INITIAL_STATE_STUDENTS = {
  studentsData: []
};

export const studentSlice = createSlice({
  name: 'student',
  initialState: INITIAL_STATE_STUDENTS,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStudentDataThunk.pending, (state) => {
        console.log("getStudentData start");
      })
      .addCase(getStudentDataThunk.fulfilled, (state, action) => {
        state.studentsData = action.payload;
        console.log("studentsData:", state.studentsData);
      })
      .addCase(getStudentDataThunk.rejected, (state, action) => {
        console.log("getStudentData error:", action.error);
      })

      .addCase(addStudentsThunk.pending, (state) => {
        console.log("addStudents start");
      })
      .addCase(addStudentsThunk.fulfilled, (state, action) => {
        state.studentsData.push(...action.payload);
        console.log("addStudents success:", action.payload);
      })
      .addCase(addStudentsThunk.rejected, (state, action) => {
        console.log("addStudents error:", action.error);
      });
  }
});

export default studentSlice.reducer;
