// Browser-safe types, schemas and labels for the admin contact-message inbox (no server imports).
import { z } from "zod";

export const messageStatusSchema = z.enum(["new", "in_progress", "done", "spam"]);
export type MessageStatus = z.infer<typeof messageStatusSchema>;

export type Topic = "ask_help" | "refer" | "report" | "paid" | "question";

export type ContactMessage = {
  id: string;
  createdAt: string;
  topic: Topic;
  displayName: string | null;
  contact: string | null;
  message: string;
  billId: string | null;
  amount: number | null;
  status: MessageStatus;
  teamNote: string | null;
};

export const STATUS_LABELS: Record<MessageStatus, string> = {
  new: "ใหม่",
  in_progress: "กำลังดูแล",
  done: "เสร็จแล้ว",
  spam: "สแปม",
};

/** Same wording as the public contact form (public/konlanid/app.js). */
export const TOPIC_LABELS: Record<Topic, string> = {
  ask_help: "ขอความช่วยเหลือเรื่องบิล",
  refer: "แนะนำคนที่ต้องการความช่วยเหลือ",
  report: "แจ้งเรื่องผิดปกติ",
  paid: "แจ้งว่าโอนแล้ว",
  question: "สอบถามเรื่องอื่น ๆ",
};

export const MESSAGES_PAGE_SIZE = 30;

export const NOTE_MAX_LENGTH = 1000;

export const updateMessageSchema = z.object({
  id: z.string().uuid(),
  status: messageStatusSchema,
  teamNote: z.string().max(NOTE_MAX_LENGTH).nullable(),
});
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;

export const listMessagesSchema = z.object({
  status: messageStatusSchema.optional(),
  /**
   * created_at of the last message already shown, passed back exactly as PostgREST returned it
   * (e.g. 2026-10-26T05:30:00.123456+00:00, with microseconds and an offset); returns older ones.
   */
  before: z.string().datetime({ offset: true }).optional(),
});
export type ListMessagesInput = z.infer<typeof listMessagesSchema>;

export type MessageCounts = Record<MessageStatus, number>;

export type ListMessagesResult = {
  items: ContactMessage[];
  counts: MessageCounts;
  /** True when at least one older message exists beyond this page. */
  hasMore: boolean;
};
