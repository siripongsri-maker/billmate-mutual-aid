import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useStore, type Role } from "@/lib/store";
import { Btn, PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Profile & privacy — billmate" },
    { name: "description", content: "Profile, settings and privacy controls (demo)." },
    { property: "og:title", content: "Profile & privacy — billmate" },
    { property: "og:description", content: "Manage demo settings and privacy on billmate." },
  ] }),
  component: Profile,
});

function Profile() {
  const s = useStore();
  const toggle = (k: keyof typeof s.privacy) => s.set((x) => ({ ...x, privacy: { ...x.privacy, [k]: !x.privacy[k] } }));
  const roles: { id: Role; th: string; en: string; d: string }[] = [
    { id: "helper", th: "ผู้ให้", en: "Helper", d: "🤝" },
    { id: "requester", th: "ผู้ขอ", en: "Requester", d: "🙋" },
    { id: "moderator", th: "ผู้ตรวจ", en: "Moderator", d: "🛡️" },
  ];
  const Row = ({ label, sub, k }: { label: string; sub: string; k: keyof typeof s.privacy }) => (
    <label className="flex cursor-pointer items-center justify-between gap-4 p-4">
      <span><span className="block font-medium">{label}</span><span className="text-sm text-muted-foreground">{sub}</span></span>
      <button role="switch" aria-checked={s.privacy[k]} onClick={() => toggle(k)} className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", s.privacy[k] ? "bg-primary" : "bg-input")}>
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-card transition-all", s.privacy[k] ? "left-6" : "left-1")} />
      </button>
    </label>
  );
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={s.t("โปรไฟล์", "Profile")} />
      <div className="card flex items-center gap-4 p-5">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-coral-soft text-3xl">🐘</div>
        <div><p className="font-display text-xl font-semibold">{s.t("ช้างน้อยใจดี", "Kind Little Elephant")}</p><p className="text-sm text-muted-foreground">{s.t("นามแฝงเดโม · ไม่มีข้อมูลจริง", "Demo alias · no real data")}</p></div>
      </div>

      <h2 className="mt-6 mb-2 font-semibold">{s.t("บทบาทเดโม", "Demo role")}</h2>
      <div className="grid grid-cols-3 gap-2">
        {roles.map((r) => <button key={r.id} onClick={() => s.set((x) => ({ ...x, role: r.id }))} aria-pressed={s.role === r.id} className={cn("press rounded-2xl border-2 p-3 text-center font-semibold", s.role === r.id ? "border-primary bg-primary-soft" : "bg-card")}><span className="block text-2xl">{r.d}</span>{s.t(r.th, r.en)}</button>)}
      </div>

      <h2 className="mt-6 mb-2 font-semibold">{s.t("ความเป็นส่วนตัว", "Privacy")}</h2>
      <div className="card divide-y">
        <Row k="anon" label={s.t("ให้แบบไม่ระบุชื่อเป็นค่าเริ่มต้น", "Give anonymously by default")} sub={s.t("ผู้รับจะไม่เห็นนามแฝงของคุณ", "Recipients won't see your alias")} />
        <Row k="hideRegion" label={s.t("ซ่อนภูมิภาคในคำขอ", "Hide region on my requests")} sub={s.t("แสดงเพียง “ประเทศไทย”", "Show only “Thailand”")} />
        <Row k="showGivers" label={s.t("แสดงจำนวนผู้ให้", "Show giver count")} sub={s.t("บนบิลของฉัน", "On my bills")} />
      </div>

      <h2 className="mt-6 mb-2 font-semibold">{s.t("การตั้งค่า", "Settings")}</h2>
      <div className="card divide-y">
        <button onClick={() => s.set((x) => ({ ...x, lang: x.lang === "th" ? "en" : "th" }))} className="flex w-full items-center justify-between p-4"><span>{s.t("ภาษา", "Language")}</span><span className="font-semibold text-primary">{s.lang === "th" ? "ไทย" : "English"}</span></button>
        {([["/requests", s.t("คำขอของฉัน", "My requests")], ["/impact", s.t("รอยเท้าการให้", "My footprint")], ["/how-it-works", s.t("ความปลอดภัยและวิธีการทำงาน", "Trust & how it works")], ["/corporate", s.t("องค์กรสมทบ", "Corporate matching")], ["/moderator", s.t("แดชบอร์ดผู้ตรวจ", "Moderator dashboard")]] as const).map(([to, l]) => (
          <Link key={to} to={to} className="flex items-center justify-between p-4 hover:bg-muted"><span>{l}</span><ChevronRight className="h-4 w-4" /></Link>
        ))}
      </div>
      <Btn variant="outline" full className="mt-6" onClick={() => { s.reset(); toast.success(s.t("รีเซ็ตข้อมูลเดโมแล้ว", "Demo data reset")); }}>{s.t("รีเซ็ตข้อมูลเดโม", "Reset demo data")}</Btn>
      <Btn variant="ghost" full className="mt-2" onClick={() => s.set((x) => ({ ...x, onboarded: false }))}>{s.t("ดูหน้าแนะนำอีกครั้ง", "Replay onboarding")}</Btn>
    </div>
  );
}
