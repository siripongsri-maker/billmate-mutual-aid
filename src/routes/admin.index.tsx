import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StatusPill, type StatusTone } from "@/components/kl/StatusPill";
import { STATUS_LABELS } from "@/lib/admin-messages";
import { getAdminOverview, type AdminOverview } from "@/lib/admin-overview.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

type Card = { label: string; value: number; unit: string; href: string; tone: StatusTone };

type State = { kind: "loading" } | { kind: "error" } | { kind: "ready"; data: AdminOverview };

export function AdminOverviewPage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ kind: "loading" });
    getAdminOverview().then(
      (data) => {
        if (active) setState({ kind: "ready", data });
      },
      () => {
        if (active) setState({ kind: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  if (state.kind === "loading") {
    return (
      <p className="py-8 text-center text-base text-[var(--kl-muted)]" role="status">
        กำลังโหลด…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto max-w-md space-y-4 py-8 text-center">
        <p role="alert" className="text-base font-medium text-[var(--kl-coral-ink)]">
          โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ
        </p>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--kl-green)] px-4 py-2 text-base font-semibold text-white"
          onClick={() => setAttempt((n) => n + 1)}
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  const overview = state.data;

  const cards: Card[] = [
    { label: "ข้อความใหม่", value: overview.newMessages, unit: "ข้อความ", href: "/admin/messages?status=new", tone: "new" },
    {
      label: STATUS_LABELS.in_progress,
      value: overview.inProgressMessages,
      unit: "ข้อความ",
      href: "/admin/messages?status=in_progress",
      tone: "progress",
    },
    { label: "สมาชิกทีม", value: overview.teamCount, unit: "คน", href: "/admin/team", tone: "muted" },
  ];

  return (
    <section aria-labelledby="admin-overview-heading" className="kl-overview">
      <h2 id="admin-overview-heading" className="kl-page-heading">
        ภาพรวม
      </h2>
      <ul className="kl-stats-grid">
        {cards.map((card) => (
          <li key={card.href}>
            <a
              href={card.href}
              className={`kl-stat-card kl-stat-card--${card.tone}`}
            >
              <div className="kl-stat-top"><StatusPill tone={card.tone}>{card.label}</StatusPill><ArrowUpRight size={20} aria-hidden="true" /></div>
              <span className="text-[var(--kl-ink)]">
                <span className="kl-stat-number">{card.value}</span>{" "}
                <span className="text-base">{card.unit}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
