import { configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./slices/USER/userSlice.js";
import calendarReducer from "../components/store/calendar/calendarSlice.js";

export const store = configureStore({
  reducer: {
    // userSlice נשאר בדיוק כמו שהוא
    user: userSlice.reducer,
    calendar: calendarReducer,
  },
});
