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


const fieldGroups = {
    basic: ["id_number", "first_name", "last_name", "class_kodesh"],
    personal: [
        "id_number", "first_name", "last_name", "phone", "marital_status", "address",
        "father_name_he", "father_mobile_he", "mother_name_he", "mother_mobile_he", "class_kodesh"
    ],
    payments: ["id_number", "first_name", "last_name", "payment_status", "paid_amount", "class_kodesh"],
    phonebook: ["id_number", "first_name", "last_name", "phone", "class_kodesh","track"],
    photos: ["id_number", "first_name", "last_name", "photoUrl", "class_kodesh"]
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

const initialNewStudent = Object.fromEntries(
    Object.values(fieldsDict).map((key) => [key, ""])
);

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






    const toApiField = (f) => (f === 'photoUrl' ? 'photo_url' : f);

    useEffect(() => {
        const categoriesArr = selectedFields.map(toApiField);
        // Ensure registration year is available for filtering, even if not displayed
        if (!categoriesArr.includes('registration_year')) {
            categoriesArr.push('registration_year');
        }
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
        setSelectedFields(fieldGroups[group]);
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setGroup(value);
    };



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
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        title="הוספת תלמידה"
                    >
                        <UserRoundPlus className="w-5 h-5" />
                    </button>

                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogContent className="space-y-4 rtl text-right">
                            <h2 className="text-lg font-semibold mb-2">פרטי תלמידה חדשה</h2>
                            {Object.keys(fieldsDictHeb).filter(k => k !== 'photoUrl').map((key) => (
                                <TextField
                                    key={key}
                                    label={fieldsDictHeb[key] || key}
                                    value={newStudent[key]}
                                    onChange={(e) =>
                                        setNewStudent((prev) => ({ ...prev, [key]: e.target.value }))
                                    }
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                />
                            ))}


                            <Button onClick={handleAddStudent}>שמור</Button>
                        </DialogContent>
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
                    {studentToEdit &&
                        Object.keys(initialNewStudent).filter(k => k !== 'photoUrl').map((key) => (
                            <TextField
                                key={key}
                                label={fieldLabels[key] || key}
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
                                disabled={key === "id_number"} // שדה ת"ז לא ניתן לעריכה
                            />
                        ))}
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
