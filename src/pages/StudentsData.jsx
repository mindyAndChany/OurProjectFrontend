import React, { useEffect, useState } from "react";

const classes = ["ה1", "ה2", "ו1", "ו2", "כל הכיתות"];
const categories = [
  { key: "payments", label: "סטטוס תשלום"},
  { key: "familyData", label: "נתונים משפחתיים" },
  { key: "baseData", label: "נתונים בסיסיים" },
  { key: "alphone", label: "אלפון תלמידות" },
  { key: "allData", label: "כל הנתונים" },
  
];

const Cell = ({ children, className = "" }) => (
  <td className={`border border-black px-4 py-2 text-center align-middle ${className}`}>
    {children || "-"}
  </td>
);

export const StudentsTable = () => {
  const [selectedClass, setSelectedClass] = useState("ה1");
  const [selectedField, setSelectedField] = useState("payment_status");
  const [students, setStudents] = useState([]);

  return (
    <div className="min-h-screen bg-[#f4f0ec] px-10 py-6 [direction:rtl] font-sans">
      <div className="flex flex-wrap gap-6 mb-10 text-lg font-bold items-center">
        <div className="flex items-center gap-2">
          <label>כיתה:</label>
          <select
            className="border border-black rounded px-2 py-1"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label>תחום נתונים:</label>
          <select
            className="border border-black rounded px-2 py-1"
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
          >
            {categories.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse border border-black text-right">
        <thead>
          <tr className="bg-[#584041] text-white">
            <th className="border border-black px-4 py-2">שם התלמידה</th>
            <th className="border border-black px-4 py-2">
              {categories.find((f) => f.key === selectedField)?.label}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <Cell>{student.name}</Cell>
              <Cell>{student.value}</Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
