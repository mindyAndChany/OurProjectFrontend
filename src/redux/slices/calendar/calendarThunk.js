import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCalendarEventsThunk = createAsyncThunk(
  'calendar/getCalendarEvents',
  async () => {
    const res = await fetch(`http://localhost:4000/api/calendar-events`);
    
    if (res.ok) {
      const data = await res.json();
      console.log("✔️ fetch calendar events success");
      return data;
    } else {
      throw new Error('❌ failed to fetch calendar events');
    }
  }
);

export const addEvent = createAsyncThunk(
  'calendar/postCalendarEvent',
  async (eventData) => {
    const { id, ...rest } = eventData;

    const cleanedEvent = {
      ...rest,
      time_start: rest.time_start?.trim() || null,
      time_end: rest.time_end?.trim() || null,
    };

    const res = await fetch(`http://localhost:4000/api/calendar-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanedEvent)
    });

    if (res.ok) {
      const data = await res.json();
      console.log("✔️ event added:", data);
      return data;
    } else {
      throw new Error('❌ failed to post calendar event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, data }) => {
    const res = await fetch(
      `http://localhost:4000/api/calendar-events/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error('failed to update event');
    }

    return await res.json(); // האירוע המעודכן מהשרת
  }
);

export const removeEvent = createAsyncThunk(
  'calendar/removeEvent',
  async (id) => {
    const res = await fetch(
      `http://localhost:4000/api/calendar-events/${id}`,
      { method: 'DELETE' }
    );

    if (!res.ok) {
      throw new Error('failed to delete event');
    }

    return id; // מחזירים id כדי למחוק מה־store
  }
);

