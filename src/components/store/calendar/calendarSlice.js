import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [
    {
      id: "1",
      title: "מבחן מתמטיקה",
      type: "exam",
      date: "5786-09-10",
      time_start: "09:00",
      time_end: "11:00",
      notes: "כיתה י״ב בלבד",
    },
    {
      id: "2",
      title: "טיול שנתי",
      type: "trip",
      date: "5786-09-15",
      time_start: "08:00",
      time_end: "18:00",
      notes: "",
    },
  ],
  status: "idle", // future: loading / success / error
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent(state, action) {
      state.events.push(action.payload);
    },
    removeEvent(state, action) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    updateEvent(state, action) {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
  },
});

export const {
  addEvent,
  removeEvent,
  updateEvent,
} = calendarSlice.actions;

export default calendarSlice.reducer;
