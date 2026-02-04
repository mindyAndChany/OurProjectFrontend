import { createAsyncThunk } from "@reduxjs/toolkit";

export const addRoomThunk = createAsyncThunk(
  'Rooms/addRoom',
  async (roomData) => {
    const res = await fetch('http://localhost:4000/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('❌ failed to add room');
    return await res.json();
  }
);
