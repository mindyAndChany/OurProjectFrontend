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
    bg: "bg-white",
    to:"/Kattendence/kodesh"  },
  {
    title: "לימודי הוראה",
    icon: mortarboard01,
    bg: "bg-[#bda39b]",
    to:"/Kattendence/horaah"
  },
  {
    title: "התמחויות",
    icon: desk,
    bg: "bg-[#295f8b] text-white",
    to:"/Kattendence/hitmachuyot"
  },
  {
    title: "מערכת שעות",
    icon: CalendarClock,
    bg: "bg-[#d8cdc2]",
    to: "/schedule",
  },
  {
    title: "לוח שנה",
    icon: calendar02,
    bg: "bg-[#295f8b] text-white",
    to: "/Calendar",
  },
  {
    title: "השאלת ציוד",
    icon: payByCheck,
    bg: "bg-[#bda39b]",
    to: "/Equipments",
  },
  {
    title: "נתוני תלמידות",
    icon: task01,
    bg: "bg-white",
    to:"/StudentsData"
  },
  {
    title: "אישורים",
    icon: taskDone02,
    bg: "bg-[#d8cdc2]",
    to: "/Approvals",
  },
];

export default function Screen() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white [direction:rtl] pt-36 pb-24">
      {/* Title */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <h1 className="text-5xl font-bold text-right">
          דף הבית
        </h1>
        <p className="mt-4 text-xl text-gray-700 font-semibold">
          ניהול כל המערכות במקום אחד – בצורה ברורה ונוחה
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => item.to && navigate(item.to)}
              className={`
                ${item.bg}
                rounded-3xl p-8 h-44
                flex flex-col items-center justify-center gap-4
                font-bold text-2xl
                shadow-md hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-2
                ${item.to ? "cursor-pointer" : "cursor-default"}
              `}
            >
              {typeof item.icon === "string" ? (
                <img
                  src={item.icon}
                  alt=""
                  className="w-14 h-14 object-contain"
                />
              ) : (
                (() => {
                  const Icon = item.icon;
                  return <Icon className="w-14 h-14 opacity-80" />;
                })()
              )}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
