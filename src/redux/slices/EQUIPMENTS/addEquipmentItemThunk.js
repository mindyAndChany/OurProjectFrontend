import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

/**
 * שלב ראשון: מוסיף פריט ציוד חדש.
 * עדיין לא מחובר לשרת — יוצר אובייקט מקומי עם ID זמני.
 */
export const addEquipmentItemThunk = createAsyncThunk(
  "equipment/addEquipmentItem",
  async (itemData, { rejectWithValue }) => {
    try {
      // TODO: להחליף בקריאת שרת אמיתית
      // const res = await fetch(`${BACKEND_URL}/api/equipment`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(itemData),
      // });
      // if (!res.ok) throw new Error("Failed to add equipment");
      // return await res.json();

      // 시뮦레이션 지연
      await new Promise((resolve) => setTimeout(resolve, 200));

      return {
        id: Date.now(),
        name: itemData.name,
        category: itemData.category,
        totalQuantity: Number(itemData.totalQuantity) || 1,
        borrowed: [],
      };
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);
