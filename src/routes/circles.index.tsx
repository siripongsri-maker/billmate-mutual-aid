import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { circles, fmt } from "@/lib/data";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/circles/")({
  head: () => ({ meta: [
    { title: "Circles — billmate" },
    { name: "description", content: "Discover mutual aid circles on billmate (demo)." },
    { property: "og:title", content: "Circles — billmate" },
    { property: "og:description", content: "Join fictional mutual aid circles in the demo." },
  ] }),
  component: Circles,
});

function Circles() {
  const s = useStore();
  return (
    <div>
      <PageHeader title={s.t("วงช่วยเหลือ", "Circles")} />
      <p className="mb-5 text-muted-foreground">{s.t("กลุ่มคนที่มีเรื่องร่วมกัน ช่วยกันดูแลบิลของสมาชิก", "Groups with something in common, looking after each other's bills.")}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {circles.map((c) => {
          const joined = s.joined.includes(c.id);
          return (
            <Link key={c.id} to="/circles/$id" params={{ id: c.id }} className="card lift flex gap-4 p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft text-3xl">{c.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-semibold">{s.l(c.name)}</h3>{joined && <span className="rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground">{s.t("สมาชิก", "Joined")}</span>}</div>
                <p className="text-sm text-muted-foreground">{s.l(c.desc)}</p>
                <p className="mt-2 text-xs font-semibold">{(c.members + (joined ? 1 : 0)).toLocaleString()} {s.t("สมาชิก", "members")} · {s.t("กองกลาง", "pool")} {fmt(c.pool)} <span className="text-muted-foreground">(demo)</span></p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
