import React, { useEffect, useRef } from "react";

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

  return (
    <input
      id={id}
      ref={inputRef}
      className="relative z-10 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
