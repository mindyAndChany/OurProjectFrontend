// הנחתי שאתה עובד עם React
// אני מפריד את הקבצים כדי למנוע כפילויות

// 📁 utils/calendarUtils.js
export const TYPE_META = {
  exam: { label: "מבחנים", color: "#295f8b" },
  trip: { label: "טיולים", color: "#10B981" },
  wedding: { label: "חתונות", color: "#EC4899" },
  holiday: { label: "חופשות", color: "#F59E0B" },
  other: { label: "אחר", color: "#64748B" },
};

export function getTypeLabel(type) {
  return (TYPE_META[type] || TYPE_META.other).label;
}

export function getTypeColor(type) {
  return (TYPE_META[type] || TYPE_META.other).color;
}

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function normalizeTime(v) {
  if (!v) return "";
  const parts = v.split(":");
  if (parts.length !== 2) return v;
  const hh = pad2(parseInt(parts[0], 10));
  const mm = pad2(parseInt(parts[1], 10));
  return `${hh}:${mm}`;
}

export function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}
