// // import React, { useState } from "react";

// // export const Screen = () => {
// //   const [formData, setFormData] = useState({
// //     studentName: "",
// //     idNumber: "",
// //     certificateType: "אישור לימודים",
// //     academicYear: "פ\"ג",
// //   });

// //   const certificateTypes = ["אישור לימודים"];
// //   const academicYears = ['פ"ג'];

// //   const navigationItems = [
// //     "ניהול המערכת",
// //     "נתוני תלמידות",
// //     "הנפקת אישורים",
// //     "השאלת ציוד",
// //     "ארועים",
// //     "התמחויות",
// //     "לימודי הוראה",
// //     "לימודי קודש",
// //   ];

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log("Form submitted:", formData);
// //     // כאן תוכל להוסיף קריאה ל-API או ניווט
// //   };

// //   const handleInputChange = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   return (
// //     <div className="bg-white min-h-screen w-full [direction:rtl]">
// //       {/* Header */}
// //       <header className="w-full px-8 py-5 flex items-center justify-between border-b border-black">
// //         <div className="flex items-center gap-6">
// //           <button
// //             onClick={() => {}}
// //             className="px-4 py-2 bg-[#295f8b] text-black font-bold rounded-md border-2 border-black hover:bg-[#1e4a6b] transition"
// //           >
// //             התחברות
// //           </button>

// //           <nav aria-label="ניווט ראשי" className="hidden lg:block">
// //             <ul className="flex gap-6 font-bold text-base">
// //               {navigationItems.map((item, index) => (
// //                 <li key={index}>
// //                   <a href="#" className="hover:text-[#295f8b] transition-colors">
// //                     {item}
// //                   </a>
// //                 </li>
// //               ))}
// //             </ul>
// //           </nav>
// //         </div>

// //         <h1 className="font-bold text-3xl">
// //           <span className="text-black">EDU</span>
// //           <span className="text-[#295f8b]">LINK</span>
// //         </h1>
// //       </header>

// //       {/* Main */}
// //       <main className="px-6 md:px-12 lg:px-24 py-12">
// //         <h2 className="text-center text-4xl font-medium mb-8">הנפקת אישורים</h2>

// //         <section className="max-w-3xl mx-auto">
// //           <form
// //             onSubmit={handleSubmit}
// //             className="bg-[#f3efe8] rounded-2xl border-2 border-black p-8 shadow-sm"
// //             aria-label="טופס הנפקת אישורים"
// //           >
// //             <div className="space-y-6">
// //               <div>
// //                 <label htmlFor="studentName" className="block text-right font-medium text-lg mb-2">
// //                   שם התלמידה
// //                 </label>
// //                 <input
// //                   id="studentName"
// //                   name="studentName"
// //                   type="text"
// //                   value={formData.studentName}
// //                   onChange={(e) => handleInputChange("studentName", e.target.value)}
// //                   required
// //                   className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
// //                 />
// //               </div>

// //               <div>
// //                 <label htmlFor="idNumber" className="block text-right font-medium text-lg mb-2">
// //                   ת.ז.
// //                 </label>
// //                 <input
// //                   id="idNumber"
// //                   name="idNumber"
// //                   type="text"
// //                   value={formData.idNumber}
// //                   onChange={(e) => handleInputChange("idNumber", e.target.value)}
// //                   pattern="[0-9]{9}"
// //                   maxLength={9}
// //                   required
// //                   className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div>
// //                   <label htmlFor="certificateType" className="block text-right font-medium text-lg mb-2">
// //                     סוג האישור
// //                   </label>
// //                   <select
// //                     id="certificateType"
// //                     name="certificateType"
// //                     value={formData.certificateType}
// //                     onChange={(e) => handleInputChange("certificateType", e.target.value)}
// //                     className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
// //                     required
// //                   >
// //                     {certificateTypes.map((t, i) => (
// //                       <option key={i} value={t}>
// //                         {t}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div>
// //                   <label htmlFor="academicYear" className="block text-right font-medium text-lg mb-2">
// //                     שנת לימודים
// //                   </label>
// //                   <select
// //                     id="academicYear"
// //                     name="academicYear"
// //                     value={formData.academicYear}
// //                     onChange={(e) => handleInputChange("academicYear", e.target.value)}
// //                     className="w-full rounded-lg border border-black px-4 py-3 text-right text-lg"
// //                     required
// //                   >
// //                     {academicYears.map((y, i) => (
// //                       <option key={i} value={y}>
// //                         {y}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="flex justify-center mt-4">
// //                 <button
// //                   type="submit"
// //                   className="px-8 py-3 bg-[#295f8b] text-black font-bold rounded-lg border-2 border-black hover:bg-[#1e4a6b] transition"
// //                 >
// //                   הנפק
// //                 </button>
// //               </div>
// //             </div>
// //           </form>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // };

// // export default Screen;
// // components/ApprovalScreen.jsx

// // אישור לימודים מודרני ומעוצב עם תמיכה ב-PDF והדפסה

// import { useState, useRef } from "react"
// import { jsPDF } from "jspdf"
// import { motion } from "framer-motion"

// const approvals = [
//   {
//     id: "student",
//     label: "אישור סטודנט",
//     generateText: ({ name, id, yearHeb }) => [
//       ["בסיעתא דשמיא"],
//       ["לכל המעוניין"],
//       [`הריני לאשר כי התלמידה ${name}, ת.ז ${id}, סטודנטית במוסדותינו בשנת ${yearHeb}`],
//       ["בכבוד רב"],
//       ["המזכירות"]
//     ]
//   },
//   {
//     id: "12years",
//     label: "אישור 12 שנות לימוד",
//     generateText: ({ name, id, yearHeb }) => [
//       ["בסיעתא דשמיא"],
//       ["לכל המעוניין"],
//       [`הריני לאשר כי התלמידה ${name}, ת.ז ${id}, סיימה 12 שנות לימוד בתיכון בשנת ${yearHeb}`],
//       ["בכבוד רב"],
//       ["המזכירות"]
//     ]
//   },
//   {
//     id: "graduate",
//     label: "אישור סיום לימודים",
//     generateText: ({ name, id, yearHeb }) => [
//       ["בסיעתא דשמיא"],
//       ["לכל המעוניין"],
//       [`הריני לאשר כי התלמידה ${name}, ת.ז ${id}, סיימה בהצלחה את לימודיה בשנת ${yearHeb}`],
//       ["בכבוד רב"],
//       ["המזכירות"]
//     ]
//   }
// ]

// export default function ApprovalsPage() {
//   const [form, setForm] = useState({ name: "", id: "", yearHeb: "תשפו", type: "student" })
//   const iframeRef = useRef()

//   const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

//   const generatePdf = () => {
//     const selected = approvals.find(a => a.id === form.type)
//     const doc = new jsPDF()
//     doc.setFont("helvetica")
//     doc.setFontSize(14)
//     doc.setTextColor(33, 33, 33)
//     doc.setR2L(true)

//     const lines = selected.generateText(form).map(([line]) => line)
//     lines.forEach((line, i) => {
//       doc.text(line, 190, 40 + i * 12, { align: "right" })
//     })

//     doc.save("approval.pdf")
//   }

//   const printIframe = () => {
//     if (iframeRef.current) iframeRef.current.contentWindow.print()
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-[#f3efe8] px-8 py-16 text-right [direction:rtl]">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//         <h1 className="text-4xl font-bold text-center mb-10">הנפקת אישורים</h1>
//         <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-black space-y-4">
//           <div>
//             <label className="font-medium">שם התלמידה</label>
//             <input
//               type="text"
//               value={form.name}
//               onChange={e => handleChange("name", e.target.value)}
//               className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <label className="font-medium">תעודת זהות</label>
//             <input
//               type="text"
//               value={form.id}
//               onChange={e => handleChange("id", e.target.value)}
//               className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <label className="font-medium">שנה עברית</label>
//             <input
//               type="text"
//               value={form.yearHeb}
//               onChange={e => handleChange("yearHeb", e.target.value)}
//               className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg"
//             />
//           </div>

//           <div>
//             <label className="font-medium">סוג האישור</label>
//             <select
//               value={form.type}
//               onChange={e => handleChange("type", e.target.value)}
//               className="w-full mt-1 border border-black rounded-lg px-4 py-2 text-lg bg-white"
//             >
//               {approvals.map(a => (
//                 <option key={a.id} value={a.id}>{a.label}</option>
//               ))}
//             </select>
//           </div>

//           <div className="flex gap-4 justify-center pt-4">
//             <button
//               onClick={generatePdf}
//               className="bg-[#295f8b] text-white font-bold px-6 py-2 rounded-xl border border-black hover:bg-[#1e4a6b]"
//             >
//               הורד PDF
//             </button>
//             <button
//               onClick={printIframe}
//               className="bg-green-600 text-white font-bold px-6 py-2 rounded-xl border border-black hover:bg-green-700"
//             >
//               הדפס
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }
import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { HDate } from "@hebcal/core";
import * as fontkit from "fontkit";
import { Download, Printer } from "lucide-react";
import { motion } from "framer-motion";

const templates = [
  {
    id: "student",
    label: "אישור תלמידה",
    file: "/backgrounds/student.jpg",
    fields: ["name", "id", "hebYear", "yearHeb", "yearEng", "year"],
    positions: {
      name: { x: 271, y: 565 },
      id: { x: 310, y: 510 },
      yearHeb: { x: 228, y: 448 },
      hebYear: { x: 320, y: 448 },
      year: { x: 274, y: 420 },
      dateHeb: { x: 100, y: 800 },
      dateEng: { x: 100, y: 780 },
    },
  },
  {
    id: "btl",
    label: "אישור לביטוח לאומי",
    file: "/backgrounds/btl.jpg",
    fields: ["name", "id", "yearHeb", "yearEng"],
    positions: {
      name: { x: 270, y: 560 },
      id: { x: 310, y: 500 },
      yearHeb: { x: 250, y: 440 },
      yearEng: { x: 220, y: 440 },
      dateHeb: { x: 100, y: 800 },
      dateEng: { x: 100, y: 780 },
    },
  },
  {
    id: "single",
    label: "אישור רווקה",
    file: "/backgrounds/single.jpg",
    fields: ["name", "id", "yearHeb"],
    positions: {
      name: { x: 260, y: 550 },
      id: { x: 300, y: 490 },
      yearHeb: { x: 260, y: 430 },
      dateHeb: { x: 100, y: 800 },
      dateEng: { x: 100, y: 780 },
    },
  },
];

function getTodayDates() {
  const today = new Date();
  const gDate = today.toLocaleDateString("he-IL");
  const hdate = new HDate(today);
  const hDateString = hdate.renderGematriya();
  return {
    dateEng: gDate,
    dateHeb: hDateString,
  };
}

export default function CertificateGenerator() {
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [form, setForm] = useState({});
  const selectedTemplate = templates.find((t) => t.id === templateId);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generate = async () => {
    const { dateEng, dateHeb } = getTodayDates();
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]);

    const imageBytes = await fetch(selectedTemplate.file).then((res) => res.arrayBuffer());
    const embeddedImage = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(embeddedImage, { x: 0, y: 0, width: 595, height: 842 });

    const fontBytes = await fetch("/fonts/david.ttf").then((res) => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const positions = selectedTemplate.positions;

    const data = {
      ...form,
      dateHeb,
      dateEng,
      yearRange:
        form.yearHeb && form.yearEng ? `${form.yearHeb}-${form.yearEng}` : "",
    };

    selectedTemplate.fields.concat(["dateHeb", "dateEng"]).forEach((field) => {
      const value = field === "yearHeb" && data.yearRange ? data.yearRange : data[field];
      const pos = positions[field];
      if (value && pos) {
        page.drawText(value, {
          x: pos.x,
          y: pos.y,
          size: 18,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      }
    });

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "אישור.pdf");
  };

  const fieldLabels = {
    name: "שם התלמידה",
    id: "ת.ז.",
    yearHeb: "בין השנים :",
    yearEng: "ל",
    year: "שנה לימודים",
    hebYear: "שנה עיברית",
  };

  return (
    <div className="pt-28 p-6 max-w-4xl mx-auto text-right [direction:rtl] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-300 shadow-lg p-6 space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex gap-2 items-center">
            <label className="font-medium">בחר סוג אישור</label>
            <select
              value={templateId}
              onChange={(e) => {
                setTemplateId(e.target.value);
                setForm({});
              }}
              className="border border-gray-300 p-2 rounded"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generate}
              className="p-2 rounded hover:bg-gray-200 transition"
              title="הורד PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 rounded hover:bg-gray-200 transition"
              title="הדפס"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {selectedTemplate.fields.map((field) => (
            <div key={field}>
              <label className="block font-medium mb-1">{fieldLabels[field] || field}</label>
              <input
                type="text"
                value={form[field] || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}