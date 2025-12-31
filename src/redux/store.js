import { combineSlices, configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./slices/USER/userSlice.js";
import calendarReducer from "../components/store/calendar/calendarSlice.js";

const reducers = combineSlices(userSlice);


export const STORE = configureStore({
    reducer: reducers,

})


export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});