import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getweeklySchedulesThunk = createAsyncThunk(
  'getSchedule',
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/weekly-schedules`);

    if (res.ok) {
      const data = await res.json();
      console.log("fetch weekly-schedules success get ");
      return data;
    } else {
      throw new Error('failed to fetch');
    }
  }
);
