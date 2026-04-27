import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const COMMON_FORMATS = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "D/M/YYYY",
  "MM/DD/YYYY",
  "M/D/YYYY",
  "YYYY/MM/DD",
];

/**
 * Robustly parse a date string into a Date object.
 * Tries several common formats if native parsing fails.
 */
export function parseRobustDate(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date(NaN);

  // 1. Try native parsing (handles ISO 8601 well)
  const native = new Date(dateStr);
  if (!isNaN(native.getTime())) {
    // If it's a short date with slashes, native parsing can be locale-dependent.
    // For "30/6/2026", native might still fail or return something weird.
    // So we only return native if it doesn't look like a simple slash/dash date
    // OR if it's already a full ISO string.
    if (dateStr.includes("T") || dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return native;
    }
  }

  // 2. Try common formats with dayjs
  for (const format of COMMON_FORMATS) {
    const d = dayjs(dateStr, format, true);
    if (d.isValid()) {
      return d.toDate();
    }
  }

  // 3. Fallback to native anyway, or return Invalid Date
  return native;
}
