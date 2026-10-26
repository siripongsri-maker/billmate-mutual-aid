import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: {} } }));

const navigate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useNavigate: () => navigate,
}));

const useSession = vi.fn();
const sendEmailCode = vi.fn();
const verifyEmailCode = vi.fn();
const signInWithGoogle = vi.fn();
vi.mock("@/lib/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/auth")>()),
  useSession: () => useSession(),
  sendEmailCode: (...a: unknown[]) => sendEmailCode(...a),
  verifyEmailCode: (...a: unknown[]) => verifyEmailCode(...a),
  signInWithGoogle: (...a: unknown[]) => signInWithGoogle(...a),
}));

import { LoginPage } from "@/routes/login";

const BAD_CODE = "รหัสไม่ถูกต้องหรือหมดอายุ ขอรหัสใหม่ได้เลย";

async function submitEmail(value: string) {
  fireEvent.change(screen.getByLabelText("อีเมล"), { target: { value } });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "ส่งรหัสเข้าอีเมล" }));
  });
}

beforeEach(() => {
  useSession.mockReturnValue({ session: null, loading: false });
  sendEmailCode.mockResolvedValue({ ok: true });
  verifyEmailCode.mockResolvedValue({ ok: true });
  signInWithGoogle.mockResolvedValue({ ok: true });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  it("shows an error next to the field for a malformed email and does not send", async () => {
    render(<LoginPage next="/admin" />);
    await submitEmail("not-an-email");
    expect(screen.getByRole("alert")).toHaveTextContent("กรอกอีเมลให้ถูกต้อง");
    expect(sendEmailCode).not.toHaveBeenCalled();
  });

  it("sends the code and then shows the code field", async () => {
    render(<LoginPage next="/admin" />);
    await submitEmail("team@example.org");
    expect(sendEmailCode).toHaveBeenCalledWith("team@example.org", "/admin");
    const input = screen.getByLabelText("รหัส 6 หลัก");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("keeps resend disabled for 60 seconds", async () => {
    vi.useFakeTimers();
    render(<LoginPage next="/admin" />);
    await submitEmail("team@example.org");
    const resend = screen.getByRole("button", { name: /ขอรหัสใหม่/ });
    expect(resend).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(59_000);
    });
    expect(screen.getByRole("button", { name: /ขอรหัสใหม่/ })).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(screen.getByRole("button", { name: /ขอรหัสใหม่/ })).toBeEnabled();
  });

  it("announces the cooldown once at start and once at the end, not every second", async () => {
    vi.useFakeTimers();
    render(<LoginPage next="/admin" />);
    await submitEmail("team@example.org");
    const live = () => document.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(live()).toHaveTextContent("ขอรหัสใหม่ได้ใน 60 วินาที");
    // the ticking number is on screen but is not itself a live region
    const ticking = screen.getByText(/ขอใหม่ได้ในอีก 60 วินาที/);
    expect(ticking.closest("[aria-live]")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(screen.getByText(/ขอใหม่ได้ในอีก 50 วินาที/).closest("[aria-live]")).toBeNull();
    expect(live()).toHaveTextContent("ขอรหัสใหม่ได้ใน 60 วินาที");
    act(() => {
      vi.advanceTimersByTime(50_000);
    });
    expect(live()).toHaveTextContent("ขอรหัสใหม่ได้แล้ว");
    expect(screen.queryByText(/ขอใหม่ได้ในอีก/)).toBeNull();
  });

  it("shows the failure message and keeps the typed code when verify fails", async () => {
    verifyEmailCode.mockResolvedValue({ ok: false, message: BAD_CODE });
    render(<LoginPage next="/admin" />);
    await submitEmail("team@example.org");
    const input = screen.getByLabelText("รหัส 6 หลัก") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123456" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ยืนยันรหัส" }));
    });
    expect(verifyEmailCode).toHaveBeenCalledWith("team@example.org", "123456");
    expect(screen.getByRole("alert")).toHaveTextContent(BAD_CODE);
    expect((screen.getByLabelText("รหัส 6 หลัก") as HTMLInputElement).value).toBe("123456");
  });

  it("starts Google sign-in with the next path", async () => {
    render(<LoginPage next="/admin/bills" />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "เข้าสู่ระบบด้วย Google" }));
    });
    expect(signInWithGoogle).toHaveBeenCalledWith("/admin/bills");
  });

  it("goes to the safe next path once there is a session", () => {
    useSession.mockReturnValue({ session: { user: { id: "u" } }, loading: false });
    render(<LoginPage next="//evil.com" />);
    expect(navigate).toHaveBeenCalledWith({ to: "/", replace: true });
  });
});
