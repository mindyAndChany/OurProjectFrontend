// import React from "react";

// export const Edulink = ({ className, EDULINKClassName, spanClassName }) => {
//   return (
//     <div
//       className={`relative top-[29px] left-[1666px] w-[231px] h-[59px] flex ${className}`}
//     >
//       <p
//         className={`flex-1 w-[231px] [font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-transparent text-5xl text-center tracking-[0] leading-[normal] ${EDULINKClassName}`}
//       >
//         <span className="text-black">EDU</span>

//         <span className={`text-[#54f0af] ${spanClassName}`}>LINK</span>
//       </p>
//     </div>
//   );
// };
import React from "react";

export const Edulink = ({ className = "", spanClassName = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <p
        className="
          font-bold text-4xl
          [font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica]
          leading-none
          whitespace-nowrap
        "
      >
        <span className="text-black">EDU</span>
        <span className={`text-[#295f8b] ${spanClassName}`}>LINK</span>
      </p>
    </div>
  );
};
