import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { fmt } from "@/lib/data";
import { Btn, PageHeader, Progress } from "@/components/ui-kit";

export const Route = createFileRoute("/corporate")({
  head: () => ({ meta: [
    { title: "Corporate matching — chuaykan" },
    { name: "description", content: "How companies could match employee giving on chuaykan (demo)." },
    { property: "og:title", content: "Corporate matching — chuaykan" },
    { property: "og:description", content: "Fictional corporate matching partners, demo only." },
  ] }),
  component: Corporate,
});

const partners = [
  { name: "Saeng Coffee Co. (fictional)", ratio: "1:1", cap: 50000, used: 31200, emoji: "☕" },
  { name: "Mekong Logistics (fictional)", ratio: "2:1", cap: 120000, used: 48000, emoji: "🚚" },
  { name: "Lotus Tech Studio (fictional)", ratio: "1:1", cap: 30000, used: 27600, emoji: "💻" },
];

function Corporate() {
  const s = useStore();
  const [amt, setAmt] = useState(100);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back title={s.t("องค์กรสมทบ", "Corporate matching")} />
      <div className="bg-hero rounded-3xl p-6 text-primary-foreground shadow-lift">
        <h2 className="font-display text-2xl font-semibold">{s.t("ทุกบาทของพนักงาน ทวีคูณได้", "Multiply every employee baht")}</h2>
        <p className="mt-2 opacity-90">{s.t("องค์กรสมทบการให้ของพนักงานเข้าสู่บิลที่ตรวจแล้ว", "Companies match employee gifts to reviewed bills.")}</p>
        <div className="mt-5 rounded-2xl bg-primary-foreground/15 p-4">
          <label className="text-sm">{s.t("ถ้าคุณให้", "If you give")}: <b>{fmt(amt)}</b>
            <input type="range" min={20} max={1000} step={10} value={amt} onChange={(e) => setAmt(Number(e.target.value))} className="mt-2 w-full accent-coral" />
          </label>
          <p className="mt-2">{s.t("สมทบ 2:1 รวมเป็น", "With 2:1 match, total")} <span className="font-display text-2xl font-semibold">{fmt(amt * 3)}</span></p>
        </div>
      </div>
      <h2 className="mt-6 mb-3 font-semibold">{s.t("พาร์ทเนอร์ตัวอย่าง", "Sample partners")}</h2>
      <div className="space-y-3">
        {partners.map((p) => (
          <div key={p.name} className="card p-4">
            <div className="flex items-center gap-3"><span className="text-2xl">{p.emoji}</span><p className="flex-1 font-semibold">{p.name}</p><span className="rounded-full bg-coral-soft px-2.5 py-1 text-xs font-bold">{p.ratio}</span></div>
            <Progress value={(p.used / p.cap) * 100} className="mt-3" />
            <p className="mt-1 text-xs text-muted-foreground">{fmt(p.used)} / {fmt(p.cap)} {s.t("งบสมทบ (สมมติ)", "match budget (fictional)")}</p>
          </div>
        ))}
      </div>
      <form className="card mt-6 space-y-3 p-5" onSubmit={(e) => { e.preventDefault(); if (!company || !emailOk) return; toast.success(s.t("ได้รับความสนใจแล้ว (เดโม — ไม่มีการส่งข้อมูล)", "Interest noted (demo — nothing was sent)")); setCompany(""); setEmail(""); }}>
        <h2 className="font-semibold">{s.t("สนใจเป็นพาร์ทเนอร์?", "Interested in partnering?")}</h2>
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder={s.t("ชื่อองค์กร", "Company name")} className="w-full rounded-2xl border bg-card px-4 py-3" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={s.t("อีเมลงาน", "Work email")} className="w-full rounded-2xl border bg-card px-4 py-3" />
        {email && !emailOk && <p className="text-sm font-semibold text-destructive">{s.t("อีเมลไม่ถูกต้อง", "Invalid email")}</p>}
        <Btn full disabled={!company || !emailOk}>{s.t("ส่งความสนใจ (เดโม)", "Send interest (demo)")}</Btn>
      </form>
    </div>
  );
}
