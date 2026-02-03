// import React from "react";
// // import line1 from "./line-1.svg";
// // import line2 from "./line-2.svg";

// export const Screen = () => {
//   const equipmentItems = [
//     {
//       id: 1,
//       label: "ספר אינדיזיין",
//       top: "519px",
//       left: "calc(50.00% - 657px)",
//     },
//     { id: 2, label: "גימבל", top: "519px", left: "calc(50.00% - 159px)" },
//     { id: 3, label: "מצלמה", top: "519px", left: "calc(50.00% + 335px)" },
//     { id: 4, label: "ספר בינה", top: "707px", left: "calc(50.00% - 657px)" },
//     { id: 5, label: "ספר פוטושופ", top: "693px", left: "calc(50.00% - 159px)" },
//     { id: 6, label: "חצובה", top: "693px", left: "calc(50.00% + 335px)" },
//   ];

//   const buttonPositions = [
//     { top: "492px", left: "251px" },
//     { top: "492px", left: "749px" },
//     { top: "492px", left: "1247px" },
//     { top: "680px", left: "251px" },
//     { top: "680px", left: "749px" },
//     { top: "680px", left: "1247px" },
//   ];

//   const shadowPositions = [
//     { top: "508px", left: "268px" },
//     { top: "508px", left: "766px" },
//     { top: "508px", left: "1264px" },
//     { top: "696px", left: "268px" },
//     { top: "696px", left: "766px" },
//     { top: "696px", left: "1264px" },
//   ];

//   return (
//     <div className="bg-white overflow-hidden w-full min-w-[1920px] min-h-[1231px] relative">
//       {shadowPositions.map((pos, index) => (
//         <div
//           key={`shadow-${index}`}
//           className="w-[402px] h-[116px] bg-black rounded-[36px] absolute border-[5px] border-solid"
//           style={{ top: pos.top, left: pos.left }}
//         />
//       ))}

//       <h1 className="top-[230px] left-[calc(50.00% - 211px)] w-[306px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-5xl absolute text-black text-center tracking-[0] leading-[normal] [direction:rtl]">
//         השאלת ציוד
//       </h1>

//       <h2 className="top-[319px] left-[calc(50.00% - 211px)] w-[306px] [font-family:'Anomalia_ML_Medium_AAA-Medium',Helvetica] font-medium text-5xl absolute text-black text-center tracking-[0] leading-[normal] [direction:rtl]">
//         גרפיקה
//       </h2>

//       {buttonPositions.map((pos, index) => (
//         <button
//           key={`button-${index}`}
//           className="w-[402px] h-[116px] bg-variable-collection-color-4 rounded-[36px] border-black absolute border-[5px] border-solid cursor-pointer hover:opacity-90 transition-opacity"
//           style={{ top: pos.top, left: pos.left }}
//           aria-label={equipmentItems[index]?.label}
//         />
//       ))}

//       {equipmentItems.map((item) => (
//         <div
//           key={item.id}
//           className="w-[306px] [font-family:'Anomalia_ML_Medium_AAA-Medium',Helvetica] font-medium text-5xl absolute text-black text-center tracking-[0] leading-[normal] [direction:rtl] pointer-events-none"
//           style={{ top: item.top, left: item.left }}
//         >
//           {item.label}
//         </div>
//       ))}

//       <header className="absolute top-[17px] left-[1536px] w-[393px] h-[100px] flex">
//         <p className="flex-1 w-[392.73px] [font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-transparent text-[70.7px] text-center tracking-[0] leading-[normal]">
//           <span className="text-black">EDU</span>
//           <span className="text-[#295f8b]">LINK</span>
//         </p>
//       </header>

//       <nav
//         className="top-[58px] left-[309px] w-[1219px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-2xl absolute text-black text-center tracking-[0] leading-[normal] [direction:rtl]"
//         role="navigation"
//         aria-label="תפריט ראשי"
//       >
//         <p>
//           לימודי קודש&nbsp;&nbsp;&nbsp;&nbsp;לימודי
//           הוראה&nbsp;&nbsp;&nbsp;&nbsp;התמחויות&nbsp;&nbsp;&nbsp;&nbsp;ארועים&nbsp;&nbsp;&nbsp;&nbsp;השאלת
//           ציוד&nbsp;&nbsp;&nbsp;&nbsp;הנפקת אישורים&nbsp;&nbsp;&nbsp;&nbsp;נתוני
//           תלמידות&nbsp;&nbsp;&nbsp;&nbsp;ניהול המערכת
//         </p>
//       </nav>
// {/* 
//       <img
//         className="absolute top-0 left-[1548px] w-[5px] h-[135px]"
//         alt=""
//         src={line1}
//         role="presentation"
//       /> */}

//       <div className="top-0 left-[-21px] w-[304px] h-[140px] bg-[#295f8b] border-black absolute border-[5px] border-solid" />

//       <div className="top-9 -left-12 w-[365px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-5xl absolute text-black text-center tracking-[0] leading-[normal] [direction:rtl]">
//         התחברות
//       </div>

//       {/* <img
//         className="absolute top-[135px] left-0 w-[1919px] h-[5px]"
//         alt=""
//         src={line2}
//         role="presentation"
//       /> */}
//     </div>
//   );
// };
// export default Screen;
export const Equipments=()=>{

  return <div className="min-h-screen bg-gray-100 p-6 pt-28 font-sans [direction:rtl]">

<h1>
  
    כאן יוצג בהמשך בעז"ה מסך לניהול השאלת ציוד

    נא להמתין בסבלנות 😉😉😉😉
</h1>
  </div>
}
 export default Equipments;