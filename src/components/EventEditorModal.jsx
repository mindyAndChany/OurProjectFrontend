import React from "react";
import { getTypeColor, getTypeLabel } from "../utils/calendarUtils";

export default function EventEditorModal({ open, editing, onChange, onClose, onSave, onDelete }) {
  if (!open || !editing) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6">
        <h3 className="text-2xl font-bold mb-4">
          {editing.id ? "עריכת אירוע" : "הוספת אירוע"}
        </h3>

        <input
          className="w-full border rounded px-3 py-2 mb-3"
          value={editing.title}
          onChange={(e) => onChange({ ...editing, title: e.target.value })}
          placeholder="כותרת"
        />

        <select
          className="w-full border rounded px-3 py-2 mb-3"
          value={editing.type}
          onChange={(e) => onChange({ ...editing, type: e.target.value })}
        >
          {Object.keys(getTypeLabel).map?.(() => null)}
          {["exam", "trip", "wedding", "holiday", "other"].map((t) => (
            <option key={t} value={t}>{getTypeLabel(t)}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">שמור</button>
          {editing.id && (
            <button onClick={onDelete} className="border px-4 py-2 rounded text-red-600">מחק</button>
          )}
          <button onClick={onClose} className="border px-4 py-2 rounded">סגור</button>
        </div>

        <div className="mt-2 text-sm">
          צבע: <span className="inline-block w-3 h-3 rounded-full" style={{ background: getTypeColor(editing.type) }} />
        </div>
      </div>
    </div>
  );
}
