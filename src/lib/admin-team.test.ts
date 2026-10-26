import { describe, expect, it } from "vitest";
import { roleChangeError, setRoleSchema } from "@/lib/admin-team";

const owner = { userId: "owner-1", role: "owner" as const };
const admin = { userId: "admin-1", role: "admin" as const };

describe("roleChangeError", () => {
  it("refuses an actor who is not the owner", () => {
    expect(roleChangeError(admin, { userId: "u2", role: "requester" }, "admin", 1)).toBe("เฉพาะเจ้าของระบบที่จัดการทีมได้");
    expect(roleChangeError({ userId: "r", role: "requester" }, { userId: "u2", role: "admin" }, "requester", 1)).toBe(
      "เฉพาะเจ้าของระบบที่จัดการทีมได้",
    );
  });

  it("refuses changing your own role", () => {
    expect(roleChangeError(owner, { userId: "owner-1", role: "owner" }, "admin", 2)).toBe("เปลี่ยนบทบาทของตัวเองไม่ได้");
  });

  it("refuses leaving the system without an owner", () => {
    expect(roleChangeError(owner, { userId: "owner-2", role: "owner" }, "requester", 1)).toBe("ต้องมีเจ้าของระบบอย่างน้อย 1 คน");
  });

  it("refuses demoting another owner even when 2 owners exist", () => {
    expect(roleChangeError(owner, { userId: "owner-2", role: "owner" }, "admin", 2)).toBe("เปลี่ยนบทบาทเจ้าของระบบผ่าน Lovable เท่านั้น");
    expect(roleChangeError(owner, { userId: "owner-2", role: "owner" }, "requester", 2)).toBe("เปลี่ยนบทบาทเจ้าของระบบผ่าน Lovable เท่านั้น");
  });

  it("refuses making someone an owner", () => {
    expect(roleChangeError(owner, { userId: "u2", role: "admin" }, "owner", 1)).toBe("เพิ่มเจ้าของระบบผ่าน Lovable เท่านั้น");
  });

  it("lets the owner make a requester an admin", () => {
    expect(roleChangeError(owner, { userId: "u2", role: "requester" }, "admin", 1)).toBeNull();
  });

  it("lets the owner turn an admin back into a requester", () => {
    expect(roleChangeError(owner, { userId: "admin-1", role: "admin" }, "requester", 1)).toBeNull();
  });
});

describe("setRoleSchema", () => {
  it("trims and lowercases the email", () => {
    expect(setRoleSchema.parse({ email: "  Nid@Example.COM ", role: "admin" })).toEqual({ email: "nid@example.com", role: "admin" });
  });

  it("rejects owner, a bad email and an over-long email", () => {
    expect(setRoleSchema.safeParse({ email: "a@b.co", role: "owner" }).success).toBe(false);
    expect(setRoleSchema.safeParse({ email: "not-an-email", role: "admin" }).success).toBe(false);
    expect(setRoleSchema.safeParse({ email: `${"a".repeat(250)}@b.co`, role: "admin" }).success).toBe(false);
  });
});
