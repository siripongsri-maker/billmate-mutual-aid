import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-middleware";
import {
  AUDIT_PAGE_SIZE,
  UNKNOWN_ACTOR,
  listAuditSchema,
  type AuditItem,
  type JsonValue,
  type ListAuditResult,
} from "@/lib/admin-log";
import { adminDb } from "@/server/admin-guard";

type AuditRow = {
  id: number;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  detail: unknown;
  created_at: string;
};

type NameRow = { user_id: string; display_name: string | null };

function toDetail(value: unknown): Record<string, JsonValue> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, JsonValue>) : {};
}

/** Newest first, 50 per page. Any active admin may read it; there is no write path from here. */
export const listAudit = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator(listAuditSchema)
  .handler(async ({ data }): Promise<ListAuditResult> => {
    let query = adminDb
      .from("audit_log")
      .select("id, actor_id, action, target_type, target_id, detail, created_at")
      .order("id", { ascending: false })
      // One extra row tells us whether an older page exists without a second query.
      .limit(AUDIT_PAGE_SIZE + 1);
    if (data.before !== undefined) query = query.lt("id", data.before);

    const { data: rows, error } = await query.returns<AuditRow[]>();
    if (error) throw new Error(`Could not load audit log: ${error.message}`);

    const all = rows ?? [];
    const page = all.slice(0, AUDIT_PAGE_SIZE);

    // One lookup for every actor on the page, not one query per row.
    const actorIds = [...new Set(page.map((r) => r.actor_id).filter((id): id is string => id !== null))];
    const names = new Map<string, string>();
    if (actorIds.length > 0) {
      const { data: profiles, error: nameError } = await adminDb
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", actorIds)
        .returns<NameRow[]>();
      if (nameError) throw new Error(`Could not load actor names: ${nameError.message}`);
      for (const p of profiles ?? []) {
        if (p.display_name && p.display_name.trim() !== "") names.set(p.user_id, p.display_name);
      }
    }

    const items: AuditItem[] = page.map((r) => ({
      id: r.id,
      at: r.created_at,
      actorName: (r.actor_id !== null ? names.get(r.actor_id) : undefined) ?? UNKNOWN_ACTOR,
      action: r.action,
      targetType: r.target_type,
      targetId: r.target_id,
      detail: toDetail(r.detail),
    }));
    return { items, hasMore: all.length > AUDIT_PAGE_SIZE };
  });
