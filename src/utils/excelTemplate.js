import * as XLSX from "xlsx";

// ─── תבנית אקסל מלאה של נתוני התלמידות ─────────────────────────────────────
// הקובץ מיוצא עם שתי גליונות:
//   "תלמידות" — שורה לכל תלמידה, כל העמודות שנשמרות בשרת.
//   "מדריך"   — פירוט החוקים (ולידציות) לכל עמודה, כדי לדעת מה מותר להזין.
//
// ‼️ חשוב לייבוא חוזר: הכותרת בגיליון "תלמידות" חייבת להתחיל בדיוק בתווית
// מתוך fieldsDict (למשל "כיתה"), כי פונקציית imports (ExcelImport) מחפשת
// כותרות לפי מילון השדות. לכן הפירוט נמצא בעמודה נפרדת (שורה 2) ולא בכותרת.

// המפתחות בדיוק כפי שהשרת שומר אותם (AddStudent.service.ts / student.model.ts)
export const EXPORT_COLUMNS = [
    { key: "id_number", label: "ת. זהות", rules: "חובה. 9 ספרות בלבד, ייחודית במערכת", example: "123456789" },
    { key: "first_name", label: "שם פרטי", rules: "חובה. אותיות בעברית/אנגלית בלבד", example: "שרה" },
    { key: "last_name", label: "משפחה", rules: "חובה. אותיות בעברית/אנגלית בלבד", example: "כהן" },
    { key: "nickname", label: "שם חיבה", rules: "רשות. טקסט חופשי", example: "" },
    { key: "class_kodesh", label: "כיתה", rules: "חובה. חייב להיות אחד מהשמות הקיימים בטבלת הכיתות", example: "ז׳1" },
    { key: "registration_year", label: "שנת הרישום", rules: "חובה. 4 ספרות, בין 2000 ל-2035", example: "2027" },
    { key: "serial_number", label: "מס' סידורי", rules: "רשות. ספרות בלבד (מספר ייחודי בתוך שנת הרישום)", example: "1" },
    { key: "phone", label: "טלפון", rules: "חובה. ספרות בלבד, 9–10 ספרות (מותר - או +)", example: "0501234567" },
    { key: "personal_mobile", label: "נייד אישי", rules: "רשות. ספרות בלבד, 9–10 ספרות", example: "0521234567" },
    { key: "address", label: "כתובת", rules: "רשות. טקסט חופשי", example: "רחוב הרב כהנמן 5, בני ברק" },
    { key: "zipcode", label: "מיקוד", rules: "רשות. 5–7 ספרות", example: "5120000" },
    { key: "birthdate_hebrew", label: "ת.לידה עברי", rules: "רשות. טקסט חופשי (לדוגמה: י״ד ניסן תשס״ז)", example: "י״ד ניסן תשס״ז" },
    { key: "birthdate_gregorian", label: "ת.לידה לועזי", rules: "רשות. תאריך תקין בפורמט YYYY-MM-DD", example: "2007-04-02" },
    { key: "birth_country", label: "ארץ לידה", rules: "רשות. טקסט חופשי", example: "ישראל" },
    { key: "marital_status", label: "מצב אישי", rules: "רשות. ערך מהרשימה: רווקה / נשואה (ברירת מחדל: רווקה)", example: "רווקה" },
    { key: "married_date", label: "תאריך חתונה", rules: "רשות. תאריך תקין בפורמט YYYY-MM-DD", example: "" },
    { key: "married_name", label: "שם אחרי החתונה", rules: "רשות. טקסט חופשי", example: "" },
    { key: "father_name_he", label: "שם האב", rules: "רשות. טקסט חופשי", example: "אברהם" },
    { key: "father_mobile_he", label: "נייד אבא", rules: "רשות. ספרות בלבד, 9–10 ספרות", example: "0531234567" },
    { key: "mother_name_he", label: "שם האם", rules: "רשות. טקסט חופשי", example: "רבקה" },
    { key: "mother_mobile_he", label: "נייד אמא", rules: "רשות. ספרות בלבד, 9–10 ספרות", example: "0541234567" },
    { key: "external_mother", label: "אמא חוץ", rules: "רשות. טקסט חופשי (ארץ מוצא של האם)", example: "" },
    { key: "external_father", label: "אבא חוץ", rules: "רשות. טקסט חופשי (ארץ מוצא של האב)", example: "" },
    { key: "track", label: "התמחות", rules: "רשות. חייב להיות אחד מהמסלולים הקיימים במערכת", example: "" },
    { key: "track2", label: "התמחות נוספת", rules: "רשות. חייב להיות אחד מהמסלולים הקיימים במערכת", example: "" },
    { key: "track3", label: "אופציה ב", rules: "רשות. חייב להיות אחד מהמסלולים הקיימים במערכת", example: "" },
    { key: "trend", label: "מגמה", rules: "רשות. טקסט חופשי", example: "" },
    { key: "is_graduate", label: "הוראה", rules: "רשות. כן / לא", example: "לא" },
    { key: "chetz", label: "חץ", rules: "רשות. כן / לא", example: "לא" },
    { key: "bookshelf", label: "מדפית", rules: "רשות. טקסט חופשי", example: "" },
    { key: "perach", label: "פרח", rules: "רשות. כן / לא", example: "לא" },
    { key: "paid_amount", label: "סכום ששלמה", rules: "רשות. מספר חיובי, עד 2 ספרות אחרי הנקודה", example: "0" },
    { key: "payment_method", label: "א. תשלום", rules: "רשות. ערך מהרשימה: מזומן / העברה / צ׳ק / אשראי", example: "" },
    { key: "notes", label: "הערות", rules: "רשות. טקסט חופשי", example: "" },
    { key: "photo_url", label: "תמונה", rules: "רשות. קישור לתמונה (לא חובה לייבוא)", example: "" },
];

const HEADER_ROW_LABEL = "כותרת (שורה 1)";
const RULES_ROW_LABEL = "חוקי בדיקה (שורה 2)";

const formatCellValue = (value) => {
    if (value === null || value === undefined) return "";
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }
    if (typeof value === "boolean") return value ? "כן" : "לא";
    return value;
};

// בונה קובץ אקסל עם כל העמודות ושורת חוקי הבדיקה. שורות הנתונים אופציונליות —
// ללא מערך (או עם מערך ריק) מתקבלת תבנית ריקה למילוי ידני.
export const exportStudentsTemplate = (students = []) => {
    const rows = Array.isArray(students) ? students : [];

    // שורה 1: הכותרת המקורית (לצורך ייבוא חוזר)
    // שורה 2: פירוט חוקי הבדיקה לכל עמודה
    const headerRow = {};
    const rulesRow = {};
    EXPORT_COLUMNS.forEach(({ label, rules }) => {
        headerRow[label] = label;
        rulesRow[label] = rules;
    });

    const dataRows = rows.map((student) => {
        const row = {};
        EXPORT_COLUMNS.forEach(({ key, label }) => {
            row[label] = formatCellValue(student?.[key]);
        });
        return row;
    });

    const sheetRows = [headerRow, rulesRow, ...dataRows];
    const worksheet = XLSX.utils.json_to_sheet(sheetRows, {
        skipHeader: true,
        header: EXPORT_COLUMNS.map((c) => c.label),
    });
    worksheet["!cols"] = EXPORT_COLUMNS.map((c) => ({ wch: Math.max(14, c.label.length + 4) }));

    // גיליון מדריך: חוקים ודוגמה בכל עמודה
    const guide = EXPORT_COLUMNS.map((c) => ({
        [HEADER_ROW_LABEL]: c.label,
        [RULES_ROW_LABEL]: c.rules,
        "דוגמה": c.example,
        "שם השדה בשרת": c.key,
    }));
    const guideSheet = XLSX.utils.json_to_sheet(guide);
    guideSheet["!cols"] = [{ wch: 20 }, { wch: 55 }, { wch: 20 }, { wch: 20 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "תלמידות");
    XLSX.utils.book_append_sheet(workbook, guideSheet, "מדריך");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `students_${today}.xlsx`);
};
