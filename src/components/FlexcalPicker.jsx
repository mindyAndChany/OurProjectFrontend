import React, { useEffect, useRef } from "react";

/**
 * אינפוט לבחירת תאריך עברי
 * FlexcalPicker: wraps jQuery flexcal in a React component.
 * Requires global jQuery, jQuery UI, and flexcal scripts loaded in index.html.
 * Props:
 * - onCommit(hebDateStr, context): callback when a date is chosen
 *   - hebDateStr: formatted string (yyyy-mm-dd) of the Hebrew date
 *   - context: raw object returned by flexcal commit and formatted date for convenience
 * - id: optional DOM id to target; auto-generated if omitted
 * - placeholder: input placeholder
 */
export default function FlexcalPicker({ onCommit, id = "flexcal-input", placeholder = "בחרי תאריך" }) {
  const inputRef = useRef(null);

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
        console.warn("FlexcalPicker: $.fn.flexcal not found. Waiting for scripts to load...");
        return false;
      }
      $el = jq(inputRef.current);
      $el.flexcal({
        position: "lt",
        calendars: [["he-jewish", "עברי", { dateFormat: "yyyy-mm-dd", titleText: "בחר תאריך" }]],
        commit: function (e, d) {
          try {
            const formatted = $el.flexcal("format", d);
            if (typeof onCommit === "function") onCommit(formatted, { event: e, raw: d, formatted });
          } catch (err) {
            console.warn("FlexcalPicker commit error", err);
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
          console.error("FlexcalPicker: failed to initialize. Check script URLs in index.html");
        }
      }, 100);
    }

    return () => {
      destroyed = true;
      if (initialized && $el) {
        try { $el.flexcal("destroy"); } catch {}
      }
    };
  }, [onCommit, id]);

  return (
    <input
      id={id}
      ref={inputRef}
      type="text"
      className="border border-black rounded px-2 py-1 z-10 relative"
      placeholder={placeholder}
      readOnly
      onClick={() => {
        try {
          const $ = window.jQuery || window.$;
          if ($ && $.fn && $.fn.flexcal) {
            $(inputRef.current).flexcal("show");
          }
        } catch {}
      }}
    />
  );
}
