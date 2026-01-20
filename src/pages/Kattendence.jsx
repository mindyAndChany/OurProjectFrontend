import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLessonsThunk } from "../redux/slices/LESSONS/getLessonsThunk";
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";
import FlexcalPicker from "../components/FlexcalPicker.jsx";

const Cell = ({ children, className = "" }) => (
  <td className={`border border-black px-4 py-2 text-center align-middle ${className}`}>
    {children || ""}
  </td>
);

export const Screen = () => {
  const dispatch = useDispatch();
  const [hebrewDate, setHebrewDate] = useState("");
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

  // Student names for selected class
  const allStudentNames = students
    .filter((s) => String(s.class_kodesh) === String(selectedClassId))
    .map((s) => s.name);

  // Lessons filtered by selected class and selected date (ISO)
  const filteredLessons = lessons.filter((l) => {
    const byClass = selectedClassId ? String(l.class_id) === String(selectedClassId) : true;
    const byDate = selectedDateISO ? l.date === selectedDateISO : true;
    return byClass && byDate;
  });

  // Hebrew date formatting consistent with CalendarModern
  const hebFullFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function hebrewDateTextFromISO(iso) {
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

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  // Handle Flexcal commit: formatted Hebrew yyyy-mm-dd -> convert to Gregorian ISO then format Hebrew text
  async function handleHebCommit(hebFormatted, ctx) {
    try {
      // hebFormatted is yyyy-mm-dd for Hebrew calendar
      const [hy, hm, hd] = hebFormatted.split("-");
      const url = `https://www.hebcal.com/converter?cfg=json&h2g=1&strict=0&hy=${hy}&hm=${hm}&hd=${hd}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed heb->greg conversion");
      const data = await res.json();
      const iso = `${data.gy}-${pad2(data.gm)}-${pad2(data.gd)}`;
      setSelectedDateISO(iso);
      setHebrewDate(hebrewDateTextFromISO(iso));
    } catch {
      setSelectedDateISO("");
      setHebrewDate("");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f0ec] px-10 py-6 pt-[88px] [direction:rtl] font-sans">
      {/* HEADER */}
      <div className="flex flex-wrap gap-6 mb-10 text-lg font-bold items-center">
        {/* Hebrew date picker (jQuery Flexcal) */}
        <div className="flex items-center gap-2">
          <label htmlFor="flexcal-input">תאריך עברי:</label>
          <FlexcalPicker id="flexcal-input" onCommit={handleHebCommit} />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="class">כיתה:</label>
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

        {/* Display the formatted Hebrew date (CalendarModern style)
        <div className="flex items-center gap-2">
          <label htmlFor="hebrew-date">תאריך עברי נבחר:</label>
          <input
            id="hebrew-date"
            className="border border-black rounded px-2 py-1 z-10 relative bg-white"
            value={hebrewDate || "בחרי תאריך"}
            readOnly
          />
        </div>*/}
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
              {filteredLessons.map((lesson, colIndex) => {
                const student = lesson.students.find((s) => s.name === studentName);
                return <Cell key={colIndex}>{student?.attendance}</Cell>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Screen;