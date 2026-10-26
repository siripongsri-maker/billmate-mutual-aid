import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { categories, fmt } from "@/lib/data";
import { Empty, getBill, PageHeader, Progress } from "@/components/ui-kit";

export const Route = createFileRoute("/impact")({
  head: () => ({ meta: [
    { title: "My footprint — billmate" },
    { name: "description", content: "Your simulated giving footprint and impact receipts." },
    { property: "og:title", content: "My footprint — billmate" },
    { property: "og:description", content: "See the impact of your simulated contributions." },
  ] }),
  component: Impact,
});

function Impact() {
  const s = useStore();
  const total = s.contributions.reduce((a, c) => a + c.amount, 0);
  const people = new Set(s.contributions.map((c) => c.billId)).size;
  const byCat = categories.map((c) => ({ c, v: s.contributions.filter((x) => getBill(x.billId)?.category === c.id).reduce((a, x) => a + x.amount, 0) })).filter((x) => x.v > 0);
  const level = total >= 1000 ? s.t("ต้นไม้ใหญ่ 🌳", "Big tree 🌳") : total >= 200 ? s.t("ต้นอ่อน 🌿", "Sapling 🌿") : s.t("เมล็ดพันธุ์ 🌱", "Seed 🌱");
  const next = total >= 1000 ? 1000 : total >= 200 ? 1000 : 200;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={s.t("รอยเท้าการให้", "My footprint")} />
      <div className="bg-hero rounded-3xl p-6 text-primary-foreground shadow-lift">
        <p className="text-sm opacity-85">{s.t("ระดับของคุณ", "Your level")}</p>
        <p className="font-display text-3xl font-semibold">{level}</p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div><p className="font-display text-2xl font-semibold">{fmt(total)}</p><p className="text-xs opacity-85">{s.t("แบ่งเบา", "shared")}</p></div>
          <div><p className="font-display text-2xl font-semibold">{people}</p><p className="text-xs opacity-85">{s.t("บิลที่ช่วย", "bills helped")}</p></div>
          <div><p className="font-display text-2xl font-semibold">{s.joined.length}</p><p className="text-xs opacity-85">{s.t("วงที่เข้าร่วม", "circles")}</p></div>
        </div>
        {total < 1000 && <><Progress value={(total / next) * 100} className="mt-5 bg-primary-foreground/20" /><p className="mt-1 text-xs opacity-85">{s.t(`อีก ${fmt(next - total)} สู่ระดับถัดไป`, `${fmt(next - total)} to next level`)}</p></>}
      </div>
      {byCat.length > 0 && (
        <section className="card mt-4 p-5">
          <h2 className="mb-3 font-semibold">{s.t("แยกตามหมวด", "By category")}</h2>
          {byCat.map(({ c, v }) => <div key={c.id} className="mb-3"><div className="flex justify-between text-sm"><span>{c.icon} {s.l(c.label)}</span><b>{fmt(v)}</b></div><Progress value={(v / total) * 100} className="mt-1" /></div>)}
        </section>
      )}
      <h2 className="mt-6 mb-3 font-semibold">{s.t("ใบรับผลกระทบ (จำลอง)", "Impact receipts (simulated)")}</h2>
      {s.contributions.length === 0 ? (
        <Empty icon="🌱" title={s.t("ยังไม่มีการให้", "No contributions yet")} sub={s.t("เริ่มต้นได้ตั้งแต่ ฿20", "Start from ฿20")} action={<Link to="/browse" className="press inline-block rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground">{s.t("ค้นหาบิล", "Browse bills")}</Link>} />
      ) : (
        <div className="space-y-2">
          {[...s.contributions].reverse().map((c) => { const b = getBill(c.billId); return (
            <Link key={c.id} to="/bills/$id" params={{ id: c.billId }} className="card lift flex items-center justify-between p-4 text-sm">
              <div><p className="font-semibold">{b ? s.l(b.title) : "—"}</p><p className="font-mono text-xs text-muted-foreground">{c.id} · {new Date(c.at).toLocaleDateString(s.lang === "th" ? "th-TH" : "en-GB")}</p></div>
              <b className="text-primary">{fmt(c.amount)}</b>
            </Link>); })}
        </div>
      )}
    </div>
  );
}
