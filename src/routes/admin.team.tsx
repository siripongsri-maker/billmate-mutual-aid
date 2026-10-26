import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StatusPill } from "@/components/kl/StatusPill";
import { getAdminMe, type AdminMe } from "@/lib/admin-me.functions";
import { ROLE_LABELS, type TeamMember } from "@/lib/admin-team";
import { listTeam, setRole } from "@/lib/admin-team.functions";

export const Route = createFileRoute("/admin/team")({
  component: TeamPage,
});

const fieldClass =
  "block w-full min-h-11 rounded-lg border border-[var(--kl-muted)] bg-white px-3 py-2 text-base text-[var(--kl-ink)]";
const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--kl-green)] px-4 py-2 text-base font-semibold text-white disabled:opacity-60";
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--kl-border)] bg-[var(--kl-paper)] px-4 py-2 text-base font-semibold text-[var(--kl-ink)] disabled:opacity-60";
const errorClass = "text-base font-medium text-[var(--kl-coral-ink)]";

const SAVE_FAILED = "บันทึกไม่สำเร็จ ลองอีกครั้งนะ";

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; me: AdminMe; members: TeamMember[] };

export function TeamPage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ kind: "loading" });
    Promise.all([getAdminMe(), listTeam()]).then(
      ([me, members]) => {
        if (active) setState({ kind: "ready", me, members });
      },
      () => {
        if (active) setState({ kind: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const reload = useCallback(async (): Promise<boolean> => {
    try {
      const members = await listTeam();
      setState((prev) => (prev.kind === "ready" ? { ...prev, members } : prev));
      return true;
    } catch {
      return false;
    }
  }, []);

  if (state.kind === "loading") {
    return (
      <p className="py-8 text-center text-base text-[var(--kl-muted)]" role="status">
        กำลังโหลด…
      </p>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="mx-auto max-w-md space-y-4 py-8 text-center">
        <p role="alert" className={errorClass}>
          โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ
        </p>
        <button type="button" className={primaryBtn} onClick={() => setAttempt((n) => n + 1)}>
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  const isOwner = state.me.role === "owner";

  return (
    <section aria-labelledby="admin-team-heading" className="min-w-0">
      <h2 id="admin-team-heading" className="mb-4 text-xl font-bold">
        ทีมงาน
      </h2>

      {isOwner ? <AddAdminForm onAdded={reload} /> : <p className="mb-5 text-base">เฉพาะเจ้าของระบบที่เพิ่มหรือเอาแอดมินออกได้นะ</p>}

      <ul className="space-y-3">
        {state.members.map((m) => (
          <li key={m.userId} className="min-w-0">
            <MemberCard member={m} canRemove={isOwner && m.role === "admin" && m.userId !== state.me.userId} onChanged={reload} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function AddAdminForm({ onAdded }: { onAdded: () => Promise<boolean> }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      const res = await setRole({ data: { email: value, role: "admin" } });
      if (res.ok) {
        setEmail("");
        setDone(`เพิ่ม ${value} เป็นแอดมินแล้ว`);
        await onAdded();
      } else {
        setError(res.message);
      }
    } catch {
      setError(SAVE_FAILED);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-6 space-y-3 rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-paper)] p-4 sm:p-5">
      <div>
        <label htmlFor="team-add-email" className="mb-1 block text-base font-semibold">
          อีเมลของคนที่จะเพิ่มเป็นแอดมิน
        </label>
        <input
          id="team-add-email"
          type="email"
          autoComplete="off"
          inputMode="email"
          className={fieldClass}
          value={email}
          maxLength={254}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={primaryBtn} disabled={busy || email.trim() === ""}>
          {busy ? "กำลังบันทึก…" : "เพิ่มเป็นแอดมิน"}
        </button>
        {done ? (
          <p role="status" className="text-base font-medium text-[var(--kl-deep)]">
            {done}
          </p>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      ) : null}
    </form>
  );
}

function MemberCard({
  member: m,
  canRemove,
  onChanged,
}: {
  member: TeamMember;
  canRemove: boolean;
  onChanged: () => Promise<boolean>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      const res = await setRole({ data: { email: m.email, role: "requester" } });
      if (res.ok) {
        await onChanged();
      } else {
        setError(res.message);
      }
    } catch {
      setError(SAVE_FAILED);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="min-w-0 break-words rounded-2xl border border-[var(--kl-border)] bg-[var(--kl-paper)] p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="break-words">{m.displayName ?? "ไม่ได้ระบุชื่อเรียก"}</h3>
          <p className="break-all text-base text-[var(--kl-muted)]">{m.email}</p>
        </div>
        <StatusPill tone={m.role === "owner" ? "done" : "progress"}>{ROLE_LABELS[m.role]}</StatusPill>
      </div>

      {canRemove && !confirming ? (
        <div className="mt-3">
          <button type="button" className={secondaryBtn} onClick={() => setConfirming(true)}>
            เอาออกจากทีม
          </button>
        </div>
      ) : null}

      {canRemove && confirming ? (
        <div className="mt-3 space-y-3" role="group" aria-label={`ยืนยันการเอา ${m.email} ออกจากทีม`}>
          <p className="text-base font-semibold">{`เอา ${m.email} ออกจากทีมนะ? เขาจะเข้าหน้าทีมงานไม่ได้อีก`}</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={primaryBtn} disabled={busy} onClick={remove}>
              {busy ? "กำลังบันทึก…" : "ยืนยัน เอาออก"}
            </button>
            <button
              type="button"
              className={secondaryBtn}
              disabled={busy}
              onClick={() => {
                setConfirming(false);
                setError(null);
              }}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className={`${errorClass} mt-3`}>
          {error}
        </p>
      ) : null}
    </article>
  );
}
