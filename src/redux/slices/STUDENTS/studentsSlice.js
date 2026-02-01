import { createSlice } from "@reduxjs/toolkit";
import { getStudentDataThunk } from "./getStudentDataThunk.js";
import { addStudentsThunk } from "./addStudentsThunk.js";
import { updateStudentThunk } from "./updateStudentThunk.js";
import { getStudentByIdThunk } from "./getStudentByIdThunk.js";
import { uploadStudentFilesThunk } from "./uploadStudentFilesThunk.js";

export const INITIAL_STATE_STUDENTS = {
  studentsData: [],
  selectedStudent: null,
  loading: false,
  error: null,
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
 // קריאה לפי ת"ז
      .addCase(getStudentByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudentByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })
      .addCase(getStudentByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching student';
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
    // File upload handling
    builder
      .addCase(uploadStudentFilesThunk.pending, (state) => {
        console.log("uploadStudentFiles start");
      })
      .addCase(uploadStudentFilesThunk.fulfilled, (state, action) => {
        const { id_number, photoUrl, documents } = action.payload || {};
        const index = state.studentsData.findIndex(s => (s.id_number || s.id) === id_number);
        if (index !== -1) {
          state.studentsData[index] = {
            ...state.studentsData[index],
            photoUrl,
            documents,
          };
        }
        if (state.selectedStudent && (state.selectedStudent.id_number === id_number)) {
          state.selectedStudent = {
            ...state.selectedStudent,
            photoUrl,
            documents,
          };
        }
        console.log("uploadStudentFiles success:", action.payload);
      })
      .addCase(uploadStudentFilesThunk.rejected, (state, action) => {
        console.log("uploadStudentFiles error:", action.payload || action.error);
      });
  }
});

export default studentSlice.reducer;
