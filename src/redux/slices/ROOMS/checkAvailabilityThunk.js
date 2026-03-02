import { createAsyncThunk } from '@reduxjs/toolkit';

export const checkAvailabilityThunk = createAsyncThunk(
  'rooms/checkAvailability',
  async (params, { rejectWithValue }) => {
    try {
      const { date, start_time, end_time } = params;
      
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
      
      console.log('📅 Available params:', { date, start_time, end_time });
      
      // בדוק שלא שכחנו שעות ודקות
      if (!date || !start_time || !end_time) {
        throw new Error('חסרו פרמטרים');
      }

      const apiUrl = `${BACKEND_URL}/api/lessons?date=${date}&start_time=${encodeURIComponent(start_time)}&end_time=${encodeURIComponent(end_time)}`;
      console.log('🔍 Checking availability at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('❌ JSON Parse error:', text);
        throw new Error('Invalid JSON response from server');
      }

      console.log('✅ Available lessons:', data);
      return data;
    } catch (error) {
      console.error('❌ Availability check error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);
