import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X, Flag } from "lucide-react";
import { useStore } from "@/lib/store";
import { categories, fmt } from "@/lib/data";
import { Btn, Empty, getBill, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/moderator")({
  head: () => ({ meta: [
    { title: "Moderator dashboard — billmate" },
    { name: "description", content: "Demo verification queue, dispute flags and metrics." },
    { property: "og:title", content: "Moderator dashboard — billmate" },
    { property: "og:description", content: "Review pending requests in the billmate demo." },
  ] }),
  component: Moderator,
});

function Moderator() {
  const s = useStore();
  if (s.role !== "moderator") return (
    <div className="mx-auto max-w-md"><PageHeader back title={s.t("แดชบอร์ดผู้ตรวจ", "Moderator dashboard")} />
      <Empty icon="🔒" title={s.t("เฉพาะบทบาทผู้ตรวจ", "Moderators only")} sub={s.t("สลับบทบาทเดโมเพื่อเข้าถึง", "Switch demo role to access")}
        action={<Btn onClick={() => s.set((x) => ({ ...x, role: "moderator" }))}>{s.t("สลับเป็นผู้ตรวจ (เดโม)", "Switch to Moderator (demo)")}</Btn>} /></div>
  );
  const pending = s.requests.filter((r) => r.status === "pending");
  const openDisputes = s.disputes.filter((d) => !d.resolved);
  const decide = (id: string, status: "verified" | "rejected") => {
    const r = s.requests.find((x) => x.id === id)!;
    s.set((x) => ({ ...x, requests: x.requests.map((y) => y.id === id ? { ...y, status } : y),
      notifs: [{ id: "n" + Date.now(), read: false, at: Date.now(), text: status === "verified" ? { th: `คำขอ “${r.title}” ผ่านการตรวจ (เดโม)`, en: `Request “${r.title}” reviewed (demo)` } : { th: `คำขอ “${r.title}” ไม่ผ่าน กรุณาส่งใหม่`, en: `Request “${r.title}” not approved — please resubmit` } }, ...x.notifs] }));
    toast.success(status === "verified" ? s.t("อนุมัติแล้ว (เดโม)", "Approved (demo)") : s.t("ปฏิเสธแล้ว (เดโม)", "Rejected (demo)"));
  };
  const metrics = [
    [pending.length, s.t("รอตรวจ", "Pending")],
    [s.requests.filter((r) => r.status === "verified").length + 214, s.t("อนุมัติแล้ว", "Approved")],
    [openDisputes.length, s.t("ข้อพิพาท", "Disputes")],
    ["6.2h", s.t("เวลาตรวจเฉลี่ย", "Avg review")],
  ];
  return (
    <div>
      <PageHeader title={s.t("แดชบอร์ดผู้ตรวจ", "Moderator dashboard")} />
      <p className="mb-4 rounded-xl bg-warning-soft p-3 text-sm font-semibold text-warning">{s.t("การดำเนินการทั้งหมดเป็นเดโม ไม่มีผลต่อบุคคลจริง", "All actions are demo only and affect no real people.")}</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map(([v, l]) => <div key={l} className="card p-4"><p className="font-display text-3xl font-semibold text-primary">{v}</p><p className="text-sm text-muted-foreground">{l}</p></div>)}
      </div>
      <h2 className="mt-8 mb-3 font-display text-xl font-semibold">{s.t("คิวรอตรวจสอบ", "Verification queue")}</h2>
      {pending.length === 0 ? <Empty icon="✅" title={s.t("ไม่มีคำขอรอตรวจ", "Queue is clear")} sub={s.t("ลองส่งคำขอใหม่ในบทบาทผู้ขอ", "Try submitting a request as a requester")} action={<Link to="/requests/new" className="font-semibold text-primary">{s.t("สร้างคำขอ", "Create request")} →</Link>} /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {pending.map((r) => (
            <div key={r.id} className="card p-4 animate-in fade-in">
              <div className="flex items-start gap-3"><span className="text-2xl">{categories.find((c) => c.id === r.category)?.icon}</span>
                <div className="flex-1"><p className="font-semibold">{r.title}</p><p className="text-sm text-muted-foreground">{fmt(r.amount)} · {s.t("ครบกำหนด", "Due")} {r.due}</p></div></div>
              <p className="mt-3 line-clamp-3 rounded-xl bg-muted p-3 text-sm">{r.story}</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>☑ {s.t("เอกสารแนบ: sample_bill.pdf (ปิดบังแล้ว)", "Attachment: sample_bill.pdf (redacted)")}</li>
                <li>☑ {s.t("ยอดตรงกับเอกสาร (ตรวจด้วยตา)", "Amount matches document (manual check)")}</li>
                <li>⚠ {s.t("การอ่านอัตโนมัติไม่ใช่หลักฐานความถูกต้อง", "Automatic reading is not proof of authenticity")}</li>
              </ul>
              <div className="mt-4 flex gap-2">
                <Btn className="flex-1 py-2" onClick={() => decide(r.id, "verified")}><Check className="h-4 w-4" />{s.t("อนุมัติ", "Approve")}</Btn>
                <Btn variant="outline" className="flex-1 py-2" onClick={() => decide(r.id, "rejected")}><X className="h-4 w-4" />{s.t("ปฏิเสธ", "Reject")}</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2 className="mt-8 mb-3 font-display text-xl font-semibold">{s.t("รายงานและข้อพิพาท", "Dispute flags")}</h2>
      {openDisputes.length === 0 ? <Empty icon="🕊️" title={s.t("ไม่มีข้อพิพาทค้าง", "No open disputes")} /> : (
        <div className="space-y-2">
          {openDisputes.map((d) => { const b = getBill(d.billId); return (
            <div key={d.id} className="card flex flex-wrap items-center gap-3 p-4">
              <Flag className="h-5 w-5 text-coral" />
              <div className="min-w-0 flex-1"><p className="font-semibold">{b ? s.l(b.title) : d.billId}</p><p className="text-sm text-muted-foreground">{s.l(d.reason)}</p></div>
              {b && <Link to="/bills/$id" params={{ id: b.id }} className="text-sm font-semibold text-primary">{s.t("ดู", "View")}</Link>}
              <Btn variant="ghost" className="py-1.5 text-sm" onClick={() => { s.set((x) => ({ ...x, disputes: x.disputes.map((y) => y.id === d.id ? { ...y, resolved: true } : y) })); toast(s.t("ปิดข้อพิพาทแล้ว", "Dispute resolved")); }}>{s.t("ปิดเรื่อง", "Resolve")}</Btn>
            </div>); })}
        </div>
      )}
    </div>
  );
}
