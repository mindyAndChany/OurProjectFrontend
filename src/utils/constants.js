import { formatHebrewYear } from "./hebrewGematria";

// ===== שנת הלימודים של המערכת — מקור אמת יחיד לכל האפליקציה =====
// לעדכן ידנית פעם בשנה, בפתיחת שנת הלימודים. כל המסכים קוראים מכאן,
// כך שאין צורך (ולא רצוי) להזין את השנה בקוד של דף כלשהו.
//
// 2026/2027 -> תשפ״ז. ההפרש הקבוע בין השנה האזרחית לשנה העברית הוא 3760.
export const SYSTEM_YEAR = 2027;

/** השנה האזרחית של שנת הלימודים הנוכחית (2027) */
export const CURRENT_YEAR = SYSTEM_YEAR;

/** שנת רישום ברירת מחדל לתלמידה חדשה — השנה הבאה (2028) */
export const DEFAULT_REG_YEAR = SYSTEM_YEAR + 1;

/** מספר השנה העברית של המערכת. קבוע ויציב — לא תלוי בתאריך של היום. */
export const SYSTEM_HEBREW_YEAR = SYSTEM_YEAR + 3760;

/** השנים המוצעות לבוררי השנה (שנה קודמת ועד שנת המערכת) */
export const SCHOOL_YEARS = [SYSTEM_YEAR - 3, SYSTEM_YEAR - 2, SYSTEM_YEAR - 1, SYSTEM_YEAR];

/** מחזיר תווית שנה עברית (אותיות). offset=0 -> שנת המערכת, offset=1 -> השנה הבאה. */
export const HEB_SCHOOL_YEAR = (offset = 0) => formatHebrewYear(SYSTEM_HEBREW_YEAR + offset);

/**
 * התווית המלאה של שנת הלימודים, למשל "תשפ״ז (2026-2027)".
 * @param {'he'|'gregorian'|'full'} mode - עברית / אזרחית / משולבת
 */
export function getSchoolYearLabel(mode = "full") {
  const he = HEB_SCHOOL_YEAR();
  const gregorian = `${SYSTEM_YEAR - 1}-${SYSTEM_YEAR}`;
  if (mode === "he") return he;
  if (mode === "gregorian") return gregorian;
  return `${he} (${gregorian})`;
}
