import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { authorizeAdmin } from "@/server/admin-guard";

/**
 * Function middleware: signed in (requireSupabaseAuth) and an active admin/owner. Adds { userId, role } to context.
 *
 * Lives in src/lib, not src/server: a server fn file references this middleware on the client too, and
 * TanStack's import protection denies anything under **\/server/** there. The server-only import below is
 * used only inside .server(), which the compiler strips from the client bundle.
 */
export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const staff = await authorizeAdmin(context.userId);
    return next({ context: staff });
  });
