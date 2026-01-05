import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, updateEvent, removeEvent } from "../redux/slices/calendar/calendarSlice.js";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";

/** =========================
 *  הגדרות סוגי אירועים (עברית + צבעים בסגנון האתר)
 *  ========================= */
const TYPE_META = {
  exam: { label: "מבחנים", color: "#295f8b" },
  trip: { label: "טיולים", color: "#10B981" },
  wedding: { label: "חתונות", color: "#EC4899" },
  holiday: { label: "חופשות", color: "#F59E0B" },
  other: { label: "אחר", color: "#64748B" },
};

const WEEK_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

// תאריך עברי מלא למעלה
const hebFullFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// יום עברי בתא
const hebDayFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", { day: "numeric" });

// חודש עברי (כותרת)
const hebMonthFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", { month: "long", year: "numeric" });

function pad2(n) {
  return String(n).padStart(2, "0");
}
function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfMonth(year, monthIndex) {
  return new Date(year, monthIndex, 1);
}
function endOfMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0);
}
// שבוע מתחיל ביום א' (Sunday=0)
function getGridStart(year, monthIndex) {
  const first = startOfMonth(year, monthIndex);
  const day = first.getDay();
  const start = new Date(first);
  start.setDate(first.getDate() - day);
  return start;
}
function buildMonthGrid(year, monthIndex) {
  const start = getGridStart(year, monthIndex);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}
function normalizeTime(v) {
  if (!v) return "";
  const parts = v.split(":");
  if (parts.length !== 2) return v;
  const hh = pad2(parseInt(parts[0], 10));
  const mm = pad2(parseInt(parts[1], 10));
  return `${hh}:${mm}`;
}

function formatTopDate(d) {
  const heb = hebFullFormatter.format(d);
  const iso = toISODate(d);
  return { heb, iso };
}

function getTypeLabel(type) {
  return (TYPE_META[type] || TYPE_META.other).label;
}
function getTypeColor(type) {
  return (TYPE_META[type] || TYPE_META.other).color;
}

/** =========================
 *  מודאל אירוע (הוספה/עריכה)
 *  ========================= */
function EventEditorModal({ open, editing, onChange, onClose, onSave, onDelete }) {
  if (!open || !editing) return null;

  const typeColor = getTypeColor(editing.type);

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {editing.id ? "עריכת אירוע" : "הוספת אירוע"}
            </h3>
            <p className="mt-1 text-gray-600 font-semibold">{editing.date}</p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition font-bold"
          >
            סגור
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">כותרת</label>
            <input
              value={editing.title}
              onChange={(e) => onChange({ ...editing, title: e.target.value })}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#295f8b]"
              placeholder="שם האירוע"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">סוג</label>
              <select
                value={editing.type}
                onChange={(e) => onChange({ ...editing, type: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#295f8b]"
              >
                {Object.keys(TYPE_META).map((t) => (
                  <option key={t} value={t}>
                    {getTypeLabel(t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">שעת התחלה</label>
              <input
                value={editing.time_start}
                onChange={(e) => onChange({ ...editing, time_start: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#295f8b]"
                placeholder="HH:mm"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-800 mb-2">שעת סיום</label>
              <input
                value={editing.time_end}
                onChange={(e) => onChange({ ...editing, time_end: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#295f8b]"
                placeholder="HH:mm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">הערות</label>
            <textarea
              value={editing.notes}
              onChange={(e) => onChange({ ...editing, notes: e.target.value })}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#295f8b] min-h-[110px]"
              placeholder="פרטים נוספים..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onSave}
              className="px-6 py-3 rounded-full bg-[#295f8b] text-white font-bold shadow-md hover:bg-[#1e4a6b] transition"
            >
              שמירה
            </button>

            {editing.id ? (
              <button
                onClick={onDelete}
                className="px-6 py-3 rounded-full border border-red-200 text-red-700 font-bold hover:bg-red-50 transition"
              >
                מחיקה
              </button>
            ) : null}
          </div>

          <div className="text-sm font-bold text-gray-600 flex items-center gap-2">
            <span>צבע:</span>
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: typeColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** =========================
 *  מודאל "כל האירועים ביום" (נפתח בלחיצה על תאריך)
 *  ========================= */
function DayEventsModal({ open, dateISO, dateHeb, events, onClose, onAdd, onEdit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] bg-black/40 flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">אירועים בתאריך</h3>
            <div className="mt-2 text-gray-700 font-semibold">
              <div>{dateHeb}</div>
              <div className="text-sm text-gray-500">{dateISO}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAdd}
              className="px-5 py-3 rounded-full bg-[#295f8b] text-white font-bold shadow-md hover:bg-[#1e4a6b] transition"
            >
              הוסף אירוע
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition font-bold"
            >
              סגור
            </button>
          </div>
        </div>

        <div className="mt-6">
          {events.length === 0 ? (
            <div className="text-gray-600 font-semibold">אין אירועים בתאריך זה</div>
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => onEdit(ev)}
                  className="w-full text-right rounded-2xl border border-gray-200 p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor(ev.type) }} />
                        <span className="text-lg font-bold text-gray-900 truncate">{ev.title}</span>
                        <span className="text-sm font-bold text-[#295f8b]">
                          ({getTypeLabel(ev.type)})
                        </span>
                      </div>

                      <div className="mt-1 text-sm font-semibold text-gray-600">
                        {ev.time_start || ev.time_end ? (
                          <span>
                            {ev.time_start || "??:??"} - {ev.time_end || "??:??"}
                          </span>
                        ) : (
                          <span>ללא שעה</span>
                        )}
                      </div>

                      {ev.notes ? (
                        <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{ev.notes}</div>
                      ) : null}
                    </div>

                    <span className="text-sm font-bold text-[#295f8b]">עריכה</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const ShabbatCandlesIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    className="text-[#295f8b]"
  >
    <path
      d="M8 21V10M16 21V10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 6C8 4.343 9.343 3 11 3C11 4.657 9.657 6 8 6Z"
      fill="currentColor"
    />
    <path
      d="M16 6C16 4.343 14.657 3 13 3C13 4.657 14.343 6 16 6Z"
      fill="currentColor"
    />
  </svg>
);
function hebrewDateTextFromISO(iso, numberToHebrewLetters, formatHebrewYear, hebFullFormatter) {
  const [y, m, d] = iso.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);

  const parts = hebFullFormatter.formatToParts(dateObj);
  const dayNum = Number(parts.find((p) => p.type === "day")?.value);
  const monthName = parts.find((p) => p.type === "month")?.value || "";
  const yearNum = Number(parts.find((p) => p.type === "year")?.value);

  const dayHeb = numberToHebrewLetters(dayNum);
  const yearHeb = formatHebrewYear(yearNum);

  return `${dayHeb} ${monthName} ${yearHeb}`;
}

/** =========================
 *  הקומפוננטה הראשית
 *  ========================= */
export default function CalendarModern() {
  const dispatch = useDispatch();
  const events = useSelector((s) => s?.calendar?.events ?? []);

  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0..11

  // מצב בחירה/ריחוף לתאריך למעלה
  const [selectedDateISO, setSelectedDateISO] = useState(toISODate(today));
  const [hoveredISO, setHoveredISO] = useState(null);

  // מודאל "אירועים ביום"
  const [dayModalOpen, setDayModalOpen] = useState(false);

  // מודאל עריכה/הוספה
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const monthStart = useMemo(() => startOfMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthEnd = useMemo(() => endOfMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const gridDays = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  // כותרת חודש עברי (יפה וברורה)
//   const hebMonthTitle = useMemo(() => hebMonthFormatter.format(new Date(viewYear, viewMonth, 15)), [viewYear, viewMonth]);
const hebMonthTitle = useMemo(() => {
  const mid = new Date(viewYear, viewMonth, 15);
  const parts = hebMonthFormatter.formatToParts(mid);

  const monthName = parts.find((p) => p.type === "month")?.value || "";
  const yearNum = Number(parts.find((p) => p.type === "year")?.value);

  const yearHeb = formatHebrewYear(yearNum); // תשפ״ו
  return `${monthName} ${yearHeb}`;          // טבת תשפ״ו
}, [viewYear, viewMonth]);

  // map אירועים לפי date (ISO YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      if (!ev?.date) continue;
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.time_start || "").localeCompare(b.time_start || ""));
      map.set(k, arr);
    }
    return map;
  }, [events]);

  const selectedEvents = useMemo(() => eventsByDate.get(selectedDateISO) || [], [eventsByDate, selectedDateISO]);

//   // תאריך עליון לפי hovered אם קיים אחרת selected
//   const topDate = useMemo(() => {
//     const iso = hoveredISO || selectedDateISO;
//     const [y, m, d] = iso.split("-").map(Number);
//     const dateObj = new Date(y, m - 1, d);
//     const { heb, iso: isoOut } = formatTopDate(dateObj);
//     return { heb, iso: isoOut };
//   }, [hoveredISO, selectedDateISO]);
const selectedHebText = useMemo(() => {
  return hebrewDateTextFromISO(selectedDateISO, numberToHebrewLetters, formatHebrewYear, hebFullFormatter);
}, [selectedDateISO]);
const topDate = useMemo(() => {
  const iso = hoveredISO || selectedDateISO;
  const [y, m, d] = iso.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);

  const parts = hebFullFormatter.formatToParts(dateObj);
  const dayNum = Number(parts.find((p) => p.type === "day")?.value);
  const monthName = parts.find((p) => p.type === "month")?.value || "";
  const yearNum = Number(parts.find((p) => p.type === "year")?.value);

  const dayHeb = numberToHebrewLetters(dayNum);  // י״ב
  const yearHeb = formatHebrewYear(yearNum);     // תשפ״ו
  const hebText = `${dayHeb} ${monthName} ${yearHeb}`;

  return { heb: hebText, iso };
}, [hoveredISO, selectedDateISO]);

  // מקרא קטן: מציג רק סוגים שמופיעים בפועל (אם אין, מציג סט בסיס)
  const legendItems = useMemo(() => {
    const typesInData = new Set(events.map((e) => e.type).filter(Boolean));
    const base = Object.keys(TYPE_META);
    const merged = [...new Set([...base, ...typesInData])];
    // קטנים בצד: נשאיר סדר קבוע "הגיוני"
    const order = ["exam", "trip", "wedding", "holiday", "other"];
    return merged
      .filter((t) => order.includes(t))
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((type) => ({
        type,
        label: getTypeLabel(type),
        color: getTypeColor(type),
      }));
  }, [events]);

  function prevMonth() {
    const m = viewMonth - 1;
    if (m < 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth(m);
  }

  function nextMonth() {
    const m = viewMonth + 1;
    if (m > 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth(m);
  }

  function openAdd(dateISO) {
    setEditing({
      id: "",
      title: "",
      type: "other",
      date: dateISO,
      time_start: "",
      time_end: "",
      notes: "",
    });
    setEditorOpen(true);
  }

  function openEdit(ev) {
    setEditing({
      id: ev.id ?? "",
      title: ev.title ?? "",
      type: ev.type ?? "other",
      date: ev.date ?? selectedDateISO,
      time_start: ev.time_start ?? "",
      time_end: ev.time_end ?? "",
      notes: ev.notes ?? "",
    });
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditing(null);
  }

  function saveEvent() {
    if (!editing) return;

    const payload = {
      id: editing.id,
      title: String(editing.title || "").trim(),
      type: String(editing.type || "other").trim(),
      date: String(editing.date || "").trim(),
      time_start: normalizeTime(editing.time_start),
      time_end: normalizeTime(editing.time_end),
      notes: String(editing.notes || ""),
    };

    if (!payload.title || !payload.date) return;

    if (!payload.id) {
      dispatch(
        addEvent({
          ...payload,
          id: Date.now().toString(),
        })
      );
    } else {
      dispatch(updateEvent(payload));
    }

    setSelectedDateISO(payload.date);
    closeEditor();
  }

  function deleteEvent() {
    if (!editing?.id) return;
    dispatch(removeEvent(editing.id));
    closeEditor();
  }

  function openDayModal(dateISO) {
    setSelectedDateISO(dateISO);
    setDayModalOpen(true);
  }

  function closeDayModal() {
    setDayModalOpen(false);
  }

  const dayModalEvents = useMemo(() => eventsByDate.get(selectedDateISO) || [], [eventsByDate, selectedDateISO]);
  const dayModalHeb = useMemo(() => {
    const [y, m, d] = selectedDateISO.split("-").map(Number);
    return hebFullFormatter.format(new Date(y, m - 1, d));
  }, [selectedDateISO]);

  return (
    <main dir="rtl" className="w-full bg-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">לוח שנה</h1>

            {/* תאריך מדויק למעלה (לפי hover/selected) */}
            <div className="mt-4 inline-flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="px-5 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="text-sm font-bold text-gray-600">תאריך</div>
                <div className="text-xl font-bold text-gray-900">{topDate.heb}</div>
                <div className="text-sm font-semibold text-gray-500">{topDate.iso}</div>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-[#295f8b] text-white font-bold shadow-md">
                {hebMonthTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="px-5 py-3 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition font-bold"
              aria-label="חודש קודם"
            >
              הקודם
            </button>
            <button
              onClick={nextMonth}
              className="px-5 py-3 rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md transition font-bold"
              aria-label="חודש הבא"
            >
              הבא
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Calendar */}
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            {/* Week header */}
            {/* <div className="grid grid-cols-7 gap-3 mb-3">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="text-center font-bold text-lg text-gray-800">
                  {d}
                </div>
              ))}
            </div> */}
<div className="grid grid-cols-7 gap-3 mb-3">
  {WEEK_DAYS.map((d, idx) => {
    const isShabbatCol = idx === 6; // עמודה 7 = "ש"
    return (
      <div
        key={d}
        className={[
          "text-center font-bold text-lg",
          isShabbatCol ? "text-[#295f8b]" : "text-gray-800",
        ].join(" ")}
      >
        {d}
      </div>
    );
  })}
</div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-3">
              {gridDays.map((d) => {
                const iso = toISODate(d);
                const inMonth = d >= monthStart && d <= monthEnd;
                const isSelected = iso === selectedDateISO;
                const isToday = iso === toISODate(today);
               const hebParts = hebDayFormatter.formatToParts(d);
const hebDayNum = Number(hebParts.find(p => p.type === "day")?.value);
const isHebrewMonthEdge = hebDayNum === 1 || hebDayNum === 30;


                const isShabbat = d.getDay() === 6; // שבת (JS: 0=א, 6=ש)

                const dayEvents = eventsByDate.get(iso) || [];
                // const hebDay = hebDayFormatter.format(d);
                const hebDayNumber = Number(hebDayFormatter.format(d)); // יוצא 12
                const hebDay = numberToHebrewLetters(hebDayNumber);     // יוצא י״ב

                const gregDay = d.getDate();

                return (
                  <button
                    key={iso}
                    onMouseEnter={() => setHoveredISO(iso)}
                    onMouseLeave={() => setHoveredISO(null)}
onClick={() => {
    // קליק אחד → רק בחירה
    setSelectedDateISO(iso);
  }}
  onDoubleClick={() => {
    // דאבל קליק → פתיחת חלונית
    setSelectedDateISO(iso);
    setDayModalOpen(true);
  }}                   
   className={classNames(
                      "relative rounded-2xl p-3 min-h-[118px] text-right transition-all",
                      "border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5",
                      inMonth ? "border-gray-200" : "border-gray-100 opacity-40",
                      isSelected && "ring-2 ring-[#295f8b]",
               isHebrewMonthEdge && "bg-[#295f8b]/10",

                      isShabbat && "bg-[#295f8b]/25 border-[#295f8b] ring-2 ring-[#295f8b]",
                    
                      isToday && "border-[#295f8b] ring-1 ring-[#295f8b]/30"
                    )}
                  >
                    {isHebrewMonthEdge && (
  <span className="absolute bottom-2 right-2 text-[10px] font-bold text-[#295f8b]/70">
    ראש חודש
  </span>
)}

                    {isShabbat && (
    <div className="absolute top-2 left-2 z-10">
      <ShabbatCandlesIcon />
    </div>
     )}
                    {/* כותרת תא: עברי גדול + גרגוריאני קטן */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className={classNames("text-2xl font-extrabold", isToday ? "text-[#295f8b]" : "text-gray-900")}>
                          {hebDay}
                        </div>
                        <div className="text-xs font-bold text-gray-500">({gregDay})</div>
                      </div>

                      {/* + הוספה */}
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedDateISO(iso);
                          openAdd(iso);
                        }}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#295f8b] text-white text-lg font-bold hover:bg-[#1e4a6b] transition"
                        aria-label="הוספת אירוע"
                        role="button"
                        title="הוספת אירוע"
                      >
                        +
                      </span>
                    </div>

                    {/* אירועים: נקודות צבע + טקסט קצר (עברית) */}
                    {dayEvents.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {/* נקודות */}
                        <div className="flex flex-wrap gap-2">
                          {dayEvents.slice(0, 6).map((ev) => (
                            <span
                              key={ev.id}
                              className="w-3 h-3 rounded-full"
                              title={`${ev.title} • ${getTypeLabel(ev.type)}`}
                              style={{ backgroundColor: getTypeColor(ev.type) }}
                            />
                          ))}
                          {dayEvents.length > 6 && (
                            <span className="text-xs font-bold text-gray-600">+{dayEvents.length - 6}</span>
                          )}
                        </div>

                        {/* טקסט ברור: 1-2 אירועים ראשונים */}
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((ev) => (
                            <div key={ev.id} className="text-xs font-bold text-gray-700 truncate">
                              {ev.time_start ? `${ev.time_start} ` : ""}
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs font-bold text-gray-500">ועוד {dayEvents.length - 2}…</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* תגית "היום" */}
                    {isToday && (
                      <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-[#295f8b]/10 text-[#295f8b] text-xs font-extrabold">
                        היום
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Legend קטן בצד */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">מקרא</h2>
                <span className="text-xs font-bold text-gray-500">סוגי אירועים</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {legendItems.map((x) => (
                  <div key={x.type} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: x.color }} />
                    <span className="text-sm font-bold text-gray-800">{x.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected day events (נשאר בצד כמו שביקשת) */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">אירועים בתאריך</h2>
                 <p className="mt-1 text-gray-600 font-semibold">
  {hebrewDateTextFromISO(selectedDateISO, numberToHebrewLetters, formatHebrewYear, hebFullFormatter)}
</p>

                 {/* <p className="mt-1 text-gray-600 font-semibold">{selectedDateISO}</p> */}
                </div>

                <button
                  onClick={() => openAdd(selectedDateISO)}
                  className="px-5 py-3 rounded-full bg-[#295f8b] text-white font-bold shadow-md hover:bg-[#1e4a6b] transition"
                >
                  הוסף
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {selectedEvents.length === 0 ? (
                  <div className="text-gray-600 font-semibold">אין אירועים בתאריך זה</div>
                ) : (
                  selectedEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => openEdit(ev)}
                      className="w-full text-right rounded-2xl border border-gray-200 p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getTypeColor(ev.type) }} />
                            <span className="text-lg font-bold text-gray-900 truncate">{ev.title}</span>
                          </div>


                          <div className="mt-1 text-sm font-semibold text-gray-600">
                            <span className="font-bold text-[#295f8b]">{getTypeLabel(ev.type)}</span>
                            {ev.time_start || ev.time_end ? (
                              <span className="mr-2">
                                • {ev.time_start || "??:??"} - {ev.time_end || "??:??"}
                              </span>
                            ) : (
                              <span className="mr-2">• ללא שעה</span>
                            )}
                          </div>

                          {ev.notes ? (
                            <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">{ev.notes}</div>
                          ) : null}
                        </div>

                        <span className="text-sm font-bold text-[#295f8b]">עריכה</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Day events modal on date click */}
      <DayEventsModal
        open={dayModalOpen}
        dateISO={selectedDateISO}
        // dateHeb={dayModalHeb},
        dateHeb={selectedHebText}
        events={dayModalEvents}
        onClose={closeDayModal}
        onAdd={() => {
          closeDayModal();
          openAdd(selectedDateISO);
        }}
        onEdit={(ev) => {
          closeDayModal();
          openEdit(ev);
        }}
      />

      {/* Editor modal */}
      <EventEditorModal
        open={editorOpen}
        editing={editing}
        onChange={setEditing}
        onClose={closeEditor}
        onSave={saveEvent}
        onDelete={deleteEvent}
      />
    </main>
  );
}
