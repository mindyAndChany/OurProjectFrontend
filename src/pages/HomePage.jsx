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
    gradient: "from-purple-400 via-pink-400 to-red-400",
    glow: "group-hover:shadow-purple-500/50",
    to:"/Kattendence/kodesh"
  },
  {
    title: "לימודי הוראה",
    icon: mortarboard01,
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    glow: "group-hover:shadow-amber-500/50",
    to:"/Kattendence/horaah"
  },
  {
    title: "התמחויות",
    icon: desk,
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glow: "group-hover:shadow-blue-500/50",
    to:"/Kattendence/hitmachuyot"
  },
  {
    title: "מערכת שעות",
    icon: CalendarClock,
    gradient: "from-emerald-400 via-teal-400 to-cyan-500",
    glow: "group-hover:shadow-teal-500/50",
    to: "/schedule",
  },
  {
    title: "לוח שנה",
    icon: calendar02,
    gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
    glow: "group-hover:shadow-violet-500/50",
    to: "/Calendar",
  },
  {
    title: "השאלת ציוד",
    icon: payByCheck,
    gradient: "from-rose-400 via-pink-400 to-purple-400",
    glow: "group-hover:shadow-pink-500/50",
    to: "/Equipments",
  },
  {
    title: "נתוני תלמידות",
    icon: task01,
    gradient: "from-blue-400 via-indigo-400 to-purple-500",
    glow: "group-hover:shadow-indigo-500/50",
    to:"/StudentsData"
  },
  {
    title: "אישורים",
    icon: taskDone02,
    gradient: "from-lime-400 via-green-400 to-emerald-500",
    glow: "group-hover:shadow-green-500/50",
    to: "/Approvals",
  },
];

export default function Screen() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 [direction:rtl] pt-36 pb-24 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Title */}
      <section className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <h1 className="text-6xl font-bold text-right bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
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
              <span className="relative z-10 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
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
