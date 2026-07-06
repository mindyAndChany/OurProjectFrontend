import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const addRoomThunk = createAsyncThunk(
  'Rooms/addRoom',
  async (roomData) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('❌ failed to add room');
    return await res.json();
  }
);
