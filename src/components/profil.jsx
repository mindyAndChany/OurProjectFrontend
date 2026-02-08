import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/USER/userSlice.js";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const user = useSelector((state) => state.user);
  const details = user?.userDetails || user;

  const name = details?.name || "משתמש";
  const role = details?.role || "";
  const institution = details?.institution_code || "";

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
    } catch (e) {
      dispatch(logout());
    }
  };

  const initials = (name || "").trim().slice(0, 1).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="h-10 w-10 rounded-full bg-[#295f8b] text-white flex items-center justify-center font-bold">
          {initials}
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{role || ""}</div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
        >
          <div className="px-4 py-4 bg-gradient-to-b from-white to-gray-50">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#295f8b] text-white flex items-center justify-center font-bold text-lg">
                {initials}
              </div>
              <div className="flex-1 text-right">
                <div className="text-base font-bold text-gray-900">{name}</div>
                {role && <div className="text-sm text-gray-600">{role}</div>}
              </div>
            </div>
            {institution && (
              <div className="mt-3 text-xs text-gray-500 text-right">
                קוד מוסד: <span className="font-medium text-gray-700">{institution}</span>
              </div>
            )}
          </div>

          <div className="py-2">
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-right px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              פרטי חשבון
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full text-right px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              הגדרות
            </button>
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t">
            <button
              onClick={handleLogout}
              className="w-full text-right px-4 py-2 text-sm font-bold rounded-lg bg-[#295f8b] text-white hover:bg-[#1e4a6b] transition"
            >
              התנתקות
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
