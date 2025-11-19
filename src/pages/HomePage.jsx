import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  Calendar,
  Archive,
  Users,
  CheckSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import TopNav from "../components/TopNav.tsx"; 
export default function Homepage() {
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "limudeiKodesh", label: "לימודי קודש", icon: BookOpen, color: "bg-pink-500" },
    { id: "limudeiHoraa", label: "לימודי הוראה", icon: GraduationCap, color: "bg-emerald-500" },
    { id: "hitmachuyot", label: "התמחויות", icon: Briefcase, color: "bg-indigo-500" },
    { id: "events", label: "אירועים", icon: Calendar, color: "bg-amber-500" },
    { id: "calendar", label: "לוח שנה", icon: Archive, color: "bg-purple-500" },
    { id: "equipment", label: "השאלת ציוד", icon: Users, color: "bg-cyan-500" },
    { id: "studentData", label: "נתוני תלמידות", icon: CheckSquare, color: "bg-teal-600" },
    { id: "approvals", label: "אישורים", icon: CheckSquare, color: "bg-rose-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900">
      <TopNav /> {/* שימוש בתפריט החדש */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <motion.h1
          key={active}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-gray-700 mb-6"
        >
          {menuItems.find((item) => item.id === active)?.label || "ברוך הבא"}
        </motion.h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl w-full">
          {menuItems.map(({ id, label, icon: Icon, color }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(id)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg text-white transition-all duration-200 ${color} ${
                active === id ? "ring-4 ring-white/80" : "hover:brightness-110"
              }`}
            >
              <Icon size={36} className="mb-2" />
              <span className="text-sm font-medium text-center">{label}</span>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}
