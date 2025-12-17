import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-slate-900 dark:text-slate-100">
      {/* NAV */}
      <header className="w-full bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="font-bold text-white">ס</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-none">מערכת ניהול סמינר</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">מאגר תלמידות | נוכחות | לוח שנה | השאלת ציוד</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">דף הבית</Link>
              <Link to="/students" className="hover:text-blue-600 dark:hover:text-blue-400"> מסד נתונים</Link>
              <Link to="/attendance" className="hover:text-blue-600 dark:hover:text-blue-400">נוכחות</Link>
              <Link to="/calendar" className="hover:text-blue-600 dark:hover:text-blue-400">לוח שנה</Link>
              <Link to="/equipment" className="hover:text-blue-600 dark:hover:text-blue-400">השאלת ציוד</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                aria-label="toggle dark mode"
                onClick={() => setDark((s) => !s)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-transparent bg-slate-100 dark:bg-slate-700 text-sm shadow-sm hover:shadow-md transition"
              >
                {dark ? "מצב כהה" : "מצב בהיר"}
              </button>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
              >
                התחברות
              </Link>

              {/* mobile menu trigger - simple anchor to list below */}
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              להחליף את הגיליונות בקובץ מסודר, בטוח ומותאם
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl">
              מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות עם פרטי קשר, היסטוריית נוכחות, לוח שנה משותף, והשאלת ציוד.
              כלים חכמים לחיסכון בזמן וניהול פשוט של הפעילות היומיומית.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg"
              >
                כניסה למערכת
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md"
              >
                חקור את המערכת
              </a>
            </div>

            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              <strong>מוכן להתחיל?</strong> השירות מגן על המידע ומאפשר הרשאות גישה מתקדמות לכל משתמשת.
            </div>
          </div>

          {/* Right column: compact info cards */}
          <aside className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold">מסד נתונים </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">פרטי קשר, תיעוד, סינון מהיר וייצוא נתונים.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold">נוכחות חכמה</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">מעקב בזמן אמת ודוחות חודשיים בלחיצת כפתור.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold">לוח שנה משותף</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">כל האירועים, מבחנים והפסקות במבט אחד.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold">השאלת ציוד</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-lg border border-slate-100 dark:border-slate-700">
              <h4 className="text-sm font-semibold">הרשאות וגיבוי</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-2">הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.</p>
            </div>
          </aside>
        </section>

        {/* FEATURES / GRID */}
        <section id="features" className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="גיבוי ופרטיות" desc="אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים." />
            <FeatureCard title="ייצוא ודוחות" desc="ייצוא לקבצי Excel/PDF ודוחות מותאמים אישית." />
            <FeatureCard title="התראות חכמות" desc="התראות על ציוד בהשאלה, תזכורות לחסרי נוכחות ועוד." />
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="mt-12 mb-20">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">מוכנה להפחית ניירת ולהתארגן?</h3>
              <p className="text-sm opacity-90 mt-1">התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/login" className="px-5 py-3 rounded-lg bg-white text-indigo-700 font-semibold">התחברות</Link>
              <Link to="/" className="px-5 py-3 rounded-lg border border-white/30">למד עוד</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
<<<<<<< HEAD:src/pages/LandingPage.jsx

function FeatureCard({ title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}
// import { useState } from "react";
// import {
//   BookOpen,
//   GraduationCap,
//   Briefcase,
//   Calendar,
//   Archive,
//   Users,
//   CheckSquare,
//   User,
// } from "lucide-react";
// import { motion } from "framer-motion";
// export default function Homepage() {
//   const [active, setActive] = useState("home");
//   const menuItems = [
//     { id: "limudeiKodesh", label: "לימודי קודש", icon: BookOpen, color: "bg-pink-500" },
//     { id: "limudeiHoraa", label: "לימודי הוראה", icon: GraduationCap, color: "bg-emerald-500" },
//     { id: "hitmachuyot", label: "התמחויות", icon: Briefcase, color: "bg-indigo-500" },
//     { id: "events", label: "אירועים", icon: Calendar, color: "bg-amber-500" },
//     { id: "calendar", label: "לוח שנה", icon: Archive, color: "bg-purple-500" },
//     { id: "equipment", label: "השאלת ציוד", icon: Users, color: "bg-cyan-500" },
//     { id: "studentData", label: "נתוני תלמידות", icon: CheckSquare, color: "bg-teal-600" },
//     { id: "approvals", label: "אישורים", icon: CheckSquare, color: "bg-rose-500" },
//   ];
//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-900">
//       {/* Top Navigation Bar */}
//       <header className="bg-white shadow-xl flex justify-between items-center p-4 sticky top-0 z-50">
//         <div className="flex items-center gap-4">
//           <User className="text-gray-700" size={30} />
//           <span className="font-medium text-gray-700">פרופיל</span>
//         </div>
//         <div className="flex flex-wrap justify-center gap-3">
//           {menuItems.map(({ id, label, icon: Icon, color }) => (
//             <motion.button
//               key={id}
//               whileHover={{ scale: 1.15, rotate: 3 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setActive(id)}
//               className={`relative flex flex-col items-center justify-center p-3 w-24 h-24 rounded-2xl shadow-md text-white transition-all ${color} ${
//                 active === id ? "ring-4 ring-white" : "hover:brightness-110"
//               }`}
//             >
//               <Icon size={40} className="text-white mb-2" />
//               <span className="text-sm font-semibold text-center drop-shadow-lg">{label}</span>
//             </motion.button>
//           ))}
//         </div>
//       </header>
//       {/* Main Content */}
//       <main className="flex-1 flex items-center justify-center p-10">
//         <motion.div
//           key={active}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="text-3xl font-bold text-gray-700 bg-white p-10 rounded-3xl shadow-2xl"
//         >
//           {menuItems.find((item) => item.id === active)?.label || "דף הבית"}
//         </motion.div>
//       </main>
//     </div>
//   );
// }
=======
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
>>>>>>> e7d777ffdb2e13fe8a3504793f7493af9a8b0164:src/pages/HomePage copy.jsx
