// export default Screen;
import React from "react";
import bookEdit from "../icons/book-edit.png";
import calendar02 from "../icons/calendar-02.png";
import desk from "../icons/desk.png";
import mortarboard01 from "../icons/mortarboard-01.png";
import payByCheck from "../icons/pay-by-check.png";
import task01 from "../icons/task-01.png";
import taskDone02 from "../icons/task-done-02.png";
import securityCheck from "../icons/security-check.png";
import { CalendarClock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const items = [
  {
    title: "לימודי קודש",
    icon: bookEdit,
    gradient: "from-[#295f8b] via-[#3b78b2] to-[#4a8fc4]",
    glow: "group-hover:shadow-[#295f8b]/50",
    to:"/Kattendence/kodesh"
  },
  {
    title: "לימודי הוראה",
    icon: mortarboard01,
    gradient: "from-[#bda39b] via-[#c9b5ad] to-[#d4c3bb]",
    glow: "group-hover:shadow-[#bda39b]/50",
    to:"/Kattendence/horaah"
  },
  {
    title: "התמחויות",
    icon: desk,
    gradient: "from-[#295f8b] via-[#3b78b2] to-[#4a8fc4]",
    glow: "group-hover:shadow-[#584041]/50",
    to:"/Kattendence/hitmachuyot"
  },
  {
    title: "מערכת שעות",
    icon: CalendarClock,
    gradient: "from-[#bda39b] via-[#c9b5ad] to-[#d4c3bb]",
    glow: "group-hover:shadow-[#3b78b2]/50",
    to: "/schedule",
  },
  {
    title: "לוח שנה",
    icon: calendar02,
    gradient: "from-[#3b78b2] via-[#4a8fc4] to-[#5ba3d4]",
    glow: "group-hover:shadow-[#3b78b2]/50",
    to: "/Calendar",
  },
  {
    title: "השאלת ציוד",
    icon: payByCheck,
    gradient: "from-[#c9b5ad] via-[#bda39b] to-[#a89189]",
    glow: "group-hover:shadow-[#bda39b]/50",
    to: "/Equipments",
  },
  {
    title: "נתוני תלמידות",
    icon: task01,
    gradient: "from-[#295f8b] via-[#3b78b2] to-[#4a8fc4]",
    glow: "group-hover:shadow-[#295f8b]/50",
    to:"/StudentsData"
  },
  {
    title: "אישורים",
    icon: taskDone02,
    gradient: "from-[#bda39b] via-[#c9b5ad] to-[#d4c3bb]",
    glow: "group-hover:shadow-[#bda39b]/50",
    to: "/Approvals",
  },
  {
    title: "ניהול",
    icon: securityCheck,
    gradient: "from-[#584041] via-[#6b5152] to-[#7d6264]",
    glow: "group-hover:shadow-[#584041]/50",
    to: "/Managment",
    isAdminOnly: true,
  },
];

export default function Screen() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  
  // בדיקה אם המשתמש הוא admin - רק אם התחבר והגיעו פרטי משתמש
  const isAdmin = user?.userDetails?.role === "admin";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f7f4f1] via-[#f0f6ff] to-[#fef7f2] [direction:rtl] pt-16 xs:pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-8 xs:pb-10 sm:pb-12 md:pb-16 lg:pb-20 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-5 xs:top-10 sm:top-16 md:top-20 left-5 xs:left-10 sm:left-16 md:left-20 w-32 xs:w-40 sm:w-56 md:w-64 lg:w-72 h-32 xs:h-40 sm:h-56 md:h-64 lg:h-72 bg-[#bda39b]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 xs:top-16 sm:top-24 md:top-32 lg:top-40 right-5 xs:right-10 sm:right-16 md:right-20 w-32 xs:w-40 sm:w-56 md:w-64 lg:w-72 h-32 xs:h-40 sm:h-56 md:h-64 lg:h-72 bg-[#295f8b]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-32 xs:w-40 sm:w-56 md:w-64 lg:w-72 h-32 xs:h-40 sm:h-56 md:h-64 lg:h-72 bg-[#584041]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Title */}
      <section className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative z-10">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-right bg-gradient-to-r from-[#295f8b] via-[#3b78b2] to-[#4a8fc4] bg-clip-text text-transparent animate-gradient-x leading-tight">
          דף הבית
        </h1>
        <p className="mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-medium text-right">
          ניהול כל המערכות במקום אחד – בצורה ברורה ונוחה
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className={`grid grid-cols-1 xs:grid-cols-2 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8`}>
          {items
            .filter(item => !item.isAdminOnly || isAdmin)
            .map((item, i) => (
            <button
              key={i}
              onClick={() => item.to && navigate(item.to)}
              className={`
                group relative
                bg-white/80 backdrop-blur-sm
                rounded-xl xs:rounded-2xl sm:rounded-3xl 
                p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 
                h-28 xs:h-32 sm:h-36 md:h-40 lg:h-48
                flex flex-col items-center justify-center 
                gap-2 xs:gap-3 sm:gap-4 md:gap-5
                font-bold 
                text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl 
                text-gray-800
                shadow-md hover:shadow-xl sm:shadow-lg sm:hover:shadow-2xl ${item.glow}
                transition-all duration-500 ease-out
                hover:-translate-y-1 xs:hover:-translate-y-2 sm:hover:-translate-y-3 
                hover:scale-105
                active:scale-95
                ${item.to ? "cursor-pointer" : "cursor-default"}
                overflow-hidden
                border border-white/20
                touch-target
              `}
            >
              {/* Gradient Background Overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${item.gradient}
                opacity-0 group-hover:opacity-20
                transition-opacity duration-500
              `}></div>
              
              {/* Animated Border Gradient */}
              <div className={`
                absolute inset-0 rounded-3xl
                bg-gradient-to-br ${item.gradient}
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                -z-10 blur-xl
              `}></div>

              {/* Icon Container with Animation */}
              <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                {typeof item.icon === "string" ? (
                  <div className="relative">
                    <img
                      src={item.icon}
                      alt=""
                      className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain drop-shadow-lg"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500`}></div>
                  </div>
                ) : (
                  (() => {
                    const Icon = item.icon;
                    return (
                      <div className="relative">
                        <Icon className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 stroke-2 text-gray-700 group-hover:text-transparent group-hover:bg-gradient-to-br group-hover:from-current group-hover:to-current transition-all duration-500" />
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Title with gradient on hover */}
              <span className="relative z-10 group-hover:bg-gradient-to-r group-hover:from-[#295f8b] group-hover:to-[#3b78b2] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                {item.title}
              </span>

              {/* Decorative circles */}
              <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-tr from-white/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
