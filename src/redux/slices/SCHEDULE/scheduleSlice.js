import { createSlice } from '@reduxjs/toolkit';
import { getweeklySchedulesThunk } from './getScheduleThunk.js';

const scheduleSlice = createSlice({
  name: 'weekly_schedule',
  initialState: {
    data: [], // [{ id, class_id, day_of_week, start_time, end_time, topic, teacher_name }]
  },
  reducers: {
    setWeeklySchedule(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers:(builder)=>{
     builder
          .addCase(getweeklySchedulesThunk.pending, (state) => {
            console.log("getweekly-schedules start");
          })
          .addCase(getweeklySchedulesThunk.fulfilled, (state, action) => {
            state.data = action.payload;
            console.log("weekly-schedules loaded:", state.data.length);
          })
          .addCase(getweeklySchedulesThunk.rejected, (state, action) => {
            console.log("getweekly-schedules error:", action.error);
          });
  }
});

export const { setWeeklySchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
