import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  redirect,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";
import { usesKlShell } from "@/components/kl/KlShell";
import { legacyRedirect } from "@/lib/legacy-routes";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">ไม่พบหน้านี้ · Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            กลับหน้าแรก · Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">เกิดข้อผิดพลาด · Something went wrong</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">ลองอีกครั้ง · Retry</button>
          <a href="/" className="rounded-full border bg-card px-5 py-2.5 text-sm font-semibold">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: ({ location }) => {
    const target = legacyRedirect(location.pathname);
    if (target) throw redirect({ href: target, reloadDocument: true });
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "chuaykan — Life happens. We help." },
      { name: "description", content: "chuaykan demo: a Thai mutual aid bill-sharing prototype. No real payments." },
      { property: "og:title", content: "chuaykan — Life happens. We help." },
      { property: "og:description", content: "A Thai/English mutual aid bill-sharing prototype (demo only)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#087F70" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Mali:wght@600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  staticData: { sitemap: false },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {usesKlShell(pathname) ? (
          <Outlet />
        ) : (
          <AppShell>
            <Outlet />
          </AppShell>
        )}
        <Toaster position="top-center" richColors />
      </StoreProvider>
    </QueryClientProvider>
  );
}
