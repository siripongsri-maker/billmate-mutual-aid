import type { ReactNode } from "react";

export type StatusTone = "new" | "progress" | "done" | "muted" | "danger";

// One simple stroke icon per tone so the status never relies on colour alone.
const ICONS: Record<StatusTone, ReactNode> = {
  new: <path d="M12 3l2.4 5.6 6.1.5-4.6 4 1.4 6-5.3-3.2L6.7 19l1.4-6-4.6-4 6.1-.5z" />,
  progress: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  done: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l3 3 5-6" />
    </>
  ),
  muted: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8" />
    </>
  ),
  danger: (
    <>
      <path d="M12 3.5l9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
};

export function StatusPill({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return (
    <span className={`kl-pill kl-pill--${tone}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {ICONS[tone]}
      </svg>
      <span>{children}</span>
    </span>
  );
}
