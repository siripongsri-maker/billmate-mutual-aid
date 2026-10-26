import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { bills, circles, fmt } from "@/lib/data";
import { BillCard, Btn, Empty, PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/circles/$id")({
  loader: ({ params }) => { const c = circles.find((x) => x.id === params.id); if (!c) throw notFound(); return { name: c.name.en }; },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.name ?? "Circle"} — chuaykan` },
    { name: "description", content: "Circle details and member bills (demo)." },
    { property: "og:title", content: `${loaderData?.name ?? "Circle"} — chuaykan` },
    { property: "og:description", content: "A fictional mutual aid circle." },
  ] }),
  notFoundComponent: () => <div className="card p-8 text-center">Circle not found. <Link to="/circles" className="font-semibold text-primary">Back</Link></div>,
  component: CircleDetail,
});

function CircleDetail() {
  const { id } = Route.useParams();
  const s = useStore();
  const c = circles.find((x) => x.id === id)!;
  const joined = s.joined.includes(c.id);
  const related = bills.filter((b) => b.category === c.focus);
  const toggle = () => {
    s.set((x) => ({ ...x, joined: joined ? x.joined.filter((j) => j !== c.id) : [...x.joined, c.id] }));
    toast.success(joined ? s.t("ออกจากวงแล้ว", "Left circle") : s.t("ยินดีต้อนรับสู่วง! 🎉", "Welcome to the circle! 🎉"));
  };
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back title={s.l(c.name)} />
      <div className="bg-hero rounded-3xl p-6 text-primary-foreground shadow-lift">
        <div className="text-5xl">{c.emoji}</div>
        <p className="mt-3 opacity-90">{s.l(c.desc)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary-foreground/15 p-3"><p className="font-display text-2xl font-semibold">{(c.members + (joined ? 1 : 0)).toLocaleString()}</p><p className="text-sm opacity-85">{s.t("สมาชิก", "members")}</p></div>
          <div className="rounded-2xl bg-primary-foreground/15 p-3"><p className="font-display text-2xl font-semibold">{fmt(c.pool)}</p><p className="text-sm opacity-85">{s.t("กองกลางสมมติ", "demo pool")}</p></div>
        </div>
      </div>
      <div className="card mt-4 p-4 text-sm">
        <p className="font-semibold">{s.t("กติกาของวง", "Circle guidelines")}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>{s.t("เคารพความเป็นส่วนตัวของสมาชิก", "Respect members' privacy")}</li>
          <li>{s.t("ไม่ขอข้อมูลบัญชีหรือที่อยู่ส่วนตัว", "Never ask for account details or addresses")}</li>
          <li>{s.t("รายงานสิ่งผิดปกติให้ผู้ตรวจสอบ", "Report anything suspicious to moderators")}</li>
        </ul>
      </div>
      <Btn full variant={joined ? "outline" : "coral"} className="mt-4" onClick={toggle}>{joined ? s.t("ออกจากวง", "Leave circle") : s.t("เข้าร่วมวง", "Join circle")}</Btn>
      <h2 className="mt-8 mb-3 font-display text-xl font-semibold">{s.t("บิลของสมาชิก", "Member bills")}</h2>
      {related.length ? <div className="grid gap-3">{related.map((b) => <BillCard key={b.id} b={b} />)}</div> : <Empty icon="🌤️" title={s.t("ยังไม่มีบิลในตอนนี้", "No bills right now")} />}
    </div>
  );
}
