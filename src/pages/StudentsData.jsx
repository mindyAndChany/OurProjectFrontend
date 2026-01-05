import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getStudentDataThunk } from "../redux/slices/STUDENTS/getStudentDataThunk";


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

// נתוני דמו מהשרת
const mockData = [
  {
    first_name: "שרה",
    last_name: "כהן",
    id_number: "123456789",
    phone: "050-1234567",
    city_he: "ירושלים",
    payment_status: "שולם",
    paid_amount: "1000"
  },
  {
    first_name: "רחל",
    last_name: "לוי",
    id_number: "987654321",
    phone: "050-7654321",
    city_he: "בני ברק",
    payment_status: "לא שולם",
    paid_amount: "0"
  }
];

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
      await dispatch(getStudentDataThunk(categories)); // הנתונים ייכנסו ל־slice
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
                <label key={field} className="flex items-center gap-2 text-sm">
<input
  type="checkbox"
  checked={selectedFields.includes(field)}
  onChange={() => toggleField(field)}
  className="w-4 h-4 appearance-auto accent-blue-600 cursor-pointer"
/>




                  {field}
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
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx}>
                  {selectedFields.map((field) => (
                    <Cell key={field}>{student[field]}</Cell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;
