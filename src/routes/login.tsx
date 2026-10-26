import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KlShell } from "@/components/kl/KlShell";
import { safeNext, sendEmailCode, signInWithGoogle, useSession, verifyEmailCode } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  staticData: { sitemap: false },
  validateSearch: (search: Record<string, unknown>): { next?: string } =>
    typeof search["next"] === "string" ? { next: search["next"] } : {},
  head: () => ({ meta: [{ title: "เข้าสู่ระบบ — คนละนิด" }] }),
  component: LoginRoute,
});

function LoginRoute() {
  const { next } = Route.useSearch();
  return <LoginPage next={safeNext(next)} />;
}

const RESEND_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = "kl-field";
const primaryBtn = "kl-button kl-button--primary";
const secondaryBtn = "kl-button kl-button--secondary";
const linkBtn =
  "inline-flex min-h-11 items-center px-1 text-base font-semibold text-[var(--kl-green)] underline underline-offset-4";
const errorClass = "mt-2 text-base font-medium text-[var(--kl-coral-ink)]";

export function LoginPage({ next }: { next: string }) {
  const navigate = useNavigate();
  const { session } = useSession();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (session) navigate({ to: safeNext(next), replace: true });
  }, [session, next, navigate]);

  const counting = cooldown > 0;
  const [announcement, setAnnouncement] = useState("");
  const [wasCounting, setWasCounting] = useState(false);
  if (counting !== wasCounting) {
    setWasCounting(counting);
    if (counting) setAnnouncement(`ขอรหัสใหม่ได้ใน ${RESEND_SECONDS} วินาที`);
    else if (step === "code") setAnnouncement("ขอรหัสใหม่ได้แล้ว");
    else setAnnouncement("");
  }
  useEffect(() => {
    if (!counting) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [counting]);

  async function requestCode(e?: FormEvent) {
    e?.preventDefault();
    const clean = email.trim();
    if (!EMAIL_PATTERN.test(clean)) {
      setEmailError("กรอกอีเมลให้ถูกต้อง");
      return;
    }
    setEmailError("");
    setBusy(true);
    const res = await sendEmailCode(clean, next);
    setBusy(false);
    if (!res.ok) {
      // On the code step a failed resend keeps the person where they are.
      if (step === "email") setEmailError(res.message);
      else setCodeError(res.message);
      return;
    }
    setEmail(clean);
    setCodeError("");
    setStep("code");
    setCooldown(RESEND_SECONDS);
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    if (code.length !== 6) {
      setCodeError("กรอกรหัส 6 หลักที่ได้รับทางอีเมลนะ");
      return;
    }
    setCodeError("");
    setBusy(true);
    const res = await verifyEmailCode(email, code);
    setBusy(false);
    // Success is picked up by useSession, which then navigates; the code stays put on failure.
    if (!res.ok) setCodeError(res.message);
  }

  async function google() {
    setGoogleError("");
    const res = await signInWithGoogle(next);
    if (!res.ok) setGoogleError(res.message);
  }

  return (
    <KlShell title="เข้าสู่ระบบ">
      <div className="kl-login-layout">
        <div className="kl-login-art" aria-hidden="true">
          <img src="/konlanid/assets/helping-hand.webp" alt="" width="800" height="800" />
        </div>
        <div className="kl-login-card space-y-6">
          {/* Always mounted so screen readers pick up changes. Announces once when the resend cooldown starts and once when it ends, not every second. */}
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
          {step === "email" ? (
            <form onSubmit={requestCode} noValidate className="space-y-4">
              <p className="text-base">ใช้อีเมลของทีม เราจะส่งรหัส 6 หลักไปให้ ไม่ต้องจำรหัสผ่านนะ</p>
              <div>
                <label htmlFor="login-email" className="mb-1 block text-base font-semibold">
                  อีเมล
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? "login-email-error" : undefined}
                  className={inputClass}
                />
                {emailError ? (
                  <p id="login-email-error" role="alert" className={errorClass}>
                    {emailError}
                  </p>
                ) : null}
              </div>
              <button type="submit" disabled={busy} className={`${primaryBtn} w-full`}>
                ส่งรหัสเข้าอีเมล
              </button>
            </form>
          ) : (
            <form onSubmit={submitCode} noValidate className="space-y-4">
              <p className="text-base">
                ส่งรหัส 6 หลักไปที่ <strong>{email}</strong> แล้ว ลองดูในกล่องจดหมาย หรือโฟลเดอร์สแปมอีกทีนะ
              </p>
              <div>
                <label htmlFor="login-code" className="mb-1 block text-base font-semibold">
                  รหัส 6 หลัก
                </label>
                <input
                  id="login-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]*"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  aria-invalid={codeError ? true : undefined}
                  aria-describedby={codeError ? "login-code-error" : undefined}
                  className={`${inputClass} tracking-[0.4em] text-center text-xl`}
                />
                {codeError ? (
                  <p id="login-code-error" role="alert" className={errorClass}>
                    {codeError}
                  </p>
                ) : null}
              </div>
              <button type="submit" disabled={busy} className={`${primaryBtn} w-full`}>
                ยืนยันรหัส
              </button>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => requestCode()}
                  disabled={busy || cooldown > 0}
                  className={`${secondaryBtn} sm:w-auto`}
                >
                  ขอรหัสใหม่
                </button>
                {cooldown > 0 ? (
                  <span className="text-base text-[var(--kl-muted)]">ขอใหม่ได้ในอีก {cooldown} วินาที</span>
                ) : null}
              </div>
              <button
                type="button"
                className={linkBtn}
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setCodeError("");
                  setCooldown(0);
                }}
              >
                เปลี่ยนอีเมล
              </button>
            </form>
          )}

          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-[var(--kl-border)]" />
            <span className="text-base text-[var(--kl-muted)]">หรือ</span>
            <span className="h-px flex-1 bg-[var(--kl-border)]" />
          </div>

          <div>
            <button type="button" onClick={google} className={`${secondaryBtn} w-full`}>
              เข้าสู่ระบบด้วย Google
            </button>
            {googleError ? (
              <p role="alert" className={errorClass}>
                {googleError}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </KlShell>
  );
}
