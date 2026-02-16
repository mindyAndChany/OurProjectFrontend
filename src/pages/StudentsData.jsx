import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { motion } from "framer-motion";
// import * as XLSX from "xlsx";
import { Printer, FileUp, UserRoundPlus, UserPen, UserRoundSearch } from "lucide-react";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { TextField, Button, IconButton, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { addStudentsThunk } from "../redux/slices/STUDENTS/addStudentsThunk";
import { updateStudentThunk } from "../redux/slices/STUDENTS/updateStudentThunk";
import { getStudentByIdThunk } from "../redux/slices/STUDENTS/getStudentByIdThunk";
import { ExportToExcel } from "../components/ExportToExcel"
import { ExcelImport } from "../components/ExcelImport";
import StudentFilesManager from "../components/StudentFilesManager";
import { getDocumentsByStudentThunk } from "../redux/slices/STUDENTS/getDocumentsByStudentThunk";
import { getDocumentsByClassThunk } from "../redux/slices/STUDENTS/getDocumentsByClassThunk";
import { getDocumentsByTrackThunk } from "../redux/slices/STUDENTS/getDocumentsByTrackThunk";
import { formatHebrewYear } from "../utils/hebrewGematria";

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
    "שנת הרישום": "registration_year"
}

// const fieldOptions = [...new Set(Object.values(fieldsDict))];

const fieldsDictHeb = Object.fromEntries(
    Object.entries(fieldsDict).map(([he, en]) => [en, he])
);

// קונפיגורציה אחידה לקבוצות כדי לחסוך כפילויות
const GROUPS = [
    { key: 'basic', title: 'פרטים בסיסיים', navLabel: 'נתונים בסיסיים', showInNav: true },
    { key: 'personal', title: 'פרטים אישיים', navLabel: 'נתונים אישיים', showInNav: true },
    { key: 'payments', title: 'תשלומים', navLabel: 'פרטי תשלומים', showInNav: true },
    { key: 'parents', title: 'הורי התלמידה', navLabel: 'נתוני הורים', showInNav: true },
    { key: 'study', title: 'לימודים ומגמות', navLabel: 'תכנית לימודים', showInNav: true },
    { key: 'contact', title: 'פרטי קשר', navLabel: 'אלפון', showInNav: true },
    // הקבוצות הבאות מופיעות בניווט אך ללא שדות בטופס ההוספה/עריכה
    { key: 'photos', title: 'תצוגת תמונות', navLabel: 'תצוגת תמונות', showInNav: true },
    { key: 'documents', title: 'מסמכים', navLabel: 'מסמכים', showInNav: true },
    // "other" נשארת לזיהוי עתידי, לא מוצגת בניווט כרגע
    { key: 'other', title: 'פרטים נוספים', navLabel: 'פרטים נוספים', showInNav: false },
];

// הפקה אוטומטית של כותרות לקבוצות ושל ניווט מהקונפיגורציה
const formGroupTitles = Object.fromEntries(GROUPS.map(g => [g.key, g.title]));
const navGroups = GROUPS.filter(g => g.showInNav).map(g => ({ key: g.key, label: g.navLabel }));

// קבוצות לשדות בטופס (סדר הופעה)
const formGroups = {
    basic: [
        "id_number",
        "first_name",
        "last_name",
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
        "nickname",
        "birthdate_hebrew",
        "birthdate_gregorian",
        "birth_country",
        "marital_status",
        "married_date",
        "married_name",
        "notes"
    ],
    study: ["class_kodesh",
        "registration_year",// ברירת מחדל-שנת הלימודים הבאה
        "serial_number",//שיתמלא אוטומטית
        "track",
        "track2",
        "track3",
        "trend",
        "is_graduate",
        "chetz",
        "bookshelf",
        "perach"],
    payments: ["paid_amount", "Payment method"],
    photos: ["photoUrl"],
    documents: []
};

const filterFields = ["id_number", "class_kodesh", "first_name", "last_name", "track"];

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

// Helper to consistently render Hebrew labels across the UI
const getHebrewLabel = (field) => fieldsDictHeb[field] || fieldLabels[field] || field;

const Cell = ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-center text-sm">{children || "-"}</td>
);

// ברירת מחדל: שנת הרישום היא השנה הבאה
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_REG_YEAR = CURRENT_YEAR + 1;
// מחזיר שנת לימודים עברית (אותיות) לפי הלוח העברי
const normalizeToDate = (input) => {
    if (input instanceof Date) return input;
    if (Number.isFinite(input)) {
        const now = new Date();
        return new Date(input, now.getMonth(), now.getDate());
    }
    return new Date();
};
const getHebrewYearNumber = (input = new Date()) => {
    const date = normalizeToDate(input);
    try {
        const fmt = new Intl.DateTimeFormat("he-IL-u-ca-hebrew-nu-latn", { year: "numeric" });
        const yearPart = fmt.formatToParts(date).find((p) => p.type === "year")?.value;
        const numeric = parseInt(String(yearPart || "").replace(/\D/g, ""), 10);
        if (Number.isFinite(numeric)) return numeric;
    } catch (_) {
        // ignore and fall back
    }
    return date.getMonth() < 8 ? date.getFullYear() + 3760 : date.getFullYear() + 3761;
};
const HEB_SCHOOL_YEAR = (input = new Date()) => formatHebrewYear(getHebrewYearNumber(input));


const initialNewStudent = (() => {
    const obj = Object.fromEntries(Object.values(fieldsDict).map((key) => [key, ""]));
    obj.registration_year = DEFAULT_REG_YEAR; // שנה הבאה כברירת מחדל
    return obj;
})();

//ניתוב נכון לתמונה
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;
const API_BASE = BACKEND_URL;

const resolveFileUrl = (url) => {
    if (!url) return '';
    return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url.startsWith('/') ? url : '/' + url}`;
};


const StudentsTable = () => {

    const dispatch = useDispatch();

    const allStudentData = useSelector((state) => state.student.studentsData);
    const [selectedFields, setSelectedFields] = useState(
        Array.from(new Set([...(formGroups.basic || []), ...(formGroups.contact || [])]))
    );
    const [students, setStudents] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("contact");
    const [filters, setFilters] = useState({});
    const [newStudent, setNewStudent] = useState(initialNewStudent);
    const [open, setOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const [editStudentId, setEditStudentId] = useState(null);
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const [studentForFiles, setStudentForFiles] = useState(null);
    const [selectedRegistrationYear, setSelectedRegistrationYear] = useState(null);
    // Documents view state
    const documentsByStudent = useSelector((state) => state.student.documentsByStudent);
    const documentsByClass = useSelector((state) => state.student.documentsByClass);
    const documentsByTrack = useSelector((state) => state.student.documentsByTrack);
    const selectedStudent = useSelector((state) => state.student.selectedStudent);
    const studentLoading = useSelector((state) => state.student.loading);
    const [activeDocs, setActiveDocs] = useState([]);
    const [docFilters, setDocFilters] = useState({ id_number: "", class_kodesh: "", track: "" });
    const [docsSource, setDocsSource] = useState(null); // 'id' | 'class' | 'track'
    const [docMode, setDocMode] = useState('id');
    const [docsLoading, setDocsLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

    const toApiField = (f) => (f === 'photoUrl' ? 'photo_url' : f);

    const normalizeStudentFromApi = (student) => {
        if (!student) return null;
        return {
            ...student,
            photoUrl: student.photoUrl ?? student.photo_url,
        };
    };

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
            let filtered = allStudentData
                .filter((student) => {
                    const baseMatch = Object.entries(filters).every(([field, value]) => {
                        if (!value) return true;
                        return student[field]?.toString().includes(value);
                    });
                    if (!baseMatch) return false;
                    if (selectedRegistrationYear) {
                        if (selectedRegistrationYear === 'graduates') {
                            const ry = parseInt(student['registration_year'] ?? student.registration_year, 10);
                            return !isNaN(ry) && ry <= (CURRENT_YEAR - 2);
                        }
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
            
            if (sortConfig.field) {
                filtered.sort((a, b) => {
                    const aVal = (a[sortConfig.field] || '').toString();
                    const bVal = (b[sortConfig.field] || '').toString();
                    const cmp = aVal.localeCompare(bVal, 'he');
                    return sortConfig.direction === 'asc' ? cmp : -cmp;
                });
            }
            
            setStudents(filtered);
        }
    }, [allStudentData, selectedFields, filters, selectedRegistrationYear, sortConfig]);

    const handleGroupChange = (group) => {
        setSelectedGroup(group);
        const base = formGroups.basic || [];
        if (group === 'basic') {
            setSelectedFields(base);
            return;
        }
        // Map aliases or fall back to the defined group
        const targetGroupKey = group === 'phonebook' ? 'contact' : group;
        const additional = formGroups[targetGroupKey] || [];
        // Always include base fields, then add selected group's fields (deduped)
        const merged = Array.from(new Set([...base, ...additional]));
        setSelectedFields(merged);
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSort = (field) => {
        setSortConfig((prev) => {
            if (prev.field === field) {
                if (prev.direction === 'asc') return { field, direction: 'desc' };
                if (prev.direction === 'desc') return { field: null, direction: null };
            }
            return { field, direction: 'asc' };
        });
    };

    const getSortIcon = (field) => {
        if (sortConfig.field !== field) return ' ⇅';
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const openSearch = () => {
        setShowSearch((prev) => !prev);
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

    useEffect(() => {
        if (!editDialogOpen || !selectedStudent || !editStudentId) return;
        const selectedId = selectedStudent.id_number ?? selectedStudent.id;
        if (!selectedId || selectedId.toString() !== editStudentId.toString()) return;
        const normalized = normalizeStudentFromApi(selectedStudent);
        setStudentToEdit((prev) => ({
            ...initialNewStudent,
            ...(prev || {}),
            ...(normalized || {}),
        }));
    }, [editDialogOpen, selectedStudent, editStudentId]);

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
        const titleText =
            (navGroups.find((g) => g.key === selectedGroup)?.label)
            || formGroupTitles[selectedGroup]
            || selectedGroup;
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
    const fetchDocuments = async () => {
        const id = (docFilters.id_number || "").trim();
        const klass = (docFilters.class_kodesh || "").trim();
        const trk = (docFilters.track || "").trim();
        setDocsLoading(true);
        try {
            if (docMode === 'id' && id) {
                setDocsSource('id');
                await dispatch(getDocumentsByStudentThunk(id));
                return;
            }
            if (docMode === 'class' && klass) {
                setDocsSource('class');
                await dispatch(getDocumentsByClassThunk(klass));
                return;
            }
            if (docMode === 'track' && trk) {
                setDocsSource('track');
                await dispatch(getDocumentsByTrackThunk(trk));
                return;
            }
            // No active value for the chosen mode → clear
            setDocsSource(null);
            setActiveDocs([]);
        } finally {
            setDocsLoading(false);
        }
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
                {/* כותרת + בחירת שנתון לפי שנת רישום */}
                <motion.div
                    className="rounded-xl border border-[#0A3960]/20 bg-blue-50 px-6 py-4 text-right"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(CURRENT_YEAR - 1)}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === CURRENT_YEAR - 1 ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title={`סנן לפי שנת רישום ${CURRENT_YEAR - 1}`}
                        >
                            כיתות ו ({HEB_SCHOOL_YEAR(CURRENT_YEAR)})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(CURRENT_YEAR)}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === CURRENT_YEAR ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title={`סנן לפי שנת רישום ${CURRENT_YEAR}`}
                        >
                            כיתות ה ({HEB_SCHOOL_YEAR(CURRENT_YEAR)})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(CURRENT_YEAR + 1)}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === CURRENT_YEAR + 1 ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title={`סנן לפי שנת רישום ${CURRENT_YEAR + 1}`}
                        >
                            נרשמות ({HEB_SCHOOL_YEAR(CURRENT_YEAR + 1)})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear('graduates')}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === 'graduates' ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title="סנן לפי בוגרות (נרשמו לפני יותר משנה)"
                        >
                            בוגרות
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(null)}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === null ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title="הצג הכל"
                        >
                            הכל
                        </button>
                    </div>
                </motion.div>

                <motion.div className="flex gap-6 flex-wrap justify-center items-center"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {navGroups.map(({ key, label }) => (
                        key !== "basic" && (
                            <button
                                key={key}
                                onClick={() => handleGroupChange(key)}
                                className={`rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 shadow ${selectedGroup === key ? 'bg-[#0A3960] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {label}
                            </button>
                        )
                    ))}
                </motion.div>

                <motion.div className="flex gap-6 flex-wrap justify-center items-center"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <ExportToExcel data={students} />
                    <ExcelImport onData={handleImport} columns={fieldsDict} />
                    <button
                        onClick={printTable}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="הדפסה"
                    >
                        <Printer className="w-8 h-8" />
                    </button>
                    <button
                        onClick={openSearch}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="חיפוש או מיון"
                    >
                        <UserRoundSearch className="w-8 h-8" />
                    </button>
                    <button
                        onClick={openAddDialog}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="הוספת תלמידה"
                    >
                        <UserRoundPlus className="w-8 h-8" />
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

                {showSearch && (
                    <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        {filterFields.map((field) => (
                            <input
                                key={field}
                                type="text"
                                placeholder={`סנן לפי ${getHebrewLabel(field)}`}
                                value={filters[field] || ""}
                                onChange={(e) => handleFilterChange(field, e.target.value)}
                                className="border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
                            />
                        ))}
                    </motion.div>
                )}
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
                    <div className="rounded-xl border border-[#0A3960]/20 bg-white p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-label="document-search-mode"
                                    value={docMode}
                                    onChange={(e) => setDocMode(e.target.value)}
                                >
                                    <FormControlLabel value="id" control={<Radio />} label="חיפוש לפי ת.ז." />
                                    <FormControlLabel value="class" control={<Radio />} label="חיפוש לפי כיתה" />
                                    <FormControlLabel value="track" control={<Radio />} label="חיפוש לפי מסלול" />
                                </RadioGroup>
                            </FormControl>

                            {docMode === 'id' && (
                                <TextField
                                    label="מ.ז. תלמידה"
                                    placeholder="לדוגמה: 123456789"
                                    value={docFilters.id_number}
                                    onChange={(e) => setDocFilters((p) => ({ ...p, id_number: e.target.value }))}
                                    onKeyDown={(e) => { if (e.key === 'Enter') fetchDocuments(); }}
                                    size="small"
                                />
                            )}
                            {docMode === 'class' && (
                                <TextField
                                    label="כיתה"
                                    placeholder="לדוגמה: ה׳1"
                                    value={docFilters.class_kodesh}
                                    onChange={(e) => setDocFilters((p) => ({ ...p, class_kodesh: e.target.value }))}
                                    onKeyDown={(e) => { if (e.key === 'Enter') fetchDocuments(); }}
                                    size="small"
                                />
                            )}
                            {docMode === 'track' && (
                                <TextField
                                    label="מסלול"
                                    placeholder="לדוגמה: עיצוב"
                                    value={docFilters.track}
                                    onChange={(e) => setDocFilters((p) => ({ ...p, track: e.target.value }))}
                                    onKeyDown={(e) => { if (e.key === 'Enter') fetchDocuments(); }}
                                    size="small"
                                />
                            )}

                            <div className="flex gap-3">
                                <Button variant="outlined" onClick={fetchDocuments} disabled={docsLoading}>
                                    {docsLoading ? 'טוען…' : 'חפש מסמכים'}
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        setDocFilters({ id_number: "", class_kodesh: "", track: "" });
                                        setActiveDocs([]);
                                        setDocsSource(null);
                                    }}
                                >
                                    נקה
                                </Button>
                            </div>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                            {docsSource ? `נמצאו ${activeDocs.length} מסמכים` : 'הזינו ערך וחפשו מסמכים'}
                        </div>
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
            {selectedGroup !== 'photos' && selectedGroup !== 'documents' && students.length > 0 && (
                <motion.div className="overflow-auto max-w-full"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <table id="students-table" className="min-w-full mt-6 border-collapse border border-gray-400 text-sm text-right bg-white shadow rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-[#0A3960] text-white">
                                {selectedGroup === 'personal' && (
                                    <>
                                        <th className="border px-2 py-2" style={{ width: "80px", minWidth: "80px" }}>עריכה</th>
                                        <th className="border px-2 py-2" style={{ width: "80px", minWidth: "80px" }}>קבצים</th>
                                    </>
                                )}
                                {selectedFields.map((field) => (
                                    <th key={field} className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-[#0d4a7a]" onClick={() => handleSort(field)}>
                                        {getHebrewLabel(field)}{getSortIcon(field)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                                    {selectedGroup === 'personal' && (
                                        <>
                                            <Cell style={{ width: "80px", minWidth: "80px" }}>
                                                <IconButton onClick={() => {
                                                    const id = student?.id_number ?? student?.id;
                                                    setEditStudentId(id ?? null);
                                                    setStudentToEdit({ ...initialNewStudent, ...student });
                                                    setEditDialogOpen(true);
                                                    if (id) {
                                                        dispatch(getStudentByIdThunk(id));
                                                    }
                                                }}>
                                                    <UserPen size={24} />
                                                </IconButton>
                                            </Cell>

                                            <Cell style={{ width: "80px", minWidth: "80px" }}>
                                                <IconButton onClick={() => {
                                                    setStudentForFiles({ ...initialNewStudent, ...student });
                                                    setFilesDialogOpen(true);
                                                }}>
                                                    <FileUp size={24} />
                                                </IconButton>
                                            </Cell>
                                        </>
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
                            {studentLoading && (
                                <div className="text-sm text-gray-500">טוען נתוני תלמידה מלאים...</div>
                            )}
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
