import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCoursesThunk = createAsyncThunk(
  "courses/getCourses",
  async () => {
    const res = await fetch("http://localhost:4000/api/courses", {
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
