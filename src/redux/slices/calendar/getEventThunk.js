import { createAsyncThunk } from '@reduxjs/toolkit';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getEvents = createAsyncThunk(
  'calendar/getEvents',
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/calendar-events`);
    if (!res.ok) throw new Error('❌ failed to fetch calendar events');
    const data = await res.json();
    console.log('📅 fetched events:', data);
    return data;
  }
);