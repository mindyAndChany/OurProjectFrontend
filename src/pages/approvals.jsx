

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import * as fontkit from "fontkit";
import moment from "moment";
import 'moment/locale/he';
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { getSchoolYearLabel, HEB_SCHOOL_YEAR } from "../utils/constants";

const defaultTemplates = [
  {
    id: "student",
    label: "אישור לימודים",
    file: "/backgrounds/student.jpg",
    defaultText: (s) => `לכל המעוניין:\n\nהננו לאשר שהתלמידה:\n\n${s.first_name} ${s.last_name}\nמספר זהות: ${s.id_number}\nסטודנטית במוסדנו\nבשנת הלימודים ${getSchoolYearLabel()}\nבסמינר גור ירושלים`,
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
  const [filterName, setFilterName] = useState("");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplateLabel, setNewTemplateLabel] = useState("");
  const [newTemplateText, setNewTemplateText] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

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
  }, [selectedClass, selectedTrack, filterId, filterName]);
  const uniqueTracks = [...new Set(students.map((s) => s.track).filter(Boolean))];
  const uniqueClasses = [...new Set(students.map((s) => s.class_kodesh || s.class_teaching).filter(Boolean))].sort();

  const selectAllStudents = () => {
    setSelectedStudentsIds(sorted.map(s => s.id_number));
  };

  const clearSelection = () => {
    setSelectedStudentsIds([]);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const filtered = students.filter((s) =>
    (!selectedClass || s.class_teaching === selectedClass || s.class_kodesh === selectedClass) &&
    (!selectedTrack || s.track === selectedTrack) &&
    (!filterId || s.id_number?.includes(filterId)) &&
    (!filterName || `${s.first_name} ${s.last_name}`.toLowerCase().includes(filterName.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    const comparison = aVal.toString().localeCompare(bVal.toString(), 'he');
    return sortDirection === 'asc' ? comparison : -comparison;
  });

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
  const dateHebrew = student.birthdate_hebrew || HEB_SCHOOL_YEAR();
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
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
            placeholder="סינון לפי שם"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="סינון לפי ת.ז."
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">בחר כיתה</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

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

        <div className="flex gap-3 justify-center">
          <button
            onClick={selectAllStudents}
            disabled={sorted.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            ✓ בחר הכל ({sorted.length})
          </button>
          <button
            onClick={clearSelection}
            disabled={selectedStudentsIds.length === 0}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            ✕ נקה בחירה
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded mb-3 flex gap-3 justify-center flex-wrap">
          <button onClick={() => handleSort('first_name')} className="bg-white px-3 py-1 rounded shadow hover:bg-gray-50 text-sm">
            מיין לפי שם פרטי {getSortIcon('first_name')}
          </button>
          <button onClick={() => handleSort('last_name')} className="bg-white px-3 py-1 rounded shadow hover:bg-gray-50 text-sm">
            מיין לפי שם משפחה {getSortIcon('last_name')}
          </button>
          <button onClick={() => handleSort('class_kodesh')} className="bg-white px-3 py-1 rounded shadow hover:bg-gray-50 text-sm">
            מיין לפי כיתה {getSortIcon('class_kodesh')}
          </button>
          <button onClick={() => handleSort('track')} className="bg-white px-3 py-1 rounded shadow hover:bg-gray-50 text-sm">
            מיין לפי התמחות {getSortIcon('track')}
          </button>
          <button onClick={() => handleSort('id_number')} className="bg-white px-3 py-1 rounded shadow hover:bg-gray-50 text-sm">
            מיין לפי ת.ז. {getSortIcon('id_number')}
          </button>
        </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border max-h-[500px] overflow-y-auto">
  {sorted.map((s) => (
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
            disabled={selectedStudentsIds.length === 0}
            onClick={generateMultiplePDFs}
            className="bg-[#0A3960] text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            צור אישורים מרוכזים ({selectedStudentsIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}
