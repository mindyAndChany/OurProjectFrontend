import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { motion } from "framer-motion";
// import * as XLSX from "xlsx";
import { Printer, FileUp, UserRoundPlus, UserPen } from "lucide-react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { TextField, Button, IconButton } from "@mui/material";
import { addStudentsThunk } from "../redux/slices/STUDENTS/addStudentsThunk";
import { updateStudentThunk } from "../redux/slices/STUDENTS/updateStudentThunk";
import { ExportToExcel } from "../components/ExportToExcel"
import { ExcelImport } from "../components/ExcelImport";
import StudentFilesManager from "../components/StudentFilesManager";
import { getDocumentsByStudentThunk } from "../redux/slices/STUDENTS/getDocumentsByStudentThunk";
import { getDocumentsByClassThunk } from "../redux/slices/STUDENTS/getDocumentsByClassThunk";
import { getDocumentsByTrackThunk } from "../redux/slices/STUDENTS/getDocumentsByTrackThunk";

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
    "נייד אמא": "mother_m_he",
    "התמחות": "track",
    "התמתחות נוספת": "track2",
    "אופציה ב": "track3",
    " מצב אישי": "marital_status",
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
    "א. תשלום": "Payment method",
    "תמונה": "photoUrl",
    "שנת הרישום":"registration_year"
}

// const fieldOptions = [...new Set(Object.values(fieldsDict))];

const fieldsDictHeb = Object.fromEntries(
    Object.entries(fieldsDict).map(([he, en]) => [en, he])
);

// כותרות לקבוצות והגדרת קבוצות לשדות בטופס
const formGroupTitles = {
    basic: "פרטים בסיסיים",
    contact: "פרטי קשר",
    parents: "הורי התלמידה",
    personal: "פרטים אישיים",
    study: "לימודים ומגמות",
    payments: "תשלומים",
    other: "פרטים נוספים",
};

// קבוצות לשדות בטופס (סדר הופעה)
const formGroups = {
    basic: [
        "id_number",
        "first_name",
        "last_name",
        "nickname",
        "class_kodesh",
        "registration_year",// ברירת מחדל-שנת הלימודים הבאה
        "serial_number"//שיתמלא אוטומטית
    ],
    contact: ["phone", "address", "zipcode", "personal_mobile"],
    parents: [
        "father_name_he",
        "father_mobile_he",
        "mother_name_he",
        "mother_m_he",
        "external_mother",
        "external_father",
    ],
    personal: [
        "birthdate_hebrew",
        "birthdate_gregorian",
        "birth_country",
        "marital_status",
        "married_date",
        "married_name"
    ],
    study: ["track", "track2", "track3", "trend", "is_graduate", "chetz", "bookshelf"],
    payments: ["paid_amount", "Payment method"],
    other: ["notes", "perach"],
};

// מצייני מקום (placeholder) לשדות בטופס
const placeholdersMap = {
    id_number: "הקלד/י ת.ז. (9 ספרות)",
    first_name: "הקלד/י שם פרטי",
    last_name: "הקלד/י שם משפחה",
    nickname: "שם חיבה (לא חובה)",
    class_kodesh: "כיתה (לדוגמה: ז׳1)",
    registration_year: "שנת רישום (לדוגמה: 2026)",
    serial_number: "מס׳ סידורי",
    phone: "טלפון תלמידה (לדוגמה: 050-1234567)",
    personal_mobile: "נייד אישי",
    address: "רחוב, מספר, עיר",
    zipcode: "מיקוד",
    father_name_he: "שם האב",
    father_mobile_he: "נייד אבא (050-...)",
    mother_name_he: "שם האם",
    mother_m_he: "נייד אמא (050-...)",
    external_mother: "האם מחוץ לעיר? כן/לא",
    external_father: "האב מחוץ לעיר? כן/לא",
    birthdate_hebrew: "תאריך עברי (לדוגמה: י״ד ניסן תשס״ז)",
    birthdate_gregorian: "תאריך לועזי (YYYY-MM-DD)",
    birth_country: "ארץ לידה",
    marital_status: "מצב אישי (רווקה/נשואה)",
    married_date: "תאריך חתונה (אם רלוונטי)",
    married_name: "שם אחרי החתונה",
    track: "התמחות",
    track2: "התמחות נוספת",
    track3: "אופציה ב",
    trend: "מגמה",
    chetz: "חץ",
    bookshelf: "מס׳ מדפית",
    paid_amount: "סכום ששולם (מספר)",
    "Payment method": "אופן תשלום (מזומן/העברה/צ׳ק)",
    notes: "הערות נוספות",
    perach: "פרח",
    is_graduate: "הוראה (כן/לא)",
};


const fieldGroups = {
    basic: ["id_number", "first_name", "last_name", "class_kodesh","track","track2"],
    personal: [
        "id_number", "first_name", "last_name", "phone", "marital_status", "address",
        "father_name_he", "father_mobile_he", "mother_name_he", "mother_mobile_he", "class_kodesh"
    ],
    payments: ["id_number", "first_name", "last_name", "payment_status", "paid_amount", "class_kodesh"],
    phonebook: ["id_number", "first_name", "last_name", "phone", "class_kodesh","track"],
    photos: ["id_number", "first_name", "last_name", "photoUrl", "class_kodesh"],
    documents: []
};

const filterFields = ["id_number", "class_kodesh", "first_name", "last_name"];

const fieldLabels = {
    id_number: "ת.ז.",
    first_name: "שם פרטי",
    last_name: "שם משפחה",
    phone: "טלפון",
    marital_status: "מצב אישי",
    address: "כתובת",
    father_name_he: "שם אבא",
    father_mobile_he: "נייד אבא",
    mother_name_he: "שם אמא",
    mother_mobile_he: "נייד אמא",
    payment_status: "סטטוס תשלום",
    paid_amount: "סכום שולם",
    class_kodesh: "כיתה",
    photoUrl: "תמונה"
};

const Cell = ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-center text-sm">{children || "-"}</td>
);

// ברירת מחדל: שנת הרישום היא השנה הבאה
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_REG_YEAR = CURRENT_YEAR + 1;

const initialNewStudent = (() => {
    const obj = Object.fromEntries(Object.values(fieldsDict).map((key) => [key, ""]));
    obj.registration_year = DEFAULT_REG_YEAR; // שנה הבאה כברירת מחדל
    return obj;
})();

//ניתוב נכון לתמונה
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

const resolveFileUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url.startsWith('/') ? url : '/' + url}`;
};


const StudentsTable = () => {

    const dispatch = useDispatch();

    const allStudentData = useSelector((state) => state.student.studentsData);
    const [selectedFields, setSelectedFields] = useState(fieldGroups.basic);
    const [students, setStudents] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("basic");
    const [filters, setFilters] = useState({});
    const [newStudent, setNewStudent] = useState(initialNewStudent);
    const [open, setOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const [group, setGroup] = useState("רשימת הבנות");
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const [studentForFiles, setStudentForFiles] = useState(null);
    const [selectedRegistrationYear, setSelectedRegistrationYear] = useState(null);
    // Documents view state
    const documentsByStudent = useSelector((state) => state.student.documentsByStudent);
    const documentsByClass = useSelector((state) => state.student.documentsByClass);
    const documentsByTrack = useSelector((state) => state.student.documentsByTrack);
    const [activeDocs, setActiveDocs] = useState([]);
    const [docFilters, setDocFilters] = useState({ id_number: "", class_kodesh: "", track: "" });
    const [docsSource, setDocsSource] = useState(null); // 'id' | 'class' | 'track'






    const toApiField = (f) => (f === 'photoUrl' ? 'photo_url' : f);

    useEffect(() => {
        const categoriesArr = selectedFields.map(toApiField);
        // Always include fields needed for defaults and auto-numbering
        if (!categoriesArr.includes('registration_year')) categoriesArr.push('registration_year');
        if (!categoriesArr.includes('serial_number')) categoriesArr.push('serial_number');
        const categories = [...new Set(categoriesArr)].join(',');
        dispatch(getStudentDataThunk(categories));
    }, [selectedFields]);

    useEffect(() => {
        if (Array.isArray(allStudentData)) {
            const filtered = allStudentData
                .filter((student) => {
                    const baseMatch = Object.entries(filters).every(([field, value]) => {
                        if (!value) return true;
                        return student[field]?.toString().includes(value);
                    });
                    if (!baseMatch) return false;
                    if (selectedRegistrationYear) {
                        return student['registration_year']?.toString() === selectedRegistrationYear.toString();
                    }
                    return true;
                })
                .map((student) => {
                    const result = {};
                    selectedFields.forEach((f) => {
                        const apiF = toApiField(f);
                        result[f] = student[f] ?? student[apiF];
                    });
                    return result;
                });
            setStudents(filtered);
        }
    }, [allStudentData, selectedFields, filters, selectedRegistrationYear]);

    const handleGroupChange = (group) => {
        setSelectedGroup(group);
        setSelectedFields(fieldGroups[group] || []);
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setGroup(value);
    };

    // חשב מס׳ סידורי הבא לפי שנת רישום מהנתונים הקיימים
    const computeNextSerialNumber = (year) => {
        const yearStr = year?.toString();
        const list = Array.isArray(allStudentData) ? allStudentData : [];
        const maxSerial = list.reduce((max, s) => {
            const sYear = (s['registration_year'] ?? s.registration_year)?.toString();
            if (sYear !== yearStr) return max;
            const sn = parseInt(s['serial_number'] ?? s.serial_number, 10);
            return isNaN(sn) ? max : Math.max(max, sn);
        }, 0);
        return (maxSerial + 1).toString();
    };

    // פתיחת דיאלוג הוספה עם ערכי ברירת מחדל
    const openAddDialog = () => {
        const year = DEFAULT_REG_YEAR;
        const nextSerial = computeNextSerialNumber(year);
        setNewStudent({ ...initialNewStudent, registration_year: year, serial_number: nextSerial });
        setOpen(true);
    };

    // עדכון מס׳ סידורי אוטומטי כששנת רישום משתנה (בדיאלוג הוספה)
    useEffect(() => {
        if (!open) return;
        const year = newStudent.registration_year;
        if (!year) return;
        const nextSerial = computeNextSerialNumber(year);
        if (newStudent.serial_number?.toString() !== nextSerial.toString()) {
            setNewStudent((prev) => ({ ...prev, serial_number: nextSerial }));
        }
    }, [open, newStudent.registration_year, allStudentData]);


        const printTable = () => {
                const titleText = group || (selectedGroup === 'photos' ? 'תצוגת תמונות' : 'רשימת הבנות');
                const printWindow = window.open("", "_blank");

                // Minimal print CSS to ensure reasonable formatting without app styles
                const baseStyles = `
                    body { font-family: sans-serif; direction: rtl; margin: 16px; }
                    h2 { margin: 0 0 12px; font-size: 18px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: center; font-size: 12px; }
                    thead th { background: #0A3960; color: #fff; }
                    /* Photos grid */
                    .photos-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
                    .photo-card { border: 1px solid #ddd; border-radius: 8px; padding: 8px; text-align: center; }
                    .photo-img { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; display: block; margin: 0 auto 6px; }
                    .no-photo { width: 100px; height: 100px; border-radius: 50%; background: #eee; color: #666; display: flex; align-items: center; justify-content: center; margin: 0 auto 6px; font-size: 12px; }
                    @media print {
                        .photos-grid { grid-template-columns: repeat(6, 1fr); }
                        .photo-card, img { break-inside: avoid; page-break-inside: avoid; }
                        /* Hide the Edit column (first column) in print */
                        th:first-child, td:first-child { display: none; }
                    }
                `;

                if (selectedGroup === 'photos') {
                        // Build a simple printable grid of photos
                        const photosHTML = `
                            <html>
                                <head>
                                    <title>${titleText}</title>
                                    <meta charset="utf-8" />
                                    <style>${baseStyles}</style>
                                </head>
                                <body>
                                    <h2>${titleText}</h2>
                                    <div class="photos-grid">
                                        ${students.map((s) => {
                                                const hasPhoto = !!s.photoUrl;
                                                const img = hasPhoto
                                                        ? `<img class=\"photo-img\" src=\"${resolveFileUrl(s.photoUrl)}\" alt=\"${s.first_name || ''} ${s.last_name || ''}\" />`
                                                        : `<div class=\"no-photo\">אין תמונה</div>`;
                                                const name = `${s.first_name || ''} ${s.last_name || ''}`.trim();
                                                return `
                                                    <div class=\"photo-card\">
                                                        ${img}
                                                        <div style=\"font-size:12px;\">${name}</div>
                                                    </div>
                                                `;
                                        }).join('')}
                                    </div>
                                </body>
                            </html>
                        `;
                        printWindow.document.open();
                        printWindow.document.write(photosHTML);
                        printWindow.document.close();
                        // Give images a brief moment to load before printing
                        const onReady = () => printWindow.print();
                        // Fallback: print after a short delay
                        setTimeout(onReady, 300);
                } else {
                        // Print the existing table markup with minimal styling
                        const tableEl = document.getElementById("students-table");
                        const tableHTML = tableEl ? tableEl.outerHTML : '<div>אין נתונים להדפסה</div>';
                        const docHTML = `
                            <html>
                                <head>
                                    <title>${titleText}</title>
                                    <meta charset="utf-8" />
                                    <style>${baseStyles}</style>
                                </head>
                                <body>
                                    <h2>${titleText}</h2>
                                    ${tableHTML}
                                </body>
                            </html>
                        `;
                        printWindow.document.open();
                        printWindow.document.write(docHTML);
                        printWindow.document.close();
                        printWindow.print();
                }
        };

    // Fetch documents based on current docFilters
    const fetchDocuments = () => {
        const id = (docFilters.id_number || "").trim();
        const klass = (docFilters.class_kodesh || "").trim();
        const trk = (docFilters.track || "").trim();
        console.log("id",id,"klass",klass,"trk",trk);
        
        if (id) {
            setDocsSource('id');
            dispatch(getDocumentsByStudentThunk(id));
            return;
        }
        if (klass) {
            setDocsSource('class');
            dispatch(getDocumentsByClassThunk(klass));
            return;
        }
        if (trk) {
            setDocsSource('track');
            dispatch(getDocumentsByTrackThunk(trk));
            return;
        }
        // No filters → clear
        setDocsSource(null);
        setActiveDocs([]);
    };

    // Update active docs when store updates
    useEffect(() => {
        if (docsSource === 'id') {
            setActiveDocs(Array.isArray(documentsByStudent) ? documentsByStudent : []);
        } else if (docsSource === 'class') {
            setActiveDocs(Array.isArray(documentsByClass) ? documentsByClass : []);
        } else if (docsSource === 'track') {
            setActiveDocs(Array.isArray(documentsByTrack) ? documentsByTrack : []);
        }
    }, [docsSource, documentsByStudent, documentsByClass, documentsByTrack]);

    const getStudentNameById = (idNum) => {
        const s = (Array.isArray(allStudentData) ? allStudentData : []).find((st) => (st.id_number || st.id) === idNum);
        const fn = s?.first_name || s?.firstName || "";
        const ln = s?.last_name || s?.lastName || "";
        return `${fn} ${ln}`.trim();
    };

    const handleAddStudent = () => {
        console.log("try adding student", newStudent);

        dispatch(addStudentsThunk([newStudent]));
        setNewStudent(initialNewStudent);
        setOpen(false); // לסגור את הדיאלוג אחרי ההוספה
    };


    const handleImport = (data) => {
        dispatch(addStudentsThunk(data));
        console.log("Data imported:", data);
    };
    return (
        <div className="pt-28 p-6 [direction:rtl] font-sans bg-gray-100 min-h-screen">
            <div className="mb-6 space-y-6 max-w-6xl mx-auto">
                <h1>{group}</h1>

                {/* כותרת + בחירת שנתון לפי שנת רישום */}
                <motion.div
                    className="rounded-xl border border-[#0A3960]/20 bg-blue-50 px-6 py-4 text-right"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                                     <div className="mt-2 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(2025)}
                            className={`rounded-full px-3 py-1 text-sm font-semibold shadow transition ${selectedRegistrationYear === 2025 ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title="סנן לפי שנת רישום 2025"
                        >
                            כיתות ו
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(2026)}
                            className={`rounded-full px-3 py-1 text-sm font-semibold shadow transition ${selectedRegistrationYear === 2026 ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title="סנן לפי שנת רישום 2026"
                        >
                           כיתות ה
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(2027)}
                            className={`rounded-full px-3 py-1 text-sm font-semibold shadow transition ${selectedRegistrationYear === 2027 ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title="סנן לפי שנת רישום 2027"
                        >
                             נרשמות
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(null)}
                            className={`rounded-full px-3 py-1 text-sm font-semibold shadow transition ${selectedRegistrationYear === null ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title="הצג הכל"
                        >
                            הכל
                        </button>
                    </div>
                </motion.div>

                <motion.div className="flex gap-4 flex-wrap justify-start items-center"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <button
                        onClick={() => handleGroupChange('basic')}
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === 'basic' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >נתונים בסיסיים</button>
                    <button
                        onClick={() => handleGroupChange('personal')}
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === 'personal' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >נתונים אישיים</button>
                    <button
                        onClick={() => handleGroupChange('payments')}
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === 'payments' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >פרטי תשלומים</button>
                    <button
                        onClick={() => handleGroupChange('phonebook')}
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === 'phonebook' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >אלפון</button>
                    <button
                        onClick={() => handleGroupChange('photos')}
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === 'photos' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >תצוגת תמונות</button>
                    <button
                        onClick={() => handleGroupChange('documents')}
                        className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === 'documents' ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >מסמכים</button>
                    <ExportToExcel data={students} />
                    <ExcelImport onData={handleImport} columns={fieldsDict} />
                    <button
                        onClick={printTable}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="הדפסה"
                    >
                        <Printer className="w-5 h-5" />
                    </button>

                    <button
                        onClick={openAddDialog}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="הוספת תלמידה"
                    >
                        <UserRoundPlus className="w-5 h-5" />
                    </button>

                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>פרטי תלמידה חדשה</DialogTitle>
                        <DialogContent className="space-y-6 rtl text-right">
                            {Object.entries(formGroups).map(([groupKey, groupFields]) => (
                                <div key={groupKey} className="space-y-3">
                                    <h3 className="text-base font-semibold text-gray-800">{formGroupTitles[groupKey]}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {groupFields
                                            .filter((key) => key !== 'photoUrl')
                                            .map((key) => (
                                                <TextField
                                                    key={key}
                                                    label={fieldsDictHeb[key] || fieldLabels[key] || key}
                                                    placeholder={placeholdersMap[key] || `הקלד/י ${fieldsDictHeb[key] || key}`}
                                                    value={newStudent[key] || ""}
                                                    onChange={(e) =>
                                                        setNewStudent((prev) => ({ ...prev, [key]: e.target.value }))
                                                    }
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    margin="dense"
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>ביטול</Button>
                            <Button onClick={handleAddStudent}>שמור</Button>
                        </DialogActions>
                    </Dialog>

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

            {selectedGroup === 'photos' && students.length > 0 && (
                <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    {students.map((s, idx) => (
                        <div key={idx} className="bg-white shadow rounded-xl p-3 flex flex-col items-center gap-2">
                            {s.photoUrl ? (
                                <img src={resolveFileUrl(s.photoUrl)}
                                    alt={`${s.first_name} ${s.last_name}`} className="w-24 h-24 object-cover rounded-full" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">אין תמונה</div>
                            )}
                            <div className="text-sm font-medium">{s.first_name} {s.last_name}</div>
                        </div>
                    ))}
                </motion.div>
            )}
            {selectedGroup === 'documents' && (
                <motion.div className="mt-4 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            placeholder="מ.ז. תלמידה"
                            value={docFilters.id_number}
                            onChange={(e) => setDocFilters((p) => ({ ...p, id_number: e.target.value }))}
                            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <input
                            type="text"
                            placeholder="כיתה"
                            value={docFilters.class_kodesh}
                            onChange={(e) => setDocFilters((p) => ({ ...p, class_kodesh: e.target.value }))}
                            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <input
                            type="text"
                            placeholder="מסלול"
                            value={docFilters.track}
                            onChange={(e) => setDocFilters((p) => ({ ...p, track: e.target.value }))}
                            className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outlined" onClick={fetchDocuments}>חפש מסמכים</Button>
                        <Button variant="text" onClick={() => { setDocFilters({ id_number: "", class_kodesh: "", track: "" }); setActiveDocs([]); setDocsSource(null); }}>נקה</Button>
                    </div>

                    <div className="overflow-auto max-w-full">
                        <table className="min-w-full mt-4 border-collapse border border-gray-400 text-sm text-right bg-white shadow rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-[#0A3960] text-white">
                                    <th className="border px-2 py-2">תלמידה</th>
                                    <th className="border px-2 py-2">מ.ז.</th>
                                    <th className="border px-2 py-2">שם מסמך</th>
                                    <th className="border px-2 py-2">סוג</th>
                                    <th className="border px-2 py-2">מסלול</th>
                                    <th className="border px-2 py-2">תאריך העלאה</th>
                                    <th className="border px-2 py-2">צפייה/הורדה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeDocs.length === 0 && (
                                    <tr>
                                        <td className="px-4 py-3 text-center" colSpan={7}>אין מסמכים להצגה</td>
                                    </tr>
                                )}
                                {activeDocs.map((doc, i) => {
                                    const id = doc.id_number || doc.id || "";
                                    const name = getStudentNameById(id);
                                    const url = resolveFileUrl(doc.url);
                                    return (
                                        <tr key={i}>
                                            <Cell>{name}</Cell>
                                            <Cell>{id}</Cell>
                                            <Cell>{doc.name}</Cell>
                                            <Cell>{doc.type}</Cell>
                                            <Cell>{doc.track || ""}</Cell>
                                            <Cell>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('he-IL') : ""}</Cell>
                                            <Cell>
                                                {doc.url ? (
                                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">פתח</a>
                                                ) : (
                                                    "—"
                                                )}
                                            </Cell>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
            {selectedGroup !== 'photos' && students.length > 0 && (
                <motion.div className="overflow-auto max-w-full"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <table id="students-table" className="min-w-full mt-6 border-collapse border border-gray-400 text-sm text-right bg-white shadow rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-[#0A3960] text-white">
                                <th className="border px-2 py-2" style={{ width: "80px", minWidth: "80px" }}>עריכה</th>
                                {selectedGroup === 'personal' && (
                                    <th className="border px-2 py-2" style={{ width: "80px", minWidth: "80px" }}>קבצים</th>
                                )}
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
                                    <Cell style={{ width: "80px", minWidth: "80px" }}>
                                        <IconButton onClick={() => {
                                            setStudentToEdit({ ...initialNewStudent, ...student });
                                            setEditDialogOpen(true);
                                        }}>
                                            <UserPen />
                                        </IconButton>
                                    </Cell>
                                    {selectedGroup === 'personal' && (
                                        <Cell style={{ width: "80px", minWidth: "80px" }}>
                                            <IconButton onClick={() => {
                                                setStudentForFiles({ ...initialNewStudent, ...student });
                                                setFilesDialogOpen(true);
                                            }}>
                                                <FileUp />
                                            </IconButton>
                                        </Cell>
                                    )}

                                    {selectedFields.map((field) => (
                                        <Cell key={field}>{student[field]}</Cell>
                                    ))}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>עריכת תלמידה</DialogTitle>
                <DialogContent className="space-y-4 rtl text-right">
                    {studentToEdit && (
                        <div className="space-y-6">
                            {Object.entries(formGroups).map(([groupKey, groupFields]) => (
                                <div key={groupKey} className="space-y-3">
                                    <h3 className="text-base font-semibold text-gray-800">{formGroupTitles[groupKey]}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {groupFields
                                            .filter((key) => key !== 'photoUrl')
                                            .map((key) => (
                                                <TextField
                                                    key={key}
                                                    label={fieldsDictHeb[key] || fieldLabels[key] || key}
                                                    placeholder={placeholdersMap[key] || `הקלד/י ${fieldsDictHeb[key] || key}`}
                                                    value={studentToEdit[key] || ""}
                                                    onChange={(e) =>
                                                        setStudentToEdit((prev) => ({
                                                            ...prev,
                                                            [key]: e.target.value,
                                                        }))
                                                    }
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    margin="dense"
                                                    disabled={key === "id_number"}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {studentToEdit && (
                        <StudentFilesManager
                            student={studentToEdit}
                            onUpdated={(payload) => {
                                setStudentToEdit((prev) => ({
                                    ...prev,
                                    photoUrl: payload.photoUrl,
                                }));
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>ביטול</Button>
                    <Button
                        onClick={() => {
                            dispatch(updateStudentThunk(studentToEdit));
                            setEditDialogOpen(false);
                        }}
                    >
                        שמירה
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={filesDialogOpen} onClose={() => setFilesDialogOpen(false)}>
                <DialogTitle>מסמכים ותמונות</DialogTitle>
                <DialogContent className="space-y-4 rtl text-right">
                    {studentForFiles && (
                        <StudentFilesManager
                            student={studentForFiles}
                            onUpdated={(payload) => {
                                setStudentForFiles((prev) => ({
                                    ...prev,
                                    photoUrl: payload.photoUrl,
                                    documents: payload.documents,
                                }));
                            }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFilesDialogOpen(false)}>סגור</Button>
                </DialogActions>
            </Dialog>


        </div>
    );
};

export default StudentsTable;
