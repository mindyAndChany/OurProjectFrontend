import { createAsyncThunk } from '@reduxjs/toolkit';

export const checkAvailabilityThunk = createAsyncThunk(
  'rooms/checkAvailability',
  async (params, { rejectWithValue, getState }) => {
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

      // also merge weekly schedule conflicts from state (if available)
      try {
        const state = getState();
        const weekly = state.weekly_schedule?.data || [];
        if (Array.isArray(weekly) && weekly.length > 0 && date) {
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay();
          const year = dateObj.getFullYear();
          const toMinutes = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
          };
          const overlaps = (s1, e1, s2, e2) => !(toMinutes(e1) <= toMinutes(s2) || toMinutes(e2) <= toMinutes(s1));

          const weeklyConflicts = weekly.filter(entry => {
            // don't require a room_id; we still want to report there is a scheduled lesson
            if (entry.day_of_week !== dayOfWeek || entry.year !== year) return false;
            return overlaps(entry.start_time, entry.end_time, start_time, end_time);
          }).map(e => ({
            room_id: e.room_id ?? null,
            fromWeekly: true,
            weeklyEntry: e
          }));

          if (weeklyConflicts.length) {
            console.log('📘 Weekly schedule conflicts merged:', weeklyConflicts);
            data = data.concat(weeklyConflicts);
          }
        }
      } catch (err) {
        console.warn('⚠️ unable to merge weekly schedule conflicts in thunk', err);
      }

      return data;
    } catch (error) {
      console.error('❌ Availability check error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);
