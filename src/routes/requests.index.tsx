import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type ReqStatus } from "@/lib/store";
import { categories, fmt } from "@/lib/data";
import { Empty, PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requests/")({
  head: () => ({ meta: [
    { title: "My requests — chuaykan" },
    { name: "description", content: "Track the status of your help requests (demo)." },
    { property: "og:title", content: "My requests — chuaykan" },
    { property: "og:description", content: "Track request statuses in the chuaykan demo." },
  ] }),
  component: MyRequests,
});

const statusStyle: Record<ReqStatus, string> = {
  pending: "bg-warning-soft text-warning",
  verified: "bg-primary-soft text-accent-foreground",
  rejected: "bg-coral-soft text-destructive",
  funded: "bg-primary text-primary-foreground",
};

function MyRequests() {
  const s = useStore();
  const [f, setF] = useState<ReqStatus | "all">("all");
  const label: Record<ReqStatus, string> = { pending: s.t("รอตรวจสอบ", "Pending"), verified: s.t("ตรวจแล้ว (เดโม)", "Reviewed (demo)"), rejected: s.t("ไม่ผ่าน", "Not approved"), funded: s.t("ครบเป้า", "Funded") };
  const list = s.requests.filter((r) => f === "all" || r.status === f);
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={s.t("คำขอของฉัน", "My requests")} right={<Link to="/requests/new" className="press rounded-full bg-coral px-4 py-2 text-sm font-semibold text-coral-foreground">+ {s.t("ใหม่", "New")}</Link>} />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {(["all", "pending", "verified", "rejected", "funded"] as const).map((k) => (
          <button key={k} onClick={() => setF(k)} className={cn("press shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium", f === k ? "bg-primary text-primary-foreground border-primary" : "bg-card")}>{k === "all" ? s.t("ทั้งหมด", "All") : label[k]}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{categories.find((c) => c.id === r.category)?.icon}</span>
              <div className="flex-1"><p className="font-semibold">{r.title}</p><p className="text-sm text-muted-foreground">{fmt(r.amount)} · {s.t("ครบกำหนด", "Due")} {r.due}</p></div>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyle[r.status])}>{label[r.status]}</span>
            </div>
            {r.status === "rejected" && <p className="mt-3 rounded-xl bg-muted p-3 text-sm">{s.t("เอกสารไม่ชัดเจน กรุณาส่งคำขอใหม่พร้อมใบแจ้งหนี้ที่อ่านได้ (เดโม)", "Document unclear. Please resubmit with a readable bill (demo).")}</p>}
            {r.status === "pending" && <p className="mt-3 text-xs text-muted-foreground">{s.t("สลับเป็นบทบาทผู้ตรวจเพื่อทดลองอนุมัติ", "Switch to Moderator role to try approving it")}</p>}
          </div>
        ))}
      </div>
      {list.length === 0 && <Empty icon="📭" title={s.t("ยังไม่มีคำขอในสถานะนี้", "No requests here yet")} action={<Link to="/requests/new" className="font-semibold text-primary">{s.t("สร้างคำขอ", "Create a request")} →</Link>} />}
    </div>
  );
}
