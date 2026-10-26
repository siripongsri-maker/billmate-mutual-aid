import { describe, expect, it } from "vitest";
import {
  STATUS_LABELS,
  TOPIC_LABELS,
  listMessagesSchema,
  messageStatusSchema,
  updateMessageSchema,
} from "@/lib/admin-messages";

const validId = "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b";

describe("updateMessageSchema", () => {
  it("accepts a valid update", () => {
    expect(updateMessageSchema.safeParse({ id: validId, status: "in_progress", teamNote: "โทรกลับแล้ว" }).success).toBe(true);
  });

  it("accepts a null note", () => {
    expect(updateMessageSchema.safeParse({ id: validId, status: "done", teamNote: null }).success).toBe(true);
  });

  it("rejects an unknown status", () => {
    expect(updateMessageSchema.safeParse({ id: validId, status: "archived", teamNote: null }).success).toBe(false);
  });

  it("rejects a note over 1000 characters but accepts exactly 1000", () => {
    expect(updateMessageSchema.safeParse({ id: validId, status: "new", teamNote: "ก".repeat(1001) }).success).toBe(false);
    expect(updateMessageSchema.safeParse({ id: validId, status: "new", teamNote: "ก".repeat(1000) }).success).toBe(true);
  });

  it("rejects an id that is not a uuid", () => {
    expect(updateMessageSchema.safeParse({ id: "123", status: "new", teamNote: null }).success).toBe(false);
  });
});

describe("listMessagesSchema", () => {
  it("accepts no filter, a status and an ISO cursor", () => {
    expect(listMessagesSchema.safeParse({}).success).toBe(true);
    expect(listMessagesSchema.safeParse({ status: "spam" }).success).toBe(true);
    expect(listMessagesSchema.safeParse({ before: "2026-10-26T12:00:00.000Z" }).success).toBe(true);
  });

  it("accepts a PostgREST timestamp with microseconds and a +00:00 offset, unchanged", () => {
    const before = "2026-10-26T05:30:00.123456+00:00";
    const parsed = listMessagesSchema.safeParse({ before });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.before).toBe(before);
  });

  it("rejects an unknown status or a cursor that is not an ISO datetime", () => {
    expect(listMessagesSchema.safeParse({ status: "archived" }).success).toBe(false);
    expect(listMessagesSchema.safeParse({ before: "yesterday" }).success).toBe(false);
  });
});

describe("labels", () => {
  it("has a Thai label for every status and topic", () => {
    expect(messageStatusSchema.options.map((s) => STATUS_LABELS[s])).toEqual(["ใหม่", "กำลังดูแล", "เสร็จแล้ว", "สแปม"]);
    expect(Object.keys(TOPIC_LABELS)).toEqual(["ask_help", "refer", "report", "paid", "question"]);
    expect(TOPIC_LABELS.paid).toBe("แจ้งว่าโอนแล้ว");
  });
});
