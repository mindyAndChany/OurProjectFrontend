import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLessonsThunk } from "../redux/slices/LESSONS/getLessonsThunk";
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";
import HebrewDateSelector from "../components/HebrewDateSelector.jsx";
import { HebrewDateShow } from "../components/HebrewDateShow.jsx";

const Cell = ({ children, className = "" }) => (
  <td className={`border border-black px-4 py-2 text-center align-middle ${className}`}>
    {children || ""}
  </td>
);

export const Screen = () => {
  const dispatch = useDispatch();
  const [selectedClassId, setSelectedClassId] = useState("");
  // Flexcal provides Hebrew date; we keep ISO + formatted Hebrew
  const [selectedDateISO, setSelectedDateISO] = useState("");


  // Selectors to fetch data from Redux Store
  const classes = useSelector((state) => state.classes?.data || []);
  const students = useSelector((state) => state.student.studentsData || []);
  const lessons = useSelector((state) => state.lessons?.data || []);

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
    const className=cls?.name || "";
    const cleaned = className.replace(/'/g, "");
console.log("cleaned",cleaned);
    return cleaned;
  }, [classes, selectedClassId]);
  
  // שמות תלמידות לפי כיתה (התאמה לפי שם כיתה, לא לפי ID)
  const allStudentNames = useMemo(() => {
    if (!Array.isArray(students) || !selectedClassName) return [];
    return students
      .filter((s) => String(s.class_kodesh) === String(selectedClassName))
      .map((s) => s.name ?? [s.first_name, s.last_name].filter(Boolean).join(" "))
      .filter(Boolean);
  }, [students, selectedClassName]);

  // Lessons filtered by selected class and selected date (ISO)
  const filteredLessons = lessons.filter((l) => {
    const byClass = selectedClassId ? String(l.class_id) === String(selectedClassId) : true;
    const byDate = selectedDateISO ? l.date === selectedDateISO : true;
    return byClass && byDate;
  });

 
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
        {/* Hebrew date picker (jQuery Flexcal) */}
        <div className="flex items-center gap-2">
          {/* בחירת תאריך עברי  */}
          <HebrewDateSelector id="flexcal-input" onCommit={handleHebCommit} />

          <HebrewDateShow isoDate={selectedDateISO} />
        </div>


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
          {allStudentNames.map((studentName, rowIndex) => (
            <tr key={rowIndex}>
              <Cell>{studentName}</Cell>
              {/* {filteredLessons.map((lesson, colIndex) => {
                const studentList = Array.isArray(lesson?.students) ? lesson.students : [];
                const student = studentList.find((s) => s.name === studentName);
                return <Cell key={colIndex}>{student?.attendance || ""}</Cell>;
              })} */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Screen;