import { createAsyncThunk } from '@reduxjs/toolkit';

export const getEvents = createAsyncThunk(
  'calendar/getEvents',
  async () => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendar-events`);
    if (!res.ok) throw new Error('❌ failed to fetch calendar events');
    const data = await res.json();
    console.log('📅 fetched events:', data);
    return data;
  }
);