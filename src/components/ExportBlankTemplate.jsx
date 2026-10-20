import { useState } from "react";
import { FileDown } from "lucide-react";
import { exportStudentsTemplate } from "../utils/excelTemplate";

// מוריד קובץ אקסל ריק למילוי: כל העמודות שנשמרות בשרת + שורת חוקי בדיקה + גיליון מדריך
export const ExportBlankTemplate = () => {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // ייצוג אסינכרוני קצר, כדי שלא לחסום את הממשק בזמן בניית הקובץ
            exportStudentsTemplate([]);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-full bg-[#0A3960] px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0a2f4f] disabled:opacity-60"
            title="הורדת קובץ אקסל ריק למילוי, עם כל העמודות וחוקי הבדיקה"
        >
            <FileDown className="w-5 h-5" />
            {downloading ? "מכין קובץ..." : "הורדת טופס אקסל ריק"}
        </button>
    );
};
