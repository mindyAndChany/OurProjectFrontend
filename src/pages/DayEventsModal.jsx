import React from "react";
import { getTypeColor, getTypeLabel } from "../utils/calendarUtils";

export default function DayEventsModal({ open, dateISO, dateHeb, events, onClose, onAdd, onEdit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] bg-black/40 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full">
        <h3 className="text-2xl font-bold mb-2">{dateHeb}</h3>
        <p className="text-sm text-gray-500 mb-4">{dateISO}</p>

        <button onClick={onAdd} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
          הוסף אירוע
        </button>

        {events.length === 0 ? (
          <div>אין אירועים</div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onEdit(ev)}
              className="border rounded p-3 mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: getTypeColor(ev.type) }} />
                <strong>{ev.title}</strong>
                <span className="text-sm text-gray-500">({getTypeLabel(ev.type)})</span>
              </div>
            </div>
          ))
        )}

        <button onClick={onClose} className="mt-4 border px-4 py-2 rounded">
          סגור
        </button>
      </div>
    </div>
  );
}
