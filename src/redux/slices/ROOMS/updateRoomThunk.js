import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateRoomThunk = createAsyncThunk(
  'Rooms/updateRoom',
  async ({ id, roomData }) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData),
    });
    if (!res.ok) throw new Error('❌ failed to update room');
    return await res.json();
  }
);
