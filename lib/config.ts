// lib/config.ts
// ─── Single source of truth for all company branding ───────────────────────
// Change these values (or set them via .env.local) to match your company.

export const companyConfig = {
  name:    process.env.COMPANY_NAME    || "Robotspraak Company",
  address: process.env.COMPANY_ADDRESS || "Manjai, Banjul, The Gambia",
  email:   process.env.COMPANY_EMAIL   || "info@robotspraak.nl",
  phone:   process.env.COMPANY_PHONE   || "+220 000 0000",
  website: process.env.COMPANY_WEBSITE || "www.robotspraak.nl",

  // ── Brand colours (used by PDF & DOCX generators) ──
  colors: {
    primary:   "1e40af",   // Deep corporate blue  (#1e40af)
    secondary: "0f172a",   // Navy                 (#0f172a)
    accent:    "f59e0b",   // Amber                (#f59e0b)
    text:      "111827",   // Near-black           (#111827)
    muted:     "6b7280",   // Gray-500             (#6b7280)
    subtle:    "9ca3af",   // Gray-400             (#9ca3af)
  },
} as const;

export type CompanyConfig = typeof companyConfig;
