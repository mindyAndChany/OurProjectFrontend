import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";
import { motion } from "framer-motion";
// import * as XLSX from "xlsx";
import { Printer, FileUp, UserRoundPlus, UserPen, UserRoundSearch } from "lucide-react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Alert, FormHelperText, FormControl as MuiFormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { TextField, Button, IconButton, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { addStudentsThunk } from "../redux/slices/STUDENTS/addStudentsThunk";
import { getClassesThunk } from "../redux/slices/CLASSES/getClassesThunk";
import { getCoursesThunk } from "../redux/slices/COURSES/getCoursesThunk";
import { updateStudentThunk } from "../redux/slices/STUDENTS/updateStudentThunk";
import { getStudentByIdThunk } from "../redux/slices/STUDENTS/getStudentByIdThunk";
import { ExportToExcel } from "../components/ExportToExcel"
import { ExportBlankTemplate } from "../components/ExportBlankTemplate"
import { ExcelImport } from "../components/ExcelImport";
import StudentFilesManager from "../components/StudentFilesManager";
import { getDocumentsByStudentThunk } from "../redux/slices/STUDENTS/getDocumentsByStudentThunk";
import { getDocumentsByClassThunk } from "../redux/slices/STUDENTS/getDocumentsByClassThunk";
import { getDocumentsByTrackThunk } from "../redux/slices/STUDENTS/getDocumentsByTrackThunk";
import { studentSlice } from "../redux/slices/STUDENTS/studentsSlice";
import { formatHebrewYear } from "../utils/hebrewGematria";
import { fieldsDict, fieldsDictHeb } from "../utils/fieldsDict";

// const fieldOptions = [...new Set(Object.values(fieldsDict))];

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
    phone: "טלפון  ",
    personal_mobile: "נייד אישי",
    address: "רחוב, מספר, עיר",
    zipcode: "מיקוד",
    father_name_he: "שם האב",
    father_mobile_he: "נייד אבא (050-...)",
    mother_name_he: "שם האם",
    mother_m_he: "נייד אמא (050-...)",
    external_mother: "ארץ מוצא של האם",
    external_father: "ארץ מוצא של האב",
    birthdate_hebrew: "תאריך לידה עברי (לדוגמה: י״ד ניסן תשס״ז)",
    birthdate_gregorian: "תאריך לידה לועזי (YYYY-MM-DD)",
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
    Payment_method: "אופן תשלום (מזומן/העברה/צ׳ק)",
    notes: "הערות נוספות",
    perach: "פרח (כן/לא)",
    is_graduate: "הוראה (כן/לא)",
};

// ─── ולידציה ────────────────────────────────────────────────────────────────
// חוקי הבדיקה משקפים את האילוצים שהשרת אוכף (AddStudent.service.ts) ואת סוגי
// העמודות במודל (student.model.ts). שדה לא תקין חוסם שמירה — כדי שהשרת לא ימחק
// אותו בשקט.
const REQUIRED_FIELDS = ["first_name", "last_name", "id_number", "class_kodesh", "registration_year", "phone"];

const REQUIRED_MESSAGES = {
    first_name: "שם פרטי הוא שדה חובה",
    last_name: "שם משפחה הוא שדה חובה",
    id_number: "ת.ז. היא שדה חובה (9 ספרות)",
    class_kodesh: "יש לבחור כיתה",
    registration_year: "יש לבחור שנת רישום",
    phone: "טלפון הוא שדה חובה",
};

// שדות שנפתחים כרשימה נפתחת מתוך נתוני המערכת (ולא כטקסט חופשי) —
// כי הם מפתחות זרים לטבלת classes (class_kodesh/track*) או קבועים קבועים מראש.
const DROPDOWN_FIELDS = ["class_kodesh", "track", "track2", "track3", "marital_status", "perach", "chetz", "is_graduate", "Payment method"];

const BOOLEAN_FIELDS = ["perach", "chetz", "is_graduate"];

const MARITAL_STATUS_OPTIONS = ["רווקה", "נשואה"];

const PAYMENT_METHOD_OPTIONS = ["מזומן", "העברה", "צ׳ק", "אשראי"];

// מיפוי תווית -> מפתח שהשרת מכיר (ב-service: mother_mobile_he / payment_method).
// שמות השדות בפרונט נגזרו מהמילון (fieldsDict) ולא תמיד תואמים למודל.
const API_FIELD_ALIASES = {
    mother_m_he: "mother_mobile_he",
    "Payment method": "payment_method",
    photoUrl: "photo_url",
};

const isDigits = (value, min, max) => {
    const s = String(value ?? "").trim();
    return /^\d+$/.test(s) && s.length >= min && s.length <= max;
};

// מנרמל ערך לתאריך ISO (YYYY-MM-DD) ומחזיר null אם אינו תקין
const parseDateOnly = (value) => {
    const s = String(value ?? "").trim();
    if (!s) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!match) return null;
    const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const valid = m >= 1 && m <= 12 && d >= 1 && d <= 31;
    return valid ? s : null;
};

// ממיר תאריך שמגיע מהשרת (ISO מלא / Date) לפורמט YYYY-MM-DD — לעריכת שדה תאריך
const toDateInputValue = (value) => {
    if (!value) return "";
    const s = String(value);
    const iso = s.slice(0, 10);
    return parseDateOnly(iso) || "";
};

// בודק שדה בודד ומחזיר הודעת שגיאה, או '' אם תקין.
// ctx: { duplicateIdNumbers: Set<string>, allowedClassNames: Set<string> }
const validateStudentField = (key, value, ctx = {}) => {
    const raw = value === undefined || value === null ? "" : String(value).trim();

    if (REQUIRED_FIELDS.includes(key) && raw === "") {
        return REQUIRED_MESSAGES[key];
    }
    // שדות אופציונליים שריקים — תקינים
    if (raw === "") return "";

    switch (key) {
        case "first_name":
        case "last_name":
            return /^[א-תa-zA-Z][א-תa-zA-Z' \-\"]*$/.test(raw) ? "" : "יש להזין אותיות בלבד";
        case "id_number":
            if (!isDigits(raw, 9, 9)) return "ת.ז. חייבת להכיל בדיוק 9 ספרות";
            if (ctx.duplicateIdNumbers?.has(raw)) return "תלמידה עם ת.ז. זו כבר קיימת במערכת";
            return "";
        case "phone":
        case "personal_mobile":
        case "father_mobile_he":
        case "mother_m_he":
            return /^[0-9\-\s+]+$/.test(raw) && isDigits(raw.replace(/[-\s+]/g, ""), 9, 10)
                ? ""
                : "מספר טלפון: 9–10 ספרות";
        case "zipcode":
            return isDigits(raw, 5, 7) ? "" : "מיקוד: 5–7 ספרות";
        case "registration_year": {
            if (!/^\d{4}$/.test(raw)) return "שנת רישום: 4 ספרות (לדוגמה 2027)";
            const year = Number(raw);
            return year >= 2000 && year <= CURRENT_YEAR + 5 ? "" : `שנה בין 2000 ל-${CURRENT_YEAR + 5}`;
        }
        case "serial_number":
            return /^\d+$/.test(raw) ? "" : "מס׳ סידורי חייב להיות מספר";
        case "paid_amount":
            return /^\d+(\.\d{1,2})?$/.test(raw) ? "" : "סכום: מספר חיובי (עד 2 ספרות אחרי הנקודה)";
        case "birthdate_gregorian":
        case "married_date":
            return parseDateOnly(raw) ? "" : "תאריך חייב להיות בפורמט YYYY-MM-DD תקין";
        case "class_kodesh":
        case "track":
        case "track2":
        case "track3": {
            const allowed = ctx.allowedClassNames;
            if (!allowed || allowed.size === 0) return "";
            return allowed.has(raw) ? "" : "יש לבחור ערך מהרשימה";
        }
        case "perach":
        case "chetz":
        case "is_graduate":
            return BOOLEAN_FIELDS.includes(key) && ["true", "false", "כן", "לא", "1", "0"].includes(raw.toLowerCase())
                ? ""
                : "יש לבחור כן או לא";
        case "marital_status":
            return MARITAL_STATUS_OPTIONS.includes(raw) ? "" : "יש לבחור מצב אישי מהרשימה";
        case "Payment method":
            return PAYMENT_METHOD_OPTIONS.includes(raw) ? "" : "יש לבחור אמצעי תשלום מהרשימה";
        default:
            return "";
    }
};

// בודק את כל השדות בטופס ומחזיר מפה של { key: הודעת שגיאה }
const validateStudent = (values, ctx = {}) => {
    const errors = {};
    Object.keys(values || {}).forEach((key) => {
        const msg = validateStudentField(key, values[key], ctx);
        if (msg) errors[key] = msg;
    });
    // שדות חובה שלא קיימים בכלל באובייקט
    REQUIRED_FIELDS.forEach((key) => {
        if (!(key in errors) && String(values?.[key] ?? "").trim() === "") {
            errors[key] = REQUIRED_MESSAGES[key];
        }
    });
    return errors;
};

// ממיר את ערך הטופס לערך שנשלח/נשמר ב-DB (מספר/בוליאני/תאריך/null)
const normalizeStudentValue = (key, value) => {
    const raw = value === undefined || value === null ? "" : String(value).trim();
    switch (key) {
        case "registration_year":
        case "paid_amount":
            return raw === "" ? null : Number(raw);
        case "perach":
        case "chetz":
        case "is_graduate":
            if (raw === "") return null;
            return ["true", "כן", "1"].includes(raw.toLowerCase());
        case "birthdate_gregorian":
        case "married_date":
            return parseDateOnly(raw);
        default:
            return raw;
    }
};

// בונה את האובייקט שנשלח לשרת: שמות שדות מומרים לשמות המודל,
// ערכים ריקים אינם נשלחים (כדי לא לדרוס/ליצור ערכים ריקים), וערכים מומרים לטיפוסים הנכונים.
const buildStudentPayload = (formValues) => {
    const payload = {};
    Object.entries(formValues || {}).forEach(([key, value]) => {
        if (key === "photoUrl") return; // התמונה מועלית בנפרד
        const raw = value === undefined || value === null ? "" : String(value).trim();
        if (raw === "") return;

        const apiKey = API_FIELD_ALIASES[key] || key;
        const normalized = normalizeStudentValue(apiKey, raw);
        if (normalized === null) return;
        payload[apiKey] = normalized;
    });
    return payload;
};

// מחזיר הודעת שגיאה ידידותית מתשובת השרת (payload של addStudentsThunk)
const extractServerErrorMessage = (rejectedPayload) => {
    if (!rejectedPayload) return "שמירת התלמידה נכשלה. נסי שוב.";
    if (typeof rejectedPayload === "string") return rejectedPayload;
    const msg = rejectedPayload.error || rejectedPayload.message;
    if (typeof msg === "string" && msg) {
        if (msg.includes("already exists")) return "תלמידה עם ת.ז. זו כבר קיימת במערכת.";
        if (/foreign key|violates|invalid input/i.test(msg)) {
            return "אחד הערכים (כיתה/התמחות) אינו קיים במערכת. יש לבחור מהרשימה.";
        }
        if (msg.includes("first_name") || msg.includes("last_name")) {
            return "חסרים שדות חובה: שם פרטי או שם משפחה.";
        }
        return msg;
    }
    return "שמירת התלמידה נכשלה. נסי שוב.";
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

// שנת המערכת — לעדכן ידנית פעם בשנה, בפתיחת שנת הלימודים.
// זו השנה של מחזור "כיתות ו׳" (כלומר ו׳ = SYSTEM_YEAR - 1, ה׳ = SYSTEM_YEAR, נרשמות = SYSTEM_YEAR + 1).
// דוגמה: בשנת הלימודים תשפ״ז — כיתות ו׳ נרשמו ב-2026, כיתות ה׳ נרשמו ב-2027.
const SYSTEM_YEAR = 2027;
const CURRENT_YEAR = SYSTEM_YEAR;
const DEFAULT_REG_YEAR = SYSTEM_YEAR + 1;

// מספר השנה העברית של שנת המערכת. קבוע ויציב — לא תלוי בתאריך של היום.
// 2027 -> 5787 (תשפ״ז). ההפרש הקבוע הוא 3760.
const SYSTEM_HEBREW_YEAR = SYSTEM_YEAR + 3760;

// מחזיר תווית שנה עברית (אותיות). offset=0 -> שנת המערכת, offset=1 -> השנה הבאה.
const HEB_SCHOOL_YEAR = (offset = 0) => formatHebrewYear(SYSTEM_HEBREW_YEAR + offset);


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
    const lastImportResult = useSelector((state) => state.student.lastImportResult);
    const [importSummary, setImportSummary] = useState(null);
    const studentLoading = useSelector((state) => state.student.loading);
    const [activeDocs, setActiveDocs] = useState([]);
    const [docFilters, setDocFilters] = useState({ id_number: "", class_kodesh: "", track: "" });
    const [docsSource, setDocsSource] = useState(null); // 'id' | 'class' | 'track'
    const [docMode, setDocMode] = useState('id');
    const [docsLoading, setDocsLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null });

    // ── דיאלוג הוספת תלמידה: שגיאות, מצב שמירה והודעות ────────────────────
    const [addFormErrors, setAddFormErrors] = useState({});
    const [addTouched, setAddTouched] = useState({});
    const [addSaving, setAddSaving] = useState(false);
    const [addSubmitError, setAddSubmitError] = useState("");
    const [addSubmitSuccess, setAddSubmitSuccess] = useState("");

    // רשימות הכיתות/ההתמחויות מהמערכת (מפתחות זרים ל-classes.name)
    const classesData = useSelector((state) => state.classes?.data);
    const coursesData = useSelector((state) => state.courses?.data);

    useEffect(() => {
        if (!Array.isArray(classesData) || classesData.length === 0) dispatch(getClassesThunk());
        if (!Array.isArray(coursesData) || coursesData.length === 0) dispatch(getCoursesThunk());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // מפתחות זרים של השרת: למה כל סוג קורס משויך
    const classOptions = useMemo(() => {
        const classes = Array.isArray(classesData) ? classesData : [];
        const courses = Array.isArray(coursesData) ? coursesData : [];
        const typeByName = new Map(courses.map((c) => [c.id, String(c.type || "").toLowerCase()]));
        const byType = (types) => classes
            .filter((c) => types.includes(typeByName.get(c.course_id)))
            .map((c) => c.name)
            .filter(Boolean);

        const kodeshNames = byType(["kodesh", "קודש"]);
        const trackNames = byType(["hitmahut", "hitmahut ", "התמחות"]);

        // שמות כיתות שכבר קיימות אצל התלמידות — גיבוי למקרה שסוג הקורס שונה
        const knownClassNames = (Array.isArray(allStudentData) ? allStudentData : [])
            .map((s) => s.class_kodesh)
            .filter(Boolean);

        const uniqueSorted = (arr) => [...new Set(arr)].sort((a, b) => String(a).localeCompare(String(b), "he"));

        return {
            kodesh: uniqueSorted(kodeshNames.length ? kodeshNames : knownClassNames),
            tracks: uniqueSorted(trackNames.length ? trackNames : courses.map((c) => c.name).filter(Boolean)),
        };
    }, [classesData, coursesData, allStudentData]);

    const allowedClassNames = useMemo(
        () => new Set([...classOptions.kodesh, ...classOptions.tracks]),
        [classOptions]
    );

    const duplicateIdNumbers = useMemo(
        () => new Set(
            (Array.isArray(allStudentData) ? allStudentData : [])
                .map((s) => String(s.id_number ?? "").trim())
                .filter(Boolean)
        ),
        [allStudentData]
    );

    // ערך נוכחי של שדה בטופס ההוספה (עבור המטפל האחיד)
    const getAddValue = (field) => newStudent[field] ?? "";

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
        setAddFormErrors({});
        setAddTouched({});
        setAddSubmitError("");
        setAddSubmitSuccess("");
        setOpen(true);
    };

    // סגירת דיאלוג ההוספה — שמירה על נתוני הטופס אם יש שגיאת שמירה מן השרת,
    // כדי שהמשתמשת לא תצטרך להקליד הכול מחדש.
    const closeAddDialog = () => {
        setOpen(false);
        setAddTouched({});
        setAddFormErrors({});
    };

    // עדכון שדה בטופס ההוספה + בדיקה חיה של אותו שדה
    const handleAddFieldChange = (field, value) => {
        setNewStudent((prev) => ({ ...prev, [field]: value }));
        setAddSubmitError("");
        setAddSubmitSuccess("");
        setAddTouched((prev) => ({ ...prev, [field]: true }));
        setAddFormErrors((prev) => {
            const next = { ...prev };
            const msg = validateStudentField(field, value, { duplicateIdNumbers, allowedClassNames });
            if (msg) next[field] = msg;
            else delete next[field];
            return next;
        });
    };

    const handleAddFieldBlur = (field) => {
        setAddTouched((prev) => ({ ...prev, [field]: true }));
        setAddFormErrors((prev) => {
            const next = { ...prev };
            const msg = validateStudentField(field, newStudent[field], { duplicateIdNumbers, allowedClassNames });
            if (msg) next[field] = msg;
            else delete next[field];
            return next;
        });
    };

    // רשימת האפשרויות עבור שדה — null אם השדה אינו רשימה נפתחת
    const getDropdownOptions = (field) => {
        switch (field) {
            case "class_kodesh":
                return classOptions.kodesh.map((name) => ({ value: name, label: name }));
            case "track":
            case "track2":
            case "track3":
                return classOptions.tracks.map((name) => ({ value: name, label: name }));
            case "marital_status":
                return MARITAL_STATUS_OPTIONS.map((v) => ({ value: v, label: v }));
            case "perach":
            case "chetz":
            case "is_graduate":
                return BOOLEAN_FIELDS.includes(field)
                    ? [{ value: "true", label: "כן" }, { value: "false", label: "לא" }]
                    : null;
            case "Payment method":
                return PAYMENT_METHOD_OPTIONS.map((v) => ({ value: v, label: v }));
            default:
                return null;
        }
    };

    // סימון שדות חובה בכוכבית
    const getAddFieldLabel = (field) => {
        const label = fieldsDictHeb[field] || fieldLabels[field] || field;
        return REQUIRED_FIELDS.includes(field) ? `${label} *` : label;
    };

    // שדה נחשב חסר-שגיאה אם לא נגעו בו, או אם ערכו תקין
    const getAddFieldError = (field) => (addTouched[field] ? addFormErrors[field] || "" : "");

    const addHasErrors = Object.keys(addFormErrors).length > 0;

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

    const handleAddStudent = async () => {
        // 1. בדיקת תקינות מלאה לפני שליחה — ערך לא תקין חוסם שמירה
        const payload = buildStudentPayload(newStudent);
        const errors = validateStudent(
            { ...newStudent, ...payload },
            { duplicateIdNumbers, allowedClassNames }
        );
        if (Object.keys(errors).length > 0) {
            // סימון כל השדות כנגועים → כל השגיאות מוצגות ליד השדות
            setAddTouched(Object.fromEntries(Object.keys({ ...newStudent, ...payload }).map((k) => [k, true])));
            setAddFormErrors(errors);
            setAddSubmitError("יש לתקן את השדות המסומנים לפני השמירה.");
            return;
        }

        // 2. שליחה לשרת — הדיאלוג נסגר רק אם ההוספה הצליחה
        setAddSaving(true);
        setAddSubmitError("");
        setAddSubmitSuccess("");
        try {
            const result = await dispatch(addStudentsThunk([payload]));
            if (result.meta.requestStatus === "fulfilled") {
                setAddSubmitSuccess("התלמידה נוספה בהצלחה.");
                setNewStudent(initialNewStudent);
                setAddTouched({});
                setAddFormErrors({});
                setOpen(false);
            } else {
                setAddSubmitError(extractServerErrorMessage(result.payload));
            }
        } finally {
            setAddSaving(false);
        }
    };


    const handleImport = (data) => {
        dispatch(addStudentsThunk(data));
        console.log("Data imported:", data);
    };

    // הצגת סיכום הייבוא בדיאלוג לאחר שהבקשה מסתיימת
    useEffect(() => {
        if (lastImportResult) {
            setImportSummary(lastImportResult);
        }
    }, [lastImportResult]);

    const closeImportSummary = () => {
        setImportSummary(null);
        dispatch(studentSlice.actions.clearImportResult());
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
                            כיתות ו ({HEB_SCHOOL_YEAR(1)})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(CURRENT_YEAR)}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === CURRENT_YEAR ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title={`סנן לפי שנת רישום ${CURRENT_YEAR}`}
                        >
                            כיתות ה ({HEB_SCHOOL_YEAR()})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRegistrationYear(CURRENT_YEAR + 1)}
                            className={`w-full rounded-full px-4 py-2 text-sm font-semibold shadow transition ${selectedRegistrationYear === CURRENT_YEAR + 1 ? 'bg-[#0A3960] text-white' : 'bg-white/70 text-[#0A3960]'}`}
                            title={`סנן לפי שנת רישום ${CURRENT_YEAR + 1}`}
                        >
                            נרשמות ({HEB_SCHOOL_YEAR(-1)})
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
                    <ExportBlankTemplate />
                    <ExportToExcel data={students} selectedFields={selectedFields} />
                    <ExcelImport onData={handleImport} columns={fieldsDict} />
                    <Dialog open={!!importSummary} onClose={closeImportSummary} maxWidth="md" fullWidth>
                        <DialogTitle>תוצאות ייבוא מאקסל</DialogTitle>
                        <DialogContent>
                            {importSummary?.error ? (
                                <p className="text-red-600 font-semibold">{importSummary.error}</p>
                            ) : (
                                <>
                                    <p className="text-green-700 font-semibold">
                                        נוספו בהצלחה {importSummary?.addedCount ?? 0} תלמידות
                                    </p>
                                    {importSummary?.failures?.length > 0 && (
                                        <>
                                            <p className="text-red-600 font-semibold mt-2">
                                                {importSummary.failures.length} שורות לא יובאו:
                                            </p>
                                            <div className="overflow-x-auto mt-2">
                                                <table className="w-full text-sm border border-gray-300">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="border px-2 py-1">שורה</th>
                                                            <th className="border px-2 py-1">שם</th>
                                                            <th className="border px-2 py-1">ת.ז</th>
                                                            <th className="border px-2 py-1">סיבה</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {importSummary.failures.map((f) => (
                                                            <tr key={`${f.index}-${f.id_number ?? ''}`}>
                                                                <td className="border px-2 py-1 text-center">{f.index}</td>
                                                                <td className="border px-2 py-1 text-center">{f.name || "-"}</td>
                                                                <td className="border px-2 py-1 text-center">{f.id_number || "-"}</td>
                                                                <td className="border px-2 py-1 text-center">{f.reason}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeImportSummary} variant="contained">סגור</Button>
                        </DialogActions>
                    </Dialog>
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

                    <Dialog open={open} onClose={closeAddDialog} maxWidth="md" fullWidth>
                        <DialogTitle>פרטי תלמידה חדשה</DialogTitle>
                        <DialogContent className="space-y-6 rtl text-right">
                            <p className="text-xs text-gray-500 mt-1">
                                שדות המסומנים ב-* הם שדות חובה. שדות עם רשימה נפתחת נבחרים מתוך נתוני המערכת.
                            </p>

                            {addSubmitError && (
                                <Alert severity="error" onClose={() => setAddSubmitError("")}>
                                    {addSubmitError}
                                </Alert>
                            )}
                            {addSubmitSuccess && <Alert severity="success">{addSubmitSuccess}</Alert>}

                            {Object.entries(formGroups).map(([groupKey, groupFields]) => (
                                <div key={groupKey} className="space-y-3">
                                    <h3 className="text-base font-semibold text-gray-800">{formGroupTitles[groupKey]}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {groupFields
                                            .filter((key) => key !== 'photoUrl')
                                            .map((key) => {
                                                const error = getAddFieldError(key);
                                                const isDropdown = DROPDOWN_FIELDS.includes(key);
                                                const options = getDropdownOptions(key);
                                                const isDate = key === "birthdate_gregorian" || key === "married_date";
                                                const isNumeric = key === "registration_year" || key === "serial_number" || key === "paid_amount";

                                                if (isDropdown) {
                                                    const value = newStudent[key] ?? "";
                                                    return (
                                                        <MuiFormControl
                                                            key={key}
                                                            fullWidth
                                                            size="small"
                                                            margin="dense"
                                                            error={!!error}
                                                        >
                                                            <InputLabel id={`add-${key}-label`}>{getAddFieldLabel(key)}</InputLabel>
                                                            <Select
                                                                labelId={`add-${key}-label`}
                                                                label={getAddFieldLabel(key)}
                                                                value={value}
                                                                onChange={(e) => handleAddFieldChange(key, e.target.value)}
                                                                onBlur={() => handleAddFieldBlur(key)}
                                                                displayEmpty
                                                            >
                                                                {!REQUIRED_FIELDS.includes(key) && (
                                                                    <MenuItem value="">— ללא —</MenuItem>
                                                                )}
                                                                {(options || []).map((opt) => (
                                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                                ))}
                                                            </Select>
                                                            {error && <FormHelperText>{error}</FormHelperText>}
                                                            {!error && (options || []).length === 0 && (
                                                                <FormHelperText>אין נתונים במערכת — יש להוסיף קודם כיתות/התמחויות.</FormHelperText>
                                                            )}
                                                        </MuiFormControl>
                                                    );
                                                }

                                                return (
                                                    <TextField
                                                        key={key}
                                                        label={getAddFieldLabel(key)}
                                                        placeholder={placeholdersMap[key] || `הקלד/י ${fieldsDictHeb[key] || key}`}
                                                        value={newStudent[key] || ""}
                                                        onChange={(e) => handleAddFieldChange(key, e.target.value)}
                                                        onBlur={() => handleAddFieldBlur(key)}
                                                        error={!!error}
                                                        helperText={error || " "}
                                                        required={REQUIRED_FIELDS.includes(key)}
                                                        type={isDate ? "date" : "text"}
                                                        slotProps={
                                                            isDate
                                                                ? { inputLabel: { shrink: true } }
                                                                : isNumeric
                                                                    ? { htmlInput: { inputMode: "numeric" } }
                                                                    : undefined
                                                        }
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        margin="dense"
                                                    />
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeAddDialog} disabled={addSaving}>ביטול</Button>
                            <Button
                                variant="contained"
                                onClick={handleAddStudent}
                                disabled={addSaving || addHasErrors}
                                title={addHasErrors ? "יש לתקן את השדות המסומנים" : ""}
                            >
                                {addSaving ? "שומרת..." : "שמור"}
                            </Button>
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
                                {/* עמודות הפעולות מוצגות בכל תצוגת תלמידות, לא רק ב"נתונים אישיים" */}
                                <th className="border px-2 py-2" style={{ width: "80px", minWidth: "80px" }}>עריכה</th>
                                <th className="border px-2 py-2" style={{ width: "80px", minWidth: "80px" }}>קבצים</th>
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
