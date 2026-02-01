import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";


 export const ExportToExcel = (data) => {
    const exportToExcel=()=>{
         const translated = data.map((student) => {
            const row = {};
            selectedFields.forEach((field) => {
                row[fieldLabels[field] || field] = data[field];
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(translated);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
        XLSX.writeFile(workbook, "students_data.xlsx");

    }   
   
        return  <button
                                onClick={()=>exportToExcel(data)}
                                className="p-2 rounded-full hover:bg-gray-200 transition"
                                title="יצוא לאקסל"
                            >
                                <FileDown className="w-5 h-5" />
                            </button>
    };