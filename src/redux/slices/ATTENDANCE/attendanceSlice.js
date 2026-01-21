import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceByLessonThunk } from "./getAttendanceByLessonThunk.js";
import { updateAttendanceThunk } from "./updateAttendanceThunk.js";

// State shape:
// byLesson: {
//   [lesson_id]: {
//     [student_id]: "present" | "late" | "absent" | "approved absent"
//   }
// }

const initialState = {
  byLesson: {},
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendanceForLesson(state, action) {
      const { lesson_id, records } = action.payload; // records: Array<{student_id, status}>
      const map = {};
      for (const r of records || []) {
        if (r && r.student_id != null) {
          map[String(r.student_id)] = r.status;
        }
      }
      state.byLesson[String(lesson_id)] = map;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAttendanceByLessonThunk.pending, (state) => {
        // no-op log
      })
      .addCase(getAttendanceByLessonThunk.fulfilled, (state, action) => {
        const { lesson_id, records } = action.payload;
        const map = {};
        for (const r of records || []) {
          if (r && r.student_id != null) {
            map[String(r.student_id)] = r.status;
          }
        }
        state.byLesson[String(lesson_id)] = map;
      })
      .addCase(getAttendanceByLessonThunk.rejected, (state, action) => {
        // could log error
      })

      .addCase(updateAttendanceThunk.pending, (state, action) => {
        const { lesson_id, student_id, status } = action.meta.arg || {};
        if (lesson_id != null && student_id != null && status) {
          const key = String(lesson_id);
          state.byLesson[key] = state.byLesson[key] || {};
          state.byLesson[key][String(student_id)] = status; // optimistic
        }
      })
      .addCase(updateAttendanceThunk.fulfilled, (state, action) => {
        const { lesson_id, student_id, status } = action.payload || {};
        if (lesson_id != null && student_id != null && status) {
          const key = String(lesson_id);
          state.byLesson[key] = state.byLesson[key] || {};
          state.byLesson[key][String(student_id)] = status;
        }
      })
      .addCase(updateAttendanceThunk.rejected, (state, action) => {
        // optionally revert optimistic update here
      });
  },
});

export const { setAttendanceForLesson } = attendanceSlice.actions;
export default attendanceSlice.reducer;
