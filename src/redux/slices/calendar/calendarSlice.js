import { createSlice } from "@reduxjs/toolkit";
import { addEvent, removeEvent, getCalendarEventsThunk, updateEvent} from "./calendarThunk.js";
import { getEvents } from "./getEventThunk.js";
const initialState = {
  events: [],
  status: 'idle',
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // addEvent(state, action) {
    //   state.events.push(action.payload);
    // },
    // updateEvent(state, action) {
    //   const index = state.events.findIndex((e) => e.id === action.payload.id);
    //   if (index !== -1) {
    //     state.events[index] = action.payload;
    //   }
    // },
    // removeEvent(state, action) {
    //   state.events = state.events.filter((e) => e.id !== action.payload);
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCalendarEventsThunk.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      });
    builder
  .addCase(getEvents.pending, (state) => {
    state.status = 'loading';
  })
  .addCase(getEvents.fulfilled, (state, action) => {
    state.status = 'success';
    state.events = action.payload;
  })
  .addCase(getEvents.rejected, (state) => {
    state.status = 'error';
  })
   .addCase(updateEvent.fulfilled, (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    })
    .addCase(removeEvent.fulfilled, (state, action) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    });
  }
});

// ✅ שורת הפתרון:
// export const {updateEvent, removeEvent } = calendarSlice.actions;

export default calendarSlice.reducer;
