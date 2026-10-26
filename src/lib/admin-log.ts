// Browser-safe types, schema and the Thai wording for the read-only admin audit log (no server imports).
import { z } from "zod";
import { STATUS_LABELS } from "@/lib/admin-messages";
import { ROLE_LABELS } from "@/lib/admin-team";

export const AUDIT_PAGE_SIZE = 50;

export const UNKNOWN_ACTOR = "ไม่ทราบชื่อ";

const UNKNOWN_VALUE = "ไม่ทราบ";
const UNKNOWN_EMAIL = "ไม่ทราบอีเมล";

/** JSON as stored in audit_log.detail; spelled out so the server-function result stays serializable. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type AuditItem = {
  id: number;
  /** created_at as PostgREST returned it. */
  at: string;
  actorName: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  detail: Record<string, JsonValue>;
};

export const listAuditSchema = z.object({
  /** id of the last entry already shown; returns older ones. */
  before: z.number().int().positive().optional(),
});
export type ListAuditInput = z.infer<typeof listAuditSchema>;

export type ListAuditResult = {
  items: AuditItem[];
  /** True when at least one older entry exists beyond this page. */
  hasMore: boolean;
};

/** Own-property lookup so values such as "constructor" are never mistaken for a label. */
function labelOf(labels: Record<string, string>, value: unknown): string {
  if (typeof value !== "string" || value === "") return UNKNOWN_VALUE;
  return Object.prototype.hasOwnProperty.call(labels, value) ? (labels[value] as string) : value;
}

/**
 * One Thai sentence for an audit entry. detail is jsonb written by older and newer code, so every field
 * is optional here: a missing or unfamiliar value falls back to the raw value, and an unknown action to its name.
 */
export function describeAction(action: string, detail: Record<string, unknown>): string {
  const d: Record<string, unknown> = detail !== null && typeof detail === "object" ? detail : {};
  switch (action) {
    case "message.update":
      return `เปลี่ยนสถานะข้อความจาก ${labelOf(STATUS_LABELS, d["from"])} เป็น ${labelOf(STATUS_LABELS, d["to"])}`;
    case "team.set_role": {
      const email = typeof d["email"] === "string" && d["email"] !== "" ? d["email"] : UNKNOWN_EMAIL;
      return `ตั้งบทบาท ${email} เป็น ${labelOf(ROLE_LABELS, d["to"])}`;
    }
    default:
      return action;
  }
}
