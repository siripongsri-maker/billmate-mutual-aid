import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Btn } from "@/components/ui-kit";
import { Logo } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [
    { title: "Welcome — billmate" },
    { name: "description", content: "Get started with billmate, a mutual aid bill-sharing demo." },
    { property: "og:title", content: "Welcome — billmate" },
    { property: "og:description", content: "Life happens. We help. A demo onboarding." },
  ] }),
  component: Onboarding,
});

function Onboarding() {
  const s = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "🤝", th: "ชีวิตมีเรื่องไม่คาดฝัน", en: "Life happens", sub: { th: "billmate ช่วยให้เพื่อนร่วมชุมชนแบ่งเบาบิลจำเป็น เช่น ค่ายา ค่าไฟ ค่าเทอม ทีละเล็กละน้อย", en: "billmate lets neighbours share essential bills — medicine, power, tuition — a little at a time." } },
    { icon: "🛡️", th: "ความเป็นส่วนตัวมาก่อน", en: "Privacy first", sub: { th: "ใช้นามสมมติ ปิดบังข้อมูลส่วนตัวอัตโนมัติ ไม่เปิดเผยที่อยู่หรือเลขบัญชี", en: "Pseudonyms, auto‑redaction, never public addresses or account numbers." } },
    { icon: "🌱", th: "ทุกบาทมีความหมาย", en: "Every baht counts", sub: { th: "เริ่มต้นเพียง ฿20 ดูผลกระทบที่คุณสร้างได้ในรอยเท้าการให้", en: "Start from ฿20 and watch your impact grow in your footprint." } },
  ];
  const cur = steps[step];
  const finish = (role: "helper" | "requester") => {
    s.set((x) => ({ ...x, onboarded: true, role }));
    nav({ to: role === "helper" ? "/" : "/requests/new" });
  };
  return (
    <div className="min-h-[calc(100vh-2.25rem)] bg-hero text-primary-foreground flex flex-col">
      <div className="flex items-center justify-between p-5">
        <span className="rounded-xl bg-card px-3 py-1.5 text-foreground"><Logo /></span>
        <button className="press rounded-full border border-primary-foreground/40 px-3 py-1 text-sm font-semibold" onClick={() => s.set((x) => ({ ...x, lang: x.lang === "th" ? "en" : "th" }))}>{s.lang === "th" ? "EN" : "ไทย"}</button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
        <div key={step} className="animate-in fade-in zoom-in-95 duration-500">
          <div className="mx-auto mb-6 grid h-32 w-32 place-items-center rounded-full bg-primary-foreground/15 text-6xl">{cur.icon}</div>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Life happens. We help.</p>
          <h1 className="font-display mt-2 text-4xl font-semibold">{s.t(cur.th, cur.en)}</h1>
          <p className="mt-4 text-lg opacity-90">{s.l(cur.sub)}</p>
        </div>
        <div className="mt-8 flex gap-2" aria-label={`Step ${step + 1} of 3`}>
          {steps.map((_, i) => <span key={i} className={cn("h-2 rounded-full transition-all", i === step ? "w-8 bg-coral" : "w-2 bg-primary-foreground/40")} />)}
        </div>
      </div>
      <div className="mx-auto w-full max-w-md space-y-3 p-6">
        {step < 2 ? (
          <>
            <Btn variant="coral" full onClick={() => setStep(step + 1)}>{s.t("ถัดไป", "Next")}</Btn>
            <div className="flex justify-between text-sm font-semibold">
              <button disabled={step === 0} className="disabled:opacity-0" onClick={() => setStep(step - 1)}>{s.t("ย้อนกลับ", "Back")}</button>
              <button onClick={() => setStep(2)}>{s.t("ข้าม", "Skip")}</button>
            </div>
          </>
        ) : (
          <>
            <Btn variant="coral" full onClick={() => finish("helper")}>{s.t("ฉันอยากช่วยเหลือ", "I want to help")}</Btn>
            <button className="press w-full rounded-full border-2 border-primary-foreground/60 py-3 font-semibold" onClick={() => finish("requester")}>{s.t("ฉันต้องการความช่วยเหลือ", "I need help")}</button>
            <button className="w-full text-sm font-semibold opacity-80" onClick={() => setStep(1)}>{s.t("ย้อนกลับ", "Back")}</button>
          </>
        )}
      </div>
    </div>
  );
}
