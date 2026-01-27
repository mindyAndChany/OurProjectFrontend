import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLessonsThunk } from "../redux/slices/LESSONS/getLessonsThunk";
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import HebrewDateSelector from "../components/HebrewDateSelector.jsx";
import { HebrewDateShow } from "../components/HebrewDateShow.jsx";
import { getAttendanceByLessonThunk } from "../redux/slices/ATTENDANCE/getAttendanceByLessonThunk";
import { addAttendanceThunk } from "../redux/slices/ATTENDANCE/addAttendanceThunk";
import { setAttendanceForLesson } from "../redux/slices/ATTENDANCE/attendanceSlice";
import { updateAttendanceThunk } from "../redux/slices/ATTENDANCE/updateAttendanceThunk.js";
import { getTeachersThunk } from "../redux/slices/TEACHERS/getTeachersThunk.js";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";

const Cell = ({ children, className = "", stickyRight = false }) => (
  <td
    className={
      `border border-black px-3 py-2 text-center align-middle text-sm ` +
      (stickyRight ? "sticky right-0 bg-white z-20" : "") +
      (className ? ` ${className}` : "")
    }
  >
    {children || ""}
  </td>
);

function StatusSelect({ value, onChange, disabled }) {
  const tone =
    value === "present"
      ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
      : value === "late"
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : value === "approved absent"
      ? "bg-sky-50 text-sky-900 ring-sky-200"
      : value === "absent"
      ? "bg-rose-50 text-rose-900 ring-rose-200"
      : "bg-white text-gray-900 ring-gray-200";

  return (
    <select
      className={`w-full min-w-[120px] rounded-md border-0 px-2 py-1 text-sm shadow-sm ring-1 ${tone} disabled:opacity-60`}
      value={value}
      disabled={disabled}
      onChange={onChange}
    >
      <option value="">—</option>
      <option value="present">נוכחת</option>
      <option value="late">מאחרת</option>
      <option value="absent">חסרה</option>
      <option value="approved absent">חסרה באישור</option>
    </select>
  );
}

export const Screen = () => {
  const dispatch = useDispatch();
  const [selectedClassId, setSelectedClassId] = useState("ה'1");
  const [selectedDateISO, setSelectedDateISO] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  // Selectors to fetch data from Redux Store
  const classes = useSelector((state) => state.classes?.data || []);
  const students = useSelector((state) => state.student.studentsData || []);
  const lessons = useSelector((state) => state.lessons?.data || []);
  const teachers = useSelector((state) => state.teacher?.data || []);
  const attendanceByLesson = useSelector((state) => state.attendance?.byLesson || {});
  const attendanceIdsByLesson = useSelector((state) => state.attendance?.idsByLesson || {});
  const prefilledLessonsRef = useRef(new Set());
  const [viewMode, setViewMode] = useState("class"); // options: 'class' | 'teacher' | 'student'
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [lessonsError, setLessonsError] = useState("");
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [teachersError, setTeachersError] = useState("");
  const [pendingAttendanceIds, setPendingAttendanceIds] = useState(new Set());
  const [attendanceErrorByLesson, setAttendanceErrorByLesson] = useState({});
  const selectedTeacherName = useMemo(() => {
    const t = (teachers || []).find((x) => String(x.id) === String(selectedTeacher));
    return t?.name || "";
  }, [teachers, selectedTeacher]);
  const selectedStudent = useMemo(() => {
    const s = (students || []).find((x) => String(x.id) === String(selectedStudentId));
    if (!s) return null;
    const id = s.id ?? s.id_number ?? null; // העדפה ל-ID הסדרתי כדי להתאים לרישומי נוכחות
    const name = s.name ?? [s.first_name, s.last_name].filter(Boolean).join(" ");
    return id && name ? { id, name, class_kodesh: s.class_kodesh } : null;
  }, [students, selectedStudentId]);

  function getLessonTopicId(lesson) {
    return lesson?.topic_id ?? lesson?.topicId ?? undefined;
  }
  function getLessonTopicName(lesson) {
    return lesson?.topic_name ?? lesson?.topic ?? lesson?.topicName ?? "";
  }


  //בכותרת בוחרים לפי מה להציג את הנוכחות:
  //  יומן כיתה-כשניגשים למסך בוחרים תאריך (יום או שבוע) וכיתה ולפי זה מופיעה טבלה שכותרותיה הם השיעורים והמטלות/ מבחנים שעודכנו והשורות הם התלמידות ובפנים מזינים נוכחות. 
  // ואם עוד לא עודכן מה השיעורים שהתבצעו בפועל. וצריך קודם כל לעדכן האם התקיים השיעור ואם כן האם הפרטים כפי המתוכנן.
  // יומן מורה-בוחרים מורה וכיתה ומקבלים נוכחות של הכיתה בשיעורי המורה כולל סיכום אחוזים לכל תלמידה.בכל המחצית.
  // יומן תלמידה -רואים לבת מסוימת אחוזי נוכחות בכל המחצית בכל המקצועות.

  // Initial data load
  useEffect(() => {
    dispatch(getClassesThunk());
    dispatch(getStudentDataThunk("id,id_number,first_name,last_name,class_kodesh"));
    setIsLoadingLessons(true);
    setLessonsError("");
    dispatch(getLessonsThunk())
      .unwrap()
      .catch((e) => setLessonsError(e?.message || "שגיאה בטעינת שיעורים"))
      .finally(() => setIsLoadingLessons(false));
    setIsLoadingTeachers(true);
    setTeachersError("");
    dispatch(getTeachersThunk())
      .unwrap()
      .catch((e) => setTeachersError(e?.message || "שגיאה בטעינת מורים"))
      .finally(() => setIsLoadingTeachers(false));

  }, [dispatch]);

  // שם הכיתה הנבחרת (נגזר מה-ID לביצוע התאמות מול תלמידות)
  const selectedClassName = useMemo(() => {
    if (!selectedClassId) return "";
    const cls = classes.find((c) => String(c.id) === String(selectedClassId));
    const className = cls?.name || "";
    const cleaned = className.replace(/'/g, "");
    console.log("cleaned", cleaned);
    return cleaned;
  }, [classes, selectedClassId]);

  // שמות תלמידות לפי כיתה 
  const studentsByClass = useMemo(() => {
    if (!Array.isArray(students) || !selectedClassName) return [];
    return students
      .filter((s) => String(s.class_kodesh) === String(selectedClassName))
      .map((s) => {
        const id = s.id ?? s.id_number ?? null; // העדפה ל-ID הסדרתי כדי להתאים לרישומי נוכחות
        const name = s.name ?? [s.first_name, s.last_name].filter(Boolean).join(" ");
        return id && name ? { id, name } : null;
      })
      .filter(Boolean);
  }, [students, selectedClassName]);

  const filteredLessons = useMemo(() => {
    const base = lessons.filter((l) => {
      if (viewMode === "class") {
        return selectedClassId && String(l.class_id) === String(selectedClassId) && l.date === selectedDateISO;
      } 
      else if (viewMode === "teacher") {
        const matchesClass = selectedClassId && String(l.class_id) === String(selectedClassId);
        const lessonTopicId = getLessonTopicId(l);
        const lessonTopicName = getLessonTopicName(l);
        if (!selectedTeacher) return matchesClass; // no teacher filter yet
        // Prefer ID match when available; otherwise fall back to name match
        const byId = lessonTopicId != null && String(lessonTopicId) === String(selectedTeacher);
        const byName = !!selectedTeacherName && String(lessonTopicName) === String(selectedTeacherName);
        return matchesClass && (byId || byName);
      } else if (viewMode === "student") {
        // Show lessons for the student's class on selected date
        const studentClass = selectedStudent?.class_kodesh;
        // Map class name to class id via classes list
        const classObj = (classes || []).find((c) => String(c.name).replace(/'/g, "") === String(studentClass));
        const classIdForStudent = classObj?.id;
        return (
          selectedStudent &&
          classIdForStudent != null &&
          String(l.class_id) === String(classIdForStudent) &&
          l.date === selectedDateISO
        );
      }
      return false;
    });
    // Sort by date and time when relevant (teacher view spans multiple dates)
    return [...base].sort((a, b) => {
      const ad = String(a.date || "");
      const bd = String(b.date || "");
      if (ad < bd) return -1;
      if (ad > bd) return 1;
      const at = String(a.start_time || "");
      const bt = String(b.start_time || "");
      if (at < bt) return -1;
      if (at > bt) return 1;
      return 0;
    });
  }, [lessons, selectedClassId, selectedTeacherName, selectedDateISO, viewMode, selectedStudent, classes]);


  // Track which lesson IDs we've fetched to avoid repeated requests
  const fetchedLessonIdsRef = useRef(new Set());

  // Reset fetched set when class/date changes
  useEffect(() => {
    fetchedLessonIdsRef.current = new Set();
  }, [selectedClassId, selectedDateISO]);

  // Load attendance for each visible lesson once (so we also have record IDs)
  useEffect(() => {
    for (const lesson of filteredLessons) {
      if (lesson?.id != null && !fetchedLessonIdsRef.current.has(lesson.id)) {
        fetchedLessonIdsRef.current.add(lesson.id);
        setPendingAttendanceIds((prev) => new Set(prev).add(lesson.id));
        dispatch(getAttendanceByLessonThunk(lesson.id))
          .unwrap()
          .catch((e) =>
            setAttendanceErrorByLesson((prev) => ({ ...prev, [lesson.id]: e?.message || "שגיאת נוכחות" }))
          )
          .finally(() =>
            setPendingAttendanceIds((prev) => {
              const n = new Set(prev);
              n.delete(lesson.id);
              return n;
            })
          );
      }
    }
  }, [dispatch, filteredLessons]);

  // When attendance for a lesson returns empty, prefill all students as "present"
  useEffect(() => {
    for (const lesson of filteredLessons) {
      const key = String(lesson.id);
      const map = attendanceByLesson[key];
      if (map && Object.keys(map).length === 0) {
        const records = (studentsByClass || []).map((s) => ({ student_id: s.id, status: "present" }));
        dispatch(setAttendanceForLesson({ lesson_id: lesson.id, records }));
        prefilledLessonsRef.current.add(key); // לא להריץ שוב

      }
    }
  }, [dispatch, filteredLessons, attendanceByLesson, studentsByClass]);

  function getStatusFor(lessonId, studentId) {
    const map = attendanceByLesson[String(lessonId)] || {};
    const sid = String(studentId ?? "").replace(/\D/g, "").padStart(9, "0").slice(-9);
    return map[sid] || "";
  }

  function getRecordIdFor(lessonId, studentId) {
    const map = attendanceIdsByLesson[String(lessonId)] || {};
    const sid = String(studentId ?? "").replace(/\D/g, "").padStart(9, "0").slice(-9);
    return map[sid] || undefined;
  }


  // Map numeric Hebrew month index (1-12) to Hebcal API month names
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

  // Zero-pad helper used by commit handler
  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  // Hebrew date formatter (same logic as HebrewDateShow, scoped for simple text output)
  const hebFullFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function getHebrewDateText(iso) {
    if (!iso) return "";
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

  // Handle Flexcal commit: formatted Hebrew yyyy-mm-dd -> convert to Gregorian ISO then format Hebrew text
  async function handleHebCommit(hebFormatted, ctx) {
    try {
      // Flexcal may send either Hebrew (YYYY-MM-DD Hebrew year) or Gregorian ISO
      const [yStr, mStr, dStr] = hebFormatted.split("-");
      const y = Number(yStr);
      const m = Number(mStr);
      const d = Number(dStr);

      if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
        throw new Error("Invalid date parts");
      }

      // If year looks Gregorian (< 4000), treat as ISO directly
      if (y < 4000) {
        const iso = `${yStr}-${pad2(m)}-${pad2(d)}`;
        setSelectedDateISO(iso);
        // setHebrewDate(hebrewDateTextFromISO(iso));
        return;
      }

      // Otherwise, it's Hebrew date: convert via Hebcal h2g
      const hmParam = HEB_MONTH_NAME_BY_INDEX[m] || mStr; // map numeric month to name
      const url = `https://www.hebcal.com/converter?cfg=json&h2g=1&strict=0&hy=${y}&hm=${encodeURIComponent(hmParam)}&hd=${d}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed heb->greg conversion");
      const data = await res.json();
      const iso = `${data.gy}-${pad2(data.gm)}-${pad2(data.gd)}`;
      setSelectedDateISO(iso);
    } catch {
      setSelectedDateISO("");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f0ec] px-4 sm:px-8 lg:px-10 py-6 pt-[88px] [direction:rtl] font-sans">
      {/* HEADER */}
      <div className="sticky top-[72px] z-30 mb-6">
        <div className="flex flex-wrap gap-4 items-end text-base bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <label>סוג יומן:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="h-10 min-w-[140px] rounded-md border-0 px-3 py-2 text-sm shadow-sm ring-1 ring-gray-200"
          >
            <option value="class">יומן כיתה</option>
            <option value="teacher">יומן מורה</option>
            <option value="student">יומן תלמידה</option>
          </select>
        </div>

        {/* Hebrew date picker (jQuery Flexcal) */}
        <div className="flex items-center gap-2">
          {/* בחירת תאריך עברי  */}
          <HebrewDateSelector id="flexcal-input" onCommit={handleHebCommit} />

          <HebrewDateShow isoDate={selectedDateISO} />
          {isLoadingLessons && <span className="text-sm font-normal text-gray-600">טוען שיעורים…</span>}
          {lessonsError && <span className="text-sm font-normal text-red-700">{lessonsError}</span>}
        </div>


        {viewMode !== "student" && (
          <div className="flex items-center gap-2">
            <select
              id="class"
              className="h-10 min-w-[120px] rounded-md border-0 px-3 py-2 text-sm shadow-sm ring-1 ring-gray-200 z-10 relative"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="" disabled>בחרי כיתה</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        )}

        {viewMode === "teacher" && (
          <div className="flex items-center gap-2">
            <label htmlFor="teacher">בחרי מורה:</label>
            <select
              id="teacher"
              className="h-10 min-w-[140px] rounded-md border-0 px-3 py-2 text-sm shadow-sm ring-1 ring-gray-200"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {isLoadingTeachers && <span className="text-sm font-normal text-gray-600">טוען מורים…</span>}
            {teachersError && <span className="text-sm font-normal text-red-700">{teachersError}</span>}
          </div>
        )}

        {viewMode === "student" && (
          <div className="flex items-center gap-2">
            <label htmlFor="student">בחרי תלמידה:</label>
            <select
              id="student"
              className="h-10 min-w-[160px] rounded-md border-0 px-3 py-2 text-sm shadow-sm ring-1 ring-gray-200"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
              ))}
            </select>
          </div>
        )}


        {/* Save all statuses for visible lessons */}
        <button
          className="ml-auto bg-[#584041] text-white h-10 px-5 rounded-lg shadow-md hover:opacity-90"
          onClick={async () => {
            for (const lesson of filteredLessons) {
              const key = String(lesson.id);
              if (viewMode === "student" && selectedStudent) {
                const s = selectedStudent;
                const current = (attendanceByLesson[key] && attendanceByLesson[key][String(s.id)]) || "present";
                const recId = getRecordIdFor(lesson.id, s.id);
                if (recId) {
                  dispatch(
                    updateAttendanceThunk({
                      id: recId,
                      status: current || "present",
                      lesson_id: lesson.id,
                      student_id: s.id,
                    })
                  );
                } else {
                  dispatch(
                    addAttendanceThunk({
                      student_id: s.id,
                      lesson_id: lesson.id,
                      status: current || "present",
                    })
                  );
                }
              } else {
                for (const s of studentsByClass) {
                  const current = (attendanceByLesson[key] && attendanceByLesson[key][String(s.id)]) || "present";
                  const recId = getRecordIdFor(lesson.id, s.id);
                  if (recId) {
                    dispatch(
                      updateAttendanceThunk({
                        id: recId,
                        status: current || "present",
                        lesson_id: lesson.id,
                        student_id: s.id,
                      })
                    );
                  } else {
                    dispatch(
                      addAttendanceThunk({
                        student_id: s.id,
                        lesson_id: lesson.id,
                        status: current || "present",
                      })
                    );
                  }
                }
              }
            }
          }}
        >
          שמרי ושלחי נוכחות
        </button>

        </div>
      </div>

      {/*יומן כיתה  TABLE */}
    {viewMode==="class"&&
    <div className="overflow-x-auto rounded-xl bg-white shadow ring-1 ring-black/5">
    <table className="w-full min-w-max border-collapse text-right">
        <thead>
          <tr className="text-white">
            <th className="sticky right-0 z-30 bg-[#584041] border border-black px-4 py-3 text-sm">שם התלמידה</th>
            {filteredLessons.map((lesson, index) => (
              <th key={index} className="bg-[#584041] border border-black px-4 py-3 text-sm">
                {getLessonTopicName(lesson)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsByClass.map((student, rowIndex) => (
            <tr key={student.id ?? rowIndex} className="odd:bg-white even:bg-gray-50">
              <Cell stickyRight className="font-medium">{student.name}</Cell>
              {filteredLessons.map((lesson) => {
                const current = getStatusFor(lesson.id, student.id);
                const recordId = getRecordIdFor(lesson.id, student.id);
                return (
                  <Cell key={`${lesson.id}-${student.id}`}>
                    <StatusSelect
                      value={current}
                      onChange={(e) => {
                        const next = e.target.value;
                        if (next === "") return; // ignore blank option
                        if (!current) {
                          // No status yet → create
                          dispatch(
                            addAttendanceThunk({
                              student_id: student.id,
                              lesson_id: lesson.id,
                              status: next,
                            })
                          );
                        } else if (recordId) {
                          // Status exists and we have an ID → update
                          dispatch(
                            updateAttendanceThunk({
                              id: recordId,
                              status: next,
                              lesson_id: lesson.id,
                              student_id: student.id,
                            })
                          );
                        } else {
                          // Status exists but no ID in cache (prefilled, not saved) → create
                          dispatch(
                            addAttendanceThunk({
                              student_id: student.id,
                              lesson_id: lesson.id,
                              status: next,
                            })
                          );
                        }
                      }}
                    />
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>}

      {/* יומן מורה/מקצוע TABLE */}
      {viewMode === "teacher" && (
        <div className="overflow-x-auto rounded-xl bg-white shadow ring-1 ring-black/5">
        <table className="w-full min-w-max border-collapse text-right">
          <thead>
            <tr className="text-white">
              <th className="sticky right-0 z-30 bg-[#584041] border border-black px-4 py-3 text-sm">שם התלמידה</th>
              {filteredLessons.map((lesson, index) => (
                <th key={index} className="bg-[#584041] border border-black px-4 py-3 text-sm">
                  {getHebrewDateText(lesson.date)}
                </th>
              ))}
              <th className="bg-[#584041] border border-black px-4 py-3 text-sm">אחוז נוכחות</th>
            </tr>
          </thead>
          <tbody>
            {studentsByClass.map((student, rowIndex) => (
              <tr key={student.id ?? rowIndex} className="odd:bg-white even:bg-gray-50">
                <Cell stickyRight className="font-medium">{student.name}</Cell>
                {filteredLessons.map((lesson) => {
                  const current = getStatusFor(lesson.id, student.id);
                  const recordId = getRecordIdFor(lesson.id, student.id);
                  return (
                    <Cell key={`${lesson.id}-${student.id}`}>
                      <StatusSelect
                        value={current}
                        disabled={pendingAttendanceIds.has(lesson.id)}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next === "") return;
                          if (!current) {
                            dispatch(
                              addAttendanceThunk({
                                student_id: student.id,
                                lesson_id: lesson.id,
                                status: next,
                              })
                            );
                          } else if (recordId) {
                            dispatch(
                              updateAttendanceThunk({
                                id: recordId,
                                status: next,
                                lesson_id: lesson.id,
                                student_id: student.id,
                              })
                            );
                          } else {
                            dispatch(
                              addAttendanceThunk({
                                student_id: student.id,
                                lesson_id: lesson.id,
                                status: next,
                              })
                            );
                          }
                        }}
                      />
                    </Cell>
                  );
                })}
                {/* Summary percent per student */}
                <Cell className="font-semibold">
                  {(() => {
                    const total = filteredLessons.length;
                    if (!total) return "—";
                    let presentCount = 0;
                    for (const les of filteredLessons) {
                      const st = getStatusFor(les.id, student.id);
                      if (st === "present" || st === "late") presentCount += 1;
                    }
                    const pct = Math.round((presentCount / total) * 100);
                    return pct + "%";
                  })()}
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      {/* יומן תלמידה TABLE */}
      {viewMode === "student" && selectedStudent && (
        <div className="overflow-x-auto rounded-xl bg-white shadow ring-1 ring-black/5">
        <table className="w-full min-w-max border-collapse text-right">
          <thead>
            <tr className="text-white">
              <th className="sticky right-0 z-30 bg-[#584041] border border-black px-4 py-3 text-sm">מקצוע</th>
              {filteredLessons.map((lesson, index) => (
                <th key={index} className="bg-[#584041] border border-black px-4 py-3 text-sm">
                  {getLessonTopicName(lesson)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-gray-50">
              <Cell stickyRight className="font-medium">{selectedStudent.name}</Cell>
              {filteredLessons.map((lesson) => {
                const current = getStatusFor(lesson.id, selectedStudent.id);
                const recordId = getRecordIdFor(lesson.id, selectedStudent.id);
                return (
                  <Cell key={`${lesson.id}-${selectedStudent.id}`}>
                    <StatusSelect
                      value={current}
                      onChange={(e) => {
                        const next = e.target.value;
                        if (next === "") return;
                        if (!current) {
                          dispatch(
                            addAttendanceThunk({
                              student_id: selectedStudent.id,
                              lesson_id: lesson.id,
                              status: next,
                            })
                          );
                        } else if (recordId) {
                          dispatch(
                            updateAttendanceThunk({
                              id: recordId,
                              status: next,
                              lesson_id: lesson.id,
                              student_id: selectedStudent.id,
                            })
                          );
                        } else {
                          dispatch(
                            addAttendanceThunk({
                              student_id: selectedStudent.id,
                              lesson_id: lesson.id,
                              status: next,
                            })
                          );
                        }
                      }}
                    />
                  </Cell>
                );
              })}
            </tr>
          </tbody>
        </table>
        </div>
      )}
    </div >
  );
};

export default Screen;