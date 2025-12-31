// // import { Link } from "react-router-dom";

// // export default function Navbar() {
// //   return (
// //     <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
// //       <h1 className="text-xl font-bold">מערכת ניהול</h1>
// //       <div className="flex gap-4">
// //         <Link to="/">דף הבית</Link>
// //         <Link to="/login">התחברות</Link>
// //       </div>
// //     </nav>
// //   );
// // }
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Edulink } from "../components/Edulink";

// const navItems = [
//   { to: "/Equipments", label: "השאלת ציוד" },
//   { to: "/Calendar", label: "לוח שנה" },
//   { to: "/Kattendence", label: "נוכחות" },
//   { to: "/home", label: "דף הבית" },
//   { to: "/database", label: "מסד נתונים" }, // אם אין - אפשר לשנות/להסיר
// ];

// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   const linkClass = ({ isActive }) =>
//     `px-3 py-2 rounded transition-colors ${
//       isActive ? "text-yellow-300 font-semibold" : "text-white/90 hover:text-yellow-200"
//     }`;

//   return (
//     <header className="bg-transparent">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20 flex-row-reverse">
//           <div className="flex items-center gap-4">
//             <Edulink className="w-36 h-auto" />
//             <nav className="hidden md:flex gap-4 items-center text-sm">
//               {navItems.map((item) => (
//                 <NavLink key={item.to} to={item.to} className={linkClass}>
//                   {item.label}
//                 </NavLink>
//               ))}
//             </nav>
//           </div>

//           <div className="flex items-center gap-3">
//             <NavLink to="/login" className="px-4 py-2 rounded bg-yellow-400 text-black font-medium hover:bg-yellow-300">
//               התחברות
//             </NavLink>
//             <NavLink to="/home" className="px-4 py-2 rounded border border-white/20 text-white hover:bg-white/5">
//               למד עוד
//             </NavLink>

//             <button
//               aria-label="Toggle navigation"
//               aria-expanded={open}
//               onClick={() => setOpen((v) => !v)}
//               className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {open ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         <nav className={`md:hidden mt-3 flex flex-col gap-2 ${open ? "block" : "hidden"}`}>
//           {navItems.map((item) => (
//             <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
//               {item.label}
//             </NavLink>
//           ))}
//         </nav>
//       </div>
//     </header>
//   );
// }
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Edulink } from "../components/Edulink";

// const navItems = [
//   { to: "/Equipments", label: "השאלת ציוד" },
//   { to: "/Calendar", label: "לוח שנה" },
//   { to: "/Kattendence", label: "נוכחות" },
//   { to: "/database", label: "מסד נתונים" },
//   { to: "/home", label: "דף הבית" },
// ];

// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   const linkClass = ({ isActive }) =>
//     `relative px-4 py-2 text-lg font-semibold whitespace-nowrap
//      transition-all duration-300
//      ${isActive ? "text-blue-900" : "text-gray-800 hover:text-blue-700"}
//      after:absolute after:right-0 after:bottom-0 after:h-[2px] after:bg-blue-700
//      after:transition-all after:duration-300
//      ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`;

//   return (
//     <header dir="rtl" className="w-full bg-white shadow-md overflow-x-hidden">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="h-20 flex items-center justify-between gap-4">
//       <img className="line" alt="Line" src="/img/line" />

//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Edulink className="h-10 w-auto" />
//           </div>

//           {/* Desktop Nav */}
//           <nav className="hidden md:flex flex-wrap items-center gap-6 justify-center max-w-full">
//             {navItems.map((item) => (
//               <NavLink key={item.to} to={item.to} className={linkClass}>
//                 {item.label}
//               </NavLink>
//             ))}
//           </nav>

//           {/* Actions */}
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <NavLink
//               to="/login"
//               className="px-5 py-2 text-base font-bold rounded-md
//                          bg-blue-700 text-white
//                          hover:bg-blue-800 transition"
//             >
//               התחברות
//             </NavLink>

//             <button
//               onClick={() => setOpen(!open)}
//               className="md:hidden p-2 rounded-md hover:bg-gray-100"
//               aria-label="toggle menu"
//             >
//               <svg
//                 className="w-7 h-7"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 {open ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`md:hidden transition-all duration-300 overflow-hidden
//           ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
//         >
//           <nav className="flex flex-col gap-2 py-4">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 onClick={() => setOpen(false)}
//                 className="px-4 py-3 text-lg font-semibold rounded
//                            hover:bg-gray-100 transition"
//               >
//                 {item.label}
//               </NavLink>
//             ))}
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Edulink } from "../components/Edulink";

const navItems = [
  { to: "/home", label: "דף הבית" },
  { to: "/database", label: "מסד נתונים" },
  { to: "/Kattendence", label: "נוכחות" },
  { to: "/Calendar", label: "לוח שנה" },
  { to: "/Equipments", label: "השאלת ציוד" },
  { to: "/Approvals", label: "אישורים" }
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

