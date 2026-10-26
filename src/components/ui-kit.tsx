import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, ShieldAlert } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { bills, categories, fmt, type Bill } from "@/lib/data";
import { useStore } from "@/lib/store";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "coral" | "ghost" | "outline"; full?: boolean };
export function Btn({ variant = "primary", full, className, ...p }: BtnProps) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    coral: "bg-coral text-coral-foreground hover:opacity-90",
    ghost: "text-primary hover:bg-primary-soft",
    outline: "border-2 border-primary text-primary hover:bg-primary-soft",
  }[variant];
  return <button {...p} className={cn("press inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold disabled:opacity-40 disabled:pointer-events-none", v, full && "w-full", className)} />;
}

export function PageHeader({ title, back, right }: { title: string; back?: boolean; right?: ReactNode }) {
  const router = useRouter();
  const { t } = useStore();
  return (
    <div className="mb-5 flex items-center gap-3">
      {back && (
        <button aria-label={t("ย้อนกลับ", "Back")} onClick={() => router.history.back()} className="press grid h-10 w-10 place-items-center rounded-full bg-card border">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="font-display text-2xl font-semibold md:text-3xl flex-1">{title}</h1>
      {right}
    </div>
  );
}

export function DemoBadge({ verified }: { verified: boolean }) {
  const { t } = useStore();
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground">
      <ShieldCheck className="h-3.5 w-3.5" /> {t("ตรวจแล้ว · เดโม", "Reviewed · DEMO")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
      <ShieldAlert className="h-3.5 w-3.5" /> {t("รอตรวจสอบ · เดโม", "Pending · DEMO")}
    </span>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function useRaised(b: Bill) {
  const { extraRaised } = useStore();
  return Math.min(b.goal, b.raised + (extraRaised[b.id] ?? 0));
}

export function BillCard({ b }: { b: Bill }) {
  const { l, t } = useStore();
  const raised = useRaised(b);
  const cat = categories.find((c) => c.id === b.category)!;
  const pct = (raised / b.goal) * 100;
  return (
    <Link to="/bills/$id" params={{ id: b.id }} className="card lift block p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coral-soft text-2xl" aria-hidden>{cat.icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <DemoBadge verified={b.verified} />
            {b.urgent && pct < 100 && <span className="rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-coral-foreground">{t("ด่วน", "Urgent")}</span>}
          </div>
          <h3 className="font-semibold leading-snug">{l(b.title)}</h3>
          <p className="text-sm text-muted-foreground">{b.name} · {l(b.region)}</p>
        </div>
      </div>
      <Progress value={pct} className="mt-4" />
      <div className="mt-2 flex justify-between text-sm">
        <span><b>{fmt(raised)}</b> <span className="text-muted-foreground">/ {fmt(b.goal)}</span></span>
        <span className="text-muted-foreground">{pct >= 100 ? t("ครบแล้ว 🎉", "Funded 🎉") : t(`อีก ${b.dueDays} วัน`, `${b.dueDays} days left`)}</span>
      </div>
    </Link>
  );
}

export function Empty({ icon, title, sub, action }: { icon: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="card p-8 text-center">
      <div className="text-4xl mb-2" aria-hidden>{icon}</div>
      <p className="font-semibold">{title}</p>
      {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export const getBill = (id: string) => bills.find((b) => b.id === id);
