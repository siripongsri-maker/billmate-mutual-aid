// Single source of truth for the product name. Change it here and it flows
// through the logo, marks and page titles.
export const BRAND = {
  th: "\u0e0a\u0e48\u0e27\u0e22\u0e01\u0e31\u0e19",
  en: "chuaykan",
  markTh: "\u0e0a",
  markEn: "c",
  splitTh: ["\u0e0a\u0e48\u0e27\u0e22", "\u0e01\u0e31\u0e19"] as const,
  splitEn: ["chuay", "kan"] as const,
  taglineTh: "\u0e0a\u0e35\u0e27\u0e34\u0e15\u0e21\u0e35\u0e40\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e44\u0e21\u0e48\u0e04\u0e32\u0e14\u0e1c\u0e31\u0e19",
  taglineEn: "Life happens. We help.",
} as const;

export const pageTitle = (page: string, lang: "th" | "en" = "en") =>
  lang === "th" ? `${page} \u2014 ${BRAND.th}` : `${page} \u2014 ${BRAND.en}`;
