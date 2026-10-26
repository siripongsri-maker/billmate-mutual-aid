import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Btn, Empty, PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — chuaykan" },
    { name: "description", content: "Your chuaykan demo notifications." },
    { property: "og:title", content: "Notifications — chuaykan" },
    { property: "og:description", content: "Updates on bills, circles and requests (demo)." },
  ] }),
  component: Notifications,
});

function Notifications() {
  const s = useStore();
  const ago = (t: number) => { const m = Math.round((Date.now() - t) / 60000); return m < 60 ? s.t(`${m} นาทีที่แล้ว`, `${m}m ago`) : m < 1440 ? s.t(`${Math.round(m / 60)} ชม.ที่แล้ว`, `${Math.round(m / 60)}h ago`) : s.t(`${Math.round(m / 1440)} วันที่แล้ว`, `${Math.round(m / 1440)}d ago`); };
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back title={s.t("การแจ้งเตือน", "Notifications")} right={s.notifs.some((n) => !n.read) && <Btn variant="ghost" className="px-3 py-1.5 text-sm" onClick={() => s.set((x) => ({ ...x, notifs: x.notifs.map((n) => ({ ...n, read: true })) }))}>{s.t("อ่านทั้งหมด", "Mark all read")}</Btn>} />
      {s.notifs.length === 0 ? <Empty icon="🔔" title={s.t("ไม่มีการแจ้งเตือน", "You're all caught up")} /> : (
        <div className="space-y-2">
          {s.notifs.map((n) => (
            <button key={n.id} onClick={() => s.set((x) => ({ ...x, notifs: x.notifs.map((y) => y.id === n.id ? { ...y, read: true } : y) }))} className={cn("card press flex w-full items-start gap-3 p-4 text-left", !n.read && "border-primary")}>
              <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", n.read ? "bg-muted" : "bg-coral")} />
              <div className="flex-1"><p className={cn(!n.read && "font-semibold")}>{s.l(n.text)}</p><p className="text-xs text-muted-foreground">{ago(n.at)}</p></div>
            </button>
          ))}
          <Btn variant="ghost" full onClick={() => s.set((x) => ({ ...x, notifs: [] }))}>{s.t("ล้างทั้งหมด", "Clear all")}</Btn>
        </div>
      )}
    </div>
  );
}
