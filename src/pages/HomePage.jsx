// import React from "react";
// import bookEdit from "../icons/book-edit.png";
// import calendar02 from "../icons/calendar-02.png";
// import desk from "../icons/desk.png";
// import { Edulink } from "../components/Edulink.jsx";
// import mortarboard01 from "../icons/mortarboard-01.png";
// import payByCheck from "../icons/pay-by-check.png";
// import task01 from "../icons/task-01.png";
// import taskDone02 from "../icons/task-done-02.png";
// import line1 from "../icons/Line 1.png";
// import line2 from "../icons/Line 2.png";
// import { useNavigate } from "react-router-dom";

  

// export const Screen = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white overflow-hidden w-full min-w-[1920px] h-[1071px] relative">
//       {/* Boxes */}
//       <div className="absolute top-[554px] left-[1225px] w-[221px] h-[143px] bg-black rounded-[35px]" />
//       <div className="absolute top-[365px] left-[1225px] w-[221px] h-[141px] bg-black rounded-[35px]" />
//       <div className="absolute top-[554px] left-[982px] w-[221px] h-[143px] bg-black rounded-[35px]" />
//       <div className="absolute top-[365px] left-[982px] w-[221px] h-[141px] bg-black rounded-[35px]" />
//       <div className="absolute top-[554px] left-[739px] w-[221px] h-[143px] bg-black rounded-[35px]" />
//       <div className="absolute top-[365px] left-[739px] w-[221px] h-[141px] bg-black rounded-[35px]" />
//       <div className="absolute top-[554px] left-[496px] w-[221px] h-[143px] bg-black rounded-[35px]" />
//       <div className="absolute top-[365px] left-[496px] w-[221px] h-[141px] bg-black rounded-[35px]" />

//       {/* Highlighted Boxes */}
//       <div className="absolute top-[536px] left-[1214px] w-[221px] h-[143px] bg-variable-collection-color-3 rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[347px] left-[1214px] w-[221px] h-[141px] bg-variable-collection-color-4 rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[536px] left-[971px] w-[221px] h-[143px] bg-white rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[347px] left-[971px] w-[221px] h-[141px] bg-[#295f8b] rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[536px] left-[728px] w-[221px] h-[143px] bg-variable-collection-color-4 rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[347px] left-[728px] w-[221px] h-[141px] bg-variable-collection-color-3 rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[536px] left-[485px] w-[221px] h-[143px] bg-[#295f8b] rounded-[35px] border-2 border-solid border-black" />
//       <div className="absolute top-[347px] left-[485px] w-[221px] h-[141px] bg-white rounded-[35px] border-2 border-solid border-black" />

//       {/* Text */}
//       <div className="top-[430px] left-[491px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]" onClick={()=>navigate('/Kattendence')}>
//         לימודי קודש
//       </div>
//       <div className="top-[612px] left-[491px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]" onClick={()=>navigate('/Calendar')}>
//         לוח שנה
//       </div>
//       <div className="top-[430px] left-[728px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]">
//         לימודי הוראה
//       </div>
//       <div className="top-[612px] left-[728px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]" onClick={()=>navigate('/Equipments')}>
//         השאלת ציוד
//       </div>
//       <div className="top-[430px] left-[971px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]">
//         התמחויות
//       </div>
//       <div className="top-[612px] left-[971px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]">
//         נתוני תלמידות
//       </div>
//       <div className="top-[430px] left-[1214px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]">
//         אירועים
//       </div>
//       <div className="top-[612px] left-[1214px] w-[209px] text-2xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]" onClick={()=>navigate('/Approvals')}>
//         אישורים
//       </div>

//       {/* Header */}
//       <div className="absolute top-0 left-[3px] w-[304px] h-[140px] bg-[#295f8b] border-[5px] border-solid border-black" />
//       <div className="top-9 -left-6 w-[365px] text-5xl absolute font-bold text-black text-center leading-[normal] [direction:rtl]">
//         התחברות
//       </div>

//       {/* Lines */}
//       <img
//         className="absolute top-[135px] left-[23px] w-[1897px] h-[5px]"
//         alt="Line"
//         // src={line2}
//       />

//       <Edulink
//         EDULINKClassName="!text-[70.7px] !w-[392.73px]"
//         className="!h-[100px] !absolute !left-[1550px] !w-[393px] !top-[17px]"
//         spanClassName="!text-[#295f8b]"
//       />

//       <img
//         className="absolute top-0 left-[1562px] w-[5px] h-[135px]"
//         alt="Line"
//         // src={line1}
//       />

//       {/* Icons as <img> */}
//       <img src={taskDone02} alt="Task done" className="absolute top-[554px] left-[1298px] w-[53px] h-[53px]" />
//       <img src={mortarboard01} alt="Mortarboard" className="absolute top-[373px] left-[810px] w-[57px] h-[57px]" />
//       <img src={desk} alt="Desk" className="absolute top-[370px] left-[1050px] w-[61px] h-[61px]" />
//       <img src={bookEdit} alt="Book edit" className="absolute top-[370px] left-[578px] w-[58px] h-[58px]" />
//       <img src={task01} alt="Task" className="absolute top-[550px] left-[1044px] w-[59px] h-[59px]" />
//       <img src={payByCheck} alt="Pay by check" className="absolute top-[548px] left-[806px] w-[65px] h-[65px]" />
//       <img src={calendar02} alt="Calendar" className="absolute top-[552px] left-[569px] w-[57px] h-[57px]" />
//     </div>
//   );
// };

// export default Screen;
import React from "react";
import bookEdit from "../icons/book-edit.png";
import calendar02 from "../icons/calendar-02.png";
import desk from "../icons/desk.png";
import mortarboard01 from "../icons/mortarboard-01.png";
import payByCheck from "../icons/pay-by-check.png";
import task01 from "../icons/task-01.png";
import taskDone02 from "../icons/task-done-02.png";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "לימודי קודש",
    icon: bookEdit,
    bg: "bg-white",
    to: "/Kattendence",
  },
  {
    title: "לימודי הוראה",
    icon: mortarboard01,
    bg: "bg-[#bda39b]",
  },
  {
    title: "התמחויות",
    icon: desk,
    bg: "bg-[#295f8b] text-white",
  },
  {
    title: "מערכת שעות",
    icon: taskDone02,
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
              <img
                src={item.icon}
                alt=""
                className="w-14 h-14 object-contain"
              />
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
