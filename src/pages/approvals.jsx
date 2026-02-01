
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

    const fontBytes = await fetch("/fonts/arial.ttf").then((res) => res.arrayBuffer());
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