import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthResult = { ok: true } | { ok: false; message: string };

type AuthErrorLike = { status?: number | undefined; code?: string | undefined; message?: string | undefined };

const MSG_RATE_LIMIT = "ขอรหัสบ่อยเกินไป รอสักครู่แล้วลองใหม่นะ";
const MSG_BAD_CODE = "รหัสไม่ถูกต้องหรือหมดอายุ ขอรหัสใหม่ได้เลย";
const MSG_BAD_EMAIL = "กรอกอีเมลให้ถูกต้อง";
const MSG_GENERIC = "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้งนะ";

/** Thai, non-blaming message for an auth error. */
export function authErrorMessage(err: AuthErrorLike): string {
  const code = err.code ?? "";
  if (err.status === 429 || code === "over_email_send_rate_limit" || code === "over_request_rate_limit") {
    return MSG_RATE_LIMIT;
  }
  if (code === "otp_expired" || code === "invalid_otp" || /expired|invalid.*(token|otp|code)|(token|otp|code).*invalid/i.test(err.message ?? "")) {
    return MSG_BAD_CODE;
  }
  if (code === "email_address_invalid" || code === "validation_failed") return MSG_BAD_EMAIL;
  return MSG_GENERIC;
}

/** Only in-site paths ("/x", never "//x" or "/\x"); anything else becomes "/". */
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  return raw;
}

function toResult(error: AuthErrorLike | null): AuthResult {
  return error ? { ok: false, message: authErrorMessage(error) } : { ok: true };
}

export async function sendEmailCode(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  return toResult(error);
}

export async function verifyEmailCode(email: string, code: string): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  return toResult(error);
}

export async function signInWithGoogle(next: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}` },
  });
  return toResult(error);
}

export function useSession(): { session: Session | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: current } }) => {
      if (!active) return;
      setSession(current);
      setLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}
