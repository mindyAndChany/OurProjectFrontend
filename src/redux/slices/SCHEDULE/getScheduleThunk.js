import { createAsyncThunk } from "@reduxjs/toolkit";

export const getweeklySchedulesThunk = createAsyncThunk(
  'getSchedule',
  async () => {
    const res = await fetch(`https://ourprojectbackend-1.onrender.com/api/weekly-schedules`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch weekly-schedules success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
