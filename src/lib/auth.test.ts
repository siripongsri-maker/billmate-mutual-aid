import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithOtp = vi.fn();
const verifyOtp = vi.fn();
const signInWithOAuth = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithOtp: (...a: unknown[]) => signInWithOtp(...a),
      verifyOtp: (...a: unknown[]) => verifyOtp(...a),
      signInWithOAuth: (...a: unknown[]) => signInWithOAuth(...a),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

import {
  authErrorMessage,
  safeNext,
  sendEmailCode,
  signInWithGoogle,
  verifyEmailCode,
} from "./auth";

const RATE_LIMIT = "ขอรหัสบ่อยเกินไป รอสักครู่แล้วลองใหม่นะ";
const BAD_CODE = "รหัสไม่ถูกต้องหรือหมดอายุ ขอรหัสใหม่ได้เลย";
const GENERIC = "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้งนะ";

beforeEach(() => {
  signInWithOtp.mockReset();
  verifyOtp.mockReset();
  signInWithOAuth.mockReset();
});

describe("safeNext", () => {
  it("keeps in-site paths", () => {
    expect(safeNext("/admin")).toBe("/admin");
    expect(safeNext("/admin/bills?x=1")).toBe("/admin/bills?x=1");
  });
  it("rejects anything that could leave the site", () => {
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext("/\\evil.com")).toBe("/");
    expect(safeNext("admin")).toBe("/");
    expect(safeNext("")).toBe("/");
    expect(safeNext(null)).toBe("/");
  });
});

describe("sendEmailCode", () => {
  it("asks Supabase for an emailed code and allows new users", async () => {
    signInWithOtp.mockResolvedValue({ error: null });
    const res = await sendEmailCode("a@b.co");
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "a@b.co",
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/login?next=%2F` },
    });
    expect(res).toEqual({ ok: true });
  });
  it("passes the page's next path into the magic-link redirect", async () => {
    signInWithOtp.mockResolvedValue({ error: null });
    await sendEmailCode("a@b.co", "/admin/messages?status=new");
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "a@b.co",
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent("/admin/messages?status=new")}`,
      },
    });
  });
  it("turns a rate-limit error into a Thai message", async () => {
    signInWithOtp.mockResolvedValue({ error: { status: 429, code: "over_email_send_rate_limit", message: "x" } });
    expect(await sendEmailCode("a@b.co")).toEqual({ ok: false, message: RATE_LIMIT });
  });
});

describe("verifyEmailCode", () => {
  it("verifies with type email", async () => {
    verifyOtp.mockResolvedValue({ error: null });
    const res = await verifyEmailCode("a@b.co", "123456");
    expect(verifyOtp).toHaveBeenCalledWith({ email: "a@b.co", token: "123456", type: "email" });
    expect(res).toEqual({ ok: true });
  });
  it("returns the Thai bad-code message on failure", async () => {
    verifyOtp.mockResolvedValue({ error: { status: 403, code: "otp_expired", message: "Token has expired" } });
    expect(await verifyEmailCode("a@b.co", "000000")).toEqual({ ok: false, message: BAD_CODE });
  });
});

describe("signInWithGoogle", () => {
  it("redirects back to /login with the encoded next path", async () => {
    signInWithOAuth.mockResolvedValue({ error: null });
    const res = await signInWithGoogle("/admin/bills?x=1");
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login?next=${encodeURIComponent("/admin/bills?x=1")}` },
    });
    expect(res).toEqual({ ok: true });
  });
  it("returns a Thai message when Google sign-in fails to start", async () => {
    signInWithOAuth.mockResolvedValue({ error: { status: 400, message: "provider is not enabled" } });
    expect(await signInWithGoogle("/")).toEqual({ ok: false, message: GENERIC });
  });
});

describe("authErrorMessage", () => {
  it("maps rate limiting", () => {
    expect(authErrorMessage({ status: 429 })).toBe(RATE_LIMIT);
    expect(authErrorMessage({ code: "over_email_send_rate_limit" })).toBe(RATE_LIMIT);
  });
  it("maps wrong or expired codes", () => {
    expect(authErrorMessage({ code: "otp_expired" })).toBe(BAD_CODE);
    expect(authErrorMessage({ message: "Token has expired or is invalid" })).toBe(BAD_CODE);
  });
  it("falls back to a gentle generic message", () => {
    expect(authErrorMessage({})).toBe(GENERIC);
    expect(authErrorMessage({ status: 500, message: "boom" })).toBe(GENERIC);
  });
});
