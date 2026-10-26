import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-middleware";
import type { Role } from "@/lib/admin-access";
import {
  NOT_FOUND_MESSAGE,
  OWNER_ONLY_MESSAGE,
  roleChangeError,
  setRoleSchema,
  type SetRoleResult,
  type TeamMember,
} from "@/lib/admin-team";
import { adminDb, logAction } from "@/server/admin-guard";

type StaffRow = { user_id: string; display_name: string | null; role: "admin" | "owner" };

const PER_PAGE = 200;
const MAX_PAGES = 50;

/** Staff only (admin/owner), with the sign-in email from the auth admin API. Any active admin may read it. */
export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<TeamMember[]> => {
    const { data, error } = await adminDb
      .from("profiles")
      .select("user_id, display_name, role")
      .in("role", ["admin", "owner"])
      .order("created_at", { ascending: true })
      .returns<StaffRow[]>();
    if (error) throw new Error(`Could not load team: ${error.message}`);

    return Promise.all(
      (data ?? []).map(async (row): Promise<TeamMember> => {
        const { data: user, error: userError } = await adminDb.auth.admin.getUserById(row.user_id);
        if (userError) throw new Error(`Could not load team member: ${userError.message}`);
        return {
          userId: row.user_id,
          email: user.user?.email ?? "",
          displayName: row.display_name,
          role: row.role,
        };
      }),
    );
  });

/** supabase-js has no get-by-email on the admin API, so page through users until the email turns up. */
async function findUserIdByEmail(email: string): Promise<string | null> {
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const { data, error } = await adminDb.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) throw new Error(`Could not look up user: ${error.message}`);
    const found = data.users.find((u) => u.email?.toLowerCase() === email);
    if (found) return found.id;
    if (data.users.length < PER_PAGE) return null;
  }
  return null;
}

async function countOwners(): Promise<number> {
  const { count, error } = await adminDb.from("profiles").select("*", { count: "exact", head: true }).eq("role", "owner");
  if (error) throw new Error(`Could not count owners: ${error.message}`);
  return count ?? 0;
}

/** Owner only, enforced here with the actor's real role from requireAdmin (never from client input). */
export const setRole = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(setRoleSchema)
  .handler(async ({ data, context }): Promise<SetRoleResult> => {
    // Checked before the lookup so a non-owner cannot use this to find out which emails have accounts.
    if (context.role !== "owner") return { ok: false, message: OWNER_ONLY_MESSAGE };

    const targetId = await findUserIdByEmail(data.email);
    if (!targetId) return { ok: false, message: NOT_FOUND_MESSAGE };

    const { data: profile, error: profileError } = await adminDb
      .from("profiles")
      .select("role")
      .eq("user_id", targetId)
      .maybeSingle<{ role: Role }>();
    if (profileError) throw new Error(`Could not load profile: ${profileError.message}`);
    const from: Role = profile?.role ?? "requester";

    const refusal = roleChangeError(
      { userId: context.userId, role: context.role },
      { userId: targetId, role: from },
      data.role,
      await countOwners(),
    );
    if (refusal) return { ok: false, message: refusal };

    if (profile) {
      const { error } = await adminDb.from("profiles").update({ role: data.role }).eq("user_id", targetId);
      if (error) throw new Error(`Could not change role: ${error.message}`);
    } else {
      // Signed up before the profile trigger existed: create the row so the role has somewhere to live.
      const { error } = await adminDb.from("profiles").upsert({ user_id: targetId, role: data.role }, { onConflict: "user_id" });
      if (error) throw new Error(`Could not change role: ${error.message}`);
    }

    await logAction(context.userId, "team.set_role", "profile", targetId, { email: data.email, from, to: data.role });
    return { ok: true };
  });
