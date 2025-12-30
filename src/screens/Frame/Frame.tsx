import React, { JSX, use } from "react";
// import { Crowdfunding } from "../../components/Crowdfunding/Crowdfunding.tsx";
// import { Edulink } from "../../components/Edulink/Edulink.tsx";
// import { LicenseDraft } from "../../components/LicenseDraft/LicenseDraft.tsx";
// import { NoteEdit } from "../../components/NoteEdit/NoteEdit.tsx";
// import { SchoolBell } from "../../components/SchoolBell/SchoolBell.tsx";
// import { SecurityCheck } from "../../components/SecurityCheck/SecurityCheck.tsx";
// import { SquareLock } from "../../components/SquareLock/SquareLock.tsx";
// import { Task } from "../../components/Task/Task.tsx";
// import { User } from "../../components/User/index.ts";
import "./style.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

export const Frame = (): JSX.Element => {
const navigate=useNavigate();
function login() {
 navigate("/login") ;
}
  return (
    <div className="frame">


      <p className="text-wrapper-2">
        להחליף את הגליונות
        <br />
        בקובץ מסודר
        <br />
        בטוח ומתאים
      </p>

      <div className="rectangle-2" />

      <div className="rectangle-3" />

      <div className="rectangle-4" />

      <div className="rectangle-5" />

      <div className="text-wrapper-3">כניסה למערכת</div>

      <div className="text-wrapper-4">חקור את המערכת</div>

      <div className="rectangle-6" />

      <div className="rectangle-7" />

      <div className="rectangle-8" />

      <div className="rectangle-9" />

      <div className="rectangle-10" />

      <div className="rectangle-11" />

      <div className="rectangle-12" />

      <div className="rectangle-13" />

      <div className="rectangle-14" />

      <div className="rectangle-15" />

      <div className="rectangle-16" />

      <div className="rectangle-17" />

      <div className="rectangle-18" />

      <div className="rectangle-19" />

      <div className="rectangle-20" />

      <div className="rectangle-21" />

      <p className="div-2">
        <span className="text-wrapper-5">
          נוכחות חכמה
          <br />
        </span>

        <span className="text-wrapper-6">
          מעקב בזמן אמת ודוחות חדשים בלחיצת כפתור.
        </span>
      </p>

      <p className="div-3">
        <span className="text-wrapper-5">
          מסד נתונים
          <br />
        </span>

        <span className="text-wrapper-6">
          פרטי קשר, תיעוד, סינון מהיר ויצוא נתונים.
        </span>
      </p>

      <p className="div-4">
        {/* <Task /> */}
        <span className="text-wrapper-5">
          לוח שנה משותף
          <br />
        </span>

        <span className="text-wrapper-6">
          כל הארועים, מבחנים והפסקות במבט אחד.
        </span>
      </p>

      <p className="div-5">
        <span className="text-wrapper-5">
          הרשאות וגיבוי
          <br />
        </span>

        <span className="text-wrapper-6">
          הגדרות משתמש מדויקות וגיבוי אוטומטי של כל המידע.
        </span>
      </p>

      <p className="div-6">
        <span className="text-wrapper-5">
          השאלת ציוד
          <br />
        </span>

        <span className="text-wrapper-6">
          מעקב מלא אחרי ציוד והשאלות עם סטטוסים ברורים.
        </span>
      </p>

      <p className="div-7">
        <span className="text-wrapper-5">
          מוכנה להפחית ניירת ולהתארגן?
          <br />
        </span>

        <span className="text-wrapper-6">
          התחברי עכשיו והתחילי לנהל את כל המידע במקום אחד
        </span>
      </p>

      <div className="rectangle-22" />

      <div className="rectangle-23" />

      <div className="rectangle-24" />

      <div className="rectangle-25" />

      <div className="rectangle-26" />

      <div className="rectangle-27" />

      <div className="rectangle-28" />

      <p className="div-8">
        <span className="text-wrapper-5">
          התראות חכמות
          <br />
        </span>

        <span className="text-wrapper-6">
          התראות על ציוד בהשאלה, תזכורת לחסרי נוכחות ועוד.
        </span>
      </p>

      <p className="EXEL-PDF">
        <span className="text-wrapper-5">
          יצוא ודוחות
          <br />
        </span>

        <span className="text-wrapper-6">
          דוחות מותאמים אישית
          <br />
          יצוא לקבצי EXEL/PDF
        </span>
      </p>

      <p className="div-9">
        <span className="text-wrapper-5">
          גיבוי ופרטיות
          <br />
        </span>

        <span className="text-wrapper-6">
          אחסון מאובטח וגיבוי אוטומטי לחוסן נתונים
        </span>
      </p>

      <div className="text-wrapper-7" onClick={login}>התחברות</div>

      <div className="text-wrapper-8">למד עוד</div>

      {/* <div className="text-wrapper-9" onClick={login}>התחברות</div> */}

      <p className="text-wrapper-10">
        מערכת ניהול סמינר שמרכזת את כל המידע במקום אחד — מאגר תלמידות עם פרטי
        קשר, היסטוריית נוכחות, לוח שנה משותף, והשאלת ציוד.
        <br />
        כלים חכמים לחיסכון בזמן וניהול פשוט של הפעילות היומיומית.
      </p>

      {/* <User /> */}
      {/* <Crowdfunding
        className="crowdfunding-instance"
        crowdfunding="/img/crowdfunding-3.png"
      />
      <LicenseDraft
        className="license-draft-instance"
        licenseDraft="/img/license-draft-3.png"
      />
      <SquareLock />
      <SchoolBell />
      <Task />
      <SecurityCheck />
      <NoteEdit /> */}
    </div>
  );
};
