import type { ReactNode } from "react";

/** True for routes that use the คนละนิด look (/login and /admin, matched by whole segment). */
export function usesKlShell(pathname: string): boolean {
  return /^\/(login|admin)(\/|$)/.test(pathname);
}

export function KlShell({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="kl">
      <header className="kl-header">
        <span className="kl-logo-tile" aria-label="คนละนิด" role="img">
          นิด<span aria-hidden="true">.</span>
        </span>
        {title ? <h1>{title}</h1> : null}
      </header>
      <main className="kl-main">{children}</main>
    </div>
  );
}
