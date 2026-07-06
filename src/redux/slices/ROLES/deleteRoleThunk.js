import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const deleteRoleThunk = createAsyncThunk(
  'roles/deleteRole',
  async (id) => {
    const url = `${BACKEND_URL}/api/roles/${id}`;
    console.log("Deleting from URL:", url);
    
    const res = await fetch(url, {
      method: 'DELETE',
    });

    if (res.ok) {
      console.log("delete role success");
      return id;
    } else {
      throw new Error('failed to delete role');
    }
  }
);
