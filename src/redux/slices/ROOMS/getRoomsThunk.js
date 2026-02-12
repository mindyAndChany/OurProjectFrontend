import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getRoomsThunk = createAsyncThunk(
  'Rooms/getRooms',
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/rooms`);
  
    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch rooms success");
      return data;
    } else {
      throw new Error('❌ failed to fetch rooms');
    }
  }
);
