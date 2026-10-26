import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Search, PlusCircle, Users, User, Bell, Leaf, Info, Building2, ShieldCheck, FileText } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useStore, type Role } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const s = useStore();
  const { t } = s;
  const loc = useLocation();
  const nav = useNavigate();
  const unread = s.notifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (!s.onboarded && loc.pathname !== "/onboarding") {
      const raw = typeof window !== "undefined" ? localStorage.getItem("billmate-demo-v1") : null;
      if (!raw || !JSON.parse(raw).onboarded) nav({ to: "/onboarding" });
    }
  }, [s.onboarded, loc.pathname, nav]);

  const main = [
    { to: "/", icon: Home, label: t("หน้าแรก", "Home") },
    { to: "/browse", icon: Search, label: t("ค้นหาบิล", "Browse") },
    { to: "/requests/new", icon: PlusCircle, label: t("ขอช่วย", "Ask help") },
    { to: "/circles", icon: Users, label: t("วงช่วยเหลือ", "Circles") },
    { to: "/profile", icon: User, label: t("โปรไฟล์", "Profile") },
  ] as const;
  const more = [
    { to: "/requests", icon: FileText, label: t("คำขอของฉัน", "My requests") },
    { to: "/impact", icon: Leaf, label: t("รอยเท้าการให้", "Footprint") },
    { to: "/notifications", icon: Bell, label: t("การแจ้งเตือน", "Notifications") },
    { to: "/how-it-works", icon: Info, label: t("ความปลอดภัย", "Trust & safety") },
    { to: "/corporate", icon: Building2, label: t("องค์กรสมทบ", "Corporate match") },
    { to: "/moderator", icon: ShieldCheck, label: t("ผู้ตรวจสอบ", "Moderator") },
  ] as const;

  const isActive = (to: string) => (to === "/" ? loc.pathname === "/" : loc.pathname === to);

  if (loc.pathname === "/onboarding") return <><DemoBanner />{children}</>;

  return (
    <div className="min-h-screen">
      <DemoBanner />
      <div className="md:flex">
        <aside className="hidden md:flex md:w-64 md:flex-col md:sticky md:top-9 md:h-[calc(100vh-2.25rem)] border-r bg-card p-5 gap-1">
          <Link to="/" className="mb-6 block">
            <Logo />
          </Link>
          {[...main, ...more].map((i) => (
            <Link key={i.to} to={i.to} className={cn("press flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", isActive(i.to) ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              <i.icon className="h-5 w-5" /> {i.label}
              {i.to === "/notifications" && unread > 0 && <span className="ml-auto rounded-full bg-coral px-2 text-xs text-coral-foreground">{unread}</span>}
            </Link>
          ))}
          <div className="mt-auto"><RoleSwitch /></div>
        </aside>
        <div className="flex-1 min-w-0">
          <header className="sticky top-9 z-20 flex items-center justify-between gap-2 bg-background/90 backdrop-blur px-4 py-3 md:px-8 border-b md:border-none">
            <Link to="/" className="md:hidden"><Logo /></Link>
            <div className="hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="md:hidden"><RoleSwitch compact /></div>
              <button onClick={() => s.set((x) => ({ ...x, lang: x.lang === "th" ? "en" : "th" }))} className="press rounded-full border bg-card px-3 py-1.5 text-sm font-semibold" aria-label="Toggle language">
                {s.lang === "th" ? "EN" : "ไทย"}
              </button>
              <Link to="/notifications" className="press relative grid h-9 w-9 place-items-center rounded-full border bg-card" aria-label={t("การแจ้งเตือน", "Notifications")}>
                <Bell className="h-4 w-4" />
                {unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-coral ring-2 ring-background" />}
              </Link>
            </div>
          </header>
          <main key={loc.pathname} className="mx-auto max-w-5xl px-4 pb-28 pt-4 md:px-8 md:pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">{children}</main>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]" aria-label="Main">
        <div className="grid grid-cols-5">
          {main.map((i) => (
            <Link key={i.to} to={i.to} className={cn("press flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium", isActive(i.to) ? "text-primary" : "text-muted-foreground")}>
              <i.icon className={cn("h-6 w-6", i.to === "/requests/new" && "text-coral")} /> {i.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-display font-bold">b</span>
      <span className="font-display text-xl font-semibold tracking-tight">bill<span className="text-coral">mate</span></span>
    </span>
  );
}

function DemoBanner() {
  const { t } = useStore();
  return (
    <div className="sticky top-0 z-40 flex h-9 items-center justify-center bg-foreground px-3 text-center text-xs font-semibold text-background">
      ⚠️ {t("เดโมต้นแบบ · ไม่มีการชำระเงินจริง · ข้อมูลทั้งหมดเป็นเรื่องสมมติ", "DEMO PROTOTYPE · No real payments · All data is fictional")}
    </div>
  );
}

function RoleSwitch({ compact }: { compact?: boolean }) {
  const s = useStore();
  const roles: { id: Role; th: string; en: string }[] = [
    { id: "helper", th: "ผู้ให้", en: "Helper" },
    { id: "requester", th: "ผู้ขอ", en: "Requester" },
    { id: "moderator", th: "ผู้ตรวจ", en: "Moderator" },
  ];
  return (
    <label className={cn("block", !compact && "rounded-xl bg-muted p-3")}>
      {!compact && <span className="mb-1 block text-xs font-semibold text-muted-foreground">{s.t("บทบาทเดโม", "Demo role")}</span>}
      <select
        value={s.role}
        onChange={(e) => s.set((x) => ({ ...x, role: e.target.value as Role }))}
        className="w-full rounded-full border bg-card px-3 py-1.5 text-sm font-semibold"
        aria-label={s.t("สลับบทบาทเดโม", "Switch demo role")}
      >
        {roles.map((r) => <option key={r.id} value={r.id}>{s.t(r.th, r.en)}</option>)}
      </select>
    </label>
  );
}
