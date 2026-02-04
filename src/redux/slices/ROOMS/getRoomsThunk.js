import { createAsyncThunk } from "@reduxjs/toolkit";

export const getRoomsThunk = createAsyncThunk(
  'Rooms/getRooms',
  async () => {
    const res = await fetch('http://localhost:4000/api/rooms');
  
    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch rooms success");
      return data;
    } else {
      throw new Error('❌ failed to fetch rooms');
    }
  }
);
