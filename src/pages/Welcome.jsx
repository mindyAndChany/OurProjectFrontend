import React from "react";
import Crowdfunding from "../icons/crowdfunding.png";
import LicenseDraft from "../icons/license-draft.png";
import SchoolBell02 from "../icons/school-bell-02.png";
import SecurityCheck from "../icons/security-check.png";
import SquareLock01 from "../icons/square-lock-01.png";
import Task01 from "../icons/task-01.png";
import User from "../icons/user.png";
import { useNavigate } from "react-router-dom";

export const Frame = () => {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/login");
  }

  const navigationItems = [
    "דף הבית",
    "מסד נתונים",
    "נוכחות",
    "לוח שנה",
    "השאלת ציוד",
  ];

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
    <div className="bg-white overflow-hidden w-full min-h-screen relative [direction:rtl]">
      {/* Header */}
      <header className="w-full px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLoginClick}
            className="px-6 py-3 bg-[#295f8b] text-black font-bold rounded-md border-2 border-black hover:bg-[#1e4a6b] transition"
          >
            התחברות
          </button>

          <nav aria-label="Main navigation" className="hidden md:block">
            <ul className="flex gap-8 font-bold text-lg">
              {navigationItems.map((item, i) => (
                <li key={i}>
                  <a href={`#${item}`} className="hover:text-[#295f8b] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <h1 className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-[44px]">
          <span className="text-black">EDU</span>
          <span className="text-[#295f8b]">LINK</span>
        </h1>
      </header>

      {/* Hero */}
      <main className="px-10">
        <section className="max-w-[900px] mt-24">
          <h2 className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-6xl leading-tight">
            להחליט את הגליונות
            <br />
            בקובץ מסודר
            <br />
            בטוח ומתאים
          </h2>

          <p className="mt-6 text-[20px] font-bold max-w-[760px]">
            מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות עם פרטי קשר, היסטוריית נוכחות, לוח שנה משותף, והשאלת ציוד.
            <br />
            כלים חכמים לחיסכון בזמן וניהול פשוט של הפעילות היומיומית.
          </p>

          <div className="mt-8 flex gap-6">
            <button className="px-8 py-4 bg-[#295f8b] rounded-[30px] font-bold border-2 border-black hover:bg-[#1e4a6b]">
              כניסה למערכת
            </button>
            <button className="px-8 py-4 bg-white rounded-[30px] font-bold border-2 border-black hover:bg-gray-50">
              חקור את המערכת
            </button>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="mt-16 px-2">
          <div className="grid grid-cols-3 gap-8 justify-center max-w-[1300px] mx-auto">
            {mainFeatures.map((feature) => (
              <article key={feature.id} className="relative bg-[#bda39b] rounded-[30px] border-2 border-black p-6 text-center w-full max-w-[420px]">
                {/* offset shadow */}
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-[26px] -z-10" />
                {feature.icon && (
                  <img src={feature.icon} alt="" className="mx-auto w-16 h-16 mt-2" />
                )}
                <h3 className="mt-4 font-bold text-[24px]">{feature.title}</h3>
                <p className="mt-2 text-lg">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Additional Features (dark band) */}
        <section className="mt-16 bg-[#584041] py-12">
          <div className="max-w-[1200px] mx-auto flex gap-8 justify-center">
            {additionalFeatures.map((f) => (
              <article key={f.id} className="relative bg-[#d8cdc2] rounded-[26px] border-2 border-black p-6 w-80 text-center">
                <div className="absolute -bottom-3 -right-3 w-full h-full bg-black rounded-[22px] -z-10" />
                {f.icon && <img src={f.icon} alt="" className="mx-auto w-14 h-14 mt-2" />}
                <h3 className="mt-4 font-bold text-[20px]">{f.title}</h3>
                <p className="mt-2 whitespace-pre-line">{f.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-center gap-6">
          <div className="bg-[#295f8b] rounded-[26px] p-10 w-[85%] max-w-[1200px] border-2 border-black text-center">
            <h2 className="font-bold text-4xl">מוכנה להפחית ניירת ולהתארגן?</h2>
            <p className="mt-2 text-xl">התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד</p>
          </div>

          <div className="flex gap-6">
            <button className="px-8 py-3 bg-[#584041] rounded-[20px] font-bold border-2 border-black hover:bg-[#463334]">למד עוד</button>
            <button onClick={handleLoginClick} className="px-8 py-3 bg-[#bda39b] rounded-[20px] font-bold border-2 border-black hover:bg-[#a89088]">התחברות</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Frame;