import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import * as XLSX from "xlsx";
import { addStudentsThunk } from "../redux/slices/STUDENTS/addStudentsThunk";


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
const fieldOptions = [
    "first_name", "last_name", "id_number", "phone", "marital_status", "address",
    "registration_year", "is_graduate", "class_kodesh", "class_teaching",
    "track", "track2", "track3", "payment_status", "paid_amount", "birthdate_gregorian",
    "birthdate_hebrew", "married_date", "married_name", "notes", "city_he", "zipcode",
    "landline", "father_name_he", "father_mobile_he", "mother_name_he", "mother_mobile_he",
    "bookshelf", "perach", "external_mother", "external_father", "birth_country",
    "personal_mobile", "nickname", "serial_number"
];




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

const fieldsDictHeb = Object.fromEntries(
    Object.entries(fieldsDict).map(([he, en]) => [en, he])
);

// תא טבלה
const Cell = ({ children }) => (
    <td className="border border-black px-4 py-2 text-center">{children || "-"}</td>
);

const StudentsTable = () => {
    const [selectedFields, setSelectedFields] = useState([
        "first_name", "last_name", "id_number"
    ]);
    const [students, setStudents] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();

    const toggleField = (field) => {
        setSelectedFields((prev) =>
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...prev, field]
        );
    };

    const allStudentData = useSelector((state) => state.student.studentsData);

    // קריאה לשרת
    const fetchData = async () => {
        try {
            const categories = selectedFields.join(','); // התאמה ל-URL
            dispatch(getStudentDataThunk(categories)); // הנתונים ייכנסו ל־slice
        } catch (err) {
            console.error('שגיאה בעת קריאת הנתונים:', err);
        }
    };

    // סינון הנתונים מה־slice
    useEffect(() => {
        if (Array.isArray(allStudentData) && allStudentData.length > 0) {
            const filtered = allStudentData.map((student) => {
                const result = {};
                selectedFields.forEach((f) => result[f] = student[f]);
                return result;
            });
            setStudents(filtered); // state מקומי
        }
    }, [allStudentData, selectedFields]);

    return (
        <div className="pt-28 p-6 [direction:rtl] font-sans bg-gray-100 min-h-screen">

            {/* תפריט שדות */}
            <div className="mb-6 max-w-5xl">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#584041] text-white rounded px-4 py-2 hover:bg-[#6d5455]"
                >
                    בחירת שדות להצגה
                </button>

                {isDropdownOpen && (
                    <div className="mt-4 bg-white border border-black rounded p-4 shadow-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
                            {fieldOptions.map((field) => (
                                <label key={fieldsDictHeb[field] || field} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.includes(field)}
                                        onChange={() => toggleField(field)}
                                        className="w-4 h-4 appearance-auto accent-blue-600 cursor-pointer"
                                    />




                                    {fieldsDictHeb[field] || field}
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={fetchData}
                            className="mt-4 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                        >
                            הצג נתונים
                        </button>
                    </div>
                )}
            </div>

            {/* טבלה */}
            {students.length > 0 && selectedFields.length > 0 && (
                <div className="overflow-auto max-w-full">
                    <table className="min-w-full mt-6 border-collapse border border-black text-sm text-right bg-white">
                        <thead>
                            <tr className="bg-[#584041] text-white">
                                {selectedFields.map((field) => (
                                    <th key={field} className="border border-black px-4 py-2">
                                        {fieldsDictHeb[field] || field}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={idx}>
                                    {selectedFields.map((field) => (
                                        <Cell key={fieldsDictHeb[field] || field}>{student[field]}</Cell>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
