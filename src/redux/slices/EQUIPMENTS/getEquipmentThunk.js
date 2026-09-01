import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

/**
 * שלב ראשון: מחזיר נתוני דמה (mock data).
 * בשלב עתידי יחובר לשרת.
 */
export const getEquipmentThunk = createAsyncThunk(
  "equipment/getEquipment",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: להחליף בקריאת שרת אמיתית
      // const res = await fetch(`${BACKEND_URL}/api/equipment`);
      // if (!res.ok) throw new Error("Failed to fetch equipment");
      // return await res.json();

      // נתוני דמה
      const mockData = [
        {
          id: 1,
          name: "ספר אינדיזיין",
          category: "גרפיקה",
          totalQuantity: 5,
          borrowed: [
            {
              id: "b1",
              studentId: "",
              studentName: "רבקה כהן",
              borrowDate: "2026-08-28",
              expectedReturn: "2026-09-15",
              notes: "",
              quantity: 1,
              returnedDate: null,
              status: "active",
            },
          ],
        },
        {
          id: 2,
          name: "גימבל",
          category: "צילום",
          totalQuantity: 3,
          borrowed: [],
        },
        {
          id: 3,
          name: "מצלמה",
          category: "צילום",
          totalQuantity: 2,
          borrowed: [],
        },
        {
          id: 4,
          name: "ספר בינה",
          category: "גרפיקה",
          totalQuantity: 4,
          borrowed: [],
        },
        {
          id: 5,
          name: "ספר פוטושופ",
          category: "גרפיקה",
          totalQuantity: 5,
          borrowed: [],
        },
        {
          id: 6,
          name: "חצובה",
          category: "צילום",
          totalQuantity: 3,
          borrowed: [],
        },
        {
          id: 7,
          name: "מיקרופון",
          category: "סאונד",
          totalQuantity: 4,
          borrowed: [],
        },
        {
          id: 8,
          name: "רמקול נייד",
          category: "סאונד",
          totalQuantity: 2,
          borrowed: [],
        },
      ];

      // 시뮦레이션 지연 (אפשר להסיר בהמשך)
      await new Promise((resolve) => setTimeout(resolve, 300));

      return mockData;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);
