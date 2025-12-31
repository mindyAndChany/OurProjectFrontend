// import React from "react";
// import  Crowdfunding  from "../icons/crowdfunding.png";
// import { Edulink } from "../components/Edulink";
// import  LicenseDraft from "../icons/license-draft.png";
// import  NoteEditWrapper  from "../icons/note-edit.png";
// import  SchoolBell02  from "../icons/school-bell-02.png";
// import  SecurityCheck  from "../icons/security-check.png";
// import  SquareLock01  from "../icons/square-lock-01.png";
// import  Task01  from "../icons/task-01.png";
// import  User  from "../icons/user.png";
// import { useNavigate } from "react-router-dom";
// // import image from "./image.svg";
// // import line1 from "./line-1.svg";
// // import vector2 from "./vector-2.svg";
// // import vector3 from "./vector-3.svg";
// // import vector from "./vector.svg";

// export const Frame = () => {
//   const navigate=useNavigate();

//   function handleLoginClick() {
//     navigate("/login");
//   }
//   const navigationItems = [
//     "דף הבית",
//     "מסד נתונים",
//     "נוכחות",
//     "לוח שנה",
//     "השאלת ציוד",
//   ];

//   const mainFeatures = [
//     {
//       id: 1,
//       title: "השאלת ציוד",
//       description: "מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.",
//       icon: User,
//       position: { top: "1199px", left: "243px" },
//     },
//     {
//       id: 2,
//       title: "מסד נתונים",
//       description: "פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.",
//       icon: Crowdfunding,
//       position: { top: "1199px", left: "727px" },
//     },
//     {
//       id: 3,
//       title: "נוכחות חכמה",
//       description: "מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.",
//       icon: LicenseDraft,
//       position: { top: "1199px", left: "1211px" },
//     },
//     {
//       id: 4,
//       title: "הרשאות וגיבוי",
//       description: "הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.",
//       icon: SquareLock01,
//       position: { top: "1498px", left: "484px" },
//     },
//     {
//       id: 5,
//       title: "לוח שנה משותף",
//       description: "כל הארועים, מבחנים והפסקות במבט אחד.",
//       icon: null,
//       position: { top: "1498px", left: "968px" },
//     },
//   ];

//   const additionalFeatures = [
//     {
//       id: 1,
//       title: "גיבוי ופרטיות",
//       description: "אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים",
//       icon: SecurityCheck,
//       position: { top: "2033px", left: "243px" },
//     },
//     {
//       id: 2,
//       title: "יצוא ודוחות",
//       description: "דוחות מותאמים אישית\nיצוא לקבצי EXEL/PDF",
//       icon: Task01,
//       position: { top: "2033px", left: "721px" },
//     },
//     {
//       id: 3,
//       title: "התראות חכמות",
//       description: "התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.",
//       icon: SchoolBell02,
//       position: { top: "2036px", left: "1215px" },
//     },
//   ];

//   return (
//     <div className="bg-white overflow-hidden w-full min-w-[1920px] min-h-[3091px] relative">
//       <header className="absolute top-0 left-0 w-full">
//         <div onClick={handleLoginClick} className="absolute top-0 left-0 w-[355px] h-[140px] bg-[#295f8b] border-[5px] border-solid border-black">
//           <h2 className="top-9 left-[-5px] w-[365px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-5xl text-center absolute tracking-[0] leading-[normal] [direction:rtl]">
//             התחברות
//           </h2>
//         </div>

//         <div className="absolute top-[7px] left-[1420px] w-[500px] h-32 flex">
//           <h1 className="flex-1 w-[499.73px] [font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-transparent text-[90px] text-center tracking-[0] leading-[normal]">
//             <span className="text-black">EDU</span>
//             <span className="text-[#295f8b]">LINK</span>
//           </h1>
//         </div>

//         {/* <img
//           className="absolute top-0 left-[1420px] w-[5px] h-[135px]"
//           alt=""
//           src={line1}
//           role="presentation"
//         /> */}

//         <nav
//           className="top-[46px] left-[392px] w-[992px] absolute"
//           aria-label="Main navigation"
//         >
//           <ul className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-4xl text-center tracking-[0] leading-[normal] [direction:rtl] flex justify-center gap-8">
//             {navigationItems.map((item, index) => (
//               <li key={index}>
//                 <a
//                   href={`#${item}`}
//                   className="hover:text-[#295f8b] transition-colors"
//                 >
//                   {item}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </header>

//       <main>
//         <section
//           className="absolute top-[278px] left-[114px] w-[886px]"
//           aria-labelledby="hero-heading"
//         >
//           <h2
//             id="hero-heading"
//             className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-8xl text-left tracking-[0] leading-[normal] [direction:rtl]"
//           >
//             להחליט את הגליונות
//             <br />
//             בקובץ מסודר
//             <br />
//             בטוח ומתאים
//           </h2>
//         </section>

//         <section className="absolute top-[732px] left-[97px] w-[863px]">
//           <p className="[font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-[32px] text-left tracking-[0] leading-[normal] [direction:rtl]">
//             מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות עם
//             פרטי קשר, היסטוריית נוכחות, לוח שנה משותף, והשאלת ציוד.
//             <br />
//             כלים חכמים לחיסכון בזמן וניהול פשוט של הפעילות היומיומית.
//           </p>
//         </section>

//         <div className="absolute top-[996px] left-[123px] flex gap-[38px]">
//           <button
//             className="w-[221px] h-[75px] bg-[#295f8b] rounded-[37.5px] border-2 border-solid border-black hover:bg-[#1e4a6b] transition-colors"
//             aria-label="כניסה למערכת"
//           >
//             <span className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-2xl [direction:rtl]">
//               כניסה למערכת
//             </span>
//             <div className="absolute top-[10px] left-[11px] w-[221px] h-[75px] bg-black rounded-[37.5px] -z-10" />
//           </button>

//           <button
//             className="w-[221px] h-[75px] bg-white rounded-[37.5px] border-2 border-solid border-black hover:bg-gray-50 transition-colors"
//             aria-label="חקור את המערכת"
//           >
//             <span className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-2xl [direction:rtl]">
//               חקור את המערכת
//             </span>
//             <div className="absolute top-[10px] left-[11px] w-[221px] h-[75px] bg-black rounded-[37.5px] -z-10" />
//           </button>
//         </div>

//         {/* <figure
//           className="absolute top-[353px] left-[1170px] w-[552px] h-[552px]"
//           aria-label="Illustration"
//         >
//           <div className="relative w-[79.17%] h-[83.33%] top-[8.33%] left-[10.42%]">
//             <img
//               className="absolute w-[89.47%] h-[95.00%] top-0 left-[-3.95%]"
//               alt=""
//               src={vector}
//               role="presentation"
//             />
//             <img
//               className="absolute w-[42.11%] h-[40.00%] top-[56.25%] left-[53.95%]"
//               alt=""
//               src={image}
//               role="presentation"
//             />
//             <img
//               className="absolute w-[52.63%] h-[10.00%] top-[-3.75%] left-[14.47%]"
//               alt=""
//               src={vector2}
//               role="presentation"
//             />
//             <img
//               className="absolute w-[42.11%] h-[25.00%] top-[36.25%] left-[19.74%]"
//               alt=""
//               src={vector3}
//               role="presentation"
//             />
//           </div>
//         </figure> */}

//         <section aria-labelledby="main-features-heading">
//           <h2 id="main-features-heading" className="sr-only">
//             תכונות עיקריות
//           </h2>

//           {mainFeatures.map((feature) => (
//             <article
//               key={feature.id}
//               className="absolute w-[443px] h-[219px] bg-[#bda39b] rounded-[44px] border-2 border-solid border-black"
//               style={{ top: feature.position.top, left: feature.position.left }}
//             >
//               <div className="absolute top-[28px] left-[22px] w-[443px] h-[219px] bg-black rounded-[43px] -z-10" />

//               {feature.icon && feature.id === 1 && (
//                 <img src={User}
//                   className="!absolute !top-[14px] !left-[192px] !w-[79px] !h-[79px]"
//                   aria-hidden="true"
//                 />
//               )}
//               {feature.icon && feature.id === 2 && (
//                 <img src={Crowdfunding}
//                   className="!absolute !top-[17px] !left-[190px] !w-[69px] !h-[69px]"
//                   aria-hidden="true"
//                 />
//               )}
//               {feature.icon && feature.id === 3 && (
//                 <img src={LicenseDraft}
//                   className="!absolute !top-[24px] !left-[200px] !w-[62px] !h-[62px]"
//                   aria-hidden="true"
//                 />
//               )}
//               {feature.icon && feature.id === 4 && (
//                 <img src={SquareLock01}
//                   className="!absolute !top-[23px] !left-[211px] !w-16 !h-16"
//                   aria-hidden="true"
//                 />
//               )}

//               <div
//                 className="absolute"
//                 style={{
//                   top: feature.id === 5 ? "92px" : "97px",
//                   left:
//                     feature.id === 1
//                       ? "70px"
//                       : feature.id === 2
//                         ? "58px"
//                         : feature.id === 3
//                           ? "58px"
//                           : feature.id === 4
//                             ? "72px"
//                             : "61px",
//                   width: "327px",
//                 }}
//               >
//                 <h3 className="[font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-[27px] text-center tracking-[0] leading-[normal] [direction:rtl]">
//                   {feature.title}
//                 </h3>
//                 <p className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-black text-2xl text-center tracking-[0] leading-[normal] [direction:rtl] mt-1">
//                   {feature.description}
//                 </p>
//               </div>
//             </article>
//           ))}
//         </section>

//         <section
//           className="absolute top-[1916px] left-0 w-[1920px] h-[566px] bg-[#584041]"
//           aria-labelledby="additional-features-heading"
//         >
//           <h2 id="additional-features-heading" className="sr-only">
//             תכונות נוספות
//           </h2>

//           {additionalFeatures.map((feature) => (
//             <article
//               key={feature.id}
//               className="absolute w-[327px] h-[293px] bg-[#d8cdc2] rounded-[43px] border-2 border-solid border-black"
//               style={{ top: feature.position.top, left: feature.position.left }}
//             >
//               <div className="absolute top-[21px] left-[16px] w-[327px] h-[293px] bg-black rounded-[43px] -z-10" />

//               {feature.id === 1 && (
//                 <img src={SecurityCheck}
//                   className="!absolute !top-[47px] !left-[137px] !w-[65px] !h-[65px]"
//                   aria-hidden="true"
//                 />
//               )}
//               {feature.id === 2 && (
//                 <img src={Task01}
//                   className="!absolute !top-[45px] !left-[138px] !w-[68px] !h-[68px]"
//                   aria-hidden="true"
//                 />
//               )}
//               {feature.id === 3 && (
//                 <img src={SchoolBell02}
//                   className="!absolute !top-[46px] !left-[141px] !w-[67px] !h-[67px]"
//                   aria-hidden="true"
//                 />
//               )}

//               <div className="absolute top-[139px] left-0 w-[327px]">
//                 <h3 className="[font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-[32px] text-center tracking-[0] leading-[normal] [direction:rtl]">
//                   {feature.title}
//                 </h3>
//                 <p className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-black text-2xl text-center tracking-[0] leading-[normal] [direction:rtl] mt-1 whitespace-pre-line">
//                   {feature.description}
//                 </p>
//               </div>
//             </article>
//           ))}
//         </section>

//         <section
//           className="absolute top-[2581px] left-[234px] w-[1420px] h-[180px]"
//           aria-labelledby="cta-heading"
//         >
//           <div className="absolute top-0 left-0 w-full h-full bg-[#295f8b] rounded-[43px] border-2 border-solid border-black">
//             <div className="absolute top-[23px] left-[68px] w-[1376px] h-[180px] bg-black rounded-[43px] -z-10" />

//             <div className="absolute top-[38px] left-[353px] w-[769px]">
//               <h2
//                 id="cta-heading"
//                 className="[font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-5xl text-center tracking-[0] leading-[normal] [direction:rtl]"
//               >
//                 מוכנה להפחית ניירת ולהתארגן?
//               </h2>
//               <p className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-black text-2xl text-center tracking-[0] leading-[normal] [direction:rtl] mt-2">
//                 התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
//               </p>
//             </div>
//           </div>

//           <div className="absolute top-[271px] left-[493px] flex gap-[34px]">
//             <button
//               className="w-[211px] h-[60px] bg-[#584041] rounded-[30px] border-[0.95px] border-solid border-black hover:bg-[#463334] transition-all duration-200 ease-in-out opacity-100 scale-100"
//               aria-label="למד עוד"
//             >
//               <span className="[font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-[#0d0d0d] text-[27px] [direction:rtl]">
//                 למד עוד
//               </span>
//               <div className="absolute top-[8px] left-[11px] w-[211px] h-[60px] bg-black rounded-[30px] -z-10" />
//             </button>

//             <button
//              onClick={handleLoginClick}
//               className="w-[211px] h-[60px] bg-[#bda39b] rounded-[30px] border-[0.95px] border-solid border-black hover:bg-[#a89088] transition-colors"
//               aria-label="התחברות"
//             >
//               <span className="[font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-white text-[27px] [direction:rtl]">
//                 התחברות
//               </span>
//               <div className="absolute top-[8px] left-[11px] w-[211px] h-[60px] bg-black rounded-[30px] -z-10" />
//             </button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };
// export default Frame;
// import React from "react";
// import Crowdfunding from "../icons/crowdfunding.png";
// import LicenseDraft from "../icons/license-draft.png";
// import SchoolBell02 from "../icons/school-bell-02.png";
// import SecurityCheck from "../icons/security-check.png";
// import SquareLock01 from "../icons/square-lock-01.png";
// import Task01 from "../icons/task-01.png";
// import User from "../icons/user.png";
// import { useNavigate } from "react-router-dom";

// export const Frame = () => {
//   const navigate = useNavigate();

//   function handleLoginClick() {
//     navigate("/login");
//   }

//   const navigationItems = [
//     // "דף הבית",
//     // "מסד נתונים",
//     // "נוכחות",
//     // "לוח שנה",
//     // "השאלת ציוד",
//   ];

//   const mainFeatures = [
//     { id: 1, title: "השאלת ציוד", description: "מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.", icon: User },
//     { id: 2, title: "מסד נתונים", description: "פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.", icon: Crowdfunding },
//     { id: 3, title: "נוכחות חכמה", description: "מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.", icon: LicenseDraft },
//     { id: 4, title: "הרשאות וגיבוי", description: "הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.", icon: SquareLock01 },
//     { id: 5, title: "לוח שנה משותף", description: "כל הארועים, מבחנים והפסקות במבט אחד.", icon: null },
//   ];

//   const additionalFeatures = [
//     { id: 1, title: "גיבוי ופרטיות", description: "אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים", icon: SecurityCheck },
//     { id: 2, title: "יצוא ודוחות", description: "דוחות מותאמים אישית\nיצוא לקבצי EXEL/PDF", icon: Task01 },
//     { id: 3, title: "התראות חכמות", description: "התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.", icon: SchoolBell02 },
//   ];

//   return (
//     <div className="bg-white overflow-hidden w-full min-h-screen relative [direction:rtl]">
//       {/* Header */}
//       <header className="w-full px-10 py-6 flex items-center justify-between">
//         <div className="flex items-center gap-6">
//           <button
//             onClick={handleLoginClick}
//             className="px-6 py-3 bg-[#295f8b] text-black font-bold rounded-md border-2 border-black hover:bg-[#1e4a6b] transition"
//           >
//             התחברות
//           </button>

//           <nav aria-label="Main navigation" className="hidden md:block">
//             <ul className="flex gap-8 font-bold text-lg">
//               {navigationItems.map((item, i) => (
//                 <li key={i}>
//                   <a href={`#${item}`} className="hover:text-[#295f8b] transition-colors">
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>

//         <h1 className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-[44px]">
//           <span className="text-black">EDU</span>
//           <span className="text-[#295f8b]">LINK</span>
//         </h1>
//       </header>

//       {/* Hero */}
//       <main className="px-10">
//         <section className="max-w-[900px] mt-24">
//           <h2 className="[font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-6xl leading-tight">
//             להחליט את הגליונות
//             <br />
//             בקובץ מסודר
//             <br />
//             בטוח ומתאים
//           </h2>

//           <p className="mt-6 text-[20px] font-bold max-w-[760px]">
//             מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות עם פרטי קשר, היסטוריית נוכחות, לוח שנה משותף, והשאלת ציוד.
//             <br />
//             כלים חכמים לחיסכון בזמן וניהול פשוט של הפעילות היומיומית.
//           </p>

//           <div className="mt-8 flex gap-6">
//             <button className="px-8 py-4 bg-[#295f8b] rounded-[30px] font-bold border-2 border-black hover:bg-[#1e4a6b]">
//               כניסה למערכת
//             </button>
//             <button className="px-8 py-4 bg-white rounded-[30px] font-bold border-2 border-black hover:bg-gray-50">
//               חקור את המערכת
//             </button>
//           </div>
//         </section>

//         {/* Main Features Grid */}
//         <section className="mt-16 px-2">
//           <div className="grid grid-cols-3 gap-8 justify-center max-w-[1300px] mx-auto">
//             {mainFeatures.map((feature) => (
//               <article key={feature.id} className="relative bg-[#bda39b] rounded-[30px] border-2 border-black p-6 text-center w-full max-w-[420px]">
//                 {/* offset shadow */}
//                 <div className="absolute -bottom-4 -right-4 w-full h-full bg-black rounded-[26px] -z-10" />
//                 {feature.icon && (
//                   <img src={feature.icon} alt="" className="mx-auto w-16 h-16 mt-2" />
//                 )}
//                 <h3 className="mt-4 font-bold text-[24px]">{feature.title}</h3>
//                 <p className="mt-2 text-lg">{feature.description}</p>
//               </article>
//             ))}
//           </div>
//         </section>

//         {/* Additional Features (dark band) */}
//         <section className="mt-16 bg-[#584041] py-12">
//           <div className="max-w-[1200px] mx-auto flex gap-8 justify-center">
//             {additionalFeatures.map((f) => (
//               <article key={f.id} className="relative bg-[#d8cdc2] rounded-[26px] border-2 border-black p-6 w-80 text-center">
//                 <div className="absolute -bottom-3 -right-3 w-full h-full bg-black rounded-[22px] -z-10" />
//                 {f.icon && <img src={f.icon} alt="" className="mx-auto w-14 h-14 mt-2" />}
//                 <h3 className="mt-4 font-bold text-[20px]">{f.title}</h3>
//                 <p className="mt-2 whitespace-pre-line">{f.description}</p>
//               </article>
//             ))}
//           </div>
//         </section>

//         {/* CTA */}
//         <section className="mt-16 flex flex-col items-center gap-6">
//           <div className="bg-[#295f8b] rounded-[26px] p-10 w-[85%] max-w-[1200px] border-2 border-black text-center">
//             <h2 className="font-bold text-4xl">מוכנה להפחית ניירת ולהתארגן?</h2>
//             <p className="mt-2 text-xl">התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד</p>
//           </div>

//           <div className="flex gap-6">
//             <button className="px-8 py-3 bg-[#584041] rounded-[20px] font-bold border-2 border-black hover:bg-[#463334]">למד עוד</button>
//             <button onClick={handleLoginClick} className="px-8 py-3 bg-[#bda39b] rounded-[20px] font-bold border-2 border-black hover:bg-[#a89088]">התחברות</button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Frame;
import React from "react";
import Crowdfunding from "../icons/crowdfunding.png";
import LicenseDraft from "../icons/license-draft.png";
import SchoolBell02 from "../icons/school-bell-02.png";
import SecurityCheck from "../icons/security-check.png";
import SquareLock01 from "../icons/square-lock-01.png";
import Task01 from "../icons/task-01.png";
import User from "../icons/user.png";
import { useNavigate } from "react-router-dom";

export default function Frame() {
  const navigate = useNavigate();

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
    <div className="bg-white w-full [direction:rtl] overflow-hidden">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-32">
        <h1 className="text-6xl font-bold leading-tight animate-fadeIn">
          להחליף את הגליונות
          <br />
          בקובץ מסודר
          <br />
          בטוח ומתאים
        </h1>

        <p className="mt-6 max-w-3xl text-xl font-semibold text-gray-800 animate-fadeIn delay-100">
          מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד —
          מאגר תלמידות, נוכחות, לוח שנה והשאלת ציוד.
        </p>

        <div className="mt-10 flex gap-6 animate-fadeIn delay-200">
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-[#295f8b] text-white rounded-full
                       font-bold shadow-md hover:shadow-lg
                       transition-all duration-300 hover:-translate-y-1"
          >
            כניסה למערכת
          </button>

          <button
            className="px-10 py-4 bg-white rounded-full font-bold
                       border border-gray-300 shadow-sm
                       hover:shadow-md transition-all duration-300"
          >
            חקור את המערכת
          </button>
        </div>
      </section>

      {/* MAIN FEATURES */}
      <section className="max-w-7xl mx-auto mt-28 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {mainFeatures.map((f, i) => (
            <div
              key={f.id}
              className="bg-[#bda39b]/90 rounded-3xl p-8 text-center
                         shadow-sm hover:shadow-xl
                         transition-all duration-300
                         hover:-translate-y-2"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {f.icon && (
                <img src={f.icon} alt="" className="mx-auto w-16 h-16 mb-4" />
              )}
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="mt-2 text-lg text-gray-900">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ADDITIONAL FEATURES */}
      <section className="mt-32 bg-[#584041] py-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 justify-center px-6">
          {additionalFeatures.map((f) => (
            <div
              key={f.id}
              className="bg-[#d8cdc2] rounded-3xl p-8 w-80 text-center
                         shadow-md hover:shadow-xl
                         transition-all duration-300 hover:-translate-y-2"
            >
              <img src={f.icon} alt="" className="mx-auto w-14 h-14 mb-4" />
              <h4 className="text-xl font-bold">{f.title}</h4>
              <p className="mt-2 whitespace-pre-line">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-28 flex flex-col items-center gap-8 pb-28">
        <div className="bg-[#295f8b] max-w-5xl w-[90%] rounded-3xl
                        p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold text-white">
            מוכנה להפחית ניירת ולהתארגן?
          </h2>
          <p className="mt-3 text-xl text-white/90">
            התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
          </p>
        </div>

        <div className="flex gap-6">
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
  );
}
