// Browser-safe admin access helpers (no server imports), shared by the server guard and the /admin pages.

export type Role = "requester" | "admin" | "owner";

export type StaffProfile = { userId: string; role: Role; suspendedUntil: string | null };

/** True for an admin/owner who is not currently suspended. */
export function canAccessAdmin(p: StaffProfile | null, now: Date = new Date()): boolean {
  if (!p) return false;
  if (p.role !== "admin" && p.role !== "owner") return false;
  if (p.suspendedUntil === null) return true;
  return new Date(p.suspendedUntil).getTime() <= now.getTime();
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : "";
}

/** The shape requireSupabaseAuth throws: "Unauthorized: …". */
export function isUnauthorized(err: unknown): boolean {
  return messageOf(err).startsWith("Unauthorized");
}

/** statusCode 403, or an error whose message starts with "Forbidden" (custom props may not survive server-fn serialization). */
export function isForbidden(err: unknown): boolean {
  if (typeof err === "object" && err !== null && (err as { statusCode?: unknown }).statusCode === 403) return true;
  return messageOf(err).startsWith("Forbidden");
}

export function forbiddenError(message = "Forbidden: admin only"): Error {
  return Object.assign(new Error(message), { statusCode: 403 });
}
