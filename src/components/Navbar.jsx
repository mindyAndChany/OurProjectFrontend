import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { Edulink } from "../components/Edulink";
import Profil from "../components/profil";

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
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user?.userDetails;
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const domainFromPath = pathParts[0] === "Kattendence" ? pathParts[1] : "";
  const currentDomain = domainFromPath || new URLSearchParams(location.search).get("domain") || "";

  const linkClass = ({ isActive }) =>
    `
    relative
    px-2 sm:px-3 md:px-4 lg:px-5
    py-2 md:py-2.5 lg:py-3
    text-sm sm:text-base md:text-lg lg:text-xl font-bold
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-14 sm:h-16 md:h-20 grid grid-cols-[auto,1fr,auto] items-center gap-4 md:gap-6 lg:gap-8">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Edulink className="scale-75 origin-left" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-4 md:gap-6 lg:gap-8">
            {navItems.map((item) => {
              if (item.to === "/Kattendence") {
                return (
                  <div key={item.to} className="relative flex items-center gap-2">
                    <NavLink
                      to={item.to}
                      onClick={() => setShowDomainMenu((v) => !v)}
                      className={linkClass}
                    >
                      {item.label}
                    </NavLink>
                    {showDomainMenu && (
                      <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                        <NavLink
                          to="/Kattendence/kodesh"
                          onClick={() => {
                            setOpen(false);
                            setShowDomainMenu(false);
                          }}
                          className={({ isActive }) =>
                            `block w-full text-right px-3 py-2 text-sm hover:bg-gray-100 ${isActive || currentDomain === "kodesh" ? "text-[#295f8b] font-semibold" : "text-gray-700"}`
                          }
                        >
                          קודש
                        </NavLink>
                        <NavLink
                          to="/Kattendence/hitmachuyot"
                          onClick={() => {
                            setOpen(false);
                            setShowDomainMenu(false);
                          }}
                          className={({ isActive }) =>
                            `block w-full text-right px-3 py-2 text-sm hover:bg-gray-100 ${isActive || currentDomain === "hitmachuyot" ? "text-[#295f8b] font-semibold" : "text-gray-700"}`
                          }
                        >
                          התמחויות
                        </NavLink>
                        <NavLink
                          to="/Kattendence/horaa"
                          onClick={() => {
                            setOpen(false);
                            setShowDomainMenu(false);
                          }}
                          className={({ isActive }) =>
                            `block w-full text-right px-3 py-2 text-sm hover:bg-gray-100 ${isActive || currentDomain === "horaa" ? "text-[#295f8b] font-semibold" : "text-gray-700"}`
                          }
                        >
                          הוראה
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {isLoggedIn ? (
              <Profil />
            ) : (
              <NavLink
                to="/login"
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-[#295f8b] text-white text-sm sm:text-base md:text-lg font-bold hover:bg-[#1e4a6b] transition-all"
              >
                התחברות
              </NavLink>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="toggle menu"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
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
          <nav className="flex flex-col gap-1.5 pb-4 sm:pb-5">
            {navItems.map((item) => {
              if (item.to === "/Kattendence") {
                return (
                  <div key={item.to} className="px-4">
                    <NavLink
                      to={item.to}
                      onClick={() => setShowDomainMenu((v) => !v)}
                      className="block w-full text-right py-3 text-base sm:text-lg font-bold text-gray-800 rounded-lg hover:bg-gray-100 transition"
                    >
                      {item.label}
                    </NavLink>
                    {showDomainMenu && (
                      <div className="pb-2 space-y-1">
                        <NavLink
                          to="/Kattendence/kodesh"
                          onClick={() => {
                            setOpen(false);
                            setShowDomainMenu(false);
                          }}
                          className={`block w-full text-right px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${currentDomain === "kodesh" ? "text-[#295f8b] font-semibold" : "text-gray-700"}`}
                        >
                          קודש
                        </NavLink>
                        <NavLink
                          to="/Kattendence/hitmachuyot"
                          onClick={() => {
                            setOpen(false);
                            setShowDomainMenu(false);
                          }}
                          className={`block w-full text-right px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${currentDomain === "hitmachuyot" ? "text-[#295f8b] font-semibold" : "text-gray-700"}`}
                        >
                          התמחויות
                        </NavLink>
                        <NavLink
                          to="/Kattendence/horaa"
                          onClick={() => {
                            setOpen(false);
                            setShowDomainMenu(false);
                          }}
                          className={`block w-full text-right px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${currentDomain === "horaa" ? "text-[#295f8b] font-semibold" : "text-gray-700"}`}
                        >
                          הוראה
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-base sm:text-lg font-bold text-gray-800 rounded-lg hover:bg-gray-100 transition"
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

