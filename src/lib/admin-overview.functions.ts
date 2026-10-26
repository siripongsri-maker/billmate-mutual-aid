import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-middleware";
import { adminDb } from "@/server/admin-guard";

export type AdminOverview = { newMessages: number; inProgressMessages: number; teamCount: number };

async function countRows(
  run: PromiseLike<{ count: number | null; error: { message: string } | null }>,
): Promise<number> {
  const { count, error } = await run;
  if (error) throw new Error(`Could not count rows: ${error.message}`);
  return count ?? 0;
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async (): Promise<AdminOverview> => {
    const head = { count: "exact", head: true } as const;
    const [newMessages, inProgressMessages, teamCount] = await Promise.all([
      countRows(adminDb.from("contact_messages").select("*", head).eq("status", "new")),
      countRows(adminDb.from("contact_messages").select("*", head).eq("status", "in_progress")),
      countRows(adminDb.from("profiles").select("*", head).in("role", ["admin", "owner"])),
    ]);
    return { newMessages, inProgressMessages, teamCount };
  });
