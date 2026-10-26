import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StatusPill, type StatusTone } from "@/components/kl/StatusPill";
import {
  NOTE_MAX_LENGTH,
  STATUS_LABELS,
  TOPIC_LABELS,
  messageStatusSchema,
  type ContactMessage,
  type MessageCounts,
  type MessageStatus,
} from "@/lib/admin-messages";
import { listMessages, updateMessage } from "@/lib/admin-messages.functions";

export const Route = createFileRoute("/admin/messages")({
  validateSearch: (search: Record<string, unknown>): { status?: MessageStatus | undefined } => {
    const parsed = messageStatusSchema.safeParse(search["status"]);
    return parsed.success ? { status: parsed.data } : {};
  },
  component: AdminMessagesRoute,
});

function AdminMessagesRoute() {
  const { status } = Route.useSearch();
  const navigate = useNavigate();
  return (
    <MessagesInbox
      status={status}
      onStatusChange={(next) => navigate({ to: "/admin/messages", search: next ? { status: next } : {} })}
    />
  );
}

const STATUS_TONES: Record<MessageStatus, StatusTone> = {
  new: "new",
  in_progress: "progress",
  done: "done",
  spam: "muted",
};

const EMPTY_COUNTS: MessageCounts = { new: 0, in_progress: 0, done: 0, spam: 0 };

const fieldClass =
  "block w-full min-h-11 rounded-lg border border-[var(--kl-muted)] bg-white px-3 py-2 text-base text-[var(--kl-ink)]";
const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--kl-green)] px-4 py-2 text-base font-semibold text-white disabled:opacity-60";
const errorClass = "text-base font-medium text-[var(--kl-coral-ink)]";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

type Phase = "loading" | "error" | "ready";

export function MessagesInbox({
  status,
  onStatusChange,
}: {
  status?: MessageStatus | undefined;
  onStatusChange: (status: MessageStatus | undefined) => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [counts, setCounts] = useState<MessageCounts>(EMPTY_COUNTS);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Bumped on every fresh load so a slow "ดูเพิ่ม" from a previous filter cannot append to the new list.
  const generation = useRef(0);

  useEffect(() => {
    const mine = ++generation.current;
    setPhase("loading");
    setMoreFailed(false);
    listMessages({ data: status ? { status } : {} }).then(
      (res) => {
        if (generation.current !== mine) return;
        setItems(res.items);
        setCounts(res.counts);
        setHasMore(res.hasMore);
        setPhase("ready");
      },
      () => {
        if (generation.current === mine) setPhase("error");
      },
    );
    return () => {
      generation.current += 1;
    };
  }, [status, attempt]);

  const loadMore = useCallback(async () => {
    const last = items[items.length - 1];
    if (!last) return;
    const mine = generation.current;
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const res = await listMessages({ data: status ? { status, before: last.createdAt } : { before: last.createdAt } });
      if (generation.current !== mine) return;
      setItems((prev) => [...prev, ...res.items]);
      setCounts(res.counts);
      setHasMore(res.hasMore);
    } catch {
      if (generation.current === mine) setMoreFailed(true);
    } finally {
      if (generation.current === mine) setLoadingMore(false);
    }
  }, [items, status]);

  const handleSaved = useCallback((id: string, from: MessageStatus, to: MessageStatus, teamNote: string | null) => {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, status: to, teamNote } : m)));
    if (from !== to) setCounts((c) => ({ ...c, [from]: Math.max(0, c[from] - 1), [to]: c[to] + 1 }));
  }, []);

  const total = counts.new + counts.in_progress + counts.done + counts.spam;
  const chips: { key: string; value: MessageStatus | undefined; label: string; count: number }[] = [
    { key: "all", value: undefined, label: "ทั้งหมด", count: total },
    ...messageStatusSchema.options.map((s) => ({ key: s, value: s, label: STATUS_LABELS[s], count: counts[s] })),
  ];

  return (
    <section aria-labelledby="admin-messages-heading" className="min-w-0">
      <h2 id="admin-messages-heading" className="mb-4 text-xl font-bold">
        ข้อความจากฟอร์มติดต่อ
      </h2>

      <div role="group" aria-label="กรองตามสถานะ" className="mb-5 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const pressed = chip.value === status;
          return (
            <button
              key={chip.key}
              type="button"
              aria-pressed={pressed}
              onClick={() => onStatusChange(chip.value)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-base font-semibold ${
                pressed
                  ? "border-[var(--kl-green)] bg-[var(--kl-green)] text-white"
                  : "border-[var(--kl-border)] bg-[var(--kl-paper)] text-[var(--kl-ink)]"
              }`}
            >
              {chip.label} <span>{chip.count}</span>
            </button>
          );
        })}
      </div>

      {phase === "loading" ? (
        <p className="py-8 text-center text-base text-[var(--kl-muted)]" role="status">
          กำลังโหลด…
        </p>
      ) : null}

      {phase === "error" ? (
        <div className="mx-auto max-w-md space-y-4 py-8 text-center">
          <p role="alert" className={errorClass}>
            โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ
          </p>
          <button type="button" className={primaryBtn} onClick={() => setAttempt((n) => n + 1)}>
            ลองอีกครั้ง
          </button>
        </div>
      ) : null}

      {phase === "ready" && items.length === 0 ? (
        <p className="py-8 text-center text-base text-[var(--kl-muted)]">ยังไม่มีข้อความในหมวดนี้นะ</p>
      ) : null}

      {phase === "ready" && items.length > 0 ? (
        <>
          <ul className="space-y-4">
            {items.map((m) => (
              <li key={m.id} className="min-w-0">
                <MessageCard message={m} onSaved={handleSaved} />
              </li>
            ))}
          </ul>
          {moreFailed ? (
            <p role="alert" className={`${errorClass} mt-4 text-center`}>
              โหลดเพิ่มไม่สำเร็จ ลองอีกครั้งนะ
            </p>
          ) : null}
          {hasMore ? (
            <div className="mt-5 text-center">
              <button type="button" className={primaryBtn} disabled={loadingMore} onClick={loadMore}>
                {loadingMore ? "กำลังโหลด…" : "ดูเพิ่ม"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function MessageCard({
  message: m,
  onSaved,
}: {
  message: ContactMessage;
  onSaved: (id: string, from: MessageStatus, to: MessageStatus, teamNote: string | null) => void;
}) {
  const [draftStatus, setDraftStatus] = useState<MessageStatus>(m.status);
  const [note, setNote] = useState(m.teamNote ?? "");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"saved" | "error" | null>(null);

  async function save() {
    const teamNote = note === "" ? null : note;
    setSaving(true);
    setResult(null);
    try {
      await updateMessage({ data: { id: m.id, status: draftStatus, teamNote } });
      onSaved(m.id, m.status, draftStatus, teamNote);
      setResult("saved");
    } catch {
      // Keep what was typed so nothing has to be written again.
      setResult("error");
    } finally {
      setSaving(false);
    }
  }

  const statusId = `status-${m.id}`;
  const noteId = `note-${m.id}`;

  return (
    <article className="min-w-0 break-words rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-paper)] p-4 sm:p-5">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="break-words">{TOPIC_LABELS[m.topic] ?? m.topic}</h3>
          <time dateTime={m.createdAt} className="text-base text-[var(--kl-muted)]">
            {formatTime(m.createdAt)}
          </time>
        </div>
        <StatusPill tone={STATUS_TONES[m.status]}>{STATUS_LABELS[m.status]}</StatusPill>
      </header>

      <dl className="mb-3 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-base">
        <dt className="text-[var(--kl-muted)]">ชื่อเรียก</dt>
        <dd className="m-0 break-words">{m.displayName ?? "ไม่ได้ระบุชื่อเรียก"}</dd>
        <dt className="text-[var(--kl-muted)]">ช่องทางติดต่อ</dt>
        <dd className="m-0 break-words">{m.contact ? m.contact : "ไม่ได้ให้ช่องทางติดต่อ"}</dd>
        {m.billId ? (
          <>
            <dt className="text-[var(--kl-muted)]">รหัสบิล</dt>
            <dd className="m-0 break-words">{m.billId}</dd>
          </>
        ) : null}
        {m.amount !== null ? (
          <>
            <dt className="text-[var(--kl-muted)]">ยอด</dt>
            <dd className="m-0">{`฿${m.amount.toLocaleString("th-TH")}`}</dd>
          </>
        ) : null}
      </dl>

      <p className="mb-4 whitespace-pre-wrap break-words rounded-lg bg-[var(--kl-warm)] p-3 text-base">{m.message}</p>

      <div className="space-y-3">
        <div>
          <label htmlFor={statusId} className="mb-1 block text-base font-semibold">
            สถานะ
          </label>
          <select
            id={statusId}
            className={fieldClass}
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as MessageStatus)}
          >
            {messageStatusSchema.options.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={noteId} className="mb-1 block text-base font-semibold">
            โน้ตทีม
          </label>
          <textarea
            id={noteId}
            className={`${fieldClass} min-h-24`}
            rows={3}
            maxLength={NOTE_MAX_LENGTH}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={primaryBtn} disabled={saving} onClick={save}>
            {saving ? "กำลังบันทึก…" : "บันทึก"}
          </button>
          {result === "saved" ? (
            <p role="status" className="text-base font-medium text-[var(--kl-deep)]">
              บันทึกแล้ว
            </p>
          ) : null}
          {result === "error" ? (
            <p role="alert" className={errorClass}>
              บันทึกไม่สำเร็จ ลองอีกครั้งนะ
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
