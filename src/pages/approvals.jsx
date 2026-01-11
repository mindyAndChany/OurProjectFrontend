// import React, { useState } from "react";

// export const Screen = () => {
//   const [formData, setFormData] = useState({
//     studentName: "",
//     idNumber: "",
//     certificateType: "אישור לימודים",
//     academicYear: "פ\"ג",
//   });

//   const certificateTypes = ["אישור לימודים"];
//   const academicYears = ['פ"ג'];

//   const navigationItems = [
//     "ניהול המערכת",
//     "נתוני תלמידות",
//     "הנפקת אישורים",
//     "השאלת ציוד",
//     "ארועים",
//     "התמחויות",
//     "לימודי הוראה",
//     "לימודי קודש",
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // כאן תוכל להוסיף קריאה ל-API או ניווט
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="bg-white min-h-screen w-full [direction:rtl]">
//       {/* Header */}
//       <header className="w-full px-8 py-5 flex items-center justify-between border-b border-black">
//         <div className="flex items-center gap-6">
//           <button
//             onClick={() => {}}
//             className="px-4 py-2 bg-[#295f8b] text-black font-bold rounded-md border-2 border-black hover:bg-[#1e4a6b] transition"
//           >
//             התחברות
//           </button>

//           <nav aria-label="ניווט ראשי" className="hidden lg:block">
//             <ul className="flex gap-6 font-bold text-base">
//               {navigationItems.map((item, index) => (
//                 <li key={index}>
//                   <a href="#" className="hover:text-[#295f8b] transition-colors">
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>

//         <h1 className="font-bold text-3xl">
//           <span className="text-black">EDU</span>
//           <span className="text-[#295f8b]">LINK</span>
//         </h1>
//       </header>

//       {/* Main */}
//       <main className="px-6 md:px-12 lg:px-24 py-12">
//         <h2 className="text-center text-4xl font-medium mb-8">הנפקת אישורים</h2>

//         <section className="max-w-3xl mx-auto">
//           <form
//             onSubmit={handleSubmit}
//             className="bg-[#f3efe8] rounded-2xl border-2 border-black p-8 shadow-sm"
//             aria-label="טופס הנפקת אישורים"
//           >
//             <div className="space-y-6">
//               <div>
//                 <label htmlFor="studentName" className="block text-right font-medium text-lg mb-2">
//                   שם התלמידה
//                 </label>
//                 <input
//                   id="studentName"
//                   name="studentName"
//                   type="text"
//                   value={formData.studentName}
//                   onChange={(e) => handleInputChange("studentName", e.target.value)}
//                   required
//                   className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="idNumber" className="block text-right font-medium text-lg mb-2">
//                   ת.ז.
//                 </label>
//                 <input
//                   id="idNumber"
//                   name="idNumber"
//                   type="text"
//                   value={formData.idNumber}
//                   onChange={(e) => handleInputChange("idNumber", e.target.value)}
//                   pattern="[0-9]{9}"
//                   maxLength={9}
//                   required
//                   className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
//                 />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="certificateType" className="block text-right font-medium text-lg mb-2">
//                     סוג האישור
//                   </label>
//                   <select
//                     id="certificateType"
//                     name="certificateType"
//                     value={formData.certificateType}
//                     onChange={(e) => handleInputChange("certificateType", e.target.value)}
//                     className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
//                     required
//                   >
//                     {certificateTypes.map((t, i) => (
//                       <option key={i} value={t}>
//                         {t}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label htmlFor="academicYear" className="block text-right font-medium text-lg mb-2">
//                     שנת לימודים
//                   </label>
//                   <select
//                     id="academicYear"
//                     name="academicYear"
//                     value={formData.academicYear}
//                     onChange={(e) => handleInputChange("academicYear", e.target.value)}
//                     className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
//                     required
//                   >
//                     {academicYears.map((y, i) => (
//                       <option key={i} value={y}>
//                         {y}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-center mt-4">
//                 <button
//                   type="submit"
//                   className="px-8 py-3 bg-[#295f8b] text-black font-bold rounded-lg border-2 border-black hover:bg-[#1e4a6b] transition"
//                 >
//                   הנפק
//                 </button>
//               </div>
//             </div>
//           </form>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Screen;
// components/ApprovalScreen.jsx

// אישור לימודים מודרני ומעוצב עם תמיכה ב-PDF והדפסה

import { useState, useRef } from "react"
import { jsPDF } from "jspdf"
import { motion } from "framer-motion"

const approvals = [
  {
    id: "student",
    label: "אישור סטודנט",
    generateText: ({ name, id, yearHeb }) => [
      ["בסיעתא דשמיא"],
      ["לכל המעוניין"],
      [`הריני לאשר כי התלמידה ${name}, ת.ז ${id}, סטודנטית במוסדותינו בשנת ${yearHeb}`],
      ["בכבוד רב"],
      ["המזכירות"]
    ]
  },
  {
    id: "12years",
    label: "אישור 12 שנות לימוד",
    generateText: ({ name, id, yearHeb }) => [
      ["בסיעתא דשמיא"],
      ["לכל המעוניין"],
      [`הריני לאשר כי התלמידה ${name}, ת.ז ${id}, סיימה 12 שנות לימוד בתיכון בשנת ${yearHeb}`],
      ["בכבוד רב"],
      ["המזכירות"]
    ]
  },
  {
    id: "graduate",
    label: "אישור סיום לימודים",
    generateText: ({ name, id, yearHeb }) => [
      ["בסיעתא דשמיא"],
      ["לכל המעוניין"],
      [`הריני לאשר כי התלמידה ${name}, ת.ז ${id}, סיימה בהצלחה את לימודיה בשנת ${yearHeb}`],
      ["בכבוד רב"],
      ["המזכירות"]
    ]
  }
]

export default function ApprovalsPage() {
  const [form, setForm] = useState({ name: "", id: "", yearHeb: "תשפו", type: "student" })
  const iframeRef = useRef()

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const generatePdf = () => {
    const selected = approvals.find(a => a.id === form.type)
    const doc = new jsPDF()
    doc.setFont("helvetica")
    doc.setFontSize(14)
    doc.setTextColor(33, 33, 33)
    doc.setR2L(true)

    const lines = selected.generateText(form).map(([line]) => line)
    lines.forEach((line, i) => {
      doc.text(line, 190, 40 + i * 12, { align: "right" })
    })

    doc.save("approval.pdf")
  }

  const printIframe = () => {
    if (iframeRef.current) iframeRef.current.contentWindow.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f3efe8] px-8 py-16 text-right [direction:rtl]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl font-bold text-center mb-10">הנפקת אישורים</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-black space-y-4">
          <div>
            <label className="font-medium">שם התלמידה</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg"
            />
          </div>

          <div>
            <label className="font-medium">תעודת זהות</label>
            <input
              type="text"
              value={form.id}
              onChange={e => handleChange("id", e.target.value)}
              className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg"
            />
          </div>

          <div>
            <label className="font-medium">שנה עברית</label>
            <input
              type="text"
              value={form.yearHeb}
              onChange={e => handleChange("yearHeb", e.target.value)}
              className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg"
            />
          </div>

          <div>
            <label className="font-medium">סוג האישור</label>
            <select
              value={form.type}
              onChange={e => handleChange("type", e.target.value)}
              className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg bg-white"
            >
              {approvals.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={generatePdf}
              className="bg-[#295f8b] text-white font-bold px-6 py-2 rounded-xl border border-black hover:bg-[#1e4a6b]"
            >
              הורד PDF
            </button>
            <button
              onClick={printIframe}
              className="bg-green-600 text-white font-bold px-6 py-2 rounded-xl border border-black hover:bg-green-700"
            >
              הדפס
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
