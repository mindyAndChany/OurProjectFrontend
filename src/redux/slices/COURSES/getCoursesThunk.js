import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const getCoursesThunk = createAsyncThunk(
  "courses/getCourses",
  async () => {
    const res = await fetch(`${BACKEND_URL}/api/courses`, {
      headers: { accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch courses success");
      return data;
    }

    throw new Error("❌ failed to fetch courses");
  }
);
