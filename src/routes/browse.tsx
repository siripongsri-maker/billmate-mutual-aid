import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { bills, categories, type Category } from "@/lib/data";
import { BillCard, Btn, Empty, PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

type Search = { cat?: Category | undefined };
export const Route = createFileRoute("/browse")({
  staticData: { sitemap: true },
  validateSearch: (s: Record<string, unknown>): Search => ({ cat: categories.some((c) => c.id === s["cat"]) ? (s["cat"] as Category) : undefined }),
  head: () => ({ meta: [
    { title: "Browse bills — chuaykan" },
    { name: "description", content: "Search and filter community bills on chuaykan (demo)." },
    { property: "og:title", content: "Browse bills — chuaykan" },
    { property: "og:description", content: "Find a bill to help share. Demo data only." },
  ] }),
  component: Browse,
});

function Browse() {
  const s = useStore();
  const { cat } = Route.useSearch();
  const nav = useNavigate({ from: "/browse" });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"urgent" | "close" | "new">("urgent");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const list = useMemo(() => {
    let r = bills.filter((b) => (!cat || b.category === cat) && (!onlyVerified || b.verified));
    if (q) { const k = q.toLowerCase(); r = r.filter((b) => (b.title.th + b.title.en + b.name + b.region.th + b.region.en).toLowerCase().includes(k)); }
    return [...r].sort((a, b) => sort === "urgent" ? a.dueDays - b.dueDays : sort === "close" ? b.raised / b.goal - a.raised / a.goal : b.id.localeCompare(a.id));
  }, [q, cat, sort, onlyVerified]);
  const chip = (active: boolean) => cn("press shrink-0 rounded-full border px-4 py-2 text-sm font-medium", active ? "border-primary bg-primary text-primary-foreground" : "bg-card");
  return (
    <div>
      <PageHeader title={s.t("ค้นหาบิล", "Browse bills")} />
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.t("ค้นหาชื่อ ภูมิภาค หรือประเภท", "Search name, region or type")} className="w-full rounded-full border bg-card py-3 pl-12 pr-10" aria-label="Search" />
        {q && <button aria-label="Clear" onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="h-4 w-4" /></button>}
      </div>
      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <button className={chip(!cat)} onClick={() => nav({ search: {} })}>{s.t("ทั้งหมด", "All")}</button>
        {categories.map((c) => <button key={c.id} className={chip(cat === c.id)} onClick={() => nav({ search: { cat: c.id } })}>{c.icon} {s.l(c.label)}</button>)}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-full border bg-card px-3 py-1.5" aria-label="Sort">
          <option value="urgent">{s.t("ใกล้ครบกำหนด", "Due soonest")}</option>
          <option value="close">{s.t("ใกล้ครบเป้า", "Closest to goal")}</option>
          <option value="new">{s.t("ล่าสุด", "Newest")}</option>
        </select>
        <label className="flex items-center gap-2"><input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="h-4 w-4 accent-primary" />{s.t("เฉพาะที่ตรวจแล้ว (เดโม)", "Reviewed only (demo)")}</label>
        <span className="ml-auto text-muted-foreground">{list.length} {s.t("รายการ", "results")}</span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {list.map((b) => <BillCard key={b.id} b={b} />)}
      </div>
      {list.length === 0 && (
        <Empty icon="🔍" title={s.t("ไม่พบบิลที่ตรงกัน", "No matching bills")} sub={s.t("ลองเปลี่ยนคำค้นหาหรือตัวกรอง", "Try a different search or filter")}
          action={<Btn variant="outline" onClick={() => { setQ(""); setOnlyVerified(false); nav({ search: {} }); }}>{s.t("ล้างตัวกรอง", "Clear filters")}</Btn>} />
      )}
    </div>
  );
}
