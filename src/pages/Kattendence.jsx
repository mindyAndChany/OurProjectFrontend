import React, { useState, useEffect } from "react";

const days = Array.from({ length: 30 }, (_, i) => i + 1);
const classes = ["א׳1", "א׳2", "א׳3", "ב׳1"];
const months = ["תשרי", "חשון", "כסלו", "טבת"];
const teachers = ["כל המורות", "דינקלס", "רוזנברג", "מלכה"];

const Cell = ({ children, className = "" }) => (
  <td className={`border border-black px-4 py-2 text-center align-middle ${className}`}>
    {children || ""}
  </td>
);

export const Screen = () => {
  const [selectedClass, setSelectedClass] = useState("א׳3");
  const [selectedMonth, setSelectedMonth] = useState("כסלו");
  const [selectedDay, setSelectedDay] = useState(19);
  const [selectedTeacher, setSelectedTeacher] = useState("כל המורות");
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const mockLessons = [
      {
        subject: "תורה",
        teacher: "דינקלס",
        topic: "פרשת ויצא",
        students: [
          { name: "אסתי ברוינר", attendance: "חסרה" },
          { name: "גילי דרוק", attendance: "חסרה" },
        ],
      },
      {
        subject: "תורה",
        teacher: "דינקלס",
        topic: "מבחן",
        isTest: true,
        students: [
          { name: "אסתי ברוינר", attendance: "90" },
          { name: "גילי דרוק", attendance: "88" },
        ],
      },
      {
        subject: "יהדות",
        teacher: "לביא שטיין",
        topic: "שיעור",
        students: [
          { name: "אסתי ברוינר", attendance: "חסרה" },
          { name: "גילי דרוק", attendance: "איחרה" },
        ],
      },
      {
        subject: "יהדות",
        teacher: "לביא שטיין",
        topic: "מבחן",
        isTest: true,
        students: [
          { name: "אסתי ברוינר", attendance: "" },
          { name: "גילי דרוק", attendance: "56" },
        ],
      },
    ];
    setLessons(mockLessons);
  }, [selectedClass, selectedMonth, selectedDay, selectedTeacher]);

  const allStudentNames = Array.from(
    new Set(lessons.flatMap((lesson) => lesson.students.map((s) => s.name)))
  );

  return (
    <div className="min-h-screen bg-[#f4f0ec] px-10 py-6 [direction:rtl] font-sans">
      {/* HEADER */}
      <div className="flex flex-wrap gap-6 mb-10 text-lg font-bold items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="month">חודש:</label>
          <select
            id="month"
            className="border border-black rounded px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="day">תאריך:</label>
          <select
            id="day"
            className="border border-black rounded px-2 py-1"
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
          >
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="class">כיתה:</label>
          <select
            id="class"
            className="border border-black rounded px-2 py-1"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="teacher">מורה:</label>
          <select
            id="teacher"
            className="border border-black rounded px-2 py-1"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            {teachers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse border border-black text-right">
        <thead>
          <tr className="bg-[#584041] text-white">
            <th className="border border-black px-4 py-2">שם התלמידה</th>
            {lessons.map((lesson, index) => (
              <th key={index} className="border border-black px-4 py-2">
                {lesson.subject} - {lesson.teacher}
                {lesson.isTest && <div className="text-red-600">מבחן</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allStudentNames.map((studentName, rowIndex) => (
            <tr key={rowIndex}>
              <Cell>{studentName}</Cell>
              {lessons.map((lesson, colIndex) => {
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