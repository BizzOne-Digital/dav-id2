const isProd = process.env.NODE_ENV === "production";

export function missingServerEnv(keys: string[]): string[] {
  return keys.filter((key) => !process.env[key]?.trim());
}

/** User-safe message; logs detail server-side in production. */
export function authUnavailableMessage(missing: string[]): string {
  if (!isProd) {
    return `Server misconfigured: set ${missing.join(", ")} in .env.local`;
  }
  return "Sign-in is temporarily unavailable. Please try again later or contact support.";
}

export function registrationUnavailableMessage(missing: string[]): string {
  if (!isProd) {
    return `Server misconfigured: set ${missing.join(", ")} in .env.local`;
  }
  return "Registration is temporarily unavailable. Please try again later or contact support.";
}
