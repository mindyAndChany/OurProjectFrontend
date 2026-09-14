import { createSlice } from "@reduxjs/toolkit";
import { getEquipmentThunk } from "./getEquipmentThunk.js";
import { addEquipmentItemThunk } from "./addEquipmentItemThunk.js";

export const INITIAL_STATE_EQUIPMENT = {
  items: [],
  loading: false,
  error: null,
};

export const equipmentSlice = createSlice({
  name: "equipment",
  initialState: INITIAL_STATE_EQUIPMENT,
  reducers: {
    setEquipment(state, action) {
      state.items = action.payload;
    },
    /**
     * borrowItem: רישום השאלה על פריט קיים
     * action.payload: { itemId, borrowRecord: { studentId, studentName, borrowDate, expectedReturn, notes, quantity } }
     */
    borrowItem(state, action) {
      const { itemId, borrowRecord } = action.payload;
      const item = state.items.find((i) => i.id === itemId);
      if (item) {
        item.borrowed = item.borrowed || [];
        item.borrowed.push({
          id: Date.now().toString(),
          ...borrowRecord,
          returnedDate: null,
          status: "active",
        });
      }
    },
    /**
     * returnItem: החזרת פריט (סימון כהוחזר)
     * action.payload: { itemId, borrowId }
     */
    returnItem(state, action) {
      const { itemId, borrowId } = action.payload;
      const item = state.items.find((i) => i.id === itemId);
      if (item && item.borrowed) {
        const record = item.borrowed.find((b) => b.id === borrowId);
        if (record) {
          record.returnedDate = new Date().toISOString().split("T")[0];
          record.status = "returned";
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEquipmentThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEquipmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getEquipmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error fetching equipment";
      })
      .addCase(addEquipmentItemThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEquipmentItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addEquipmentItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error adding equipment";
      });
  },
});

export const { setEquipment, borrowItem, returnItem } = equipmentSlice.actions;
export default equipmentSlice.reducer;
