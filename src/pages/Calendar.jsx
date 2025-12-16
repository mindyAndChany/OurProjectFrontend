import React from "react";

const WEEK_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ז"];

const WEEKS = [
  ["ח", "ט", "י", "יא", "יב", "יג", "יד"],
  ["טו", "טז", "יז", "יח", "יט", "כ", "כא"],
  ["כב", "כג", "כד", "כה", "כו", "כז", "כח"],
  ["כט", "ל", "", "", "", "", ""],
];

export const Screen = () => {
  return (
    <main className="relative w-full min-w-[1920px] min-h-[1231px] bg-white">

      {/* כותרת */}
      <h1 className="absolute top-[194px] left-1/2 -translate-x-1/2 text-5xl font-medium">
        ארועים
      </h1>

      <h2 className="absolute top-[466px] left-1/2 -translate-x-1/2 text-5xl font-medium">
        כסליו
      </h2>

      {/* לוח שנה */}
      <section
        className="
          absolute top-[535px] left-[683px]
          w-[708px] h-[593px]
          grid grid-cols-7 grid-rows-5
          border-[3px] border-black
          divide-x-[3px] divide-y-[3px] divide-black
          rounded-[65px]
          overflow-hidden
        "
      >
        {/* ימי השבוע */}
        {WEEK_DAYS.map(day => (
          <div
            key={day}
            className="flex items-center justify-center text-4xl font-medium"
          >
            {day}
          </div>
        ))}

        {/* תאריכים */}
        {WEEKS.flat().map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-4xl font-medium"
          >
            {d}
          </div>
        ))}

        {/* דוגמא לאירוע צבוע */}
        <div className="col-start-4 row-start-3 bg-variable-collection-color-3" />
        <div className="col-start-5 row-start-4 bg-variable-collection-color-4" />
      </section>

      {/* מקרא */}
      <aside className="absolute top-[520px] left-[1500px] space-y-8">
        {[
          ["מבחנים", "bg-variable-collection-color-1"],
          ["טיולים", "bg-variable-collection-color-2"],
          ["חתונות", "bg-variable-collection-color-3"],
          ["חופשות", "bg-variable-collection-color-4"],
        ].map(([label, color]) => (
          <div key={label} className="flex items-center gap-4">
            <div className={`w-10 h-10 border-2 border-black ${color}`} />
            <span className="text-4xl font-medium">{label}</span>
          </div>
        ))}
      </aside>

      {/* כפתור */}
      <button
        className="
          absolute top-[1075px] left-[362px]
          w-[299px] h-[53px]
          bg-variable-collection-color-2
          rounded-full border-[3px] border-black
          text-4xl font-medium
        "
      >
        להוספת ארוע
      </button>

      {/* Header עליון */}
      <header className="absolute top-[17px] left-[1556px]">
        <h1 className="text-[70px] font-bold">
          <span className="text-black">EDU</span>
          <span className="text-[#295f8b]">LINK</span>
        </h1>
      </header>

      {/* ניווט */}
      <nav className="absolute top-[58px] left-[329px] w-[1219px] text-2xl font-bold text-center">
        ניהול המערכת &nbsp; נתוני תלמידות &nbsp; הנפקת אישורים &nbsp; השאלת ציוד &nbsp;
        ארועים &nbsp; התמחויות &nbsp; לימודי הוראה &nbsp; לימודי קודש
      </nav>
    </main>
  );
};
export default Screen ;