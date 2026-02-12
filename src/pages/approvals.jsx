
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



// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { PDFDocument, rgb } from "pdf-lib";
// import { saveAs } from "file-saver";
// import * as fontkit from "fontkit";
// import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
//  import { getStudentByIdThunk } from "../redux/slices/STUDENTS/getStudentByIdThunk";
// import moment from "moment";
// import 'moment/locale/he';

// const templates = [
//   {
//     id: "student",
//     label: "אישור לימודים",
//     file: "/backgrounds/student.jpg",
//     defaultText: (student) =>
//       `לכל המעוניין:\n\nהננו לאשר שהתלמידה:\n\n${student.first_name} ${student.last_name}\nמספר זהות: ${student.id_number}\nסטודנטית במוסדנו סמל מוסד 765192\nבשנת הלימודים תשפ"ד (2024-2025)\nבסמינר גור ירושלים`,
//   },
//   {
//     id: "single",
//     label: "אישור רווקה",
//     file: "/backgrounds/single.jpg",
//     defaultText: (student) =>
//       `לכל המעוניין:\n\nהננו לאשר כי התלמידה:\n${student.first_name} ${student.last_name}\nת.ז. ${student.id_number}\nהינה רווקה`,
//   },
// ];

// export default function CertificateAutoGenerator() {
//   const dispatch = useDispatch();
//   const studentsData = useSelector((state) => state.student.studentsData);

//   const [templateId, setTemplateId] = useState(templates[0].id);
//   const [idInput, setIdInput] = useState("");
//   const [student, setStudent] = useState(null);
//   const [customText, setCustomText] = useState("");
//   const [id, setId] = useState("");

//   useEffect(() => {
//     // dispatch(getStudentDataThunk("all"));
//   }, [dispatch]);

//   useEffect(() => {
//     // const found = studentsData.find((s) => s.id_number === idInput);
//     // if (found) setStudent(found);
//    setId(idInput)
//    debugger
//     dispatch(getStudentByIdThunk(idInput));
//   }, [idInput, studentsData]);

//   const selectedTemplate = templates.find((t) => t.id === templateId);

//   const generatePDF = async () => {
//     if (!student) return;

//     const pdfDoc = await PDFDocument.create();
//     pdfDoc.registerFontkit(fontkit);
//     const page = pdfDoc.addPage([595, 842]);

//     const imageBytes = await fetch(selectedTemplate.file).then((res) => res.arrayBuffer());
//     const background = await pdfDoc.embedJpg(imageBytes);
//     page.drawImage(background, { x: 0, y: 0, width: 595, height: 842 });

//     const fontBytes = await fetch("/fonts/arial.ttf").then((res) => res.arrayBuffer());
//     const font = await pdfDoc.embedFont(fontBytes);

//     const dateHebrew = student.birthdate_hebrew || "תשפ\"ד";
//     const dateEnglish = moment().locale("he").format("DD.MM.YYYY");

//     // תאריך בפינה שמאלית עליונה
//     page.drawText(`${dateHebrew} / ${dateEnglish}`, {
//       x: 400,
//       y: 780,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // כותרת
//     page.drawText("אישור", {
//       x: 270,
//       y: 750,
//       size: 18,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // תוכן
//     const text = customText.trim()
//       ? customText
//       : selectedTemplate.defaultText(student);

//     const lines = text.split("\n");
//     let y = 700;
//     for (const line of lines) {
//       page.drawText(line, {
//         x: 80,
//         y,
//         size: 14,
//         font,
//         color: rgb(0, 0, 0),
//       });
//       y -= 25;
//     }

//     const pdfBytes = await pdfDoc.save();
//     saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `${student.first_name} ${student.last_name}אישור.pdf`);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto text-right [direction:rtl] space-y-6">
//       <div className="bg-white p-6 rounded-xl shadow-md border space-y-4">
//         <div className="flex gap-4 items-center">
//           <label>בחר תבנית:</label>
//           <select
//             value={templateId}
//             onChange={(e) => setTemplateId(e.target.value)}
//             className="border p-2 rounded"
//           >
//             {templates.map((t) => (
//               <option key={t.id} value={t.id}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex gap-4 items-center">
//           <label>הכנס ת"ז:</label>
//           <input
//             type="text"
//             value={idInput}
//             onChange={(e) => setIdInput(e.target.value)}
//             className="border p-2 rounded w-full"
//           />
//         </div>

//         <div>
//           <label className="block mb-1">טקסט מותאם אישית (רשות):</label>
//           <textarea
//             rows="5"
//             className="border rounded w-full p-2"
//             placeholder="אם תזיני כאן טקסט – הוא יחליף את ברירת המחדל מהתבנית"
//             value={customText}
//             onChange={(e) => setCustomText(e.target.value)}
//           />
//         </div>

//         <button
//           disabled={!student}
//           onClick={generatePDF}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           צור אישור
//         </button>

//         {student && (
//           <div className="text-sm text-gray-600">
//             {student.first_name} {student.last_name} נטענה בהצלחה
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import * as fontkit from "fontkit";
import moment from "moment";
import 'moment/locale/he';
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";

const defaultTemplates = [
  {
    id: "student",
    label: "אישור לימודים",
    file: "/backgrounds/student.jpg",
    defaultText: (s) => `לכל המעוניין:\n\nהננו לאשר שהתלמידה:\n\n${s.first_name} ${s.last_name}\nמספר זהות: ${s.id_number}\nסטודנטית במוסדנו\nבשנת הלימודים תשפ"ד (2024-2025)\nבסמינר גור ירושלים`,
    isCustom: false
  },
  {
    id: "single",
    label: "אישור רווקה",
    file: "/backgrounds/single.jpg",
    defaultText: (s) => `לכל המעוניין:\n\n${s.first_name} ${s.last_name}\nת.ז. ${s.id_number}\nהינה רווקה`,
    isCustom: false
  },
];

export default function MultiCertificateGenerator() {
  const dispatch = useDispatch();
  const students = useSelector((s) => s.student.studentsData);

  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('customTemplates');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map(t => {
        if (t.isCustom && t.textTemplate) {
          const textTemplate = t.textTemplate;
          return {
            ...t,
            defaultText: (s) => textTemplate
              .replace('{שם}', `${s.first_name} ${s.last_name}`)
              .replace('{תעודת_זהות}', s.id_number)
              .replace('{כיתה}', s.class_kodesh || s.class_teaching || '')
              .replace('{התמחות}', s.track || '')
          };
        }
        return defaultTemplates.find(dt => dt.id === t.id) || t;
      });
    }
    return defaultTemplates;
  });
  const [templateId, setTemplateId] = useState("student");
  const [selectedStudentsIds, setSelectedStudentsIds] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [filterId, setFilterId] = useState("");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplateLabel, setNewTemplateLabel] = useState("");
  const [newTemplateText, setNewTemplateText] = useState("");

  useEffect(() => {
    dispatch(getStudentDataThunk("first_name,last_name,id_number,class_kodesh,track,birthdate_hebrew"));
  }, [dispatch]);

  useEffect(() => {
    if (students.length > 0) {
      console.log("Sample student data:", students[0]);
      console.log("All keys:", Object.keys(students[0]));
    }
  }, [students]);

  useEffect(() => {
    const templatesToSave = templates.map(t => {
      if (t.isCustom) {
        return { ...t, defaultText: t.textTemplate };
      }
      return { id: t.id, label: t.label, file: t.file, isCustom: false };
    });
    localStorage.setItem('customTemplates', JSON.stringify(templatesToSave));
  }, [templates]);

  const addNewTemplate = () => {
    if (!newTemplateLabel.trim() || !newTemplateText.trim()) {
      alert("יש למלא את שם האישור והטקסט");
      return;
    }
    const newTemplate = {
      id: `custom_${Date.now()}`,
      label: newTemplateLabel,
      file: "/backgrounds/student.jpg",
      textTemplate: newTemplateText,
      defaultText: (s) => newTemplateText
        .replace('{שם}', `${s.first_name} ${s.last_name}`)
        .replace('{תעודת_זהות}', s.id_number)
        .replace('{כיתה}', s.class_kodesh || s.class_teaching || '')
        .replace('{התמחות}', s.track || ''),
      isCustom: true
    };
    setTemplates([...templates, newTemplate]);
    setNewTemplateLabel("");
    setNewTemplateText("");
    setShowAddTemplate(false);
    alert("סוג אישור חדש נוסף בהצלחה!");
  };

  const deleteTemplate = (id) => {
    if (window.confirm("האם למחוק סוג אישור זה?")) {
      setTemplates(templates.filter(t => t.id !== id));
      if (templateId === id) setTemplateId("student");
    }
  };

  useEffect(() => {
    setSelectedStudentsIds([]);
  }, [selectedClass, selectedTrack, filterId]);
  const uniqueTracks = [...new Set(students.map((s) => s.track).filter(Boolean))];

  const filtered = students.filter((s) =>
    (!selectedClass || s.class_teaching === selectedClass || s.class_kodesh === selectedClass) &&
    (!selectedTrack || s.track === selectedTrack) &&
    (!filterId || s.id_number?.includes(filterId))
  );

  const toggleStudent = (id) => {
    setSelectedStudentsIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // const generateMultiplePDFs = async () => {
  //   const pdfDoc = await PDFDocument.create();
  //   pdfDoc.registerFontkit(fontkit);
  //   const fontBytes = await fetch("/fonts/arial.ttf").then((r) => r.arrayBuffer());
  //   const font = await pdfDoc.embedFont(fontBytes);
  //   const template = templates.find((t) => t.id === templateId);

  //   const selectedStudents = students.filter((s) => selectedStudentsIds.includes(s.id_number));

  //   for (const student of selectedStudents) {
  //     const page = pdfDoc.addPage([595, 842]);
  //     const bgBytes = await fetch(template.file).then((r) => r.arrayBuffer());
  //     const bg = await pdfDoc.embedJpg(bgBytes);
  //     page.drawImage(bg, { x: 0, y: 0, width: 595, height: 842 });

  //     const text = template.defaultText(student);
  //     const lines = text.split("\n");
  //     let y = 700;
  //     for (const line of lines) {
  //       page.drawText(line, {
  //         x: 80,
  //         y,
  //         size: 14,
  //         font,
  //         color: rgb(0, 0, 0),
  //       });
  //       y -= 25;
  //     }

  //     const dateHebrew = student.birthdate_hebrew || "תשפ\"ד";
  //     const dateEnglish = moment().locale("he").format("DD.MM.YYYY");
  //     page.drawText(`${dateHebrew} / ${dateEnglish}`, {
  //       x: 400,
  //       y: 780,
  //       size: 12,
  //       font,
  //       color: rgb(0, 0, 0),
  //     });
  //   }

  //   const pdfBytes = await pdfDoc.save();
  //   saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "אישורים_מרוכזים.pdf");
  // };
  // const generateMultiplePDFs = async () => {
  //   const pdfDoc = await PDFDocument.create();
  //   pdfDoc.registerFontkit(fontkit);
  //   const fontBytes = await fetch("/fonts/arial.ttf").then((r) => r.arrayBuffer());
  //   const font = await pdfDoc.embedFont(fontBytes);
  //   const template = templates.find((t) => t.id === templateId);

  //   // ✅ שימוש בתלמידות שנבחרו, ואם אין — כל המסוננות
  //   const selectedStudents = selectedStudentsIds.length > 0
  //     ? filtered.filter((s) => selectedStudentsIds.includes(s.id_number))
  //     : filtered;

  //   if (selectedStudents.length === 0) {
  //     alert("לא נבחרו תלמידות ולא קיימות תלמידות במסנן.");
  //     return;
  //   }

  //   for (const student of selectedStudents) {
  //     const page = pdfDoc.addPage([595, 842]);
  //     const bgBytes = await fetch(template.file).then((r) => r.arrayBuffer());
  //     const bg = await pdfDoc.embedJpg(bgBytes);
  //     page.drawImage(bg, { x: 0, y: 0, width: 595, height: 842 });

  //     const text = template.defaultText(student);
  //     const lines = text.split("\n");
  //     let y = 700;
  //     for (const line of lines) {
  //       page.drawText(line, {
  //         x: 80,
  //         y,
  //         size: 14,
  //         font,
  //         color: rgb(0, 0, 0),
  //       });
  //       y -= 25;
  //     }

  //     const dateHebrew = student.birthdate_hebrew || "תשפ\"ד";
  //     const dateEnglish = moment().locale("he").format("DD.MM.YYYY");
  //     page.drawText(`${dateHebrew} / ${dateEnglish}`, {
  //       x: 400,
  //       y: 780,
  //       size: 12,
  //       font,
  //       color: rgb(0, 0, 0),
  //     });
  //   }

  //   const pdfBytes = await pdfDoc.save();
  //   saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "אישורים_מרוכזים.pdf");
  // };
const generateMultiplePDFs = async () => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = await fetch("/fonts/arial.ttf").then((r) => r.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  const selectedStudents = selectedStudentsIds.length > 0
    ? filtered.filter((s) => selectedStudentsIds.includes(s.id_number))
    : filtered;

  if (selectedStudents.length === 0) {
    alert("לא נבחרו תלמידות ולא קיימות תלמידות במסנן.");
    return;
  }

  const template = templates.find((t) => t.id === templateId);
  if (!template || typeof template.defaultText !== 'function') {
    alert("שגיאה: תבנית לא נמצאה");
    return;
  }

  const imageBytes = await fetch("/backgrounds/stamp.png").then((r) => r.arrayBuffer());
  const stampImage = await pdfDoc.embedPng(imageBytes);

  for (const student of selectedStudents) {
  const page = pdfDoc.addPage([595, 842]); // A4
  const bgBytes = await fetch(template.file).then((r) => r.arrayBuffer());
  const bg = await pdfDoc.embedJpg(bgBytes);
  page.drawImage(bg, { x: 0, y: 0, width: 595, height: 842 });

  const text = template.defaultText(student);
  const lines = text.split("\n");

  // מיקום טקסט מותאם כמו ב־Word
  let y = 720;
  for (const line of lines) {
    const textWidth = font.widthOfTextAtSize(line, 14);
    const centerX = (595 - textWidth) / 2;
    page.drawText(line, {
      x: centerX,
      y,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 24;
  }

  // תאריך מוצג למעלה בצד ימין
  const dateHebrew = student.birthdate_hebrew || "תשפ\"ד";
  const dateEnglish = moment().locale("he").format("DD.MM.YYYY");
  page.drawText(`${dateHebrew} / ${dateEnglish}`, {
    x: 450,
    y: 820,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  // חתימה – הטמע את החתימה שלך (JPEG/PNG) אם יש
  const signatureBytes = await fetch("/backgrounds/stamp.png").then((r) => r.arrayBuffer());
  const signatureImage = await pdfDoc.embedPng(signatureBytes);
  page.drawImage(signatureImage, {
    x: 220, // מיקום מרכזי תחתון
    y: 100,
    width: 150,
    height: 75,
  });
}

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "אישורים_מרוכזים.pdf");
};

  return (
    <div className="pt-28 p-6 [direction:rtl] font-sans bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow border space-y-6 max-w-6xl mx-auto">
        <h2 className="text-xl font-bold">אישורים לתלמידות</h2>

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <button
            onClick={() => setShowAddTemplate(!showAddTemplate)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-3"
          >
            {showAddTemplate ? "ביטול" : "+ הוסף סוג אישור חדש"}
          </button>

          {showAddTemplate && (
            <div className="space-y-4 mt-3 bg-white p-5 rounded border">
              <div>
                <label className="block font-semibold mb-2 text-gray-700">שם סוג האישור:</label>
                <input
                  placeholder="לדוגמה: אישור השתתפות בקורס"
                  value={newTemplateLabel}
                  onChange={(e) => setNewTemplateLabel(e.target.value)}
                  className="border p-3 rounded w-full text-lg"
                />
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-gray-700">תוכן האישור:</label>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-2 text-sm">
                  <p className="font-semibold mb-1">💡 טיפ: השתמש במילים המיוחדות הבאות:</p>
                  <ul className="mr-4 space-y-1">
                    <li>• <span className="font-mono bg-white px-2 py-0.5 rounded">{'{'}שם{'}'}</span> - יוחלף בשם התלמידה המלא</li>
                    <li>• <span className="font-mono bg-white px-2 py-0.5 rounded">{'{'}תעודת_זהות{'}'}</span> - יוחלף במספר תעודת הזהות</li>
                    <li>• <span className="font-mono bg-white px-2 py-0.5 rounded">{'{'}כיתה{'}'}</span> - יוחלף בכיתה</li>
                    <li>• <span className="font-mono bg-white px-2 py-0.5 rounded">{'{'}התמחות{'}'}</span> - יוחלף בהתמחות</li>
                  </ul>
                </div>
                <textarea
                  placeholder={`דוגמה לטקסט אישור:

לכל המעוניין,

הננו לאשר כי התלמידה {שם}
מספר תעודת זהות: {תעודת_זהות}
מכיתה {כיתה}
השתתפה בקורס מיוחד במוסדנו.

בברכה,
הנהלת הסמינר`}
                  value={newTemplateText}
                  onChange={(e) => setNewTemplateText(e.target.value)}
                  rows="8"
                  className="border p-3 rounded w-full text-lg font-sans"
                  style={{lineHeight: '1.6'}}
                />
              </div>
              
              <button
                onClick={addNewTemplate}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg font-semibold w-full"
              >
                ✓ שמור את סוג האישור החדש
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex gap-2">
            <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="border p-2 rounded flex-1">
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            {templates.find(t => t.id === templateId)?.isCustom && (
              <button
                onClick={() => deleteTemplate(templateId)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
                title="מחק סוג אישור"
              >
                ✕
              </button>
            )}
          </div>

          <input
            placeholder="סינון לפי ת.ז."
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="סינון לפי כיתה"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">בחר התמחות</option>
            {uniqueTracks.map((track) => (
              <option key={track} value={track}>{track}</option>
            ))}
          </select>
        </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border max-h-[500px] overflow-y-auto">
  {filtered.map((s) => (
    <div
      key={s.id_number}
      className="flex gap-3 items-start border p-3 rounded shadow-sm bg-white relative"
    >
      <input
        type="checkbox"
        checked={selectedStudentsIds.includes(s.id_number)}
        onChange={() => toggleStudent(s.id_number)}
        className="mt-1 appearance-auto"
      />
      <div>
        <div className="font-medium text-base">
          {s.first_name} {s.last_name}
        </div>
        <div className="text-sm text-gray-600">
          ת.ז: {s.id_number} | כיתה: {s.class_kodesh || s.class_teaching || "ללא"}
        </div>
        <div className="text-sm text-gray-600">
          התמחות: {s.track || "—"}
        </div>
      </div>
    </div>
  ))}
</div>

        <div className="text-center">
          <button
            disabled={filtered.length === 0 && selectedStudentsIds.length === 0}
            onClick={generateMultiplePDFs}
            className="bg-[#0A3960] text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            צור אישורים מרוכזים
          </button>
        </div>
      </div>
    </div>
  );
}
