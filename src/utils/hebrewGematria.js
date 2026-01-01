export function numberToHebrewLetters(n, opts = {}) {
  const { addQuotes = true } = opts;
  if (!Number.isInteger(n) || n <= 0) return "";

  const special = { 15: "טו", 16: "טז" };

  const onesMap = { 1: "א", 2: "ב", 3: "ג", 4: "ד", 5: "ה", 6: "ו", 7: "ז", 8: "ח", 9: "ט" };
  const tensMap = { 10: "י", 20: "כ", 30: "ל", 40: "מ", 50: "נ", 60: "ס", 70: "ע", 80: "פ", 90: "צ" };
  const hundredsMap = { 100: "ק", 200: "ר", 300: "ש", 400: "ת" };

  function buildLetters(x) {
    let out = "";

    while (x >= 400) {
      out += "ת";
      x -= 400;
    }

    if (x >= 300) { out += "ש"; x -= 300; }
    else if (x >= 200) { out += "ר"; x -= 200; }
    else if (x >= 100) { out += "ק"; x -= 100; }

    if (x === 15 || x === 16) {
      out += special[x];
      return out;
    }

    const tens = Math.floor(x / 10) * 10;
    const ones = x % 10;
    if (tens) out += tensMap[tens] || "";
    if (ones) out += onesMap[ones] || "";
    return out;
  }

  const letters = buildLetters(n);

  if (!addQuotes) return letters;

  if (letters.length === 1) return `${letters}׳`;

  const head = letters.slice(0, -1);
  const last = letters.slice(-1);
  return `${head}״${last}`;
}

export function formatHebrewYear(hebrewYear) {
  if (!Number.isInteger(hebrewYear) || hebrewYear <= 0) return "";
  const y = hebrewYear % 1000; // 5786 -> 786
  return numberToHebrewLetters(y, { addQuotes: true });
}
