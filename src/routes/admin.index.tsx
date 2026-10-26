import { createFileRoute } from "@tanstack/react-router";
import { useAdminOverview } from "@/components/admin/AdminOverviewContext";
import { StatusPill, type StatusTone } from "@/components/kl/StatusPill";

export const Route = createFileRoute("/admin/")({
  component: AdminOverviewPage,
});

type Card = { label: string; value: number; unit: string; href: string; tone: StatusTone };

export function AdminOverviewPage() {
  const overview = useAdminOverview();
  if (!overview) return null;

  const cards: Card[] = [
    { label: "ข้อความใหม่", value: overview.newMessages, unit: "ข้อความ", href: "/admin/messages?status=new", tone: "new" },
    {
      label: "กำลังดำเนินการ",
      value: overview.inProgressMessages,
      unit: "ข้อความ",
      href: "/admin/messages?status=in_progress",
      tone: "progress",
    },
    { label: "สมาชิกทีม", value: overview.teamCount, unit: "คน", href: "/admin/team", tone: "muted" },
  ];

  return (
    <section aria-labelledby="admin-overview-heading">
      <h2 id="admin-overview-heading" className="mb-4 text-xl font-bold">
        ภาพรวม
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <a
              href={card.href}
              className="flex min-h-11 flex-col gap-3 rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-paper)] p-5 no-underline"
            >
              <StatusPill tone={card.tone}>{card.label}</StatusPill>
              <span className="text-[var(--kl-ink)]">
                <span className="text-4xl font-bold">{card.value}</span>{" "}
                <span className="text-base">{card.unit}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
