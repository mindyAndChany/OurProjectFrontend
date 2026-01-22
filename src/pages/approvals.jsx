
// import { useState } from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// import { saveAs } from "file-saver";
// import { HDate } from "@hebcal/core";
// import * as fontkit from "fontkit";
// import { Download, Printer } from "lucide-react";
// import { motion } from "framer-motion";

// const templates = [
//   {
//     id: "student",
//     label: "אישור תלמידה",
//     file: "/backgrounds/student.jpg",
//     fields: ["name", "id", "hebYear", "yearHeb", "yearEng", "year"],
//     positions: {
//       name: { x: 271, y: 565 },
//       id: { x: 310, y: 510 },
//       yearHeb: { x: 228, y: 448 },
//       hebYear: { x: 320, y: 448 },
//       year: { x: 274, y: 420 },
//       dateHeb: { x: 100, y: 800 },
//       dateEng: { x: 100, y: 780 },
//     },
//   },
//   {
//     id: "btl",
//     label: "אישור לביטוח לאומי",
//     file: "/backgrounds/btl.jpg",
//     fields: ["name", "id", "yearHeb", "yearEng"],
//     positions: {
//       name: { x: 270, y: 560 },
//       id: { x: 310, y: 500 },
//       yearHeb: { x: 250, y: 440 },
//       yearEng: { x: 220, y: 440 },
//       dateHeb: { x: 100, y: 800 },
//       dateEng: { x: 100, y: 780 },
//     },
//   },
//   {
//     id: "single",
//     label: "אישור רווקה",
//     file: "/backgrounds/single.jpg",
//     fields: ["name", "id", "yearHeb"],
//     positions: {
//       name: { x: 260, y: 550 },
//       id: { x: 300, y: 490 },
//       yearHeb: { x: 260, y: 430 },
//       dateHeb: { x: 100, y: 800 },
//       dateEng: { x: 100, y: 780 },
//     },
//   },
// ];

// function getTodayDates() {
//   const today = new Date();
//   const gDate = today.toLocaleDateString("he-IL");
//   const hdate = new HDate(today);
//   const hDateString = hdate.renderGematriya();
//   return {
//     dateEng: gDate,
//     dateHeb: hDateString,
//   };
// }

// export default function CertificateGenerator() {
//   const [templateId, setTemplateId] = useState(templates[0].id);
//   const [form, setForm] = useState({});
//   const selectedTemplate = templates.find((t) => t.id === templateId);

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const generate = async () => {
//     const { dateEng, dateHeb } = getTodayDates();
//     const pdfDoc = await PDFDocument.create();
//     pdfDoc.registerFontkit(fontkit);
//     const page = pdfDoc.addPage([595, 842]);

//     const imageBytes = await fetch(selectedTemplate.file).then((res) => res.arrayBuffer());
//     const embeddedImage = await pdfDoc.embedJpg(imageBytes);
//     page.drawImage(embeddedImage, { x: 0, y: 0, width: 595, height: 842 });

//     const fontBytes = await fetch("/fonts/arial.ttf").then((res) => res.arrayBuffer());
//     const customFont = await pdfDoc.embedFont(fontBytes);

//     const positions = selectedTemplate.positions;

//     const data = {
//       ...form,
//       dateHeb,
//       dateEng,
//       yearRange:
//         form.yearHeb && form.yearEng ? `${form.yearHeb}-${form.yearEng}` : "",
//     };

//     selectedTemplate.fields.concat(["dateHeb", "dateEng"]).forEach((field) => {
//       const value = field === "yearHeb" && data.yearRange ? data.yearRange : data[field];
//       const pos = positions[field];
//       if (value && pos) {
//         page.drawText(value, {
//           x: pos.x,
//           y: pos.y,
//           size: 18,
//           font: customFont,
//           color: rgb(0, 0, 0),
//         });
//       }
//     });

//     const pdfBytes = await pdfDoc.save();
//     saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "אישור.pdf");
//   };

//   const fieldLabels = {
//     name: "שם התלמידה",
//     id: "ת.ז.",
//     yearHeb: "בין השנים :",
//     yearEng: "ל",
//     year: "שנה לימודים",
//     hebYear: "שנה עיברית",
//   };

//   return (
//     <div className="pt-28 p-6 max-w-4xl mx-auto text-right [direction:rtl] font-sans">
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-2xl border border-gray-300 shadow-lg p-6 space-y-6"
//       >
//         <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
//           <div className="flex gap-2 items-center">
//             <label className="font-medium">בחר סוג אישור</label>
//             <select
//               value={templateId}
//               onChange={(e) => {
//                 setTemplateId(e.target.value);
//                 setForm({});
//               }}
//               className="border border-gray-300 p-2 rounded"
//             >
//               {templates.map((t) => (
//                 <option key={t.id} value={t.id}>
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={generate}
//               className="p-2 rounded hover:bg-gray-200 transition"
//               title="הורד PDF"
//             >
//               <Download className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="p-2 rounded hover:bg-gray-200 transition"
//               title="הדפס"
//             >
//               <Printer className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {selectedTemplate.fields.map((field) => (
//             <div key={field}>
//               <label className="block font-medium mb-1">{fieldLabels[field] || field}</label>
//               <input
//                 type="text"
//                 value={form[field] || ""}
//                 onChange={(e) => handleChange(field, e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2"
//               />
//             </div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { PDFDocument, rgb } from "pdf-lib";
// import { saveAs } from "file-saver";
// import * as fontkit from "fontkit";
// import { getStudentByIdThunk } from "../redux/slices/STUDENTS/getStudentByIdThunk";

// const templates = {
//   student: {
//     label: "אישור לימודים",
//     file: "/backgrounds/student.jpg",
//   },
//   single: {
//     label: "אישור רווקה",
//     file: "/backgrounds/single.jpg",
//   },
// };

// export default function CertificateAutoGenerator() {
//   const dispatch = useDispatch();
//   const student = useSelector((state) => state.student.selectedStudent);
//   const loading = useSelector((state) => state.student.loading);

//   const [templateId, setTemplateId] = useState("student");
//   const [idInput, setIdInput] = useState("");

//   const generatePDF = async () => {
//     if (!student) return;

//     const pdfDoc = await PDFDocument.create();
//     pdfDoc.registerFontkit(fontkit);
//     const page = pdfDoc.addPage([595, 842]);

//     // רקע – חתימה בלבד
//     const imageBytes = await fetch(templates[templateId].file).then(r => r.arrayBuffer());
//     const bg = await pdfDoc.embedJpg(imageBytes);
//     page.drawImage(bg, { x: 0, y: 0, width: 595, height: 842 });

//     const fontBytes = await fetch("/fonts/arial.ttf").then(r => r.arrayBuffer());
//     const font = await pdfDoc.embedFont(fontBytes);

//     const draw = (text, x, y, size = 18) => {
//       page.drawText(String(text), { x, y, size, font, color: rgb(0, 0, 0) });
//     };

//     /* ====== תוכן דינמי של האישור ====== */

//     // כותרת
//     draw("אישור", 270, 760, 22);

//     if (templateId === "student") {
//       draw("לכל המעוניין:", 420, 700);
//       draw("הננו לאשר שהתלמידה:", 380, 660);

//       draw(`${student.first_name} ${student.last_name}`, 200, 620, 20);
//       draw(`מספר זהות: ${student.id_number}`, 200, 590);

//       draw("סטודנטית במוסדנו סמל מוסד 291567", 160, 550);
//       draw("בשנת הלימודים תשפ\"ו (2025–2026)", 150, 520);
//       draw("בסמינר גור ירושלים", 200, 490);
//     }

//     if (templateId === "single") {
//       draw("הננו לאשר שהתלמידה:", 380, 660);
//       draw(`${student.first_name} ${student.last_name}`, 200, 620, 20);
//       draw(`מספר זהות: ${student.id_number}`, 200, 590);
//       draw("ידועה ומוכרת לנו כרווקה.", 200, 550);
//     }

//     // תאריך
//     const today = new Date().toLocaleDateString("he-IL");
//     draw(today, 60, 120);

//     const pdfBytes = await pdfDoc.save();
//     saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "אישור.pdf");
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto text-right [direction:rtl]">
//       <div className="space-y-4 bg-white p-6 rounded-xl border shadow">

//         <select
//           value={templateId}
//           onChange={(e) => setTemplateId(e.target.value)}
//           className="border p-2 rounded w-full"
//         >
//           {Object.entries(templates).map(([k, v]) => (
//             <option key={k} value={k}>{v.label}</option>
//           ))}
//         </select>

//         <input
//           placeholder="הכנס תעודת זהות"
//           value={idInput}
//           onChange={(e) => {
//             const id = e.target.value;
//             setIdInput(id);
//             if (id.length >= 6) dispatch(getStudentByIdThunk(id));
//           }}
//           className="border p-2 rounded w-full"
//         />

//         <button
//           disabled={!student || loading}
//           onClick={generatePDF}
//           className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
//         >
//           צור אישור
//         </button>

//         {student && (
//           <div className="text-sm text-gray-600">
//             נטענה: {student.first_name} {student.last_name}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import * as fontkit from "fontkit";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
 import { getStudentByIdThunk } from "../redux/slices/STUDENTS/getStudentByIdThunk";
import moment from "moment";
import 'moment/locale/he';

const templates = [
  {
    id: "student",
    label: "אישור לימודים",
    file: "/backgrounds/student.jpg",
    defaultText: (student) =>
      `לכל המעוניין:\n\nהננו לאשר שהתלמידה:\n\n${student.first_name} ${student.last_name}\nמספר זהות: ${student.id_number}\nסטודנטית במוסדנו סמל מוסד 765192\nבשנת הלימודים תשפ"ד (2024-2025)\nבסמינר גור ירושלים`,
  },
  {
    id: "single",
    label: "אישור רווקה",
    file: "/backgrounds/single.jpg",
    defaultText: (student) =>
      `לכל המעוניין:\n\nהננו לאשר כי התלמידה:\n${student.first_name} ${student.last_name}\nת.ז. ${student.id_number}\nהינה רווקה`,
  },
];

export default function CertificateAutoGenerator() {
  const dispatch = useDispatch();
  const studentsData = useSelector((state) => state.student.studentsData);

  const [templateId, setTemplateId] = useState(templates[0].id);
  const [idInput, setIdInput] = useState("");
  const [student, setStudent] = useState(null);
  const [customText, setCustomText] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    // dispatch(getStudentDataThunk("all"));
  }, [dispatch]);

  useEffect(() => {
    // const found = studentsData.find((s) => s.id_number === idInput);
    // if (found) setStudent(found);
   setId(idInput)
    dispatch(getStudentByIdThunk(id));
  }, [idInput, studentsData]);

  const selectedTemplate = templates.find((t) => t.id === templateId);

  const generatePDF = async () => {
    if (!student) return;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]);

    const imageBytes = await fetch(selectedTemplate.file).then((res) => res.arrayBuffer());
    const background = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(background, { x: 0, y: 0, width: 595, height: 842 });

    const fontBytes = await fetch("/fonts/arial.ttf").then((res) => res.arrayBuffer());
    const font = await pdfDoc.embedFont(fontBytes);

    const dateHebrew = student.birthdate_hebrew || "תשפ\"ד";
    const dateEnglish = moment().locale("he").format("DD.MM.YYYY");

    // תאריך בפינה שמאלית עליונה
    page.drawText(`${dateHebrew} / ${dateEnglish}`, {
      x: 400,
      y: 780,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // כותרת
    page.drawText("אישור", {
      x: 270,
      y: 750,
      size: 18,
      font,
      color: rgb(0, 0, 0),
    });

    // תוכן
    const text = customText.trim()
      ? customText
      : selectedTemplate.defaultText(student);

    const lines = text.split("\n");
    let y = 700;
    for (const line of lines) {
      page.drawText(line, {
        x: 80,
        y,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 25;
    }

    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `${student.first_name} ${student.last_name}אישור.pdf`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-right [direction:rtl] space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border space-y-4">
        <div className="flex gap-4 items-center">
          <label>בחר תבנית:</label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="border p-2 rounded"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 items-center">
          <label>הכנס ת"ז:</label>
          <input
            type="text"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">טקסט מותאם אישית (רשות):</label>
          <textarea
            rows="5"
            className="border rounded w-full p-2"
            placeholder="אם תזיני כאן טקסט – הוא יחליף את ברירת המחדל מהתבנית"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
        </div>

        <button
          disabled={!student}
          onClick={generatePDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          צור אישור
        </button>

        {student && (
          <div className="text-sm text-gray-600">
            {student.first_name} {student.last_name} נטענה בהצלחה
          </div>
        )}
      </div>
    </div>
  );
}
