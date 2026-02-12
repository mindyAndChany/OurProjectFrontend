import React, { useEffect } from "react";
import Crowdfunding from "../icons/crowdfunding.png";
import LicenseDraft from "../icons/license-draft.png";
import SchoolBell02 from "../icons/school-bell-02.png";
import SecurityCheck from "../icons/security-check.png";
import SquareLock01 from "../icons/square-lock-01.png";
import calendar02 from "../icons/calendar-02.png";
import Task01 from "../icons/task-01.png";
import User from "../icons/user.png";
import { CalendarClock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Edulink } from "../components/Edulink";

export default function Frame() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? import.meta.env.BACKEND_URL;

  // פונקציה לעורר את השרת
  async function wakeUpServer() {
    const serverUrl = BACKEND_URL;

    try {
      console.log('מעיר את השרת...');
      const response = await fetch(`${serverUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('השרת התעורר בהצלחה');
      }
    } catch (error) {
      console.log('השרת עדיין מתעורר...', error.message);
    }
  }

useEffect(() => {
  wakeUpServer();
  window.addEventListener('load', wakeUpServer);
  return () => window.removeEventListener('load', wakeUpServer);
}, []);


  const navigate = useNavigate();

  const mainFeatures = [
    { id: 1, title: "השאלת ציוד", description: "מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.", icon: User },
    { id: 2, title: "מסד נתונים", description: "פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.", icon: Crowdfunding },
    { id: 3, title: "נוכחות חכמה", description: "מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.", icon: LicenseDraft },
    { id: 4, title: "הרשאות וגיבוי", description: "הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.", icon: SquareLock01 },
    { id: 5, title: "לוח שנה משותף", description: "כל הארועים, מבחנים והפסקות במבט אחד.", icon: calendar02 },
    { id: 6, title: "ניהול מערכת", description: "ניהול חדרים, מורות, כיתות ושעות — הכל במקום אחד.", icon: CalendarClock },
  ];

  const additionalFeatures = [
    { id: 1, title: "גיבוי ופרטיות", description: "אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים", icon: SecurityCheck },
    { id: 2, title: "יצוא ודוחות", description: "דוחות מותאמים אישית\nיצוא לקבצי EXEL/PDF", icon: Task01 },
    { id: 3, title: "התראות חכמות", description: "התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.", icon: SchoolBell02 },
  ];

  const stats = [
    { id: 1, label: "מודולים חכמים", value: "9+" },
    { id: 2, label: "מסכים מנוהלים", value: "20+" },
    { id: 3, label: "זמן הטמעה", value: "דקות" },
    { id: 4, label: "שקט תפעולי", value: "100%" },
  ];

  return (
    <div className="w-full [direction:rtl] overflow-hidden bg-gradient-to-br from-[#f7f4f1] via-[#f0f6ff] to-[#fef7f2]">
      <div className="relative">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#bda39b]/30 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-[#295f8b]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#584041]/20 blur-3xl" />

        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-10 relative">
          <div className="flex items-center justify-between mb-8">
            <Edulink className="scale-75 origin-left" />
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#295f8b]" />
              <span className="text-sm font-semibold text-[#295f8b]">מערכת ניהול סמינר מתקדמת</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#1c2b36]">
                להחליף את הגליונות
                <br />
                בקובץ מסודר
                <br />
                בטוח ומתאים
              </h1>

              <p className="mt-6 max-w-3xl text-lg md:text-xl font-medium text-gray-700">
                מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד —
                מאגר תלמידות, נוכחות, מערכת שעות וחדרים, לוח שנה
                הנפקת אישורים ותעודות וניהול השאלת ציוד.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-10 py-4 bg-gradient-to-r from-[#295f8b] to-[#3b78b2] text-white rounded-full
                             font-bold shadow-lg shadow-[#295f8b]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  כניסה למערכת
                </button>

                <button
                  className="px-10 py-4 bg-white/80 backdrop-blur rounded-full font-bold
                             border border-white/70 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  חקור את המערכת
                </button>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/70 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.id} className="rounded-2xl bg-white/80 border border-white/60 p-4 text-center shadow-sm">
                    <div className="text-3xl font-extrabold text-[#295f8b]">{s.value}</div>
                    <div className="mt-1 text-sm font-semibold text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#295f8b]/10 to-[#bda39b]/20 p-4 text-sm text-gray-700">
                שליטה מלאה, תזרים עבודה ברור, וחוויית שימוש מהירה ונוחה לצוות ההנהלה.
              </div>
            </div>
          </div>
        </section>

        {/* MAIN FEATURES */}
        <section className="max-w-7xl mx-auto mt-16 px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainFeatures.map((f, i) => (
              <div
                key={f.id}
                className="group bg-white/70 backdrop-blur-md rounded-3xl p-8 text-center border border-white/60
                           shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-[#295f8b]/20 to-[#bda39b]/30 flex items-center justify-center">
                {typeof f.icon === "string" ? (
                <img
                  src={f.icon}
                  alt=""
                  className="w-14 h-14 object-contain"
                />
              ) : (
                (() => {
                  const Icon = f.icon;
                  return <Icon className="w-14 h-14 opacity-80" />;
                })()
              )}
                </div>
                <h3 className="text-2xl font-bold text-[#1c2b36]">{f.title}</h3>
                <p className="mt-2 text-base text-gray-700">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ADDITIONAL FEATURES */}
        <section className="mt-24 py-20 bg-gradient-to-br from-[#584041] via-[#3b2a2b] to-[#1f1b1c]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center text-white mb-10">
              <h2 className="text-4xl font-bold">הכלים שעושים הבדל</h2>
              <p className="mt-3 text-white/80">מערכת בנויה לשקט תפעולי ולשקיפות מלאה</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              {additionalFeatures.map((f) => (
                <div
                  key={f.id}
                  className="bg-white/95 rounded-3xl p-8 w-80 text-center shadow-xl
                             transition-all duration-300 hover:-translate-y-2"
                >
                  <img src={f.icon} alt="" className="mx-auto w-14 h-14 mb-4" />
                  <h4 className="text-xl font-bold text-[#1c2b36]">{f.title}</h4>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 flex flex-col items-center gap-8 pb-24">
          <div className="bg-gradient-to-r from-[#295f8b] to-[#3b78b2] max-w-5xl w-[90%] rounded-3xl
                          p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-white">
              מוכנה להפחית ניירת ולהתארגן?
            </h2>
            <p className="mt-3 text-xl text-white/90">
              התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
            </p>
          </div>

          <div className="flex gap-4">
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
    </div>
  );
}
