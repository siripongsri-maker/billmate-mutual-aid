// The old "chuaykan" demo routes still exist until the demo app is removed (plan 6).
// Until then every one of them sends visitors to the matching page of the คนละนิด site.
const KL = "/konlanid/index.html";

const LEGACY: ReadonlyArray<[prefix: string, target: string]> = [
  ["/onboarding", KL],
  ["/browse", `${KL}#/bills`],
  ["/bills", `${KL}#/bills`],
  ["/requests", `${KL}#/request`],
  ["/profile", `${KL}#/me`],
  ["/notifications", `${KL}#/me`],
  ["/impact", `${KL}#/activity`],
  ["/circles", `${KL}#/activity`],
  ["/corporate", KL],
  ["/moderator", KL],
  ["/how-it-works", KL],
];

export function legacyRedirect(pathname: string): string | null {
  for (const [prefix, target] of LEGACY) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return target;
  }
  return null;
}
