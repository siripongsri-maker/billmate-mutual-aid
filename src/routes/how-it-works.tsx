import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: "Trust & how it works — chuaykan" },
    { name: "description", content: "How chuaykan's demo review, privacy and safety work." },
    { property: "og:title", content: "Trust & how it works — chuaykan" },
    { property: "og:description", content: "Privacy-first mutual aid, explained." },
  ] }),
  component: How,
});

function How() {
  const s = useStore();
  const [open, setOpen] = useState<number | null>(0);
  const steps = [
    ["📝", s.t("ผู้ขอส่งบิล", "Requester submits a bill"), s.t("พร้อมเรื่องราวสั้นๆ และใบแจ้งหนี้", "With a short story and the bill")],
    ["🙈", s.t("ปิดบังข้อมูลส่วนตัว", "Personal info is redacted"), s.t("ชื่อ ที่อยู่ เลขบัญชี ถูกซ่อน", "Names, addresses, account numbers hidden")],
    ["🛡️", s.t("ผู้ตรวจสอบดูเอกสาร", "A moderator reviews"), s.t("คนจริงตรวจความสอดคล้อง ไม่ใช่การรับรอง 100%", "A human checks consistency — not a guarantee")],
    ["🤝", s.t("ชุมชนช่วยกัน", "Community chips in"), s.t("ในบริการจริงเงินจะไปที่ผู้ให้บริการโดยตรง", "In a real service, funds go straight to the biller")],
  ];
  const faq = [
    [s.t("นี่คือการระดมทุนจริงหรือไม่?", "Is this real fundraising?"), s.t("ไม่ใช่ นี่เป็นต้นแบบเดโม ไม่มีการเก็บเงินหรือชำระเงินใดๆ ข้อมูลทั้งหมดเป็นเรื่องสมมติ", "No. This is a demo prototype. No money is collected or paid, and all data is fictional.")],
    [s.t("ป้าย “ตรวจแล้ว” หมายถึงอะไร?", "What does “Reviewed” mean?"), s.t("ในเดโมเป็นเพียงตัวอย่าง ในการใช้งานจริง การตรวจเอกสารช่วยลดความเสี่ยง แต่ไม่อาจพิสูจน์ความถูกต้องได้ทั้งหมด", "In this demo it's a sample. In real use, document review reduces risk but cannot fully prove authenticity.")],
    [s.t("ระบบอ่านเอกสารอัตโนมัติพิสูจน์ได้ไหม?", "Does automatic document reading prove anything?"), s.t("ไม่ การอ่านอัตโนมัติใช้เพื่อช่วยปิดบังข้อมูลเท่านั้น", "No. Automatic reading is only used to help redact personal data.")],
    [s.t("ข้อมูลของฉันเก็บที่ไหน?", "Where is my data stored?"), s.t("ในเดโมนี้ เก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น รีเซ็ตได้ที่หน้าโปรไฟล์", "In this demo, only in your browser. Reset it from your profile.")],
    [s.t("ห้ามอัปโหลดอะไร?", "What should I never upload?"), s.t("บัตรประชาชน หนังสือเดินทาง หรือข้อมูลบัญชีธนาคาร", "ID cards, passports, or bank account details.")],
  ];
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back title={s.t("ความปลอดภัยและวิธีการทำงาน", "Trust & how it works")} />
      <ol className="space-y-3">
        {steps.map(([i, t, d], n) => (
          <li key={n} className="card flex items-center gap-4 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-2xl">{i}</span>
            <div><p className="font-semibold">{n + 1}. {t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
          </li>
        ))}
      </ol>
      <h2 className="mt-8 mb-3 font-display text-xl font-semibold">{s.t("คำถามที่พบบ่อย", "FAQ")}</h2>
      <div className="card divide-y">
        {faq.map(([q, a], i) => (
          <div key={i}>
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left font-semibold">{q}<ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open === i && "rotate-180")} /></button>
            {open === i && <p className="px-4 pb-4 text-sm text-muted-foreground animate-in fade-in">{a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
