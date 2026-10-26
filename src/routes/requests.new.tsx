import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileUp, EyeOff, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { categories, fmt, type Category } from "@/lib/data";
import { Btn, PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/requests/new")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Request help — chuaykan" },
    { name: "description", content: "Multi-step demo form to request help with a bill." },
    { property: "og:title", content: "Request help — chuaykan" },
    { property: "og:description", content: "Ask your community to share a bill (demo)." },
  ] }),
  component: NewRequest,
});

function NewRequest() {
  const s = useStore();
  const [step, setStep] = useState(0);
  const [cat, setCat] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  const [story, setStory] = useState("");
  const [uploaded, setUploaded] = useState<"none" | "uploading" | "done">("none");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const labels = [s.t("ประเภท", "Category"), s.t("รายละเอียด", "Details"), s.t("เรื่องราว", "Story"), s.t("เอกสาร", "Document"), s.t("ตรวจทาน", "Review")];
  const amt = Number(amount);
  const today = new Date().toISOString().slice(0, 10);
  const detailsErr = !title.trim() ? s.t("กรุณาใส่ชื่อบิล", "Add a bill title") : !amt || amt < 100 ? s.t("จำนวนขั้นต่ำ ฿100", "Minimum ฿100") : amt > 50000 ? s.t("สูงสุด ฿50,000 ในเดโม", "Max ฿50,000 in demo") : !due ? s.t("เลือกวันครบกำหนด", "Pick a due date") : due < today ? s.t("วันครบกำหนดต้องไม่ใช่อดีต", "Due date can't be in the past") : "";
  const storyErr = story.trim().length < 20 ? s.t("อย่างน้อย 20 ตัวอักษร", "At least 20 characters") : "";
  const canNext = [!!cat, !detailsErr, !storyErr, uploaded === "done", consent][step];

  const simulateUpload = () => { setUploaded("uploading"); setTimeout(() => setUploaded("done"), 1400); };
  const submit = () => {
    s.set((x) => ({
      ...x,
      requests: [{ id: "r" + Date.now(), title, category: cat!, amount: amt, due, story, status: "pending", created: Date.now() }, ...x.requests],
      notifs: [{ id: "n" + Date.now(), read: false, at: Date.now(), text: { th: `ส่งคำขอ “${title}” แล้ว รอการตรวจสอบ`, en: `Request “${title}” submitted, pending review` } }, ...x.notifs],
    }));
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="mx-auto max-w-md text-center animate-in zoom-in-95">
      <CheckCircle2 className="mx-auto h-20 w-20 text-primary" />
      <h1 className="font-display mt-4 text-3xl font-semibold">{s.t("ส่งคำขอแล้ว", "Request submitted")}</h1>
      <p className="mt-2 text-muted-foreground">{s.t("สถานะ: รอการตรวจสอบ (เดโม) ผู้ตรวจสอบจะดูเอกสารภายใน 24–48 ชม.", "Status: pending review (demo). A moderator typically reviews in 24–48h.")}</p>
      <div className="mt-6 grid gap-3">
        <Link to="/requests" className="press rounded-full bg-primary py-3 font-semibold text-primary-foreground">{s.t("ดูคำขอของฉัน", "View my requests")}</Link>
        <Link to="/" className="press rounded-full border-2 border-primary py-3 font-semibold text-primary">{s.t("กลับหน้าแรก", "Back home")}</Link>
      </div>
    </div>
  );

  const redacted = story.replace(/\d[\d\s-]{6,}\d/g, "███████").replace(/(ถนน|ซอย|หมู่|บ้านเลขที่|road|soi|street)\s*\S+/gi, "███");
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader back={step === 0} title={s.t("ขอความช่วยเหลือ", "Request help")} />
      <ol className="mb-6 flex gap-1.5" aria-label="Progress">
        {labels.map((l, i) => <li key={l} className="flex-1"><div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} /><span className={cn("mt-1 hidden text-xs sm:block", i === step ? "font-semibold" : "text-muted-foreground")}>{l}</span></li>)}
      </ol>
      <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={cn("press rounded-2xl border-2 p-4 text-left", cat === c.id ? "border-primary bg-primary-soft" : "bg-card")}>
                <span className="text-3xl">{c.icon}</span><p className="mt-2 font-semibold">{s.l(c.label)}</p>
              </button>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <Field label={s.t("ชื่อบิล", "Bill title")}><input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} className="inp" placeholder={s.t("เช่น ค่ายาเดือนพฤศจิกายน", "e.g. November medication")} /></Field>
            <Field label={s.t("จำนวนเงิน (บาท)", "Amount (THB)")}><input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} className="inp" placeholder="2500" /></Field>
            <Field label={s.t("วันครบกำหนด", "Due date")}><input type="date" min={today} value={due} onChange={(e) => setDue(e.target.value)} className="inp" /></Field>
            {detailsErr && (title || amount || due) && <p role="alert" className="text-sm font-semibold text-destructive">{detailsErr}</p>}
          </div>
        )}
        {step === 2 && (
          <div>
            <Field label={s.t("เล่าเรื่องของคุณ", "Tell your story")}>
              <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={6} maxLength={600} className="inp" placeholder={s.t("เกิดอะไรขึ้น และความช่วยเหลือนี้จะช่วยอย่างไร", "What happened, and how will this help?")} />
            </Field>
            <p className="mt-1 text-right text-xs text-muted-foreground">{story.length}/600</p>
            <p className="mt-2 rounded-xl bg-coral-soft p-3 text-sm">💡 {s.t("อย่าใส่ที่อยู่ เบอร์โทร หรือเลขบัญชี เราจะปิดบังให้อัตโนมัติ", "Don't include addresses, phone or account numbers — we'll auto‑redact them.")}</p>
            {storyErr && story && <p className="mt-2 text-sm font-semibold text-destructive">{storyErr}</p>}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <button onClick={simulateUpload} disabled={uploaded === "uploading"} className="press flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed bg-card p-8 text-center hover:border-primary">
              <FileUp className="h-8 w-8 text-primary" />
              <span className="font-semibold">{uploaded === "none" ? s.t("แตะเพื่ออัปโหลดใบแจ้งหนี้ตัวอย่าง (จำลอง)", "Tap to upload a sample bill (simulated)") : uploaded === "uploading" ? s.t("กำลังอัปโหลด...", "Uploading...") : s.t("อัปโหลด sample_bill.pdf แล้ว ✓", "sample_bill.pdf uploaded ✓")}</span>
              <span className="text-xs text-muted-foreground">{s.t("ไม่มีไฟล์จริงถูกส่ง · อย่าอัปโหลดบัตรประชาชน", "No real file is sent · Never upload ID cards")}</span>
            </button>
            {uploaded === "done" && (
              <div className="card p-4 animate-in fade-in">
                <p className="flex items-center gap-2 font-semibold"><EyeOff className="h-4 w-4" /> {s.t("ตัวอย่างการปิดบังข้อมูล", "Redaction preview")}</p>
                <div className="mt-3 space-y-1.5 rounded-xl bg-muted p-4 font-mono text-sm">
                  <p>{s.t("ผู้ให้บริการ", "Biller")}: {s.l(categories.find((c) => c.id === cat)!.label)} (sample)</p>
                  <p>{s.t("ชื่อ", "Name")}: <span className="rounded bg-foreground px-8" aria-label="redacted" /></p>
                  <p>{s.t("ที่อยู่", "Address")}: <span className="rounded bg-foreground px-14" aria-label="redacted" /></p>
                  <p>{s.t("เลขบัญชีผู้ใช้", "Account no.")}: <span className="rounded bg-foreground px-10" aria-label="redacted" /></p>
                  <p>{s.t("ยอดชำระ", "Amount due")}: {fmt(amt)}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{s.t("การอ่านเอกสารอัตโนมัติช่วยปิดบังข้อมูลเท่านั้น ไม่ได้พิสูจน์ความถูกต้องของเอกสาร ผู้ตรวจสอบจะดูเพิ่มเติม", "Automatic reading only helps redact; it does not prove a document is authentic. A human moderator reviews further.")}</p>
              </div>
            )}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div className="card divide-y">
              {[[s.t("ประเภท", "Category"), s.l(categories.find((c) => c.id === cat)!.label), 0], [s.t("ชื่อบิล", "Title"), title, 1], [s.t("จำนวน", "Amount"), fmt(amt), 1], [s.t("ครบกำหนด", "Due"), due, 1], [s.t("เอกสาร", "Document"), "sample_bill.pdf (redacted)", 3]].map(([k, v, st]) => (
                <div key={k as string} className="flex items-center justify-between gap-3 p-4 text-sm"><span className="text-muted-foreground">{k}</span><span className="flex-1 text-right font-semibold">{v}</span><button className="text-primary font-semibold" onClick={() => setStep(st as number)}>{s.t("แก้", "Edit")}</button></div>
              ))}
              <div className="p-4 text-sm"><p className="text-muted-foreground mb-1">{s.t("เรื่องราวที่จะแสดง (ปิดบังแล้ว)", "Public story (redacted)")}</p><p>{redacted}</p></div>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border bg-card p-4 text-sm"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 accent-primary" />{s.t("ฉันเข้าใจว่านี่คือเดโม ข้อมูลจะถูกเก็บในอุปกรณ์นี้เท่านั้น และจะไม่มีการระดมทุนจริง", "I understand this is a demo, data is stored only on this device, and no real fundraising happens.")}</label>
          </div>
        )}
      </div>
      <div className="mt-8 flex gap-3">
        {step > 0 && <Btn variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>{s.t("ย้อนกลับ", "Back")}</Btn>}
        {step < 4 ? <Btn className="flex-1" disabled={!canNext} onClick={() => setStep(step + 1)}>{s.t("ถัดไป", "Next")}</Btn>
          : <Btn variant="coral" className="flex-1" disabled={!consent} onClick={submit}>{s.t("ส่งเพื่อตรวจสอบ", "Submit for review")}</Btn>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold [&_.inp]:mt-1 [&_.inp]:w-full [&_.inp]:rounded-2xl [&_.inp]:border [&_.inp]:bg-card [&_.inp]:px-4 [&_.inp]:py-3 [&_.inp]:text-base [&_.inp]:font-normal">{label}{children}</label>;
}
