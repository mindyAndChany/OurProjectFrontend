import { configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./slices/USER/userSlice.js";
import calendarReducer from "./slices/CALENDAR/calendarSlice.js";
import { studentSlice } from "./slices/STUDENTS/studentsSlice.js";
import classesReducer from "./slices/CLASSES/classesSlice.js";
import lessonsReducer from "./slices/LESSONS/lessonsSlice.js";
import scheduleReducer from "./slices/SCHEDULE/scheduleSlice.js";
import attendanceReducer from "./slices/ATTENDANCE/attendanceSlice.js";
import roomsReducer from "./slices/ROOMS/roomSlice.js";
import topicsReducer from "./slices/TOPIC/topicSlice.js";
export const store = configureStore({
  reducer: {
    // userSlice נשאר בדיוק כמו שהוא
    user: userSlice.reducer,
    student: studentSlice.reducer,
    calendar: calendarReducer,
    classes: classesReducer,
    lessons: lessonsReducer,
    weekly_schedule: scheduleReducer,
    attendance: attendanceReducer,
    rooms: roomsReducer,
    topics: topicsReducer,
  },
});
