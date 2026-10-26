import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { KlShell } from "@/components/kl/KlShell";
import { supabase } from "@/integrations/supabase/client";
import { isForbidden, isUnauthorized } from "@/lib/admin-access";
import { useSession } from "@/lib/auth";
import { getAdminMe } from "@/lib/admin-me.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "ทีมงาน — คนละนิด" }, { name: "robots", content: "noindex" }] }),
  component: AdminRoute,
});

function AdminRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AdminLayout pathname={pathname}>
      <Outlet />
    </AdminLayout>
  );
}

const NAV_ITEMS = [
  { label: "ภาพรวม", href: "/admin" },
  { label: "ข้อความ", href: "/admin/messages" },
  { label: "ทีม", href: "/admin/team" },
  { label: "บันทึก", href: "/admin/log" },
] as const;

const btnClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--kl-green)] px-4 py-2 text-base font-semibold text-white";
const linkClass = "inline-flex min-h-11 items-center px-1 text-base font-semibold text-[var(--kl-green)] underline underline-offset-4";

type State =
  | { kind: "loading" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "ready" };

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminLayout({ pathname = "/admin", children }: { pathname?: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const signedIn = Boolean(session);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  const goToLogin = useCallback(() => {
    const next = `${pathname}${window.location.search}`;
    navigate({ to: "/login", search: { next }, replace: true });
  }, [navigate, pathname]);

  useEffect(() => {
    if (loading) return;
    if (!signedIn) {
      goToLogin();
      return;
    }
    let active = true;
    setState({ kind: "loading" });
    getAdminMe().then(
      () => {
        if (active) setState({ kind: "ready" });
      },
      async (err: unknown) => {
        if (!active) return;
        if (isForbidden(err)) {
          setState({ kind: "forbidden" });
        } else if (isUnauthorized(err)) {
          // The browser still holds a session the server rejects; drop it so /login does not bounce straight back here.
          try {
            await supabase.auth.signOut();
          } catch {
            /* nothing more to do — the login page still opens */
          }
          if (active) goToLogin();
        } else {
          setState({ kind: "error" });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [loading, signedIn, attempt, goToLogin]);

  if (state.kind === "forbidden") {
    return (
      <KlShell>
        <div className="mx-auto max-w-md space-y-4 py-8 text-center">
          <p className="text-xl font-semibold">หน้านี้สำหรับทีมคนละนิด</p>
          <a href="/" className={linkClass}>
            กลับหน้าแรก
          </a>
        </div>
      </KlShell>
    );
  }

  if (state.kind === "error") {
    return (
      <KlShell>
        <div className="mx-auto max-w-md space-y-4 py-8 text-center">
          <p role="alert" className="text-base font-medium text-[var(--kl-coral-ink)]">
            โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ
          </p>
          <button type="button" className={btnClass} onClick={() => setAttempt((n) => n + 1)}>
            ลองอีกครั้ง
          </button>
        </div>
      </KlShell>
    );
  }

  if (state.kind === "loading") {
    return (
      <KlShell>
        <p className="py-8 text-center text-base text-[var(--kl-muted)]" role="status">
          กำลังโหลด…
        </p>
      </KlShell>
    );
  }

  return (
    <KlShell title="ทีมคนละนิด">
      <nav aria-label="เมนูทีมงาน" className="mb-6 flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-lg border px-4 py-2 text-base font-semibold no-underline ${
                active
                  ? "border-[var(--kl-green)] bg-[var(--kl-green)] !text-white"
                  : "border-[var(--kl-border)] bg-[var(--kl-paper)]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      {children}
    </KlShell>
  );
}
