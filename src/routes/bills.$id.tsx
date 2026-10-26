import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Flag, Share2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { categories, fmt } from "@/lib/data";
import { DemoBadge, getBill, PageHeader, Progress, useRaised } from "@/components/ui-kit";

export const Route = createFileRoute("/bills/$id")({
  loader: ({ params }) => { const b = getBill(params.id); if (!b) throw notFound(); return { title: b.title.en }; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Bill"} — chuaykan` },
    { name: "description", content: "Bill details, progress and story (demo)." },
    { property: "og:title", content: `${loaderData?.title ?? "Bill"} — chuaykan` },
    { property: "og:description", content: "Help share this fictional demo bill." },
  ] }),
  notFoundComponent: () => <div className="card p-8 text-center">ไม่พบบิลนี้ · Bill not found. <Link to="/browse" className="text-primary font-semibold">Browse</Link></div>,
  component: BillDetail,
});

function BillDetail() {
  const { id } = Route.useParams();
  const s = useStore();
  const b = getBill(id)!;
  const raised = useRaised(b);
  const pct = (raised / b.goal) * 100;
  const cat = categories.find((c) => c.id === b.category)!;
  const mine = s.contributions.filter((c) => c.billId === b.id).reduce((a, c) => a + c.amount, 0);
  const done = pct >= 100;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back title={s.t("รายละเอียดบิล", "Bill detail")} right={
        <button aria-label="Share" onClick={() => toast(s.t("คัดลอกลิงก์เดโมแล้ว", "Demo link copied"))} className="press grid h-10 w-10 place-items-center rounded-full border bg-card"><Share2 className="h-4 w-4" /></button>
      } />
      <div className="card p-5 md:p-7">
        <div className="flex items-center gap-2"><span className="text-3xl" aria-hidden>{cat.icon}</span><span className="text-sm font-semibold text-muted-foreground">{s.l(cat.label)}</span><span className="ml-auto"><DemoBadge verified={b.verified} /></span></div>
        <h1 className="font-display mt-3 text-2xl font-semibold md:text-3xl">{s.l(b.title)}</h1>
        <p className="mt-1 text-muted-foreground">{b.name} · {s.l(b.region)}</p>
        <div className="mt-5 flex items-end justify-between">
          <p><span className="font-display text-3xl font-semibold text-primary">{fmt(raised)}</span> <span className="text-muted-foreground">/ {fmt(b.goal)}</span></p>
          <p className="font-semibold">{Math.round(pct)}%</p>
        </div>
        <Progress value={pct} className="mt-2 h-3" />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-muted p-2"><b>{b.givers + s.contributions.filter((c) => c.billId === b.id).length}</b><br /><span className="text-muted-foreground">{s.t("ผู้ให้", "givers")}</span></div>
          <div className="rounded-xl bg-muted p-2"><b>{b.dueDays}</b><br /><span className="text-muted-foreground">{s.t("วันที่เหลือ", "days left")}</span></div>
          <div className="rounded-xl bg-muted p-2"><b>{fmt(Math.max(0, b.goal - raised))}</b><br /><span className="text-muted-foreground">{s.t("ยังขาด", "remaining")}</span></div>
        </div>
        {mine > 0 && <p className="mt-4 rounded-xl bg-primary-soft p-3 text-sm font-semibold text-accent-foreground">💚 {s.t(`คุณร่วมแบ่งเบาแล้ว ${fmt(mine)} (เดโม)`, `You've shared ${fmt(mine)} (demo)`)}</p>}
      </div>

      <section className="card mt-4 p-5">
        <h2 className="font-semibold">{s.t("เรื่องราว", "Their story")}</h2>
        <p className="mt-2 leading-relaxed">“{s.l(b.story)}”</p>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{s.t(`ผู้รับเงิน: ${b.biller.th} — ในบริการจริงเงินจะโอนตรงถึงผู้ให้บริการ ไม่แสดงเลขบัญชีหรือที่อยู่ส่วนตัว`, `Payee: ${b.biller.en} — in a real service funds would go directly to the biller. No account numbers or addresses are shown.`)}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{s.t("ป้าย “ตรวจแล้ว” เป็นตัวอย่างเดโม การตรวจเอกสารไม่ได้รับรองความถูกต้อง 100%", "“Reviewed” badges are demo samples. Document review does not guarantee authenticity.")}</p>
      </section>

      {b.updates.length > 0 && (
        <section className="card mt-4 p-5">
          <h2 className="font-semibold">{s.t("อัปเดต", "Updates")}</h2>
          {b.updates.map((u, i) => <p key={i} className="mt-2 text-sm"><span className="text-muted-foreground">{s.t(`${u.day} วันก่อน`, `${u.day}d ago`)} · </span>{s.l(u.text)}</p>)}
        </section>
      )}

      <button onClick={() => { s.set((x) => ({ ...x, disputes: [...x.disputes, { id: "d" + Date.now(), billId: b.id, resolved: false, reason: { th: "ผู้ใช้รายงานบิลนี้ (เดโม)", en: "User reported this bill (demo)" } }] })); toast.success(s.t("ส่งรายงานถึงผู้ตรวจสอบแล้ว", "Report sent to moderators")); }} className="mt-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive">
        <Flag className="h-4 w-4" /> {s.t("รายงานบิลนี้", "Report this bill")}
      </button>

      <div className="sticky bottom-20 mt-6 md:bottom-4">
        {done ? (
          <div className="card p-4 text-center font-semibold">🎉 {s.t("บิลนี้ครบเป้าแล้ว ขอบคุณ!", "This bill is fully funded. Thank you!")} <Link to="/browse" className="text-primary">{s.t("ดูบิลอื่น", "See others")}</Link></div>
        ) : (
          <Link to="/bills/$id/contribute" params={{ id: b.id }} className="press block rounded-full bg-coral py-4 text-center text-lg font-semibold text-coral-foreground shadow-lift">
            {s.t("ร่วมแบ่งเบา (จำลอง)", "Chip in (simulated)")}
          </Link>
        )}
      </div>
    </div>
  );
}
