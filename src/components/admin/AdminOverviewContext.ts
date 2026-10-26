import { createContext, useContext } from "react";
import type { AdminOverview } from "@/lib/admin-overview.functions";

/** Filled by the /admin layout once the server has confirmed the caller is active staff. */
export const AdminOverviewContext = createContext<AdminOverview | null>(null);

export function useAdminOverview(): AdminOverview | null {
  return useContext(AdminOverviewContext);
}
