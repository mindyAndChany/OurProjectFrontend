import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const deletePermissionThunk = createAsyncThunk(
  'permissions/deletePermission',
  async (id) => {
    const url = `${BACKEND_URL}/api/permissions/${id}`;
    console.log("Deleting from URL:", url);
    
    const res = await fetch(url, {
      method: 'DELETE',
    });

    if (res.ok) {
      console.log("delete permission success");
      return id;
    } else {
      throw new Error('failed to delete permission');
    }
  }
);
