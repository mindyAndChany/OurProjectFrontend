import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLessonsThunk } from "../redux/slices/LESSONS/getLessonsThunk";
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";
import HebrewDateSelector from "../components/HebrewDateSelector.jsx";
import { HebrewDateShow } from "../components/HebrewDateShow.jsx";
import { getAttendanceByLessonThunk } from "../redux/slices/ATTENDANCE/getAttendanceByLessonThunk";
import { addAttendanceThunk } from "../redux/slices/ATTENDANCE/addAttendanceThunk";
import { setAttendanceForLesson } from "../redux/slices/ATTENDANCE/attendanceSlice";
import { updateAttendanceThunk } from "../redux/slices/ATTENDANCE/updateAttendanceThunk.js";

const Cell = ({ children, className = "" }) => (
  <td className={`border border-black px-4 py-2 text-center align-middle ${className}`}>
    {children || ""}
  </td>
);

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
  const teachers = useSelector((state) => state.teachers?.data || []);
  const attendanceByLesson = useSelector((state) => state.attendance?.byLesson || {});
  const attendanceIdsByLesson = useSelector((state) => state.attendance?.idsByLesson || {});
  const prefilledLessonsRef = useRef(new Set());
  const [viewMode, setViewMode] = useState("class"); // options: 'class' | 'teacher' | 'student'
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");


  //בכותרת בוחרים לפי מה להציג את הנוכחות:
  //  יומן כיתה-כשניגשים למסך בוחרים תאריך (יום או שבוע) וכיתה ולפי זה מופיעה טבלה שכותרותיה הם השיעורים והמטלות/ מבחנים שעודכנו והשורות הם התלמידות ובפנים מזינים נוכחות. 
  // ואם עוד לא עודכן מה השיעורים שהתבצעו בפועל. וצריך קודם כל לעדכן האם התקיים השיעור ואם כן האם הפרטים כפי המתוכנן.
  // יומן מורה-בוחרים מורה וכיתה ומקבלים נוכחות של הכיתה בשיעורי המורה כולל סיכום אחוזים לכל תלמידה.בכל המחצית.
  // יומן תלמידה -רואים לבת מסוימת אחוזי נוכחות בכל המחצית בכל המקצועות.

  // Initial data load
  useEffect(() => {
    dispatch(getClassesThunk());
    dispatch(getStudentDataThunk("id_number,first_name,last_name,class_kodesh"));
    dispatch(getLessonsThunk());

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
        const id = s.id_number ?? s.id ?? null;
        const name = s.name ?? [s.first_name, s.last_name].filter(Boolean).join(" ");
        return id && name ? { id, name } : null;
      })
      .filter(Boolean);
  }, [students, selectedClassName]);

  // Lessons filtered by selected class and selected date (ISO) — memoized to avoid changing identity on each render
  // const filteredLessons = useMemo(() => {
  //   return lessons.filter((l) => {
  //     const byClass = selectedClassId ? String(l.class_id) === String(selectedClassId) : true;
  //     const byDate = selectedDateISO ? l.date === selectedDateISO : true;
  //     return byClass && byDate;
  //   });
  // }, [lessons, selectedClassId, selectedDateISO]);
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (viewMode === "class") {
        return selectedClassId && String(l.class_id) === String(selectedClassId) && l.date === selectedDateISO;
      } else if (viewMode === "teacher") {
        return selectedClassId && String(l.class_id) === String(selectedClassId) && l.topic_name === selectedTeacher;
        // } else if (viewMode === "student") {
        //   return String(l.class_id) === String(selectedStudentId.class_kodesh||); // או כל התנאי שיתאים
      }
      return false;
    });
  }, [lessons, selectedClassId, selectedTeacher, selectedDateISO, viewMode]);


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
        dispatch(getAttendanceByLessonThunk(lesson.id));
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
    <div className="min-h-screen bg-[#f4f0ec] px-10 py-6 pt-[88px] [direction:rtl] font-sans">
      {/* HEADER */}
      <div className="flex flex-wrap gap-6 mb-10 text-lg font-bold items-center">
        <div className="flex items-center gap-2">
          <label>סוג יומן:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border border-black rounded px-2 py-1"
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
        </div>


        {viewMode !== "student" && (
          <div className="flex items-center gap-2">
            <select
              id="class"
              className="border border-black rounded px-2 py-1 z-10 relative"
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
              className="border border-black rounded px-2 py-1"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}

        {viewMode === "student" && (
          <div className="flex items-center gap-2">
            <label htmlFor="student">בחרי תלמידה:</label>
            <select
              id="student"
              className="border border-black rounded px-2 py-1"
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
          className="ml-auto bg-[#584041] text-white px-4 py-2 rounded shadow hover:opacity-90"
          onClick={async () => {
            for (const lesson of filteredLessons) {
              const key = String(lesson.id);
              for (const s of studentsByClass) {
                const current = (attendanceByLesson[key] && attendanceByLesson[key][String(s.id)]) || "present";
                await dispatch(
                  addAttendanceThunk({
                    student_id: s.id,
                    lesson_id: lesson.id,
                    status: current || "present",
                  })
                );
              }
            }
          }}
        >
          שמרי ושלחי נוכחות
        </button>

        {/* <div className="flex items-center gap-2">
          <label htmlFor="teacher">מורה:</label>
          <select
            id="teacher"
            className="border border-black rounded px-2 py-1 z-10 relative"
            value={selectedTeacher}
            onChange={(e) => dispatch({ type: "filters/setTeacher", payload: e.target.value })}
          >
            {teachers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div> */}

      </div>

      {/* TABLE */}
      <table className="w-full border-collapse border border-black text-right">
        <thead>
          <tr className="bg-[#584041] text-white">
            <th className="border border-black px-4 py-2">שם התלמידה</th>
            {filteredLessons.map((lesson, index) => (
              <th key={index} className="border border-black px-4 py-2">
                {lesson.topic}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsByClass.map((student, rowIndex) => (
            <tr key={student.id ?? rowIndex}>
              <Cell>{student.name}</Cell>
              {filteredLessons.map((lesson) => {
                const current = getStatusFor(lesson.id, student.id);
                const recordId = getRecordIdFor(lesson.id, student.id);
                return (
                  <Cell key={`${lesson.id}-${student.id}`}>
                    <select
                      className="border border-black rounded px-2 py-1"
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
                    >
                      <option value="">—</option>
                      <option value="present">נוכחת</option>
                      <option value="late">מאחרת</option>
                      <option value="absent">חסרה</option>
                      <option value="approved absent">חסרה באישור</option>
                    </select>
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
};

export default Screen;