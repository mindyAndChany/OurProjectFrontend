import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const deleteRoomThunk = createAsyncThunk(
  'Rooms/deleteRoom',
  async (id) => {
    const res = await fetch(`${BACKEND_URL}/api/rooms/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('❌ failed to delete room');
    return id;
  }
);
