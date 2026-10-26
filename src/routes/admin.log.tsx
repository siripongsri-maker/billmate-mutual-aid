import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { describeAction, type AuditItem } from "@/lib/admin-log";
import { listAudit } from "@/lib/admin-log.functions";

export const Route = createFileRoute("/admin/log")({
  component: AuditLog,
});

const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--kl-green)] px-4 py-2 text-base font-semibold text-white disabled:opacity-60";
const errorClass = "text-base font-medium text-[var(--kl-coral-ink)]";

/** Always shown in Thai Bangkok time, whatever the viewer's device clock says. */
function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" });
}

type Phase = "loading" | "error" | "ready";

export function AuditLog() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [items, setItems] = useState<AuditItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Bumped on every fresh load so a slow "ดูเพิ่ม" from before a reload cannot append to the new list.
  const generation = useRef(0);

  useEffect(() => {
    const mine = ++generation.current;
    setPhase("loading");
    setMoreFailed(false);
    setLoadingMore(false);
    listAudit({ data: {} }).then(
      (res) => {
        if (generation.current !== mine) return;
        setItems(res.items);
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
  }, [attempt]);

  const loadMore = useCallback(async () => {
    const last = items[items.length - 1];
    if (!last) return;
    const mine = generation.current;
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const res = await listAudit({ data: { before: last.id } });
      if (generation.current !== mine) return;
      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
    } catch {
      if (generation.current === mine) setMoreFailed(true);
    } finally {
      if (generation.current === mine) setLoadingMore(false);
    }
  }, [items]);

  return (
    <section aria-labelledby="admin-log-heading" className="min-w-0">
      <h2 id="admin-log-heading" className="mb-1 text-xl font-bold">
        บันทึกการทำงาน
      </h2>
      <p className="mb-5 text-base text-[var(--kl-muted)]">ดูว่าใครทำอะไรเมื่อไหร่ เรียงจากล่าสุดก่อน แก้ไขหรือลบไม่ได้นะ</p>

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
        <p className="py-8 text-center text-base text-[var(--kl-muted)]">ยังไม่มีบันทึกการทำงานนะ</p>
      ) : null}

      {phase === "ready" && items.length > 0 ? (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="min-w-0">
                <LogCard item={item} />
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

function LogCard({ item }: { item: AuditItem }) {
  const target = [item.targetType, item.targetId].filter((v): v is string => Boolean(v)).join(" · ");
  return (
    <article className="min-w-0 break-words rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-paper)] p-4">
      <p className="mb-1 break-words text-base font-semibold">{describeAction(item.action, item.detail)}</p>
      <p className="text-base">
        <span className="text-[var(--kl-muted)]">โดย </span>
        <span className="break-words">{item.actorName}</span>
      </p>
      <time dateTime={item.at} className="block text-base text-[var(--kl-muted)]">
        {formatTime(item.at)}
      </time>
      {target ? <p className="mt-1 break-all text-base text-[var(--kl-muted)]">{target}</p> : null}
    </article>
  );
}
