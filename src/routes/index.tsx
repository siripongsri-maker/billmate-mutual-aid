import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Users, Receipt } from "lucide-react";
import { useStore } from "@/lib/store";
import { bills, categories, fmt } from "@/lib/data";
import { BillCard } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "chuaykan — Home" },
    { name: "description", content: "Impact stats and featured reviewed bills on chuaykan (demo)." },
    { property: "og:title", content: "chuaykan — Life happens. We help." },
    { property: "og:description", content: "Share essential bills with your community. Demo prototype." },
  ] }),
  component: Home,
});

function Home() {
  const s = useStore();
  const myGiven = s.contributions.reduce((a, c) => a + c.amount, 0);
  const featured = bills.filter((b) => b.verified && b.raised < b.goal).slice(0, 4);
  const stats = [
    { icon: Receipt, v: (1284 + s.contributions.length).toLocaleString(), l: s.t("บิลที่ช่วยแล้ว", "Bills covered") },
    { icon: HeartHandshake, v: fmt(2_486_300 + myGiven), l: s.t("ยอดแบ่งเบารวม", "Shared total") },
    { icon: Users, v: "18,920", l: s.t("เพื่อนผู้ให้", "Helpers") },
  ];
  return (
    <div className="space-y-8">
      <section className="bg-hero relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-lift md:p-10">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-coral/40 blur-2xl" aria-hidden />
        <p className="text-sm font-semibold opacity-85">{s.t("สวัสดี 👋", "Hello 👋")} · {s.t("บทบาท", "Role")}: {s.t({ helper: "ผู้ให้", requester: "ผู้ขอ", moderator: "ผู้ตรวจ" }[s.role], s.role)}</p>
        <h1 className="font-display relative mt-2 text-3xl font-semibold md:text-5xl">Life happens.<br />We help.</h1>
        <p className="relative mt-3 max-w-md opacity-90">{s.t("ช่วยกันจ่ายบิลจำเป็นของเพื่อนในชุมชน ทีละ ฿20", "Help neighbours pay essential bills, ฿20 at a time.")}</p>
        <div className="relative mt-5 flex flex-wrap gap-2">
          <Link to="/browse" className="press rounded-full bg-coral px-5 py-2.5 font-semibold text-coral-foreground">{s.t("เริ่มช่วยเหลือ", "Start helping")}</Link>
          <Link to="/requests/new" className="press rounded-full border-2 border-primary-foreground/60 px-5 py-2.5 font-semibold">{s.t("ขอความช่วยเหลือ", "Ask for help")}</Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((x) => (
          <div key={x.l} className="card p-3 md:p-5">
            <x.icon className="h-5 w-5 text-coral" />
            <p className="mt-2 font-display text-lg font-semibold md:text-2xl">{x.v}</p>
            <p className="text-xs text-muted-foreground md:text-sm">{x.l}</p>
          </div>
        ))}
      </section>
      <p className="-mt-5 text-xs text-muted-foreground">{s.t("* ตัวเลขสมมติเพื่อการสาธิต", "* Fictional figures for demonstration")}</p>

      {myGiven > 0 && (
        <Link to="/impact" className="card lift flex items-center gap-4 p-4">
          <span className="text-3xl">🌱</span>
          <div className="flex-1"><p className="font-semibold">{s.t(`คุณช่วยไปแล้ว ${fmt(myGiven)}`, `You've shared ${fmt(myGiven)}`)}</p><p className="text-sm text-muted-foreground">{s.t("ดูรอยเท้าการให้ของคุณ", "See your footprint")}</p></div>
          <ArrowRight className="h-5 w-5 text-primary" />
        </Link>
      )}

      <section>
        <h2 className="mb-3 font-semibold">{s.t("หมวดหมู่", "Categories")}</h2>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {categories.map((c) => (
            <Link key={c.id} to="/browse" search={{ cat: c.id }} className="press flex shrink-0 items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium hover:border-primary">
              <span aria-hidden>{c.icon}</span> {s.l(c.label)}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold">{s.t("บิลแนะนำที่ตรวจแล้ว", "Featured reviewed bills")}</h2>
          <Link to="/browse" className="text-sm font-semibold text-primary">{s.t("ดูทั้งหมด", "See all")} →</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">{featured.map((b) => <BillCard key={b.id} b={b} />)}</div>
      </section>

      <Link to="/how-it-works" className="card lift flex items-center gap-4 p-5 bg-coral-soft">
        <span className="text-3xl">🛡️</span>
        <div className="flex-1"><p className="font-semibold">{s.t("chuaykan ทำงานอย่างไร", "How chuaykan works")}</p><p className="text-sm text-muted-foreground">{s.t("ความปลอดภัย ความเป็นส่วนตัว และการตรวจสอบ", "Safety, privacy & review")}</p></div>
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
