// Browser-safe types, schema and the role-change rule for admin team management (no server imports).
import { z } from "zod";
import type { Role } from "@/lib/admin-access";

export type TeamMember = {
  userId: string;
  email: string;
  displayName: string | null;
  role: "admin" | "owner";
};

export const setRoleSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.string().email().max(254)),
  role: z.enum(["admin", "requester"]),
});
export type SetRoleInput = z.infer<typeof setRoleSchema>;

export type SetRoleResult = { ok: true } | { ok: false; message: string };

export const OWNER_ONLY_MESSAGE = "เฉพาะเจ้าของระบบที่จัดการทีมได้";

export const OWNER_MANAGED_MESSAGE = "เปลี่ยนบทบาทเจ้าของระบบผ่าน Lovable เท่านั้น";

export const NOT_FOUND_MESSAGE = "ยังไม่มีบัญชีนี้ ให้เขาล็อกอินครั้งแรกก่อน";

export const ROLE_LABELS: Record<Role, string> = {
  requester: "ผู้ใช้ทั่วไป",
  admin: "แอดมิน",
  owner: "เจ้าของระบบ",
};

/**
 * Why this role change is not allowed, in Thai, or null when it is. The server calls this with the
 * actor's real role; the page only mirrors it for display.
 */
export function roleChangeError(
  actor: { userId: string; role: Role },
  target: { userId: string; role: Role },
  newRole: Role,
  ownerCount: number,
): string | null {
  if (actor.role !== "owner") return OWNER_ONLY_MESSAGE;
  if (actor.userId === target.userId) return "เปลี่ยนบทบาทของตัวเองไม่ได้";
  if (target.role === "owner" && newRole !== "owner" && ownerCount <= 1) return "ต้องมีเจ้าของระบบอย่างน้อย 1 คน";
  // Owners are managed in Lovable, never demoted from the app (even when another owner remains).
  if (target.role === "owner") return OWNER_MANAGED_MESSAGE;
  if (newRole === "owner") return "เพิ่มเจ้าของระบบผ่าน Lovable เท่านั้น";
  return null;
}
