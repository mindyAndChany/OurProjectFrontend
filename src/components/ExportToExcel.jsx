import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { fieldsDictHeb } from "../utils/fieldsDict";

// קומפוננטת יצוא לאקסל.
// props:
//   data          — מערך התלמידות להצגה בטבלה (כבר מסונן)
//   selectedFields — רשימת שמות השדות המוצגים כעת (מפתחות באנגלית)
export const ExportToExcel = ({ data = [], selectedFields = [] }) => {
    const exportToExcel = () => {
        const rows = Array.isArray(data) ? data : [];
        // מיפוי כל תלמידה לשורה עם כותרות עבריות בהתאם לשדות הנבחרים
        const translated = rows.map((student) => {
            const row = {};
            selectedFields.forEach((field) => {
                row[fieldsDictHeb[field] || field] = student[field] ?? "";
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(translated);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
        XLSX.writeFile(workbook, "students_data.xlsx");
    };

    return (
        <button
            onClick={exportToExcel}
            className="p-2 rounded-full hover:bg-gray-200 transition"
            title="יצוא לאקסל"
        >
            <FileDown className="w-8 h-8" />
        </button>
    );
};
