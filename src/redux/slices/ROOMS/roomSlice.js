import { createSlice } from '@reduxjs/toolkit';
import { getRoomsThunk } from './getRoomsThunk.js';
import { addRoomThunk } from './addRoomThunk.js';

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    data: [], // [{ id, class_id, date, start_time, end_time, topic, teacher_name }]
  },
  reducers: {
    setRooms(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoomsThunk.pending, (state) => {
        console.log('getRooms start', state.data);
      })
      .addCase(getRoomsThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        console.log('getRooms success:', state.data.length);
      })
      .addCase(getRoomsThunk.rejected, (state, action) => {
        console.log('getRooms error:', action.error);
      })  
      .addCase(addRoomThunk.pending, (state) => {
        console.log('addRoom start', state.data);
      }
        )
        .addCase(addRoomThunk.fulfilled, (state, action) => {
            state.data.push(action.payload);
            console.log('addRoom success:', action.payload);
        })
        .addCase(addRoomThunk.rejected, (state, action) => {
            console.log('addRoom error:', action.error);
        });
  },
});

export const { setRooms } = roomsSlice.actions;
export default roomsSlice.reducer;
