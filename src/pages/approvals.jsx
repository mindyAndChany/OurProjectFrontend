

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import * as fontkit from "fontkit";
import moment from "moment";
import 'moment/locale/he';
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";

const templates = [
  {
    id: "student",
    label: "אישור לימודים",
    file: "/backgrounds/student.jpg",
    defaultText: (s) => `לכל המעוניין:\n\nהננו לאשר שהתלמידה:\n\n${s.first_name} ${s.last_name}\nמספר זהות: ${s.id_number}\nסטודנטית במוסדנו\nבשנת הלימודים תשפ"ד (2024-2025)\nבסמינר גור ירושלים`,
  },
  {
    id: "single",
    label: "אישור רווקה",
    file: "/backgrounds/single.jpg",
    defaultText: (s) => `לכל המעוניין:\n\n${s.first_name} ${s.last_name}\nת.ז. ${s.id_number}\nהינה רווקה`,
  },
];

export default function MultiCertificateGenerator() {
  const dispatch = useDispatch();
  const students = useSelector((s) => s.student.studentsData);

  const [templateId, setTemplateId] = useState("student");
  const [selectedStudentsIds, setSelectedStudentsIds] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [filterId, setFilterId] = useState("");

  useEffect(() => {
    dispatch(getStudentDataThunk("track,class_kodesh,id_number,last_name,first_name"));
  }, [dispatch]);

  useEffect(() => {
    setSelectedStudentsIds([]);
  }, [selectedClass, selectedTrack, filterId]);
  const uniqueTracks = [...new Set(students.map((s) => s.track).filter(Boolean))];

  const filtered = students.filter((s) =>
    (!selectedClass || s.class_kodesh === selectedClass) &&
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

  const imageBytes = await fetch("/backgrounds/stamp.png").then((r) => r.arrayBuffer()); // ← שנה לפאת של הקובץ שלך
  // const stampImage = await pdfDoc.embedJpg(imageBytes);
  const stampImage = await pdfDoc.embedPng(imageBytes); 
  const template = templates.find((t) => t.id === templateId);

  for (const student of selectedStudents) {
  const page = pdfDoc.addPage([595, 842]); // A4
  const bgBytes = await fetch(template.file).then((r) => r.arrayBuffer());
  const bg = await pdfDoc.embedJpg(bgBytes);
  page.drawImage(bg, { x: 0, y: 0, width: 595, height: 842 });

  const text = template.defaultText(student);
  const lines = text.split("\n");

  // מיקום טקסט מותאם כמו ב־Word
  let y = 720; // להתחיל גבוה יותר
  for (const line of lines) {
    page.drawText(line, {
      x: 60,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="border p-2 rounded">
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

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
          ת.ז: {s.id_number} | כיתה: {s.class_kodesh}
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
