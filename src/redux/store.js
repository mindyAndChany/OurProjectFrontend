import { configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./slices/USER/userSlice.js";
import calendarReducer from "./slices/calendar/calendarSlice.js";
import { studentSlice } from "./slices/STUDENTS/studentsSlice.js";

export const store = configureStore({
  reducer: {
    // userSlice נשאר בדיוק כמו שהוא
    user: userSlice.reducer,
    student: studentSlice.reducer,
    calendar: calendarReducer,
  },
});
