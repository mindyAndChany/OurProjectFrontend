import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Edulink } from "../components/Edulink";

const navItems = [
  { to: "/home", label: "דף הבית" },
  { to: "/StudentsData", label: "מסד נתונים" },
  { to: "/Kattendence", label: "נוכחות" },
  { to: "/Calendar", label: "לוח שנה" },
  { to: "/Equipments", label: "השאלת ציוד" },
  { to: "/Approvals", label: "אישורים" },
  { to: "/schedule", label: "מערכת" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `
    relative px-4 py-2 text-xl font-bold
    transition-colors duration-300
    ${isActive ? "text-[#295f8b]" : "text-gray-800 hover:text-[#295f8b]"}
    after:absolute after:right-0 after:-bottom-1 after:h-[3px]
    after:bg-[#295f8b] after:rounded-full
    after:transition-all after:duration-300
    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
  `;

  return (
    <header
      dir="rtl"
      className="w-full bg-white shadow-sm fixed top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-[88px] flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Edulink className="h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/login"
              className="px-6 py-3 rounded-full
                         bg-[#295f8b] text-white text-lg font-bold
                         hover:bg-[#1e4a6b]
                         transition-all"
            >
              התחברות
            </NavLink>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="toggle menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav className="flex flex-col gap-2 pb-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-xl font-bold
                           text-gray-800 rounded-lg
                           hover:bg-gray-100 transition"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

