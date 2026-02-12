// export default Screen;
import React from "react";
import bookEdit from "../icons/book-edit.png";
import calendar02 from "../icons/calendar-02.png";
import desk from "../icons/desk.png";
import mortarboard01 from "../icons/mortarboard-01.png";
import payByCheck from "../icons/pay-by-check.png";
import task01 from "../icons/task-01.png";
import taskDone02 from "../icons/task-done-02.png";
import { CalendarClock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

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
];

export default function Screen() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f7f4f1] via-[#f0f6ff] to-[#fef7f2] [direction:rtl] pt-36 pb-24 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#bda39b]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-[#295f8b]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#584041]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Title */}
      <section className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <h1 className="text-6xl font-bold text-right bg-gradient-to-r from-[#295f8b] via-[#3b78b2] to-[#4a8fc4] bg-clip-text text-transparent animate-gradient-x">
          דף הבית
        </h1>
        <p className="mt-6 text-2xl text-gray-600 font-medium text-right">
          ניהול כל המערכות במקום אחד – בצורה ברורה ונוחה
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => item.to && navigate(item.to)}
              className={`
                group relative
                bg-white/80 backdrop-blur-sm
                rounded-3xl p-8 h-48
                flex flex-col items-center justify-center gap-5
                font-bold text-2xl text-gray-800
                shadow-lg hover:shadow-2xl ${item.glow}
                transition-all duration-500 ease-out
                hover:-translate-y-3 hover:scale-105
                ${item.to ? "cursor-pointer" : "cursor-default"}
                overflow-hidden
                border border-white/20
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
                      className="w-16 h-16 object-contain drop-shadow-lg"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500`}></div>
                  </div>
                ) : (
                  (() => {
                    const Icon = item.icon;
                    return (
                      <div className="relative">
                        <Icon className="w-16 h-16 stroke-2 text-gray-700 group-hover:text-transparent group-hover:bg-gradient-to-br group-hover:from-current group-hover:to-current transition-all duration-500" />
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
