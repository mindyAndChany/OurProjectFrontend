import { createSlice } from '@reduxjs/toolkit';
import { getweeklySchedulesThunk } from './getScheduleThunk.js';
import { addWeeklyLessonThunk } from './addSchedulThunk.js';
import { deleteWeeklyLessonThunk } from './deleteWeeklyLessonThunk.js';
import { updateWeeklyLessonThunk } from './updateWeeklyLessonThunk.js';

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
          builder
          .addCase(addWeeklyLessonThunk.pending, (state) => {
            console.log("addWeeklyLesson start", state.data);
          })
          .addCase(addWeeklyLessonThunk.fulfilled, (state, action) => {
            state.data.push(action.payload);
            console.log("addWeeklyLesson success:", action.payload);
          })
          .addCase(addWeeklyLessonThunk.rejected, (state, action) => {
            console.log("addWeeklyLesson error:", action.error);
          });
          builder
          .addCase(deleteWeeklyLessonThunk.pending, () => {
            console.log("deleteWeeklyLesson start");
          })
          .addCase(deleteWeeklyLessonThunk.fulfilled, (state, action) => {
            const deletedId = action.payload?.id ?? action.payload;
            if (deletedId !== undefined && deletedId !== null) {
              state.data = state.data.filter(l => String(l.id) !== String(deletedId));
            }
            console.log("deleteWeeklyLesson success:", deletedId);
          })
          .addCase(deleteWeeklyLessonThunk.rejected, (state, action) => {
            console.log("deleteWeeklyLesson error:", action.error);
          });
          builder
          .addCase(updateWeeklyLessonThunk.pending, () => {
            console.log("updateWeeklyLesson start");
          })
          .addCase(updateWeeklyLessonThunk.fulfilled, (state, action) => {
            const updated = action.payload;
            if (!updated?.id) return;
            const idx = state.data.findIndex(l => String(l.id) === String(updated.id));
            if (idx !== -1) {
              state.data[idx] = updated;
            }
            console.log("updateWeeklyLesson success:", updated?.id);
          })
          .addCase(updateWeeklyLessonThunk.rejected, (state, action) => {
            console.log("updateWeeklyLesson error:", action.error);
          });
  }
});

export const { setWeeklySchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
