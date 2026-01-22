import React, { useMemo } from "react";
import { numberToHebrewLetters, formatHebrewYear } from "../utils/hebrewGematria";

const hebFullFormatter = new Intl.DateTimeFormat("he-u-ca-hebrew", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function getHebrewDateText(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const parts = hebFullFormatter.formatToParts(dateObj);
  const dayNum = Number(parts.find((p) => p.type === "day")?.value);
  const monthName = parts.find((p) => p.type === "month")?.value || "";
  const yearNum = Number(parts.find((p) => p.type === "year")?.value);
  const dayHeb = numberToHebrewLetters(dayNum);
  const yearHeb = formatHebrewYear(yearNum);
  return `${dayHeb} ${monthName} ${yearHeb}`;
}

export const HebrewDateShow = ({ isoDate }) => {
  const hebrewDate = useMemo(() => getHebrewDateText(isoDate), [isoDate]);
  if (!isoDate) return null;

  return (
    <div className="mt-4 inline-flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="px-5 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="text-sm font-bold text-gray-600">תאריך</div>
        <div className="text-xl font-bold text-gray-900">{hebrewDate}</div>
        <div className="text-sm font-semibold text-gray-500">{isoDate}</div>
      </div>
    </div>
  );
};

export default HebrewDateShow;
