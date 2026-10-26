import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-middleware";
import type { Role } from "@/lib/admin-access";

export type AdminMe = { userId: string; role: Role };

/** Cheapest possible staff check: succeeds only for an active admin/owner, so the /admin layout can gate on it. */
export const getAdminMe = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }): Promise<AdminMe> => ({ userId: context.userId, role: context.role }));
