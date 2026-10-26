import { describe, expect, it } from "vitest";
import { describeAction } from "@/lib/admin-log";

describe("describeAction", () => {
  it("describes a message status change with the Thai status labels", () => {
    expect(describeAction("message.update", { from: "new", to: "in_progress" })).toBe(
      "เปลี่ยนสถานะข้อความจาก ใหม่ เป็น กำลังดูแล",
    );
  });

  it("describes a role change with the email and the Thai role label", () => {
    expect(describeAction("team.set_role", { email: "mint@example.org", from: "requester", to: "admin" })).toBe(
      "ตั้งบทบาท mint@example.org เป็น แอดมิน",
    );
  });

  it("returns the action name for an action it does not know", () => {
    expect(describeAction("bill.archive", { id: "b1" })).toBe("bill.archive");
  });

  it("does not throw on missing or unknown detail values and falls back to the raw value", () => {
    expect(describeAction("message.update", { from: "archived", to: "done" })).toBe(
      "เปลี่ยนสถานะข้อความจาก archived เป็น เสร็จแล้ว",
    );
    expect(describeAction("message.update", {})).toBe("เปลี่ยนสถานะข้อความจาก ไม่ทราบ เป็น ไม่ทราบ");
    expect(describeAction("team.set_role", {})).toBe("ตั้งบทบาท ไม่ทราบอีเมล เป็น ไม่ทราบ");
    expect(describeAction("team.set_role", { email: "a@b.co", to: "superuser" })).toBe("ตั้งบทบาท a@b.co เป็น superuser");
    expect(describeAction("message.update", { from: 3, to: null })).toBe("เปลี่ยนสถานะข้อความจาก ไม่ทราบ เป็น ไม่ทราบ");
    // detail can come back as null/non-object from jsonb
    expect(describeAction("message.update", null as unknown as Record<string, unknown>)).toBe(
      "เปลี่ยนสถานะข้อความจาก ไม่ทราบ เป็น ไม่ทราบ",
    );
    // keys that exist on Object.prototype must not be mistaken for labels
    expect(describeAction("message.update", { from: "constructor", to: "toString" })).toBe(
      "เปลี่ยนสถานะข้อความจาก constructor เป็น toString",
    );
  });
});
