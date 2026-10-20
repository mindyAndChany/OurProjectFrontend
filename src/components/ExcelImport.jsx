import { FileUp } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";


export const ExcelImport = ({ onData, columns }) => {


    const dispatch = useDispatch();

    const fileInputRef = useRef(null);

    const uploadExcel = () => {
        fileInputRef.current?.click();
    };

    const handleExcelImport = (event) => {
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
                // בתבנית המיוצאת מהמערכת שורה 1 = כותרות ושורה 2 = פירוט חוקי
                // הבדיקה. שורות שתאיהן מכילים רק את חוקי הבדיקה מדולגות.
                const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" })
                    .filter((row) => {
                        const values = Object.values(row);
                        const isRulesRow = values.some((v) => typeof v === "string" && /(חובה|רשות)\./.test(v))
                            && !values.some((v) => typeof v === "number");
                        return !isRulesRow;
                    });

                if (rows.length === 0) {
                    console.warn("❗ הקובץ ריק או ללא שורות נתונים");
                    return;
                }

                // בדיקת כותרות
                const headers = Object.keys(rows[0]).map(normalizeKey);
                const unknownHeaders = headers.filter((h) => !columns[h]);
                if (unknownHeaders.length > 0) {
                    console.warn("⚠️ כותרות לא מזוהות:", unknownHeaders);
                }

                // מיפוי שורות
                const mappedStudents = rows.map((row, i) => {
                    const newStudent = {};
                    Object.entries(row).forEach(([key, value]) => {
                        // "כן/לא" (כך מיוצאות עמודות בוליאניות) -> 1/0 כמו בשדות במערכת
                        if (typeof value === "string" && (value.trim() === "כן" || value.trim() === "לא")) {
                            value = value.trim() === "כן" ? 1 : 0;
                        }
                        const normKey = normalizeKey(key);
                        const field = columns[normKey];
                        if (field && value !== "") {
                            newStudent[field] = typeof value === "string" ? normalizeValue(value) : value;
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
                if (onData) onData(filtered);//שליחה המידע לקומפוננטת האב

            } catch (err) {
                console.error("❌ שגיאה בקריאת הקובץ:", err);
            }

        };

        reader.readAsArrayBuffer(file);

    };

    // ניקוי ערכי מחרוזת: תווי כיווניות נסתרים ורווחים מיותרים
    const normalizeValue = (value) =>
        value
            .replace(/[‎‏‪-‮]/g, '')
            .trim();

    const normalizeKey = (key) =>
        key
            .replace(/\u200f|\u200e/g, '') // הסרת תווי RTL חבויים
            .replace(/\s+/g, ' ')          // המרת רווחים כפולים
            .trim();

    return <div>
        <button
            onClick={uploadExcel}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="ייבוא מאקסל"
        >
            <FileUp className="w-8 h-8" />
        </button>
        <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls"
            onChange={(event) => handleExcelImport(event, dispatch)}
            className="hidden"
        />

    </div>

}