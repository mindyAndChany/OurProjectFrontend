import React from "react";
import Crowdfunding from "../icons/crowdfunding.png";
import LicenseDraft from "../icons/license-draft.png";
import SchoolBell02 from "../icons/school-bell-02.png";
import SecurityCheck from "../icons/security-check.png";
import SquareLock01 from "../icons/square-lock-01.png";
import Task01 from "../icons/task-01.png";
import User from "../icons/user.png";
import { useNavigate } from "react-router-dom";

export default function Frame() {
  const navigate = useNavigate();

  const mainFeatures = [
    { id: 1, title: "השאלת ציוד", description: "מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.", icon: User },
    { id: 2, title: "מסד נתונים", description: "פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.", icon: Crowdfunding },
    { id: 3, title: "נוכחות חכמה", description: "מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.", icon: LicenseDraft },
    { id: 4, title: "הרשאות וגיבוי", description: "הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.", icon: SquareLock01 },
    { id: 5, title: "לוח שנה משותף", description: "כל הארועים, מבחנים והפסקות במבט אחד.", icon: null },
  ];

  const additionalFeatures = [
    { id: 1, title: "גיבוי ופרטיות", description: "אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים", icon: SecurityCheck },
    { id: 2, title: "יצוא ודוחות", description: "דוחות מותאמים אישית\nיצוא לקבצי EXEL/PDF", icon: Task01 },
    { id: 3, title: "התראות חכמות", description: "התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.", icon: SchoolBell02 },
  ];

  return (
    <div className="bg-white w-full [direction:rtl] overflow-hidden">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32">
        <h1 className="text-6xl font-bold leading-tight animate-fadeIn">
          להחליף את הגליונות
          <br />
          בקובץ מסודר
          <br />
          בטוח ומתאים
        </h1>

        <p className="mt-6 max-w-3xl text-xl font-semibold text-gray-800 animate-fadeIn delay-100">
          מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד —
          מאגר תלמידות, נוכחות, לוח שנה והשאלת ציוד.
        </p>

        <div className="mt-10 flex gap-6 animate-fadeIn delay-200">
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-[#295f8b] text-white rounded-full
                       font-bold shadow-md hover:shadow-lg
                       transition-all duration-300 hover:-translate-y-1"
          >
            כניסה למערכת
          </button>

          <button
            className="px-10 py-4 bg-white rounded-full font-bold
                       border border-gray-300 shadow-sm
                       hover:shadow-md transition-all duration-300"
          >
            חקור את המערכת
          </button>
        </div>
      </section>

      {/* MAIN FEATURES */}
      <section className="max-w-7xl mx-auto mt-28 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {mainFeatures.map((f, i) => (
            <div
              key={f.id}
              className="bg-[#bda39b]/90 rounded-3xl p-8 text-center
                         shadow-sm hover:shadow-xl
                         transition-all duration-300
                         hover:-translate-y-2"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {f.icon && (
                <img src={f.icon} alt="" className="mx-auto w-16 h-16 mb-4" />
              )}
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="mt-2 text-lg text-gray-900">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ADDITIONAL FEATURES */}
      <section className="mt-32 bg-[#584041] py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 justify-center px-6">
          {additionalFeatures.map((f) => (
            <div
              key={f.id}
              className="bg-[#d8cdc2] rounded-3xl p-8 w-80 text-center
                         shadow-md hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-2"
            >
              <img src={f.icon} alt="" className="mx-auto w-14 h-14 mb-4" />
              <h4 className="text-xl font-bold">{f.title}</h4>
              <p className="mt-2 whitespace-pre-line">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-28 flex flex-col items-center gap-8 pb-28">
        <div className="bg-[#295f8b] max-w-5xl w-[90%] rounded-3xl
                        p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white">
            מוכנה להפחית ניירת ולהתארגן?
          </h2>
          <p className="mt-3 text-xl text-white/90">
            התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
          </p>
        </div>

        <div className="flex gap-6">
          <button
            className="px-10 py-4 bg-[#584041] text-white rounded-full
                       font-bold shadow-md hover:shadow-lg transition"
          >
            למד עוד
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-[#bda39b] rounded-full
                       font-bold shadow-md hover:shadow-lg transition"
          >
            התחברות
          </button>
        </div>
      </section>
    </div>
  );
}
