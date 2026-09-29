/** Public contact email shown on the website */
export const SITE_EMAIL = "contact@musiccityscavengerhunt.com";

/** Public business phone (E.164 +1 629 395 1625) */
export const SITE_PHONE = "+1 (629) 395-1625";

const LEGACY_EMAILS = new Set(["howigetemail@gmail.com"]);

export function resolvePublicEmail(email?: string | null): string {
  if (!email?.trim()) return SITE_EMAIL;
  const normalized = email.trim().toLowerCase();
  if (LEGACY_EMAILS.has(normalized)) return SITE_EMAIL;
  return email.trim();
}

const LEGACY_PHONE_DIGITS = new Set(["6155719900"]);

/** Use for all public-facing phone display (migrates old Nashville number from DB). */
export function resolvePublicPhone(phone?: string | null): string {
  if (!phone?.trim()) return SITE_PHONE;
  const digits = phone.replace(/\D/g, "");
  if (LEGACY_PHONE_DIGITS.has(digits)) return SITE_PHONE;
  return phone.trim();
}

export function sitePhoneTelHref(phone: string = SITE_PHONE): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return `tel:${SITE_PHONE.replace(/\D/g, "")}`;
  return digits.startsWith("1") ? `tel:+${digits}` : `tel:+1${digits}`;
}
