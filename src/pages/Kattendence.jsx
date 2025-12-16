import React from "react";
import { Edulink } from "../components/Edulink";


/* ========= DATA ========= */

const subjects = [
  { id: 1, title: "תורה" },
  { id: 2, title: "נביא" },
  { id: 3, title: "יהדות" },
  { id: 4, title: "דינים" },
];

const rows = [
  {
    student: "אסתי ברוינר",
    teacher: "דינקלס",
    attendance: "נוכחת",
    tasks: "ביצעה",
    grade: "93%",
  },
  {
    student: "גילי דרוק",
    teacher: "דינקלס",
    attendance: "נוכחת",
    tasks: "ביצעה",
    grade: "93%",
  },
  {
    student: "חני גרוס",
    teacher: "דינקלס",
    attendance: "נוכחת",
    tasks: "ביצעה",
    grade: "93%",
  },
];

/* ========= ATOMS ========= */

const Cell = ({ children, className = "" }) => (
  <div
    className={`border border-black flex items-center justify-center text-[22px] ${className}`}
  >
    {children}
  </div>
);

/* ========= PAGE ========= */

export const Screen = () => {
  return (
    <div className="w-full min-h-screen bg-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <Edulink />
        <div className="text-4xl font-bold">לימודי קודש</div>
      </div>

      {/* META */}
      <div className="flex gap-6 mb-10 text-2xl">
        <div>חודש: כסליו</div>
        <div>תאריך: יט׳</div>
        <div>כיתה: א׳3</div>
      </div>

      {/* SUBJECT HEADER */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        <div />
        {subjects.map(s => (
          <div
            key={s.id}
            className="bg-black text-white rounded-full text-center py-2"
          >
            {s.title}
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="grid grid-cols-5 gap-2">
        <div className="font-bold text-center bg-black text-white py-2">
          שם התלמידה
        </div>

        {subjects.map(s => (
          <div
            key={s.id}
            className="grid grid-cols-4 bg-black text-white text-sm text-center py-2"
          >
            <div>מורה</div>
            <div>נוכחות</div>
            <div>מטלות</div>
            <div>ציון</div>
          </div>
        ))}

        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <Cell className="font-medium">{row.student}</Cell>

            {subjects.map(s => (
              <div key={s.id} className="grid grid-cols-4 gap-2">
                <Cell>{row.teacher}</Cell>
                <Cell>{row.attendance}</Cell>
                <Cell>{row.tasks}</Cell>
                <Cell>{row.grade}</Cell>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
export default Screen;