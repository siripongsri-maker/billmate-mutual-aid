import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { canAccessAdmin, forbiddenError, type Role, type StaffProfile } from "@/lib/admin-access";

export { canAccessAdmin, isForbidden, isUnauthorized } from "@/lib/admin-access";
export type { Role, StaffProfile } from "@/lib/admin-access";

/**
 * Service-role client without the generated types: profiles and audit_log are not in
 * src/integrations/supabase/types.ts yet, so callers type their own rows.
 */
export const adminDb = supabaseAdmin as unknown as SupabaseClient;

type ProfileRow = { user_id: string; role: Role; suspended_until: string | null };

/** Loads the caller's profile and returns { userId, role }, or throws a 403 when they are not active staff. */
export async function authorizeAdmin(userId: string): Promise<{ userId: string; role: Role }> {
  const { data, error } = await adminDb
    .from("profiles")
    .select("user_id, role, suspended_until")
    .eq("user_id", userId)
    .maybeSingle<ProfileRow>();
  if (error) throw new Error(`Could not load profile: ${error.message}`);

  const profile: StaffProfile | null = data
    ? { userId: data.user_id, role: data.role, suspendedUntil: data.suspended_until }
    : null;
  if (!profile || !canAccessAdmin(profile)) throw forbiddenError();
  return { userId: profile.userId, role: profile.role };
}

/**
 * Writes one audit_log row. A failed write is logged and swallowed on purpose: the audit trail is
 * best-effort and must not make an already-completed admin action look like it failed.
 */
export async function logAction(
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  detail: Record<string, unknown> = {},
): Promise<void> {
  try {
    const { error } = await adminDb
      .from("audit_log")
      .insert({ actor_id: actorId, action, target_type: targetType, target_id: targetId, detail });
    if (error) console.error("[audit_log] write failed", { action, targetType, targetId, message: error.message });
  } catch (err) {
    console.error("[audit_log] write failed", { action, targetType, targetId, err });
  }
}
