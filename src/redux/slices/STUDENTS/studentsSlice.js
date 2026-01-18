import { createSlice } from "@reduxjs/toolkit";
import { getStudentDataThunk } from "./getStudentDataThunk.js";
import { addStudentsThunk } from "./addStudentsThunk.js";
import { updateStudentThunk } from "./updateStudentThunk.js";

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
      })
      .addCase(updateStudentThunk.pending, (state) => {
        console.log("updateStudents start");
      })
      .addCase(updateStudentThunk.fulfilled, (state, action) => {
        const updatedStudent = action.payload;
        const index = state.studentsData.findIndex(s => s.id === updatedStudent.id);
        if (index !== -1) {
          state.studentsData[index] = updatedStudent;
        } else {
          state.studentsData.push(updatedStudent);
        }
        console.log("updateStudents success:", updatedStudent);
      })

      .addCase(updateStudentThunk.rejected, (state, action) => {
        console.log("updateStudents error:", action.error);
      });
  }
});

export default studentSlice.reducer;
