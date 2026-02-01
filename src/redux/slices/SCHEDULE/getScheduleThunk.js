import { createAsyncThunk } from "@reduxjs/toolkit";

export const getweeklySchedulesThunk = createAsyncThunk(
  'getSchedule',
  async () => {
    const res = await fetch(`http://localhost:4000/api/weekly-schedules`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch weekly-schedules success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
