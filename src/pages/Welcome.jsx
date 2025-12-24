import React from "react";
import  Crowdfunding from "../icons/crowdfunding.png";
import  LicenseDraft from "../icons/license-draft.png";
import  SchoolBell02 from "../icons/school-bell-02.png";
import  SecurityCheck from "../icons/security-check.png";
import  SquareLock01 from "../icons/square-lock-01.png";
import  Task01 from "../icons/task-01.png";
import  User from "../icons/user.png";
// import image from "./image.svg";
// import line1 from "./line-1.svg";
// import vector2 from "./vector-2.svg";
// import vector3 from "./vector-3.svg";
// import vector from "./vector.svg";

export const Frame = () => {
  const navigationItems = [
    "דף הבית",
    "מסד נתונים",
    "נוכחות",
    "לוח שנה",
    "השאלת ציוד",
  ];

  const mainFeatures = [
    {
      title: "השאלת ציוד",
      description: "מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.",
      icon: User,
      position: { top: "1199px", left: "243px" },
    },
    {
      title: "מסד נתונים",
      description: "פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.",
      icon: Crowdfunding,
      position: { top: "1199px", left: "727px" },
    },
    {
      title: "נוכחות חכמה",
      description: "מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.",
      icon: LicenseDraft,
      position: { top: "1199px", left: "1211px" },
    },
    {
      title: "הרשאות וגיבוי",
      description: "הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.",
      icon: SquareLock01,
      position: { top: "1498px", left: "484px" },
    },
    {
      title: "לוח שנה משותף",
      description: "כל הארועים, מבחנים והפסקות במבט אחד.",
      icon: null,
      position: { top: "1498px", left: "968px" },
    },
  ];

  const additionalFeatures = [
    {
      title: "גיבוי ופרטיות",
      description: "אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים",
      icon: SecurityCheck,
      position: { top: "2033px", left: "243px" },
    },
    {
      title: "יצוא ודוחות",
      description: "דוחות מותאמים אישית\nיצוא לקבצי EXEL/PDF",
      icon: Task01,
      position: { top: "2033px", left: "721px" },
    },
    {
      title: "התראות חכמות",
      description: "התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.",
      icon: SchoolBell02,
      position: { top: "2036px", left: "1215px" },
    },
  ];

  return (
    <div className="bg-white overflow-hidden w-full min-w-[1920px] min-h-[3091px] relative">
      <header className="absolute top-0 left-0 w-full">
        <div className="absolute top-0 left-0 w-[355px] h-[140px] bg-[#295f8b] border-[5px] border-solid border-black">
          <h2 className="top-9 left-[-5px] w-[365px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-5xl text-center absolute tracking-[0] leading-[normal] [direction:rtl]">
            התחברות
          </h2>
        </div>

        <div className="absolute top-[7px] left-[1420px] w-[500px] h-32 flex">
          <h1 className="flex-1 w-[499.73px] [font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-transparent text-[90px] text-center tracking-[0] leading-[normal]">
            <span className="text-black">EDU</span>
            <span className="text-[#295f8b]">LINK</span>
          </h1>
        </div>

        <img
          className="absolute top-0 left-[1420px] w-[5px] h-[135px]"
          alt=""
        //   src={line1}
        />

        <nav className="top-[46px] left-[392px] w-[992px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-4xl text-center absolute tracking-[0] leading-[normal] [direction:rtl]">
          {navigationItems.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < navigationItems.length - 1 && "\u00A0\u00A0\u00A0\u00A0"}
            </React.Fragment>
          ))}
    
        </nav>
      </header>

      <main>
        <section className="absolute top-[278px] left-[114px] w-[1608px]">
          <h2 className="w-[886px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-8xl text-left tracking-[0] leading-[normal] [direction:rtl]">
            להחליף את הגליונות
            <br />
            בקובץ מסודר
            <br />
            בטוח ומתאים
          </h2>

          <p className="absolute top-[454px] left-[-17px] w-[863px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-black text-[32px] text-left tracking-[0] leading-[normal] [direction:rtl]">
            מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות עם
            פרטי קשר, היסטוריית נוכחות, לוח שנה משותף, והשאלת ציוד.
            <br />
            כלים חכמים לחיסכון בזמן וניהול פשוט של הפעילות היומיומית.
          </p>

          <div className="absolute top-[1056px] left-0">
            <div className="absolute top-[10px] left-[11px] w-[221px] h-[75px] bg-black rounded-[37.5px]" />
            <div className="absolute top-[10px] left-[280px] w-[221px] h-[75px] bg-black rounded-[37.5px]" />
            <button className="absolute top-0 left-0 w-[221px] h-[75px] bg-[#295f8b] rounded-[37.5px] border-2 border-solid border-black">
              <span className="w-[209px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-2xl text-center tracking-[0] leading-[normal] [direction:rtl]">
                כניסה למערכת
              </span>
            </button>
            <button className="absolute top-0 left-[269px] w-[221px] h-[75px] bg-white rounded-[37.5px] border-2 border-solid border-black">
              <span className="w-[209px] [font-family:'Anomalia_ML_DemiBold_AAA-DemiBold',Helvetica] font-bold text-black text-2xl text-center tracking-[0] leading-[normal] [direction:rtl]">
                חקור את המערכת
              </span>
            </button>
          </div>

          <div className="absolute top-[75px] left-[1056px] w-[552px] h-[552px]">
            <div className="relative w-[79.17%] h-[83.33%] top-[8.33%] left-[10.42%]">
              <img
                className="absolute w-[89.47%] h-[95.00%] top-0 left-[-3.95%]"
                alt=""
                // src={vector}
              />
              <img
                className="absolute w-[42.11%] h-[40.00%] top-[56.25%] left-[53.95%]"
                alt=""
                // src={image}
              />
              <img
                className="absolute w-[52.63%] h-[10.00%] top-[-3.75%] left-[14.47%]"
                alt=""
                // src={vector2}
              />
              <img
                className="absolute w-[42.11%] h-[25.00%] top-[36.25%] left-[19.74%]"
                alt=""
                // src={vector3}
              />
            </div>
          </div>
        </section>

        <section className="absolute top-[1199px] left-[243px] w-[1433px]">
           {mainFeatures.map((feature, index) => (
            <article
              key={index}
              className="absolute"
              style={{ top: feature.position.top, left: feature.position.left }}
            >
              <div className="absolute top-[28px] left-[22px] w-[443px] h-[219px] bg-black rounded-[43px]" />
              <div className="absolute top-0 left-0 w-[443px] h-[219px] bg-[#bda39b] rounded-[44px] border-2 border-solid border-black">
                {feature.icon && (
  <img
    src={feature.icon}
    alt={feature.title}
    className={`absolute ${
      feature.title === "השאלת ציוד"
        ? "top-[14px] left-[192px] w-[79px] h-[79px]"
        : feature.title === "מסד נתונים"
          ? "top-[17px] left-[190px] w-[69px] h-[69px]"
          : feature.title === "נוכחות חכמה"
            ? "top-[24px] left-[200px] w-[62px] h-[62px]"
            : "top-[23px] left-[211px] w-16 h-16"
    }`}
  />
)}

                <p
                  className={`absolute ${
                    feature.title === "השאלת ציוד"
                      ? "top-[97px] left-[70px]"
                      : feature.title === "מסד נתונים"
                        ? "top-[97px] left-[58px]"
                        : feature.title === "נוכחות חכמה"
                          ? "top-[97px] left-[58px]"
                          : feature.title === "הרשאות וגיבוי"
                            ? "top-[92px] left-[72px]"
                            : "top-[91px] left-[61px]"
                  } w-[327px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-normal text-black text-[27px] text-center tracking-[0] leading-[normal] [direction:rtl]`}
                >
                  <span className="font-bold">
                    {feature.title}
                    <br />
                  </span>
                  <span className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-2xl">
                    {feature.description}
                  </span>
                </p>
              </div>
            </article>
          ))} 


        </section>

        <section className="absolute top-[1916px] left-0 w-[1920px] h-[566px] bg-[#584041]">
          {additionalFeatures.map((feature, index) => (
            <article
              key={index}
              className="absolute"
              style={{ top: feature.position.top, left: feature.position.left }}
            >
              <div
                className={`absolute ${
                  index === 0
                    ? "top-[21px] left-[16px]"
                    : index === 1
                      ? "top-[27px] left-[16px]"
                      : "top-[26px] left-[16px]"
                } w-[327px] h-[293px] bg-black rounded-[43px]`}
              />
              <div className="absolute top-0 left-0 w-[327px] h-[293px] bg-[#d8cdc2] rounded-[43px] border-2 border-solid border-black">
              {feature.icon && (
  <img
    src={feature.icon}
    alt={feature.title}
    className={`absolute ${
      index === 0
        ? "top-[47px] left-[137px] w-[65px] h-[65px]"
        : index === 1
          ? "top-[45px] left-[138px] w-[68px] h-[68px]"
          : "top-[46px] left-[141px] w-[67px] h-[67px]"
    }`}
  />
)}
                <p
                  className={`absolute ${
                    index === 0
                      ? "top-[139px] left-[-4px]"
                      : index === 1
                        ? "top-[139px] left-[6px]"
                        : "top-[139px] left-0"
                  } w-[327px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-normal text-black text-[32px] text-center tracking-[0] leading-[normal] [direction:rtl]`}
                >
                  <span className="font-bold">
                    {feature.title}
                    <br />
                  </span>
                  <span className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-2xl">
                    {feature.description}
                  </span>
                </p>
              </div>
            </article>
          ))}
          
        </section>

        <section className="absolute top-[2581px] left-[234px] w-[1420px] h-[180px]">
          <div className="absolute top-[23px] left-[68px] w-[1376px] h-[180px] bg-black rounded-[43px]" />
          <div className="absolute top-0 left-0 w-[1420px] h-[180px] bg-[#295f8b] rounded-[43px] border-2 border-solid border-black">
            <p className="absolute top-[38px] left-[353px] w-[769px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-normal text-black text-5xl text-center tracking-[0] leading-[normal] [direction:rtl]">
              <span className="font-bold">
                מוכנה להפחית ניירת ולהתארגן?
                <br />
              </span>
              <span className="[font-family:'Anomalia_ML_DemiBold_AAA-Bold',Helvetica] font-bold text-2xl">
                התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
              </span>
            </p>
          </div>
        </section>

        <div className="absolute top-[2852px] left-[727px] w-[456px] h-[68px]">
          <div className="absolute top-[8px] left-[11px] w-[211px] h-[60px] bg-black rounded-[30px]" />
          <div className="absolute top-[8px] left-[256px] w-[211px] h-[60px] bg-black rounded-[30px]" />
          <button className="absolute top-0 left-0 w-[211px] h-[60px] bg-[#584041] rounded-[30px] border-[0.95px] border-solid border-black">
            <span className="w-[185px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-[#0d0d0d] text-[27px] text-center tracking-[0] leading-[normal] [direction:rtl]">
              למד עוד
            </span>
          </button>
          <button className="absolute top-0 left-[245px] w-[211px] h-[60px] bg-[#bda39b] rounded-[30px] border-[0.95px] border-solid border-black">
            <span className="w-[185px] [font-family:'Anomalia_ML_Bold_AAA-Bold',Helvetica] font-bold text-white text-[27px] text-center tracking-[0] leading-[normal] [direction:rtl]">
              התחברות
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};
 export default Frame;