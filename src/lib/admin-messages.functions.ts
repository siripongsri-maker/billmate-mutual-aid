import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-middleware";
import {
  MESSAGES_PAGE_SIZE,
  listMessagesSchema,
  messageStatusSchema,
  updateMessageSchema,
  type ContactMessage,
  type ListMessagesResult,
  type MessageCounts,
  type MessageStatus,
  type Topic,
} from "@/lib/admin-messages";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { logAction } from "@/server/admin-guard";
import type { Tables } from "@/integrations/supabase/types";

type Row = Tables<"contact_messages">;

function toStatus(value: string): MessageStatus {
  const parsed = messageStatusSchema.safeParse(value);
  return parsed.success ? parsed.data : "new";
}

function toMessage(row: Row): ContactMessage {
  return {
    id: row.id,
    createdAt: row.created_at,
    topic: row.topic as Topic,
    displayName: row.display_name,
    contact: row.contact,
    message: row.message,
    billId: row.bill_id,
    amount: row.amount === null ? null : Number(row.amount),
    status: toStatus(row.status),
    teamNote: row.team_note,
  };
}

async function countStatus(status: MessageStatus): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("status", status);
  if (error) throw new Error(`Could not count messages: ${error.message}`);
  return count ?? 0;
}

export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator(listMessagesSchema)
  .handler(async ({ data }): Promise<ListMessagesResult> => {
    let query = supabaseAdmin
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      // One extra row tells us whether an older page exists without a second query.
      .limit(MESSAGES_PAGE_SIZE + 1);
    if (data.status) query = query.eq("status", data.status);
    if (data.before) query = query.lt("created_at", data.before);

    const statuses = messageStatusSchema.options;
    const [{ data: rows, error }, ...totals] = await Promise.all([query, ...statuses.map(countStatus)]);
    if (error) throw new Error(`Could not load messages: ${error.message}`);

    const counts = Object.fromEntries(statuses.map((s, i) => [s, totals[i]])) as MessageCounts;
    const page = (rows ?? []).slice(0, MESSAGES_PAGE_SIZE).map(toMessage);
    return { items: page, counts, hasMore: (rows ?? []).length > MESSAGES_PAGE_SIZE };
  });

export const updateMessage = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(updateMessageSchema)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    const { data: current, error: loadError } = await supabaseAdmin
      .from("contact_messages")
      .select("status, team_note")
      .eq("id", data.id)
      .maybeSingle();
    if (loadError) throw new Error(`Could not load message: ${loadError.message}`);
    if (!current) throw new Error("Message not found");

    const newNote = data.teamNote === "" ? null : data.teamNote;
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .update({ status: data.status, team_note: newNote })
      .eq("id", data.id);
    if (error) throw new Error(`Could not update message: ${error.message}`);

    const noteChanged = (current.team_note ?? null) !== newNote;
    // A save that changed nothing is not worth an audit entry.
    if (current.status !== data.status || noteChanged) {
      await logAction(context.userId, "message.update", "contact_message", data.id, {
        from: current.status,
        to: data.status,
        noteChanged,
      });
    }
    return { ok: true };
  });
