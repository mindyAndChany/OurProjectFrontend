import { createSlice } from "@reduxjs/toolkit";
import { getAttendanceByLessonThunk } from "./getAttendanceByLessonThunk.js";
import { updateAttendanceThunk } from "./updateAttendanceThunk.js";
import { addAttendanceThunk } from "./addAttendanceThunk.js";

// State shape:
// byLesson: {
//   [lesson_id]: {
//     [student_id]: "present" | "late" | "absent" | "approved absent"
//   }
// }

const initialState = {
  byLesson: {},
  idsByLesson: {},
};

// Normalize student identifier to a consistent 9-digit string.
// This helps match numeric IDs from the server with zero-padded ID numbers in the UI.
function normalizeStudentId(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return String(value ?? "");
  return digits.padStart(9, "0").slice(-9);
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendanceForLesson(state, action) {
      const { lesson_id, records } = action.payload; // records: Array<{student_id, status}>
      const map = {};
      for (const r of records || []) {
        if (r && r.student_id != null) {
          map[normalizeStudentId(r.student_id)] = r.status;
        }
      }
      state.byLesson[String(lesson_id)] = map;
      state.idsByLesson[String(lesson_id)] = {}; // no IDs for prefilled records
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
        const ids = {};
        for (const r of records || []) {
          if (r && r.student_id != null) {
            const key = normalizeStudentId(r.student_id);
            map[key] = r.status;
            if (r.id != null) ids[key] = r.id;
          }
        }
        state.byLesson[String(lesson_id)] = map;
        state.idsByLesson[String(lesson_id)] = ids;
      })
      .addCase(getAttendanceByLessonThunk.rejected, (state, action) => {
        // could log error
      })

      .addCase(updateAttendanceThunk.pending, (state, action) => {
        const { lesson_id, student_id, status } = action.meta.arg || {};
        if (lesson_id != null && student_id != null && status) {
          const key = String(lesson_id);
          state.byLesson[key] = state.byLesson[key] || {};
          state.byLesson[key][normalizeStudentId(student_id)] = status; // optimistic
        }
      })
      .addCase(updateAttendanceThunk.fulfilled, (state, action) => {
        const { lesson_id, student_id, status, id } = action.payload || {};
        if (lesson_id != null && student_id != null && status) {
          const key = String(lesson_id);
          state.byLesson[key] = state.byLesson[key] || {};
          const sid = normalizeStudentId(student_id);
          state.byLesson[key][sid] = status;
          if (id != null) {
            state.idsByLesson[key] = state.idsByLesson[key] || {};
            state.idsByLesson[key][sid] = id;
          }
        }
      })
      .addCase(updateAttendanceThunk.rejected, (state, action) => {
        // optionally revert optimistic update here
      })
      .addCase(addAttendanceThunk.pending, (state, action) => {
        const { lesson_id, student_id, status } = action.meta.arg || {};
        if (lesson_id != null && student_id != null && status) {
          const key = String(lesson_id);
          state.byLesson[key] = state.byLesson[key] || {};
          state.byLesson[key][normalizeStudentId(student_id)] = status; // optimistic
        }
      })
      .addCase(addAttendanceThunk.fulfilled, (state, action) => {
        const { lesson_id, student_id, status, id } = action.payload || {};
        if (lesson_id != null && student_id != null && status) {
          const key = String(lesson_id);
          state.byLesson[key] = state.byLesson[key] || {};
          const sid = normalizeStudentId(student_id);
          state.byLesson[key][sid] = status;
          if (id != null) {
            state.idsByLesson[key] = state.idsByLesson[key] || {};
            state.idsByLesson[key][sid] = id;
          }
        }
      })
      .addCase(addAttendanceThunk.rejected, (state, action) => {
        // optionally revert optimistic update here
      });
  },
});

export const { setAttendanceForLesson } = attendanceSlice.actions;
export default attendanceSlice.reducer;
