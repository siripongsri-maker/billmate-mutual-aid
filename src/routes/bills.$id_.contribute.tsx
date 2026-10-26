import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmt } from "@/lib/data";
import { Btn, getBill, PageHeader, useRaised } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bills/$id_/contribute")({
  staticData: { sitemap: false },
  loader: ({ params }) => { if (!getBill(params.id)) throw notFound(); return null; },
  head: () => ({ meta: [
    { title: "Chip in (simulated) — chuaykan" },
    { name: "description", content: "Simulated contribution flow. No real payment is taken." },
    { property: "og:title", content: "Chip in — chuaykan demo" },
    { property: "og:description", content: "Simulated contribution flow, no payments." },
  ] }),
  component: Contribute,
});

function Contribute() {
  const { id } = Route.useParams();
  const s = useStore();
  const b = getBill(id)!;
  const raised = useRaised(b);
  const remaining = b.goal - raised;
  const [step, setStep] = useState<"amount" | "confirm" | "done">("amount");
  const [amt, setAmt] = useState(50);
  const [custom, setCustom] = useState("");
  const [anon, setAnon] = useState(s.privacy.anon);
  const [receiptId] = useState(() => "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase());
  const value = custom ? Number(custom) : amt;
  const err = !value || value < 20 ? s.t("ขั้นต่ำ ฿20", "Minimum ฿20") : value > remaining ? s.t(`สูงสุด ${fmt(remaining)} (ยอดที่ยังขาด)`, `Max ${fmt(remaining)} (remaining)`) : value > 10000 ? s.t("สูงสุด ฿10,000 ต่อครั้ง", "Max ฿10,000 per gift") : "";

  const confirm = () => {
    s.set((x) => ({
      ...x,
      contributions: [...x.contributions, { id: receiptId, billId: b.id, amount: value, at: Date.now() }],
      extraRaised: { ...x.extraRaised, [b.id]: (x.extraRaised[b.id] ?? 0) + value },
      notifs: [{ id: "n" + Date.now(), read: false, at: Date.now(), text: { th: `ขอบคุณ! คุณร่วมแบ่งเบา ${fmt(value)} ให้ ${b.name} (จำลอง)`, en: `Thank you! You shared ${fmt(value)} with ${b.name} (simulated)` } }, ...x.notifs],
    }));
    setStep("done");
  };

  if (step === "done") {
    const newPct = Math.min(100, ((raised) / b.goal) * 100);
    return (
      <div className="mx-auto max-w-md text-center animate-in zoom-in-95 duration-500">
        <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
        <h1 className="font-display mt-4 text-3xl font-semibold">{s.t("ขอบคุณที่ช่วยกัน!", "Thank you for helping!")}</h1>
        <div className="card mt-6 p-5 text-left">
          <div className="flex justify-between border-b border-dashed pb-3"><span className="font-semibold">{s.t("ใบรับผลกระทบ", "Impact receipt")}</span><span className="rounded bg-warning-soft px-2 text-xs font-bold text-warning">DEMO</span></div>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{s.t("เลขที่", "Ref")}</dt><dd className="font-mono">{receiptId}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{s.t("บิล", "Bill")}</dt><dd className="text-right">{s.l(b.title)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{s.t("จำนวน", "Amount")}</dt><dd className="font-semibold">{fmt(value)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{s.t("ความคืบหน้าบิล", "Bill progress")}</dt><dd>{Math.round(newPct)}%</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{s.t("แสดงชื่อ", "Shown as")}</dt><dd>{anon ? s.t("ผู้ให้นิรนาม", "Anonymous helper") : s.t("คุณ", "You")}</dd></div>
          </dl>
          <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">{s.t("นี่คือการจำลอง ไม่มีการตัดเงินหรือโอนเงินจริง และไม่ใช่ใบเสร็จทางภาษี", "This is a simulation. No money was charged or transferred, and this is not a tax receipt.")}</p>
        </div>
        <div className="mt-6 grid gap-3">
          <Link to="/impact" className="press rounded-full bg-primary py-3 font-semibold text-primary-foreground">{s.t("ดูรอยเท้าการให้", "View my footprint")}</Link>
          <Link to="/browse" className="press rounded-full border-2 border-primary py-3 font-semibold text-primary">{s.t("ช่วยบิลอื่น", "Help another bill")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <PageHeader back title={step === "amount" ? s.t("เลือกจำนวน", "Choose amount") : s.t("ยืนยัน", "Confirm")} />
      <div className="card mb-4 p-4 text-sm"><p className="font-semibold">{s.l(b.title)}</p><p className="text-muted-foreground">{s.t("ยังขาด", "Remaining")} {fmt(remaining)}</p></div>
      {step === "amount" ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[20, 50, 100].map((v) => (
              <button key={v} onClick={() => { setAmt(v); setCustom(""); }} aria-pressed={!custom && amt === v}
                className={cn("press rounded-2xl border-2 py-5 font-display text-2xl font-semibold", !custom && amt === v ? "border-primary bg-primary-soft text-primary" : "bg-card")}>฿{v}</button>
            ))}
          </div>
          <label className="mt-4 block text-sm font-semibold">{s.t("หรือระบุจำนวนเอง", "Or custom amount")}
            <div className="relative mt-1"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
              <input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} className="w-full rounded-2xl border bg-card py-3 pl-9 pr-4 text-lg" placeholder="250" /></div>
          </label>
          {err && <p role="alert" className="mt-2 text-sm font-semibold text-destructive">{err}</p>}
          <label className="mt-4 flex items-center gap-3 rounded-2xl border bg-card p-4"><input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="h-5 w-5 accent-primary" />{s.t("ให้แบบไม่ระบุชื่อ", "Give anonymously")}</label>
          <Btn full className="mt-6" disabled={!!err} onClick={() => setStep("confirm")}>{s.t("ถัดไป", "Continue")} · {fmt(value || 0)}</Btn>
        </>
      ) : (
        <>
          <div className="card p-5 text-center">
            <p className="text-muted-foreground">{s.t("คุณกำลังจะร่วมแบ่งเบา", "You're about to share")}</p>
            <p className="font-display text-5xl font-semibold text-primary my-2">{fmt(value)}</p>
            <p className="text-sm text-muted-foreground">{s.t("วิธีชำระ: จำลอง (ไม่มีการชำระเงินจริง)", "Method: simulated (no real payment)")}</p>
          </div>
          <Btn variant="coral" full className="mt-6" onClick={confirm}>{s.t("ยืนยันการจำลอง", "Confirm simulation")}</Btn>
          <Btn variant="ghost" full className="mt-2" onClick={() => setStep("amount")}>{s.t("แก้ไขจำนวน", "Edit amount")}</Btn>
        </>
      )}
    </div>
  );
}
