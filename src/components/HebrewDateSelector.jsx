import React, { useEffect, useRef, useState } from "react";
import { HDate } from "@hebcal/core";

/**
 * Convert Hebrew letters (Gematria) to number
 * Examples: יב -> 12, כה -> 25, תשפו -> 786, י"ב -> 12, תשפ"ו -> 786
 */
function hebrewLettersToNumber(hebrewText) {
  if (!hebrewText) return null;
  
  // Remove quotes, spaces, and other special characters
  const cleaned = hebrewText.replace(/[׳״'"`,.\-\s]/g, '').trim();
  if (!cleaned) return null;
  
  const letterValues = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
    'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90,
    'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
  };
  
  let sum = 0;
  let hasHebrewLetter = false;
  
  for (const char of cleaned) {
    const value = letterValues[char];
    if (value) {
      sum += value;
      hasHebrewLetter = true;
    } else {
      // Unknown character - not a Hebrew letter
      return null;
    }
  }
  
  return hasHebrewLetter && sum > 0 ? sum : null;
}

/**
 * Helper function to parse Hebrew date text input
 * Supports formats like: "כ אדר תשפו", "20 אדר 5786", "20/6/5786", "יב אדר תשפו"
 * Works with or without gershayim (quotes): "כ'" or "כ", "תשפ\"ו" or "תשפו"
 */
function parseHebrewDateInput(text) {
  if (!text || !text.trim()) return null;
  
  const trimmed = text.trim();
  
  // Hebrew month names mapping
  // NOTE: HDate library uses Nisan-based numbering (Nisan=1, not Tishrei=1)
  const hebrewMonths = {
    'ניסן': 1, 'אייר': 2, 'סיון': 3, 'תמוז': 4, 'אב': 5, 'אלול': 6,
    'תשרי': 7, 'חשון': 8, 'חשוון': 8, 'כסלו': 9, 'טבת': 10, 'שבט': 11,
    'אדר': 12, 'אדר א': 12, 'אדר ב': 13
  };
  
  // Try numeric format: DD/MM/YYYY or DD-MM-YYYY
  const numericMatch = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (numericMatch) {
    const [, day, month, year] = numericMatch;
    return { day: parseInt(day), month: parseInt(month), year: parseInt(year) };
  }
  
  // Try to match: <day> <month_name> <year>
  // Extract numbers and Hebrew text
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 1) {
    let day = null;
    let month = null;
    let year = null;
    
    for (const part of parts) {
      // Only remove punctuation, keep Hebrew letters and numbers
      const cleanPart = part.replace(/[,.\-״׳'"!?;:]/g, '').trim();
      
      // Check if it's a month name FIRST (before gematria)
      let isMonthName = false;
      for (const [monthName, monthNum] of Object.entries(hebrewMonths)) {
        if (cleanPart === monthName || cleanPart.includes(monthName)) {
          month = monthNum;
          isMonthName = true;
          break;
        }
      }
      
      if (isMonthName) {
        continue; // Skip to next part
      }
      
      // Try to parse as Gematria
      const gematriaValue = hebrewLettersToNumber(cleanPart);
      if (gematriaValue !== null) {
        // Determine if it's a day, month, or year based on value
        if (gematriaValue >= 1 && gematriaValue <= 31 && !day) {
          day = gematriaValue;
        } else if (gematriaValue >= 700 && gematriaValue <= 1000 && !year) {
          // Year in abbreviated format (e.g., תשפ"ו = 786)
          // Convert to full year: 786 + 5000 = 5786
          year = gematriaValue + 5000;
        } else if (gematriaValue >= 5700 && gematriaValue <= 6000 && !year) {
          year = gematriaValue;
        }
        continue;
      }
      
      // Check if it's a number
      const num = parseInt(cleanPart);
      if (!isNaN(num)) {
        if (num >= 1 && num <= 31 && !day) {
          day = num;
        } else if (num >= 5700 && num <= 6000) {
          year = num;
        } else if (num >= 700 && num <= 1000 && !year) {
          year = num + 5000;
        }
      }
    }
    
    if (day && month && year) {
      return { day, month, year };
    }
  }
  
  return null;
}

/**
 * Convert Hebrew date to Gregorian using HDate library
 */
function hebrewToGregorian(hebrewDay, hebrewMonth, hebrewYear) {
  try {
    // Use HDate to convert Hebrew date to Gregorian - simple and reliable!
    const hd = new HDate(hebrewDay, hebrewMonth, hebrewYear);
    const gregorianDate = hd.greg();
    return gregorianDate;
  } catch (err) {
    console.error('Error converting Hebrew to Gregorian with HDate:', err);
    return null;
  }
}

/**
 * אינפוט לבחירת תאריך עברי
 * HebrewDateSelector: wraps jQuery flexcal in a React component.
 * Requires global jQuery, jQuery UI, and flexcal scripts loaded in index.html.
 * Props:
 * - onCommit(hebDateStr, context): callback when a date is chosen
 *   - hebDateStr: formatted string (yyyy-mm-dd) of the Hebrew date
 *   - context: raw object returned by flexcal commit and formatted date for convenience
 * - id: optional DOM id to target; auto-generated if omitted
 * - placeholder: input placeholder
 */
export default function HebrewDateSelector({ onCommit, id = "flexcal-input", placeholder = "בחרי תאריך" }) {
  const inputRef = useRef(null);
  const onCommitRef = useRef(onCommit);
  const [inputValue, setInputValue] = useState("");
  const processingRef = useRef(false); // Track if we're processing to avoid reopening calendar

  // Keep latest onCommit without re-initializing the plugin
  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => {
    const $ = window.jQuery || window.$;
    if (!inputRef.current) return;

    let destroyed = false;
    let initialized = false;
    let $el = null;

    function init() {
      const jq = window.jQuery || window.$;
      if (!(jq && jq.fn)) return false;
      if (!jq.fn.flexcal) {
        console.warn("HebrewDateSelector: $.fn.flexcal not found. Waiting for scripts to load...");
        return false;
      }
      $el = jq(inputRef.current);
      $el.flexcal({
        position: "lt",
        calendars: [["he-jewish", "עברי", { dateFormat: "yyyy-mm-dd", titleText: "בחר תאריך" }]],
        commit: function (e, d) {
          try {
            const formatted = $el.flexcal("format", d);
            if (typeof onCommitRef.current === "function") onCommitRef.current(formatted, { event: e, raw: d, formatted });
            setInputValue(""); // Clear after selecting from popup
          } catch (err) {
            console.warn("HebrewDateSelector commit error", err);
          } finally {
            try { $el.val(""); } catch {}
          }
        },
        buttons: ["today commit"],
      });
      initialized = true;
      return true;
    }

    // Try immediate init, then retry a few times if not ready
    if (!init()) {
      let attempts = 0;
      const maxAttempts = 20; // ~2s total
      const handle = setInterval(() => {
        attempts += 1;
        if (destroyed) { clearInterval(handle); return; }
        if (init()) { clearInterval(handle); }
        if (attempts >= maxAttempts) {
          clearInterval(handle);
          console.error("HebrewDateSelector: failed to initialize. Check script URLs in index.html");
        }
      }, 100);
    }

    return () => {
      destroyed = true;
      if (initialized && $el) {
        try { $el.flexcal("destroy"); } catch {}
      }
    };
  }, [id]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Don't process on blur - only on Enter key
    // This prevents issues with alerts stealing focus
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processHebrewDateInput();
    }
  };

  const processHebrewDateInput = () => {
    processingRef.current = true;
    const parsed = parseHebrewDateInput(inputValue);
    
    if (parsed) {
      // Use HDate library for reliable conversion
      const gregorianDate = hebrewToGregorian(parsed.day, parsed.month, parsed.year);
      
      if (gregorianDate) {
        if (typeof onCommitRef.current === "function") {
          onCommitRef.current("", { event: null, raw: gregorianDate, formatted: "" });
        }
        setInputValue("");
        processingRef.current = false;
      } else {
        alert('לא ניתן להמיר את התאריך העברי. נסה פורמט אחר.');
        setTimeout(() => { processingRef.current = false; }, 500);
      }
    } else {
      alert('פורמט תאריך לא תקין. נסה:\n"20 אדר 5786" או "20/6/5786"\nאו עם גימטריה: "כ אדר תשפו" או "יב אדר תשפו"\n(ניתן להוסיף גרשיים או בלי)');
      setTimeout(() => { processingRef.current = false; }, 500);
    }
  };

  return (
    <input
      id={id}
      ref={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      onKeyPress={handleKeyPress}
      className="relative z-10 inline-flex w-fit cursor-text rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      size={Math.max(placeholder.length, 15)}
      onFocus={(e) => {
        // Only open flexcal if input is empty and not processing
        if (!inputValue.trim() && !processingRef.current) {
          try {
            const $ = window.jQuery || window.$;
            if ($ && $.fn && $.fn.flexcal) {
              $(inputRef.current).flexcal("show");
            }
          } catch {}
        }
      }}
    />
  );
}
