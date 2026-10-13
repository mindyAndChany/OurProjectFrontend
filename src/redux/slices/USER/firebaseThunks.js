import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginWithEmail, loginWithGoogle } from '../../../utils/firebaseAuth.js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

// התחברות עם אימייל וסיסמא דרך Firebase
export const loginWithFirebaseThunk = createAsyncThunk(
  'user/loginWithFirebase',
  async ({ email, password }) => {
    // 1. התחברות ל-Firebase Auth
    const firebaseUser = await loginWithEmail(email, password);

    // 2. שליחת ה-UID ל-Backend לקבלת הרשאות
    const res = await fetch(`${BACKEND_URL}/api/auth/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || 'התחברות נכשלה');
    }

    return await res.json();
  }
);

// התחברות עם Google
export const loginWithGoogleThunk = createAsyncThunk(
  'user/loginWithGoogle',
  async () => {
    // 1. התחברות ל-Firebase Auth עם Google
    const firebaseUser = await loginWithGoogle();

    // 2. שליחת ה-UID ל-Backend
    const res = await fetch(`${BACKEND_URL}/api/auth/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || 'התחברות Google נכשלה');
    }

    return await res.json();
  }
);
