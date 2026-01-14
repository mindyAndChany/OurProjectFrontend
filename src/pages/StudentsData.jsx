import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { FileDown, Printer } from "lucide-react";

const normalizeKey = (key) =>
  key
    .replace(/\u200f|\u200e/g, '') // הסרת תווי RTL חבויים
    .replace(/\s+/g, ' ')          // המרת רווחים כפולים
    .trim();

const handleExcelImport = (event, dispatch) => {
  console.log("📥 התחלת ייבוא קובץ אקסל...");

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = new Uint8Array(reader.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (rows.length === 0) {
        console.warn("❗ הקובץ ריק או ללא שורות נתונים");
        return;
      }

      // בדיקת כותרות
      const headers = Object.keys(rows[0]).map(normalizeKey);
      const unknownHeaders = headers.filter((h) => !fieldsDict[h]);
      if (unknownHeaders.length > 0) {
        console.warn("⚠️ כותרות לא מזוהות:", unknownHeaders);
      }

      // מיפוי שורות
      const mappedStudents = rows.map((row, i) => {
        const newStudent = {};
        Object.entries(row).forEach(([key, value]) => {
          const normKey = normalizeKey(key);
          const field = fieldsDict[normKey];
          if (field && value !== "") {
            newStudent[field] = value;
          }
        });
        return newStudent;
      });

      // סינון אובייקטים ריקים
      const filtered = mappedStudents.filter((s) => Object.keys(s).length > 0);

      if (filtered.length === 0) {
        console.warn("❗ כל השורות ריקות אחרי מיפוי – ודא שהכותרות נכונות");
        return;
      }

      console.log(`✅ ${filtered.length} תלמידים ייובאו:`, filtered);
      dispatch(addStudentsThunk(filtered));

    } catch (err) {
      console.error("❌ שגיאה בקריאת הקובץ:", err);
    }
  };

  reader.readAsArrayBuffer(file);
};



// רשימת כל השדות

const fieldsDict = {
    "ת. זהות": "id_number",
    "סכום ששלמה": "paid_amount",
    "מס' סידורי": "serial_number",
    "כיתה": "class_kodesh",
    "הוראה": "is_graduate",
    "משפחה": "last_name",
    "שם פרטי": "first_name",
    "שם חיבה": "nickname",
    "ת.לידה עברי": "birthdate_hebrew",
    "ת.לידה לועזי": "birthdate_gregorian",
    "כתובת": "address",
    "מיקוד": "zipcode",
    "שם האב": "father_name_he",
    "נייד אבא": "father_mobile_he",
    "שם האם": "mother_name_he",
    "נייד אמא": "mother_name_he",
    "התמחות": "track",
    "התמתחות נוספת": "track2",
    "אופציה ב": "track3",
    " מצב אישי": "marital_status",
    "הוראה": "class_teaching",
    "מדפית": "bookshelf",
    "הערות": "notes",
    "פרח": "perach",
    "אמא חוץ": "external_mother",
    "אבא חוץ": "external_father",
    "ארץ לידה": "birth_country",
    "תאריך חתונה": "married_date",
    "שם אחרי החתונה": "married_name",
    "נייד אישי": "personal_mobile",
    "מגמה": "trend",
    "חץ": "chetz",
    "טלפון": "phone",
    "א. תשלום": "Payment method"
}

const fieldOptions = [...new Set(Object.values(fieldsDict))];

const fieldsDictHeb = Object.fromEntries(
    Object.entries(fieldsDict).map(([he, en]) => [en, he])
);


const fieldGroups = {
  basic: ["first_name", "last_name", "id_number", "class_kodesh"],
  personal: [
    "first_name", "last_name", "id_number", "phone", "marital_status", "address",
    "father_name_he", "father_mobile_he", "mother_name_he", "mother_mobile_he", "class_kodesh"
  ],
  payments: ["first_name", "last_name", "id_number", "payment_status", "paid_amount", "class_kodesh"],
  phonebook: ["first_name", "last_name", "phone", "class_kodesh"]
};

const filterFields = ["class_kodesh", "id_number", "first_name", "last_name"];

const fieldLabels = {
  first_name: "שם פרטי",
  last_name: "שם משפחה",
  id_number: "ת.ז.",
  phone: "טלפון",
  marital_status: "מצב אישי",
  address: "כתובת",
  father_name_he: "שם אבא",
  father_mobile_he: "נייד אבא",
  mother_name_he: "שם אמא",
  mother_mobile_he: "נייד אמא",
  payment_status: "סטטוס תשלום",
  paid_amount: "סכום שולם",
  class_kodesh: "כיתה"
};

const Cell = ({ children }) => (
  <td className="border border-gray-300 px-4 py-2 text-center text-sm">{children || "-"}</td>
);

const StudentsTable = () => {
  const dispatch = useDispatch();
  const allStudentData = useSelector((state) => state.student.studentsData);

  const [selectedFields, setSelectedFields] = useState(fieldGroups.basic);
  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("basic");
  const [filters, setFilters] = useState({});
   
    
    const toggleField = (field) => {
        setSelectedFields((prev) =>
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...prev, field]
        );
    };


    // קריאה לשרת
    const fetchData = async () => {
        try {
            const categories = selectedFields.join(','); // התאמה ל-URL
            dispatch(getStudentDataThunk(categories)); // הנתונים ייכנסו ל־slice
        } catch (err) {
            console.error('שגיאה בעת קריאת הנתונים:', err);
        }
    };
  useEffect(() => {
    const categories = selectedFields.join(',');
    dispatch(getStudentDataThunk(categories));
  }, [selectedFields]);

  useEffect(() => {
    if (Array.isArray(allStudentData)) {
      const filtered = allStudentData
        .filter((student) => {
          return Object.entries(filters).every(([field, value]) => {
            if (!value) return true;
            return student[field]?.toString().includes(value);
          });
        })
        .map((student) => {
          const result = {};
          selectedFields.forEach((f) => result[f] = student[f]);
          return result;
        });
      setStudents(filtered);
    }
  }, [allStudentData, selectedFields, filters]);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setSelectedFields(fieldGroups[group]);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const exportToExcel = () => {
    const translated = students.map((student) => {
      const row = {};
      selectedFields.forEach((field) => {
        row[fieldLabels[field] || field] = student[field];
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(translated);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_data.xlsx");
  };

  const printTable = () => {
    const printWindow = window.open("", "_blank");
    const tableHTML = document.getElementById("students-table").outerHTML;
    printWindow.document.write(`
      <html>
      <head><title>הדפסת טבלה</title></head>
      <body dir="rtl" style="font-family:sans-serif;">${tableHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="pt-28 p-6 [direction:rtl] font-sans bg-gray-100 min-h-screen">
      <div className="mb-6 space-y-6 max-w-6xl mx-auto">

        <motion.div className="flex gap-4 flex-wrap justify-start items-center"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button
            onClick={() => handleGroupChange('basic')}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${
              selectedGroup === 'basic' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >נתונים בסיסיים</button>
          <button
            onClick={() => handleGroupChange('personal')}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${
              selectedGroup === 'personal' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >נתונים אישיים</button>
          <button
            onClick={() => handleGroupChange('payments')}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${
              selectedGroup === 'payments' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >פרטי תשלומים</button>
          <button
            onClick={() => handleGroupChange('phonebook')}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${
              selectedGroup === 'phonebook' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >אלפון</button>

          <button
            onClick={exportToExcel}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="יצוא לאקסל"
          >
            <FileDown className="w-5 h-5" />
          </button>

          <button
            onClick={printTable}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="הדפסה"
          >
            <Printer className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {filterFields.map((field) => (
            <input
              key={field}
              type="text"
              placeholder={`סנן לפי ${fieldLabels[field] || field}`}
              value={filters[field] || ""}
              onChange={(e) => handleFilterChange(field, e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          ))}
        </motion.div>
      </div>

      {students.length > 0 && (
        <motion.div className="overflow-auto max-w-full"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <table id="students-table" className="min-w-full mt-6 border-collapse border border-gray-400 text-sm text-right bg-white shadow rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#0A3960] text-white">
                {selectedFields.map((field) => (
                  <th key={field} className="border border-gray-300 px-4 py-2">
                    {fieldLabels[field] || field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                  {selectedFields.map((field) => (
                    <Cell key={field}>{student[field]}</Cell>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
          )}
                <div className="mt-14 max-w-2xl ">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    ייבוא תלמידות מאקסל:
                </label>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(event) => handleExcelImport(event, dispatch)}
                    className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded cursor-pointer focus:outline-none"
                />
            </div>

    </div>
  );
};

export default StudentsTable;
