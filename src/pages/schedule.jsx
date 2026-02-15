import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, startOfWeek, addDays } from "date-fns";
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getweeklySchedulesThunk } from "../redux/slices/SCHEDULE/getScheduleThunk";
import { addRealyLessonThunk } from "../redux/slices/LESSONS/addRealyLessonThunk";
import { getLessonsThunk } from "../redux/slices/LESSONS/getLessonsThunk";
import { useNavigate } from "react-router-dom";
import { getTopicsThunk } from "../redux/slices/TOPIC/getTopicsThunk";
import { getCoursesThunk } from "../redux/slices/COURSES/getCoursesThunk";
import HebrewDateSelector from "../components/HebrewDateSelector.jsx";
import HebrewDateShow from "../components/HebrewDateShow.jsx";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";

/**
 * קומפוננטת מערכת שבועית - מציגה את לוח השעות של כל הכיתות או כיתה ספציפית
 * התצוגה משתנה בהתאם לבחירת המשתמש:
 * - כל הכיתות: תצוגת אקסל עם טבלה נפרדת לכל יום
 * - כיתה ספציפית: טבלה שבועית מפורטת עם כל השיעורים
 */
export default function ScheduleViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDomain, setSelectedDomain] = useState("kodesh");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLesson, setModalLesson] = useState(null);
  const [modalCancelled, setModalCancelled] = useState(false);
  const [modalReason, setModalReason] = useState("");
  const navigate = useNavigate();
  const printTable = () => {
    window.print();
  };

  // מודל להוספת שיעור ידני
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLessonData, setNewLessonData] = useState({
    class_id: "",
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "",
    end_time: "",
    topic: "",
    topic_id: "",
    is_cancelled: false,
    cancellation_reason: "",
  });
  // Topic helpers: support topic_id and topic_name/topic, resolve name via teachers list if needed
  const getLessonTopicId = (lesson) => {
    return lesson?.topic_id ?? lesson?.topicId ?? null;
  };
  const getLessonTopicName = (lesson) => {
    const byField = lesson?.topic_name ?? lesson?.topic ?? "";
    if (byField) return byField;
    const tid = getLessonTopicId(lesson);
    if (tid != null) {
      const t = (teachers || []).find((x) => String(x.id) === String(tid));
      return t?.name ?? "";
    }
    return "";
  };
  const resolveTopicInfo = (lesson) => {
    const id = getLessonTopicId(lesson);
    const name = getLessonTopicName(lesson);
    return { id, name };
  };


  // קבלת נתונים מה-Redux store
  const lessons = useSelector((state) => state.lessons?.data ?? []); // שיעורים ספציפיים לתאריך
  const schedule = useSelector((state) => state.weekly_schedule?.data ?? []); // מערכת שבועית קבועה
  const classes = useSelector((state) => state.classes?.data ?? []); // רשימת כיתות
  const teachers = useSelector((state) => state.teacher?.data ?? []); // רשימת מקצועות/מורים
  const courses = useSelector((state) => state.courses?.data ?? []); // רשימת קורסים

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Hebrew date helpers (display + conversion)
  const HEB_MONTH_NAME_BY_INDEX = {
    1: "Tishrei",
    2: "Cheshvan",
    3: "Kislev",
    4: "Tevet",
    5: "Shevat",
    6: "Adar",
    7: "Nisan",
    8: "Iyar",
    9: "Sivan",
    10: "Tammuz",
    11: "Av",
    12: "Elul",
  };

  const hebFullFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatHebrewDateFromDate = (dateObj) => {
    if (!dateObj) return "";
    const parts = hebFullFormatter.formatToParts(dateObj);
    const dayNum = Number(parts.find((p) => p.type === "day")?.value);
    const monthName = parts.find((p) => p.type === "month")?.value || "";
    const yearNum = Number(parts.find((p) => p.type === "year")?.value);
    const dayHeb = numberToHebrewLetters(dayNum);
    const yearHeb = formatHebrewYear(yearNum);
    return `${dayHeb} ${monthName} ${yearHeb}`;
  };

  const formatHebrewDateFromISO = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return "";
    return formatHebrewDateFromDate(new Date(y, m - 1, d));
  };

  const convertHebFormattedToISO = async (hebFormatted) => {
    const [yStr, mStr, dStr] = String(hebFormatted).split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    const d = Number(dStr);

    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
      throw new Error("Invalid date parts");
    }

    if (y < 4000) {
      return `${yStr}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }

    const hmParam = HEB_MONTH_NAME_BY_INDEX[m] || mStr;
    const url = `https://www.hebcal.com/converter?cfg=json&h2g=1&strict=0&hy=${y}&hm=${encodeURIComponent(hmParam)}&hd=${d}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed heb->greg conversion");
    const data = await res.json();
    return `${data.gy}-${String(data.gm).padStart(2, "0")}-${String(data.gd).padStart(2, "0")}`;
  };

  const selectedDateISO = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );

  const dispatch = useDispatch();

  // טעינת נתוני כיתות ומערכת בעת טעינת הקומפוננטה
  useEffect(() => {
    dispatch(getClassesThunk());
    dispatch(getCoursesThunk());
    dispatch(getweeklySchedulesThunk());
    dispatch(getLessonsThunk());
    dispatch(getTopicsThunk());
  }, [dispatch]);

  useEffect(() => {
    setSelectedClassId("");
  }, [selectedDomain]);

  const normalizeDomain = (value) => {
    const v = String(value || "").toLowerCase();
    if (v === "horaa") return "horaah";
    if (v === "hitmahut") return "hitmachuyot";
    return v;
  };

  // Handle Hebrew date selection from flexcal
  const handleHebCommit = async (hebFormatted) => {
    try {
      const iso = await convertHebFormattedToISO(hebFormatted);
      const [y, m, d] = iso.split("-").map(Number);
      setSelectedDate(new Date(y, m - 1, d));
    } catch {
      // ignore invalid selection
    }
  };

  const getDomainKey = (type) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("kodesh")) return "kodesh";
    if (t.includes("hitmachuyot") || t.includes("hitmahut")) return "hitmachuyot";
    if (t.includes("horaah") || t.includes("horaa")) return "horaah";
    return normalizeDomain(t);
  };

  const domainCourseIds = useMemo(() => {
    if (!selectedDomain) return new Set();
    return new Set(
      (courses || [])
        .filter((c) => getDomainKey(c?.type) === selectedDomain)
        .map((c) => String(c.id))
    );
  }, [courses, selectedDomain]);

  const filteredClasses = useMemo(() => {
    if (!selectedDomain) return classes;
    if (domainCourseIds.size === 0) return [];
    return (classes || []).filter((cls) => domainCourseIds.has(String(cls.course_id ?? cls.courseId)));
  }, [classes, domainCourseIds, selectedDomain]);

  const filteredTeachers = useMemo(() => {
    if (!selectedDomain) return teachers;
    if (domainCourseIds.size === 0) return [];
    return (teachers || []).filter((t) => domainCourseIds.has(String(t.course_id)));
  }, [teachers, domainCourseIds, selectedDomain]);

  const domainClasses = useMemo(() => {
    if (filteredClasses.length > 0) return filteredClasses;
    if (selectedDomain === "kodesh") {
      return classes.filter((cls) => cls.id >= 14 && cls.id <= 22);
    }
    return filteredClasses;
  }, [filteredClasses, classes, selectedDomain]);

  const domainTeachers = useMemo(() => {
    if (!selectedDomain) return teachers;
    if (domainCourseIds.size === 0) return [];
    return filteredTeachers;
  }, [filteredTeachers, teachers, selectedDomain, domainCourseIds]);

  const domainClassIds = useMemo(
    () => new Set(domainClasses.map((c) => String(c.id))),
    [domainClasses]
  );

  const isDomainView = !selectedClassId;
  const domainTitle = useMemo(() => {
    if (selectedDomain === "kodesh") return "לימודי קודש";
    if (selectedDomain === "horaah") return "לימודי הוראה";
    if (selectedDomain === "hitmachuyot") return "לימודי התמחות";
    return "מערכת";
  }, [selectedDomain]);


  // פתיחת מודל לאישור/ביטול שיעור
  const openLessonModal = (lesson, date, classIdOverride) => {
    const classId = classIdOverride ?? lesson.class_id;
    const { id: topicIdResolved, name: topicNameResolved } = resolveTopicInfo(lesson);
    const payload = {
      class_id: classId,
      date: format(date, "yyyy-MM-dd"),
      start_time: lesson.start_time || "",
      end_time: lesson.end_time || "",
      topic: topicNameResolved || "",
      topic_id: topicIdResolved ?? "",
      is_cancelled: false,
      cancellation_reason: "",
    };
    console.log("Setting modal with payload:", payload);
    setModalLesson(payload);
    setModalCancelled(false);
    setModalReason("");
    setModalOpen(true);
  };

  const closeLessonModal = () => {
    console.log("Closing modal");
    setModalOpen(false);
    setModalLesson(null);
    setModalCancelled(false);
    setModalReason("");
  };

  const confirmLessonModal = () => {
    if (!modalLesson) return;
    // הימנעות מכפילות: בדיקה אם כבר קיים שיעור זהה (כיתה+תאריך+שעת התחלה)
    const exists = lessons.find(
      (l) =>
        String(l.class_id) === String(modalLesson.class_id) &&
        l.date === modalLesson.date &&
        l.start_time === modalLesson.start_time
    );
    if (exists) {
      alert("שיעור זה כבר קיים ב-LESSONS עבור תאריך ושעה אלו.");
      closeLessonModal();
      return;
    }
    const finalPayload = {
      ...modalLesson,
      is_cancelled: modalCancelled,
      cancellation_reason: modalCancelled ? (modalReason || "התקבל ביטול ללא סיבה") : "",
    };
    dispatch(addRealyLessonThunk(finalPayload));
    closeLessonModal();
  };

  // אישור כל השיעורים ביום הנבחר (לפי מצב תצוגה)
  const confirmAllLessonsForDate = () => {
    const date = selectedDate;
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOfWeek = date.getDay();

    // סינון מתוך המערכת השבועית ליום זה + לפי תצוגה (כיתה או לימודי קודש)
    const weeklyForDay = schedule.filter((s) => s.day_of_week === dayOfWeek && s.year === selectedYear);
    const filteredWeekly = isDomainView
      ? weeklyForDay.filter((s) => domainClassIds.has(String(s.class_id)))
      : weeklyForDay.filter((s) => String(s.class_id) === String(selectedClassId));

    // שיעורים שכבר קיימים ביום זה (כדי להימנע מכפילות)
    const realOnDate = lessons.filter((l) => l.date === dateStr);

    if (filteredWeekly.length === 0) {
      alert("אין שיעורים במערכת ביום זה.");
      return;
    }

    const ok = window.confirm(
      `לאשר ${filteredWeekly.length} שיעורים ליום ${format(date, "dd/MM/yyyy")}?`
    );
    if (!ok) return;

    filteredWeekly.forEach((lesson) => {
      const exists = realOnDate.find(
        (l) =>
          String(l.class_id) === String(lesson.class_id) &&
          l.start_time === lesson.start_time &&
          l.end_time === lesson.end_time
      );
      if (!exists) {
        const { id: topicIdResolved, name: topicNameResolved } = resolveTopicInfo(lesson);
        const payload = {
          class_id: lesson.class_id,
          date: dateStr,
          start_time: lesson.start_time || "",
          end_time: lesson.end_time || "",
          topic: topicNameResolved || "",
          topic_id: topicIdResolved ?? "",
          is_cancelled: false,
          cancellation_reason: "",
        };
        dispatch(addRealyLessonThunk(payload));
      }
    });

    // רענון אופציונלי
    setTimeout(() => dispatch(getLessonsThunk()), 0);
  };
  const openComponent = () => {
    navigate("/WeeklyScheduleEditor");
  };
  // פתיחת מודל הוספת שיעור ידני
  const openAddLessonModal = () => {
    const defaultClassId = selectedClassId || domainClasses[0]?.id || "";
    setNewLessonData({
      class_id: defaultClassId || "",
      date: selectedDateISO,
      start_time: "",
      end_time: "",
      year: selectedYear,
      topic: "",
      topic_id: "",
      is_cancelled: false,
      cancellation_reason: "",
    });
    setAddModalOpen(true);
  };

  const closeAddLessonModal = () => {
    setAddModalOpen(false);
  };

  const confirmAddLessonModal = () => {
    if (!newLessonData.class_id || !newLessonData.date || !newLessonData.start_time || !newLessonData.end_time) {
      alert("יש למלא כיתה, תאריך, שעת התחלה ושעת סיום.");
      return;
    }
    // הימנעות מכפילות בעת הוספה ידנית
    const exists = lessons.find(
      (l) =>
        String(l.class_id) === String(newLessonData.class_id) &&
        l.date === newLessonData.date &&
        l.start_time === newLessonData.start_time
    );
    if (exists) {
      alert("שיעור זה כבר קיים ב-LESSONS עבור תאריך ושעה אלו.");
      return;
    }
    // Ensure topic text matches selected topic_id when available
    let payload = { ...newLessonData };
    if (payload.topic_id && !payload.topic) {
      const t = (teachers || []).find((x) => String(x.id) === String(payload.topic_id));
      if (t?.name) payload.topic = t.name;
    }
    dispatch(addRealyLessonThunk(payload));
    setAddModalOpen(false);
  };

  // יצירת מערך של 6 ימים (ראשון עד שישי, ללא שבת)
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 6 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  /**
   * פונקציה לעיצוב שעה - מסירה שניות מהתצוגה
   * @param {string} timeStr - שעה בפורמט HH:MM:SS או HH:MM
   * @returns {string} - שעה בפורמט HH:MM
   */
  const formatTime = (timeStr = "") => {
    return timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr;
  };

  /**
   * פונקציה לקבלת כל השיעורים ליום מסוים
   * תחילה מחפשת שיעורים ספציפיים לתאריך, אם אין - מחזירה מהמערכת הקבועה
   * @param {Date} date - התאריך המבוקש
   * @returns {Array} - מערך שיעורים
   */
  const getDailyLessons = (date) => {
    const dayOfWeek = date.getDay();
    const dateStr = format(date, "yyyy-MM-dd");

    // Real lessons for the specific date
    const realLessons = lessons.filter((l) => l.date === dateStr);
    const filteredByClass = selectedClassId
      ? realLessons.filter((l) => String(l.class_id) === String(selectedClassId))
      : realLessons.filter((l) => domainClassIds.has(String(l.class_id)));

    // Weekly schedule lessons for the day
    const weeklyByDay = schedule.filter((s) => s.day_of_week === dayOfWeek && s.year === selectedYear);
    const filteredWeekly = selectedClassId
      ? weeklyByDay.filter((s) => String(s.class_id) === String(selectedClassId))
      : weeklyByDay.filter((s) => domainClassIds.has(String(s.class_id)));

    // Combine lessons, marking their status for weekly-defined slots
    const combinedLessons = filteredWeekly.map((lesson) => {
      const realLesson = filteredByClass.find(
        (l) =>
          l.class_id === lesson.class_id &&
          l.start_time === lesson.start_time &&
          l.end_time === lesson.end_time
      );

      if (realLesson) {
        return {
          ...realLesson,
          status: realLesson.is_cancelled ? "canceled" : "held",
        };
      }

      return { ...lesson, status: "tentative" };
    });

    // Add real lessons that do not exist in weekly schedule slots (standalone additions)
    const weeklyKeys = new Set(
      filteredWeekly.map((w) => `${w.class_id}|${w.start_time}|${w.end_time}`)
    );
    const extraReal = filteredByClass.filter(
      (l) => !weeklyKeys.has(`${l.class_id}|${l.start_time}|${l.end_time}`)
    );
    const extraRealMapped = extraReal.map((l) => ({
      ...l,
      status: l.is_cancelled ? "canceled" : "held",
    }));

    return [...combinedLessons, ...extraRealMapped];
  };

  /**
   * פונקציה לאיסוף כל שעות השיעורים בשבוע (למיון השורות בטבלה)
   * @returns {Array} - מערך ממוין של שעות התחלה
   */
  const getAllTimes = useMemo(() => {
    const times = new Set();

    weekDays.forEach((day) => {
      getDailyLessons(day).forEach((lesson) => {
        if (lesson.start_time) times.add(lesson.start_time);
      });
    });

    return Array.from(times).sort();
  }, [weekDays, schedule, lessons, selectedClassId, domainClassIds]);

  /**
   * פונקציה לקבלת כל השיעורים בשעה מסוימת ביום מסוים
   * (שימושי כאשר יש כמה כיתות באותה שעה)
   * @param {Date} date - התאריך
   * @param {string} time - שעת ההתחלה
   * @returns {Array} - מערך שיעורים
   */
  const getLessonsAtTime = (date, time) => {
    return getDailyLessons(date).filter((lesson) => lesson.start_time === time);
  };

  // שמות הימים בעברית
  const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];

  /**
   * פונקציה לקבלת שם כיתה לפי מזהה
   * @param {number} classId - מזהה הכיתה
   * @returns {string} - שם הכיתה
   */
  const getClassName = (classId) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "לא ידוע";
  };
  const selectedClassName = selectedClassId ? getClassName(Number(selectedClassId)) : domainTitle;

  /**
   * פונקציה לקבלת שיעור ספציפי לפי כיתה, יום ושעה
   * (שימוש בתצוגת האקסל)
   * @param {number} classId - מזהה הכיתה
   * @param {number} dayOfWeek - יום בשבוע (0-6)
   * @param {string} time - שעת התחלה
   * @returns {Object|null} - אובייקט שיעור או null
   */
  const getLessonForClassAndTime = (classId, dayOfWeek, time) => {
    const dayLessons = schedule.filter(
      (s) => s.day_of_week === dayOfWeek && s.class_id === classId && s.start_time === time
        && s.year === selectedYear
    );
    return dayLessons[0] || null;
  };


  /**
   * תצוגה 1: לימודי קודש - סגנון אקסל
   * כאשר נבחר "לימודי קודש", מציגים טבלה נפרדת לכל יום עם כיתות 14-22
   * כל טבלה מכילה את כיתות לימודי קודש בעמודות ואת השעות בשורות
   */
  if (isDomainView) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-28 font-sans [direction:rtl]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* כותרת וסרגל בקרה */}
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100" dir="rtl">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0A3960]">מערכת {domainTitle} שנתי/תש״פ</h2>
            <p className="text-sm text-gray-500 mt-1">ניהול מערכת לפי תחום הלימוד</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-wrap gap-4 items-center" dir="rtl">
            {/* בחירת תחום */}
            <div className="flex items-center gap-2">
              <label className="font-semibold text-sm">בחר תחום:</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                <option value="kodesh">קודש</option>
                <option value="horaah">הוראה</option>
                <option value="hitmachuyot">התמחויות</option>
              </select>
            </div>
            {/* בחירת תאריך עברי */}
            <label className="text-sm font-semibold text-gray-700">בחר תאריך:</label>
            <div className="flex items-center gap-3">
              <HebrewDateSelector id="schedule-heb-date-domain" onCommit={handleHebCommit} />
              <HebrewDateShow isoDate={selectedDateISO} />
            </div>
            <span className="text-sm text-gray-500">
              {formatHebrewDateFromDate(weekDays[0])} - {formatHebrewDateFromDate(weekDays[5])}
            </span>

            {/* פעולות מהירות */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                className="bg-emerald-600 text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90"
                onClick={confirmAllLessonsForDate}
              >
                אשר כל השיעורים ביום
              </button>
              <button
                className="bg-[#0A3960] text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90"
                onClick={openAddLessonModal}
              >
                הוסף שיעור בתאריך
              </button>
              <button
                className="border border-[#0A3960] text-[#0A3960] font-semibold rounded-xl px-5 py-2 text-sm shadow-sm hover:bg-[#0A3960] hover:text-white"
                onClick={openComponent}
              >
                עריכת מערכת חדשה
              </button>
            </div>
            {/* בחירת שנה */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">שנה:</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 min-w-24"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* בחירת כיתה */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="text-sm font-semibold text-gray-700">בחר כיתה:</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 min-w-48"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">כל הכיתות בתחום</option>
                {domainClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* לולאה על כל ימי השבוע - טבלה נפרדת לכל יום */}
          <div className="space-y-8">
            {weekDays.map((day) => {
              const dayOfWeek = day.getDay();
              // סינון שיעורים רק ליום זה ורק לכיתות לימודי קודש (14-22)
              const daySchedule = schedule.filter(
                (s) => s.day_of_week === dayOfWeek && domainClassIds.has(String(s.class_id))
                  && s.year === selectedYear
              );
              // שיעורים אמיתיים מתוך LESSONS עבור תאריך זה ולכיתות לימודי קודש
              const dateStr = format(day, "yyyy-MM-dd");
              const realForDay = lessons.filter(
                (l) => l.date === dateStr && domainClassIds.has(String(l.class_id))
              );
              // איסוף כל השעות ביום זה (ללא כפילויות)
              const times = [
                ...new Set([
                  ...daySchedule.map((s) => s.start_time),
                  ...realForDay.map((l) => l.start_time),
                ]),
              ].sort();

              // אם אין שיעורים ביום זה - דלג עליו
              if (times.length === 0) return null;

              return (
                <div key={day.toISOString()} className="bg-white rounded-xl shadow ring-1 ring-black/5 p-5">
                  {/* כותרת יום */}
                  <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#0A3960]">
                      {dayNames[dayOfWeek]} - {formatHebrewDateFromDate(day)}
                    </h3>
                    {/* תגית מיוחדת לימי ראשון ורביעי */}
                    {[0, 3].includes(dayOfWeek) && (
                      <span className="text-xs font-semibold text-[#0A3960] bg-blue-50 px-3 py-1 rounded-full">
                        {dayOfWeek === 0 ? "לימודי הוראה" : "לימודי התמחות"}
                      </span>
                    )}
                  </div>

                  {/* טבלת היום: עמודות = כיתות, שורות = שעות */}
                  <div className="overflow-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#0A3960]">
                          <th className="border border-gray-300 p-2 text-white font-bold w-20">שעה</th>
                          {/* עמודה לכל כיתת לימודי קודש */}
                          {domainClasses.map((cls) => (
                            <th
                              key={cls.id}
                              className="border border-gray-300 p-2 text-white font-semibold min-w-32"
                            >
                              {cls.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* שורה לכל שעה */}
                        {times.map((time, idx) => (
                          <tr key={time} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="border border-gray-300 p-2 text-center font-semibold text-gray-700 bg-gray-100">
                              {formatTime(time)}
                            </td>
                            {/* תא לכל כיתת לימודי קודש בשעה זו */}
                            {domainClasses.map((cls) => {
                              const lesson = getLessonForClassAndTime(cls.id, dayOfWeek, time);
                              const realLesson = realForDay.find(
                                (l) => String(l.class_id) === String(cls.id) && l.start_time === time
                              );
                              return (
                                <td
                                  key={cls.id}
                                  className="border border-gray-300 p-2 text-center align-middle"
                                >
                                  {realLesson ? (
                                    <div
                                      className={`font-medium cursor-pointer hover:opacity-90 px-2 py-1 rounded inline-block ${realLesson.is_cancelled
                                          ? "bg-red-50 text-red-700 border border-red-200"
                                          : "bg-green-50 text-green-700 border border-green-200"
                                        }`}
                                      onClick={() => openLessonModal(realLesson, day, cls.id)}
                                      title="שיעור מתוך LESSONS — לחץ לעדכון/ביטול"
                                    >
                                      {getLessonTopicName(realLesson) || "ללא נושא"}
                                    </div>
                                  ) : lesson ? (
                                    <div
                                      className="text-gray-800 font-medium cursor-pointer hover:text-indigo-700"
                                      onClick={() => openLessonModal(lesson, day, cls.id)}
                                      title="לחץ לאישור/ביטול שיעור"
                                    >
                                      {getLessonTopicName(lesson) || "-"}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 text-sm italic">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* מודל הוספת שיעור ידני */}
        {addModalOpen && (
          <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center px-4" dir="rtl">
            <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-[#0A3960] mb-4">הוספת שיעור לתאריך</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <label className="flex flex-col">
                  <span className="font-semibold mb-1">כיתה</span>
                  <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={newLessonData.class_id}
                    onChange={(e) => setNewLessonData({ ...newLessonData, class_id: e.target.value })}
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col">
                  <span className="font-semibold mb-1">תאריך</span>
                  <div className="flex items-center gap-2">
                    <HebrewDateSelector
                      id="add-lesson-date-domain"
                      onCommit={async (hebFormatted) => {
                        try {
                          const iso = await convertHebFormattedToISO(hebFormatted);
                          setNewLessonData({ ...newLessonData, date: iso });
                        } catch {}
                      }}
                    />
                    <HebrewDateShow isoDate={newLessonData.date} />
                  </div>
                </label>
                <label className="flex flex-col">
                  <span className="font-semibold mb-1">שעת התחלה</span>
                  <input
                    type="time"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={newLessonData.start_time}
                    onChange={(e) => setNewLessonData({ ...newLessonData, start_time: e.target.value })}
                  />
                </label>
                <label className="flex flex-col">
                  <span className="font-semibold mb-1">שעת סיום</span>
                  <input
                    type="time"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={newLessonData.end_time}
                    onChange={(e) => setNewLessonData({ ...newLessonData, end_time: e.target.value })}
                  />
                </label>
                <label className="flex flex-col">
                  <span className="font-semibold mb-1">מורה/מקצוע</span>
                  <select
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={newLessonData.topic_id}
                    onChange={(e) => {
                      const val = e.target.value;
                      const t = (domainTeachers || teachers || []).find((x) => String(x.id) === String(val));
                      setNewLessonData({
                        ...newLessonData,
                        topic_id: val,
                        topic: t?.name || newLessonData.topic,
                      });
                    }}
                  >
                    <option value="">בחרי</option>
                    {domainTeachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col">
                  <span className="font-semibold mb-1">נושא (טקסט חופשי)</span>
                  <input
                    type="text"
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="לדוגמה: דקדוק - זמנים"
                    value={newLessonData.topic}
                    onChange={(e) => setNewLessonData({ ...newLessonData, topic: e.target.value })}
                  />
                </label>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="bg-[#0A3960] text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90" onClick={confirmAddLessonModal}>אישור</button>
                <button className="border border-gray-300 text-gray-700 font-semibold rounded-xl px-5 py-2 text-sm hover:bg-gray-50" onClick={closeAddLessonModal}>ביטול</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * תצוגה 2: כיתה ספציפית - טבלה שבועית מפורטת
   * כאשר נבחרה כיתה, מציגים טבלה אחת עם כל ימי השבוע כעמודות
   */
  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-28 font-sans [direction:rtl]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* כותרת וסרגל בקרה */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100" dir="rtl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A3960]">מערכת שבועית</h2>
          <p className="text-sm text-gray-500 mt-1">ניהול מערכת שבועית לפי כיתה</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-wrap gap-4 items-center" dir="rtl">
          {/* בחירת תחום */}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-sm">בחר תחום:</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <option value="kodesh">קודש</option>
              <option value="horaah">הוראה</option>
              <option value="hitmachuyot">התמחויות</option>
            </select>
          </div>
          {/* בחירת תאריך עברי */}
          <label className="text-sm font-semibold text-gray-700">בחר תאריך:</label>
          <div className="flex items-center gap-3">
            <HebrewDateSelector id="schedule-heb-date-class" onCommit={handleHebCommit} />
            <HebrewDateShow isoDate={selectedDateISO} />
          </div>
          <span className="text-sm text-gray-500">
            {formatHebrewDateFromDate(weekDays[0])} - {formatHebrewDateFromDate(weekDays[5])}
          </span>

          {/* פעולות מהירות */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="bg-emerald-600 text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90"
              onClick={confirmAllLessonsForDate}
            >
              אשר כל השיעורים ביום
            </button>
            <button
              className="bg-[#0A3960] text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90"
              onClick={openAddLessonModal}
            >
              הוסף שיעור בתאריך
            </button>
            <button
              className="border border-[#0A3960] text-[#0A3960] font-semibold rounded-xl px-5 py-2 text-sm shadow-sm hover:bg-[#0A3960] hover:text-white"
              onClick={printTable}
            >
              הדפס טבלה
            </button>
            {/* בחירת שנה */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">שנה:</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 min-w-24"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* בחירת כיתה */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm font-semibold text-gray-700">בחר כיתה:</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 min-w-48"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">כל הכיתות בתחום</option>
              {domainClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* טבלת מערכת שבועית */}
        <div id="print-section" className="overflow-auto bg-white rounded-xl shadow ring-1 ring-black/5 p-4">
          {/* כותרת הדפסה בלבד: שם הכיתה */}
          <div className="print-only hidden text-center text-2xl font-bold py-4">
            מערכת שבועית - {selectedClassName}
          </div>
          <table className="w-full border-collapse">
            {/* כותרת טבלה - ימי השבוע */}
            <thead>
              <tr className="bg-[#0A3960]">
                <th className="border border-gray-300 p-4 text-white text-sm font-bold w-24">שעה</th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className="border border-gray-300 p-4 text-white font-bold min-w-44"
                  >
                    <div className="text-lg">{dayNames[day.getDay()]}</div>
                    <div className="text-sm font-normal">
                      {formatHebrewDateFromDate(day)}
                    </div>
                    {/* תגית מיוחדת לימי ראשון ורביעי */}
                    {[0, 3].includes(day.getDay()) && (
                      <div className="mt-1 text-xs font-semibold text-blue-100">
                        {day.getDay() === 0 ? "לימודי הוראה" : "לימודי התמחות"}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* גוף הטבלה - שורות לפי שעות */}
            <tbody>
              {getAllTimes.length > 0 ? (
                getAllTimes.map((time, idx) => (
                  <tr
                    key={time}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                  >
                    {/* Time column */}
                    <td className="border border-gray-300 p-4 font-semibold text-center bg-gray-100 text-gray-700">
                      {formatTime(time)}
                    </td>
                    {/* Lessons for each day */}
                    {weekDays.map((day) => {
                      const lessonsAtSlot = getLessonsAtTime(day, time);
                      return (
                        <td
                          key={`${day.toISOString()}-${time}`}
                          className="border border-gray-300 p-4 align-top"
                        >
                          {lessonsAtSlot.length > 0 ? (
                            <div className="space-y-3">
                              {lessonsAtSlot.map((lesson) => (
                                <div
                                  key={`${lesson.id ?? lesson.class_id}-${time}`}
                                  className={`bg-gradient-to-br border-2 rounded-lg p-4 hover:shadow-md transition cursor-pointer ${lesson.status === "tentative"
                                      ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                                      : lesson.status === "held"
                                        ? "bg-green-50 border-green-300 text-green-800"
                                        : "bg-red-50 border-red-300 text-red-800"
                                    }`}
                                  onClick={() => openLessonModal(lesson, day)}
                                  title="לחץ לאישור/ביטול שיעור"
                                >
                                  <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                                    <span>{formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}</span>
                                  </div>
                                  <div className="font-bold text-sm">
                                    {getLessonTopicName(lesson) || "ללא נושא"}
                                  </div>

                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-300 text-center text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="border border-gray-300 p-8 text-center text-gray-500">
                    אין שיעורים בשבוע זה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* הערה תחתונה */}
      <div className="max-w-7xl mx-auto">
        <div className="mt-6 p-4 bg-white rounded-xl shadow text-sm text-gray-700">
          <p>
            <span className="font-semibold">הערה:</span> הטבלה מציגה את כל השיעורים מלוח השעות השבועי, כולל עדכונים והשיעורים הנוכחיים.
          </p>
        </div>
      </div>

      {/* מודל אישור/ביטול שיעור - מחוץ לתוך max-w-7xl כדי להיות מעל הכל */}

      {
        modalOpen && modalLesson && (
          <div
            className="fixed inset-0 z-[80] bg-black/40 flex items-center justify-center px-4"
            dir="rtl"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                confirmLessonModal();
              }
            }}
            tabIndex={0}
          >
            <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-[#0A3960] mb-4">אישור שיעור לתאריך נבחר</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div><span className="font-semibold">כיתה:</span> {getClassName(Number(modalLesson.class_id))}</div>
                <div><span className="font-semibold">תאריך:</span> {formatHebrewDateFromISO(modalLesson.date)} ({modalLesson.date})</div>
                <div><span className="font-semibold">שעה:</span> {formatTime(modalLesson.start_time)} - {formatTime(modalLesson.end_time)}</div>
                <div><span className="font-semibold">נושא:</span> {modalLesson.topic || 'ללא נושא'}</div>

              </div>

              <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-110"
                    checked={modalCancelled}
                    onChange={(e) => setModalCancelled(e.target.checked)}
                  />
                  <span className="font-semibold">סמן אם השיעור מבוטל</span>
                </label>
                {modalCancelled && (
                  <textarea
                    className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="סיבת ביטול (חובה)"
                    value={modalReason}
                    onChange={(e) => setModalReason(e.target.value)}
                  />
                )}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={confirmLessonModal}
                  className="bg-[#0A3960] text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90"
                >
                  אשר (ENTER)
                </button>
                <button
                  onClick={closeLessonModal}
                  className="border border-gray-300 text-gray-700 font-semibold rounded-xl px-5 py-2 text-sm hover:bg-gray-50"
                >
                  סגור
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">בברירת מחדל (ENTER) השיעור מאושר לתאריך זה.</div>
            </div>
          </div>
        )
      }
      {/* מודל הוספת שיעור ידני */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center px-4" dir="rtl">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-[#0A3960] mb-4">הוספת שיעור לתאריך</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col">
                <span className="font-semibold mb-1">כיתה</span>
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={newLessonData.class_id}
                  onChange={(e) => setNewLessonData({ ...newLessonData, class_id: e.target.value })}
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                <span className="font-semibold mb-1">תאריך</span>
                <div className="flex items-center gap-2">
                  <HebrewDateSelector
                    id="add-lesson-date-class"
                    onCommit={async (hebFormatted) => {
                      try {
                        const iso = await convertHebFormattedToISO(hebFormatted);
                        setNewLessonData({ ...newLessonData, date: iso });
                      } catch {}
                    }}
                  />
                  <HebrewDateShow isoDate={newLessonData.date} />
                </div>
              </label>
              <label className="flex flex-col">
                <span className="font-semibold mb-1">שעת התחלה</span>
                <input
                  type="time"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={newLessonData.start_time}
                  onChange={(e) => setNewLessonData({ ...newLessonData, start_time: e.target.value })}
                />
              </label>
              <label className="flex flex-col">
                <span className="font-semibold mb-1">שעת סיום</span>
                <input
                  type="time"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  value={newLessonData.end_time}
                  onChange={(e) => setNewLessonData({ ...newLessonData, end_time: e.target.value })}
                />
              </label>
              <label className="flex flex-col col-span-2">
                <span className="font-semibold mb-1">נושא (אופציונלי)</span>
                <input
                  type="text"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="לדוגמה: דקדוק - זמנים"
                  value={newLessonData.topic}
                  onChange={(e) => setNewLessonData({ ...newLessonData, topic: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="bg-[#0A3960] text-white font-semibold rounded-xl px-5 py-2 text-sm shadow hover:opacity-90" onClick={confirmAddLessonModal}>אישור</button>
              <button className="border border-gray-300 text-gray-700 font-semibold rounded-xl px-5 py-2 text-sm hover:bg-gray-50" onClick={closeAddLessonModal}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}
