import { createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

export const updateRolePermissionThunk = createAsyncThunk(
  "rolePermissions/updateRolePermission",
  async ({ roleId, permissionId, rolePermissionData }, { rejectWithValue }) => {
    const url = `${BACKEND_URL}/api/role-permissions/${roleId}/${permissionId}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rolePermissionData), // { can_view:true, can_edit:false } למשל
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      return rejectWithValue(payload?.details || payload?.error || `HTTP ${res.status}`);
    }

    return { ...payload, roleId, oldPermissionId: permissionId };
  }
);