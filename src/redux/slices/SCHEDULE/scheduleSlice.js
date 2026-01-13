import { createSlice } from '@reduxjs/toolkit';

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
});

export const { setWeeklySchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
