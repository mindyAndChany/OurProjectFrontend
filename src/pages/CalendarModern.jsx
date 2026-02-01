import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { updateEvent, removeEvent } from "../redux/slices/calendar/calendarSlice.js";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";
import { addEvent } from "../redux/slices/calendar/calendarThunk.js";
import { getEvents } from "../redux/slices/calendar/getEventThunk.js";
import { updateEvent } from "../redux/slices/calendar/calendarThunk.js";
import { removeEvent } from "../redux/slices/calendar/calendarThunk.js";
import { addRealyLessonThunk } from "../redux/slices/LESSONS/addRealyLessonThunk.js";
import { useNavigate } from "react-router-dom";
/** =========================
 *  הגדרות סוגי אירועים (עברית + צבעים בסגנון האתר)
 *  ========================= */

const TYPE_META = {
  exam: { label: "מבחנים", color: "#295f8b" },
  trip: { label: "טיולים", color: "#10B981" },
  wedding: { label: "חתונות", color: "#EC4899" },
  holiday: { label: "חופשות", color: "#F59E0B" },
  other: { label: "אחר", color: "#64748B" },
  attendance: { label: "אירוע עם נוכחות", color: "#8B5CF6" },

};

const WEEK_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

const HEB_WEEKDAY_FULL = [
  "יום ראשון",
  "יום שני",
  "יום שלישי",
  "יום רביעי",
  "יום חמישי",
  "יום שישי",
  "שבת",
];

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
function EventEditorModal({ open, editing, onChange, onClose, onSave, onDelete, onBack }) {
  const classes = useSelector((state) => state.classes?.data ?? []); // רשימת כיתות

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
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition font-bold"
          >
            חזור
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
              <label
                className="block text-sm font-bold text-gray-800 mb-2">שעת התחלה</label>
              <input
                type="time"
                value={editing.time_start}
                onChange={(e) => onChange({ ...editing, time_start: e.target.value })}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-[#295f8b]"
                placeholder="HH:mm"
              />
            </div>

            <div className="md:col-span-1">
              <label
                className="block text-sm font-bold text-gray-800 mb-2">שעת סיום</label>
              <input
                type="time"
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
        {editing.type === "attendance" && (
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">כיתות</label>
            <select
              multiple
              value={editing.class_ids || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                onChange({ ...editing, class_ids: selected });
              }}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 font-semibold outline-none"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        )}

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
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-gray-200 shadow-xl p-6 max-h-[90vh] overflow-hidden flex flex-col">
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
            <DayTimeline events={events} onEdit={onEdit} />
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
function fullHebDayTitleFromISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);

  const weekday = HEB_WEEKDAY_FULL[dateObj.getDay()];

  const parts = hebFullFormatter.formatToParts(dateObj);
  const dayNum = Number(parts.find((p) => p.type === "day")?.value);
  const monthName = parts.find((p) => p.type === "month")?.value || "";
  const yearNum = Number(parts.find((p) => p.type === "year")?.value);

  const dayHeb = numberToHebrewLetters(dayNum);
  const yearHeb = formatHebrewYear(yearNum);

  return `${weekday} ${dayHeb} ${monthName} ${yearHeb}`;
}

/** =========================
 *  הקומפוננטה הראשית
 *  ========================= */
export default function CalendarModern() {

  const dispatch = useDispatch();
  const events = useSelector((s) => s?.calendar?.events ?? []);
  useEffect(() => {
    console.log("🔴 כל האירועים ברדאקס:", events);
    dispatch(getEvents());
  }, [dispatch]);

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
  const [viewMode, setViewMode] = useState("month"); // אפשרויות: month | week | day

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
  function goToToday() {
    const now = new Date();
    const iso = toISODate(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDateISO(iso);
    setHoveredISO(null);
  }
  function prev() {
    if (viewMode === "month") {
      prevMonth();
    }
    else if (viewMode === "week") {
      prevWeek();
    }
    else if (viewMode === "day") {
      prevDay();
    }
  }
  function next() {
    if (viewMode === "month") {
      nextMonth();
    }
    else if (viewMode === "week") {
      nextWeek();
    }
    else if (viewMode === "day") {
      nextDay();
    }
  }
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
  function shiftDay(deltaDays) {
    const [y, m, d] = selectedDateISO.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    base.setDate(base.getDate() + deltaDays);

    const iso = toISODate(base);
    setSelectedDateISO(iso);
    setHoveredISO(null);

    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  }

  function prevDay() {
    shiftDay(-1);
  }

  function nextDay() {
    shiftDay(1);
  }

  function shiftWeek(deltaDays) {
    const [y, m, d] = selectedDateISO.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    base.setDate(base.getDate() + deltaDays);

    const iso = toISODate(base);
    setSelectedDateISO(iso);
    setHoveredISO(null);

    // כדי שהכותרות (חודש עברי/תאריך למעלה) יישארו מסונכרנות
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  }

  function prevWeek() {
    shiftWeek(-7);
  }

  function nextWeek() {
    shiftWeek(7);
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
      console.log("new event payload", payload);


      dispatch(
        addEvent({
          ...payload,
          id: Date.now().toString(),
        })
      );
    } else {
      const { id, ...data } = payload;
      dispatch(updateEvent({ id, data }));
      // dispatch(updateEvent(payload));
    }

    setSelectedDateISO(payload.date);
    closeEditor();
    if (payload.type === "attendance" && Array.isArray(editing.class_ids)) {
      editing.class_ids.forEach((class_id) => {
        dispatch(addRealyLessonThunk({
          class_id,
          date: payload.date,
          start_time: payload.time_start,
          end_time: payload.time_end,
          topic: payload.title,
          topic_id: null,
          is_cancelled: false,
          cancellation_reason: "",
        }));
      });
    }

  }

  function deleteEvent() {
    if (!editing?.id) return;
    dispatch(removeEvent(editing.id));
    // dispatch(removeEvent(editing.id));
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


          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              {["month", "week", "day"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={classNames(
                    "px-4 py-2 rounded-full font-bold border",
                    viewMode === mode
                      ? "bg-[#295f8b] text-white border-[#295f8b]"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {mode === "month" ? "חודש" : mode === "week" ? "שבוע" : "יום"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={prev} className="px-4 py-2 rounded-full border">הקודם</button>
              <button onClick={goToToday} className="px-4 py-2 rounded-full border">היום</button>
              <button onClick={next} className="px-4 py-2 rounded-full border">הבא</button>
            </div>
          </div>

        </div>

        {/* Layout */}
        <div
          className={[
            "mt-10 grid gap-10",
            viewMode === "week" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1fr_360px]",
          ].join(" ")}
        >
          {/* Calendar */}

          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 min-h-[300px]">
            {viewMode === "month" && (
              <>
                {/* תצוגה חודשית מלאה */}
                <div className="grid grid-cols-7 gap-3 mb-3">
                  {WEEK_DAYS.map((d, idx) => {
                    const isShabbatCol = idx === 6;
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

                <div className="grid grid-cols-7 gap-3">
                  {gridDays.map((d) => {
                    const iso = toISODate(d);
                    const inMonth = d >= monthStart && d <= monthEnd;
                    const isSelected = iso === selectedDateISO;
                    const isToday = iso === toISODate(today);

                    const hebParts = hebDayFormatter.formatToParts(d);
                    const hebDayNum = Number(hebParts.find(p => p.type === "day")?.value);
                    const isHebrewMonthEdge = hebDayNum === 1 || hebDayNum === 30;

                    const isShabbat = d.getDay() === 6;
                    const dayEvents = eventsByDate.get(iso) || [];
                    const hebDay = numberToHebrewLetters(hebDayNum);
                    const gregDay = d.getDate();

                    return (
                      <button
                        key={iso}
                        onMouseEnter={() => setHoveredISO(iso)}
                        onMouseLeave={() => setHoveredISO(null)}
                        onClick={() => setSelectedDateISO(iso)}
                        onDoubleClick={() => {
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

                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className={classNames("text-2xl font-extrabold", isToday ? "text-[#295f8b]" : "text-gray-900")}>{hebDay}</div>
                            <div className="text-xs font-bold text-gray-500">({gregDay})</div>
                          </div>

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

                        {dayEvents.length > 0 && (
                          <div className="mt-3 space-y-2">
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

                        {isToday && (
                          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-[#295f8b]/10 text-[#295f8b] text-xs font-extrabold">
                            היום
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* {viewMode === "week" && (
              <WeeklyView
                selectedDateISO={selectedDateISO}
                eventsByDate={eventsByDate}
                onSelectDate={setSelectedDateISO}
                onOpenAdd={openAdd}
                onOpenEdit={openEdit}
              />
            )} */}
            {viewMode === "week" && (
              <WeekGridView
                weekDates={daysInWeek(selectedDateISO)}
                eventsByDate={eventsByDate}
                onEdit={openEdit}
                onOpenAdd={openAdd}
                selectedDateISO={selectedDateISO}
                onSelectDate={setSelectedDateISO}
                onHoverDate={setHoveredISO}
              />
            )}

            {viewMode === "day" && (
              <DayGridView
                selectedDateISO={selectedDateISO}
                eventsByDate={eventsByDate}
                onEdit={openEdit}
                onOpenAdd={openAdd}
                onHoverDate={setHoveredISO}
              />
            )}

          </section>
          {/* Sidebar */}
          {viewMode !== "week" && (
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
          )}

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
        onBack={() => {
          closeEditor();           // סוגר את עורך האירועים
          setDayModalOpen(true);   // פותח את מודאל האירועים של היום
        }}
      />
    </main>
  );
}

/** =========================
return (
<div className="text-right">
<div className="mb-4">
<h2 className="text-2xl font-bold text-gray-900">
{numberToHebrewLetters(Number(hebDayFormatter.format(dateObj)))} ({d})
</h2>
<div className="text-sm text-gray-500">{selectedDateISO}</div>
<button
onClick={() => onOpenAdd(selectedDateISO)}
className="mt-2 text-sm text-blue-600 underline"
>
הוסף אירוע
</button>
</div>


<DayTimeline events={dayEvents} onEdit={onOpenEdit} />
</div>
);
}


/** =========================
*   סרגל שעות לתצוגה שבועית
* ========================= */
function daysInWeek(dateISO) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const base = new Date(y, m - 1, d);
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() - weekStart.getDay()); // Sunday (א)

  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(weekStart);
    dd.setDate(weekStart.getDate() + i);
    return toISODate(dd);
  });
}

function WeeklyTimeline({ eventsByDate, weekDates, onEdit }) {
  const hourHeight = 50;
  const hours = Array.from({ length: 17 }, (_, i) => 8 + i); // 08:00 עד 24:00

  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start">
        {/* סרגל שעות בצד שמאל */}
        <div className="flex flex-col border-l w-16 text-sm text-gray-600 font-medium">
          {hours.map((h) => (
            <div
              key={h}
              className="h-[50px] flex items-start justify-center border-t pt-1"
            >
              {h.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* עמודות יומיות */}
        <div className="grid grid-cols-7 flex-1 border-t border-r">
          {weekDates.map((dateISO) => {
            const dayEvents = eventsByDate.get(dateISO) || [];

            return (
              <div key={dateISO} className="relative border-l h-[850px] bg-white">
                {/* כותרת היום */}
                <div className="sticky top-0 bg-gray-100 text-center text-sm font-bold py-2 border-b z-10">
                  {dateISO}
                </div>

                {/* אירועים */}
                {dayEvents.map((ev, idx) => {
                  const start = parseTime(ev.time_start || "00:00");
                  const end = parseTime(ev.time_end || "00:00");
                  const top = (start - 8) * hourHeight;
                  const height = Math.max((end - start) * hourHeight, 30);

                  return (
                    <div
                      key={ev.id}
                      onClick={() => onEdit(ev)}
                      className="absolute left-2 right-2 px-2 py-1 rounded-xl text-white text-sm font-bold shadow-md cursor-pointer hover:brightness-110"
                      style={{
                        top,
                        height,
                        backgroundColor: getTypeColor(ev.type),
                      }}
                    >
                      {ev.title}
                      <div className="text-xs font-normal">
                        {ev.time_start} - {ev.time_end}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/** =========================
* תצוגה שבועית חדשה
* ========================= */
function WeeklyView({ selectedDateISO, eventsByDate, onSelectDate, onOpenAdd, onOpenEdit }) {
  const [y, m, d] = selectedDateISO.split("-").map(Number);
  const baseDate = new Date(y, m - 1, d);
  const weekStart = new Date(baseDate);
  weekStart.setDate(baseDate.getDate() - baseDate.getDay());


  const days = [...Array(7)].map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });


  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((d) => {
        const iso = toISODate(d);
        const dayEvents = eventsByDate.get(iso) || [];
        return (
          <div key={iso} className="border rounded-2xl p-3 bg-gray-50 text-right">
            <div className="text-sm font-bold text-gray-800">
              {numberToHebrewLetters(Number(hebDayFormatter.format(d)))} ({d.getDate()})
            </div>
            <div className="text-xs text-gray-500">{iso}</div>
            <button
              onClick={() => onOpenAdd(iso)}
              className="text-sm text-blue-600 underline mt-2"
            >
              הוסף אירוע
            </button>


            <div className="mt-3">
              <DayTimeline events={dayEvents} onEdit={onOpenEdit} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
//DayTimeline

// DayTimeline.jsx - תצוגת לוח זמנים אופקית

// import { useEffect, useRef, useState } from "react";

function DayTimeline({ events, onEdit }) {

  const hourRowRef = useRef(null);
  const [hourWidth, setHourWidth] = useState(60); // ברירת מחדל

  useEffect(() => {
    if (hourRowRef.current) {
      const totalWidth = hourRowRef.current.offsetWidth;
      setHourWidth(totalWidth / 16); // מ-08:00 עד 24:00 = 16 שעות
    }
  }, []);

  useEffect(() => {
    const close = () => setMenuPos(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const navigate = useNavigate();
  const [menuPos, setMenuPos] = useState(null); // { x, y, event }

  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h + m / 60;
  };

  const rowHeight = 50;

  return (
    <div className="overflow-x-auto">
      {/* סרגל שעות */}
      <div className="flex" ref={hourRowRef} dir="rtl">
        {Array.from({ length: 17 }, (_, i) => {
          const hour = 8 + i;
          return (
            <div
              key={hour}
              className="text-sm font-bold text-gray-700 text-center border-l border-gray-200"
              style={{ width: hourWidth, minWidth: hourWidth }}
            >
              {hour.toString().padStart(2, "0")}:00
            </div>
          );
        })}
      </div>

      {/* אירועים */}
      <div className="relative h-[200px] mt-2 bg-gray-50">
        {events.map((ev, idx) => {
          const start = parseTime(ev.time_start || "00:00");
          const end = parseTime(ev.time_end || "00:00");

          const left = (start - 8) * hourWidth;
          const width = Math.max((end - start) * hourWidth, 40);

          return (
            <button
              key={ev.id}
              onClick={() => onEdit(ev)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (ev.type === "attendance") {
                  setMenuPos({ x: e.clientX, y: e.clientY, event: ev });
                }
              }}
              className="absolute text-white text-sm font-bold px-2 py-1 rounded-xl shadow-md hover:brightness-110"
              style={{
                backgroundColor: getTypeColor(ev.type),
                left,
                width,
                height: rowHeight,
                top: 10 + idx * (rowHeight + 10),
                direction: "rtl",
              }}
            >
              {ev.title}
              {ev.time_start && ev.time_end && (
                <div className="text-xs font-medium">
                  {ev.time_start} - {ev.time_end}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {menuPos && (
        <div
          className="absolute z-50 bg-white border rounded shadow-lg text-sm"
          style={{ top: menuPos.y, left: menuPos.x }}
          onClick={() => {
            const ev = menuPos.event;
            const class_id = ev.class_ids?.[0]; // או ev.class_id
            const date = ev.date; // לוודא שזה קיים
            // navigate(`/attendance?date=${date}&class_id=${class_id}&journal_type=class`);
          navigate(`/Kattendence`);
            setMenuPos(null);
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            עבור לרשימת נוכחות
          </div>
        </div>
      )}
    </div>

  );

}

/** =========================
* קומפוננטה: WeekGridView
* ========================= */
function WeekGridView({
  weekDates,
  selectedDateISO,
  eventsByDate,
  onEdit,
  onOpenAdd,
  onSelectDate,
  onHoverDate,
}) {
  const startHour = 8;
  const endHour = 24;

  const rowHeight = 52;
  const bodyHeight = (endHour - startHour) * rowHeight;

  const todayISO = toISODate(new Date());

  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h + m / 60;
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // כותרת עברית (יום+חודש)
  const hebHeaderForISO = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const parts = hebFullFormatter.formatToParts(dateObj);
    const dayNum = Number(parts.find((p) => p.type === "day")?.value);
    const monthName = parts.find((p) => p.type === "month")?.value || "";
    const dayHeb = numberToHebrewLetters(dayNum);
    return `${dayHeb} ${monthName}`;
  };

  const dayLetter = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const jsDay = new Date(y, m - 1, d).getDay();
    const map = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
    return map[jsDay] || "";
  };

  const isShabbatISO = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).getDay() === 6;
  };

  // חפיפות: layout
  const layoutDayEvents = (dayEvents) => {
    const items = dayEvents
      .map((ev) => {
        const s0 = parseTime(ev.time_start);
        const e0 = parseTime(ev.time_end);
        if (s0 == null || e0 == null) return null;

        const s1 = Math.min(s0, e0);
        const e1 = Math.max(s0, e0);

        if (e1 <= startHour || s1 >= endHour) return null;

        const start = clamp(s1, startHour, endHour);
        const end = clamp(e1, startHour, endHour);

        return { ev, start, end };
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start || a.end - b.end);

    const clusters = [];
    let current = [];
    let clusterEnd = -Infinity;

    for (const it of items) {
      if (current.length === 0) {
        current = [it];
        clusterEnd = it.end;
        continue;
      }
      if (it.start < clusterEnd) {
        current.push(it);
        clusterEnd = Math.max(clusterEnd, it.end);
      } else {
        clusters.push(current);
        current = [it];
        clusterEnd = it.end;
      }
    }
    if (current.length) clusters.push(current);

    const result = [];
    for (const cluster of clusters) {
      const colEnd = [];
      const placed = [];

      for (const it of cluster) {
        let col = -1;
        for (let i = 0; i < colEnd.length; i++) {
          if (it.start >= colEnd[i]) {
            col = i;
            break;
          }
        }
        if (col === -1) {
          col = colEnd.length;
          colEnd.push(it.end);
        } else {
          colEnd[col] = it.end;
        }
        placed.push({ it, colIndex: col });
      }

      const colsInCluster = colEnd.length;
      for (const p of placed) {
        const top = (p.it.start - startHour) * rowHeight;
        const height = Math.max((p.it.end - p.it.start) * rowHeight, 26);
        result.push({
          ev: p.it.ev,
          top,
          height,
          colIndex: p.colIndex,
          colsInCluster,
        });
      }
    }

    return result;
  };

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    []
  );

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden" dir="rtl">
      <div
        className="grid"
        style={{
          // שעות מימין (ב־RTL זה יוצא מימין)
          gridTemplateColumns: `90px repeat(7, minmax(0, 1fr))`,
        }}
      >
        {/* Header שעות (ריק) */}
        <div className="border-b border-gray-200 bg-white" />

        {/* Header ימים */}
        {weekDates.map((iso) => {
          const isToday = iso === todayISO;
          const isSelected = iso === selectedDateISO;
          const isShabbat = isShabbatISO(iso);

          return (
            <div
              key={iso}
              onMouseEnter={() => onHoverDate?.(iso)}
              onMouseLeave={() => onHoverDate?.(null)}
              onClick={() => onSelectDate?.(iso)}
              className={[
                "group relative border-b border-gray-200 border-l border-gray-200",
                "bg-white px-3 py-3 text-center cursor-pointer transition-all",
                "hover:shadow-md hover:-translate-y-0.5",
                isSelected ? "ring-2 ring-[#295f8b] ring-inset" : "",
                isToday ? "bg-[#295f8b]/5" : "",
                isShabbat ? "bg-[#295f8b]/10" : "",
              ].join(" ")}
            >
              {isShabbat && (
                <div className="absolute top-2 left-2">
                  <ShabbatCandlesIcon />
                </div>
              )}

              <div className="font-bold text-gray-900 text-base">{dayLetter(iso)}</div>
              <div className="text-sm font-semibold text-gray-700">{hebHeaderForISO(iso)}</div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectDate?.(iso);
                  onOpenAdd?.(iso);
                }}
                className="absolute top-2 right-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#295f8b] text-white text-lg font-bold hover:bg-[#1e4a6b] transition"
                title="הוספת אירוע"
                aria-label="הוספת אירוע"
                type="button"
              >
                +
              </button>

              {isToday && (
                <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-[#295f8b]/10 text-[#295f8b] text-xs font-extrabold">
                  היום
                </span>
              )}
            </div>
          );
        })}

        {/* גוף: עמודת שעות (ללא פסים/קווי שעה) */}
        <div className="bg-white" style={{ height: bodyHeight }}>
          {hours.map((h) => (
            <div
              key={h}
              className="flex items-start justify-center pt-3 text-sm font-bold text-gray-700"
              style={{ height: rowHeight }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* גוף: עמודות ימים — בלי קווי שעות אופקיים */}
        {weekDates.map((iso) => {
          const isToday = iso === todayISO;
          const isSelected = iso === selectedDateISO;
          const isShabbat = isShabbatISO(iso);

          const dayEvents = eventsByDate.get(iso) || [];
          const layout = layoutDayEvents(dayEvents);

          return (
            <div
              key={iso}
              onMouseEnter={() => onHoverDate?.(iso)}
              onMouseLeave={() => onHoverDate?.(null)}
              onClick={() => onSelectDate?.(iso)}
              className={[
                "group relative border-l border-gray-200 cursor-pointer transition-all",
                "hover:shadow-md hover:-translate-y-0.5",
                isSelected ? "ring-2 ring-[#295f8b] ring-inset" : "",
                isToday ? "bg-[#295f8b]/5" : "bg-white",
                isShabbat ? "bg-[#295f8b]/5" : "",
              ].join(" ")}
              style={{ height: bodyHeight }}
            >
              {layout.map(({ ev, top, height, colIndex, colsInCluster }) => {
                const gap = 6;
                const widthPct = 100 / colsInCluster;

                return (
                  <button
                    key={ev.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(ev);
                    }}
                    className="absolute rounded-xl text-white text-xs font-bold px-2 py-2 shadow-md overflow-hidden hover:brightness-110 transition"
                    style={{
                      top,
                      height,
                      backgroundColor: getTypeColor(ev.type),
                      width: `calc(${widthPct}% - ${gap * 2}px)`,
                      right: `calc(${colIndex * widthPct}% + ${gap}px)`,
                    }}
                    title={`${ev.title} • ${ev.time_start || ""}-${ev.time_end || ""}`}
                    type="button"
                  >
                    <div className="truncate">{ev.title}</div>
                    <div className="text-[11px] font-semibold opacity-90">
                      {ev.time_start} - {ev.time_end}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
/** =========================
* קומפוננטה: DayGridView
* ========================= */
function DayGridView({
  selectedDateISO,
  eventsByDate,
  onEdit,
  onOpenAdd,
  onHoverDate, // אופציונלי: כדי לעדכן topDate למעלה כמו חודש/שבוע
}) {
  const startHour = 8;
  const endHour = 24;

  const rowHeight = 52;
  const bodyHeight = (endHour - startHour) * rowHeight;

  const todayISO = toISODate(new Date());

  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h + m / 60;
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    []
  );

  // כותרת עברית ליום
  const hebHeaderForISO = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const parts = hebFullFormatter.formatToParts(dateObj);
    const dayNum = Number(parts.find((p) => p.type === "day")?.value);
    const monthName = parts.find((p) => p.type === "month")?.value || "";
    const yearNum = Number(parts.find((p) => p.type === "year")?.value);
    const dayHeb = numberToHebrewLetters(dayNum);
    const yearHeb = formatHebrewYear(yearNum);
    return `${dayHeb} ${monthName} ${yearHeb}`;
  };

  // חפיפות באותו יום (מקביל) – כמו בשבוע
  const layoutDayEvents = (dayEvents) => {
    const items = dayEvents
      .map((ev) => {
        const s0 = parseTime(ev.time_start);
        const e0 = parseTime(ev.time_end);
        if (s0 == null || e0 == null) return null;

        const s1 = Math.min(s0, e0);
        const e1 = Math.max(s0, e0);

        if (e1 <= startHour || s1 >= endHour) return null;

        const start = clamp(s1, startHour, endHour);
        const end = clamp(e1, startHour, endHour);

        return { ev, start, end };
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start || a.end - b.end);

    const clusters = [];
    let current = [];
    let clusterEnd = -Infinity;

    for (const it of items) {
      if (current.length === 0) {
        current = [it];
        clusterEnd = it.end;
        continue;
      }
      if (it.start < clusterEnd) {
        current.push(it);
        clusterEnd = Math.max(clusterEnd, it.end);
      } else {
        clusters.push(current);
        current = [it];
        clusterEnd = it.end;
      }
    }
    if (current.length) clusters.push(current);

    const result = [];
    for (const cluster of clusters) {
      const colEnd = [];
      const placed = [];

      for (const it of cluster) {
        let col = -1;
        for (let i = 0; i < colEnd.length; i++) {
          if (it.start >= colEnd[i]) {
            col = i;
            break;
          }
        }
        if (col === -1) {
          col = colEnd.length;
          colEnd.push(it.end);
        } else {
          colEnd[col] = it.end;
        }
        placed.push({ it, colIndex: col });
      }

      const colsInCluster = colEnd.length;
      for (const p of placed) {
        const top = (p.it.start - startHour) * rowHeight;
        const height = Math.max((p.it.end - p.it.start) * rowHeight, 26);
        result.push({
          ev: p.it.ev,
          top,
          height,
          colIndex: p.colIndex,
          colsInCluster,
        });
      }
    }

    return result;
  };

  const dayEvents = eventsByDate.get(selectedDateISO) || [];
  const layout = layoutDayEvents(dayEvents);

  const isToday = selectedDateISO === todayISO;

  return (
    <div
      className={[
        "w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden",
        isToday ? "ring-2 ring-[#295f8b]/30" : "",
      ].join(" ")}
      dir="rtl"
      onMouseEnter={() => onHoverDate?.(selectedDateISO)}
      onMouseLeave={() => onHoverDate?.(null)}
    >
      {/* Header יום */}
      <div className="relative border-b border-gray-200 bg-white px-4 py-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">{fullHebDayTitleFromISO(selectedDateISO)}</div>
          {/* אם תרצי להשאיר גם ISO קטן: */}
          {/* <div className="text-sm font-semibold text-gray-500">{selectedDateISO}</div> */}
        </div>

        <button
          onClick={() => onOpenAdd?.(selectedDateISO)}
          className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#295f8b] text-white text-xl font-bold hover:bg-[#1e4a6b] transition"
          title="הוספת אירוע"
          type="button"
        >
          +
        </button>

        {isToday && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-[#295f8b]/10 text-[#295f8b] text-xs font-extrabold">
            היום
          </span>
        )}
      </div>

      {/* גוף: שעות + עמודת אירועים */}
      <div
        className="grid"
        style={{
          // שעות מימין (ב־RTL זה מימין)
          gridTemplateColumns: `90px 1fr`,
        }}
      >
        {/* עמודת שעות */}
        <div className="bg-white" style={{ height: bodyHeight }}>
          {hours.map((h) => (
            <div
              key={h}
              className="flex items-start justify-center pt-3 text-sm font-bold text-gray-700"
              style={{ height: rowHeight }}
            >
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* אזור אירועים (ללא פסים אופקיים, כמו השבועי אחרי ההורדה) */}
        <div className="relative border-r border-gray-200 bg-white" style={{ height: bodyHeight }}>
          {layout.map(({ ev, top, height, colIndex, colsInCluster }) => {
            const gap = 8;
            const widthPct = 100 / colsInCluster;

            return (
              <button
                key={ev.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(ev);
                }}
                className="absolute rounded-xl text-white text-xs font-bold px-2 py-2 shadow-md overflow-hidden hover:brightness-110 transition"
                style={{
                  top,
                  height,
                  backgroundColor: getTypeColor(ev.type),
                  width: `calc(${widthPct}% - ${gap * 2}px)`,
                  right: `calc(${colIndex * widthPct}% + ${gap}px)`,
                }}
                title={`${ev.title} • ${ev.time_start || ""}-${ev.time_end || ""}`}
                type="button"
              >
                <div className="truncate">{ev.title}</div>
                <div className="text-[11px] font-semibold opacity-90">
                  {ev.time_start} - {ev.time_end}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
