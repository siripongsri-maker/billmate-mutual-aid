import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signOut = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { signOut: () => signOut() } } }));

const navigate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useNavigate: () => navigate,
}));

const useSession = vi.fn();
vi.mock("@/lib/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/auth")>()),
  useSession: () => useSession(),
}));

const getAdminMe = vi.fn();
vi.mock("@/lib/admin-me.functions", () => ({ getAdminMe: (...a: unknown[]) => getAdminMe(...a) }));

const getAdminOverview = vi.fn();
vi.mock("@/lib/admin-overview.functions", () => ({ getAdminOverview: (...a: unknown[]) => getAdminOverview(...a) }));

import { AdminLayout } from "@/routes/admin";
import { AdminOverviewPage } from "@/routes/admin.index";

function renderAdmin() {
  return render(
    <AdminLayout pathname="/admin">
      <AdminOverviewPage />
    </AdminLayout>,
  );
}

const forbidden = () => Object.assign(new Error("Forbidden: not staff"), { statusCode: 403 });

beforeEach(() => {
  useSession.mockReturnValue({ session: { user: { id: "u" } }, loading: false });
  signOut.mockResolvedValue({ error: null });
  getAdminMe.mockResolvedValue({ userId: "u", role: "admin" });
  getAdminOverview.mockResolvedValue({ newMessages: 0, inProgressMessages: 0, teamCount: 1 });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin", () => {
  it("shows only the refusal, a way home and no numbers when the server says 403", async () => {
    getAdminMe.mockRejectedValue(forbidden());
    renderAdmin();
    expect(await screen.findByText("หน้านี้สำหรับทีมคนละนิด")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /กลับหน้าแรก/ })).toHaveAttribute("href", "/");
    expect(document.body.textContent).not.toMatch(/\d/);
    expect(screen.queryByText("ข้อความใหม่")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
    expect(getAdminOverview).not.toHaveBeenCalled();
  });

  it("also treats a serialized Forbidden message (no statusCode) as a refusal", async () => {
    getAdminMe.mockRejectedValue(new Error("Forbidden: not staff"));
    renderAdmin();
    expect(await screen.findByText("หน้านี้สำหรับทีมคนละนิด")).toBeInTheDocument();
  });

  it("sends a signed-out visitor to login without calling the server", async () => {
    useSession.mockReturnValue({ session: null, loading: false });
    renderAdmin();
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "/login", search: { next: "/admin" }, replace: true }),
    );
    expect(getAdminMe).not.toHaveBeenCalled();
    expect(getAdminOverview).not.toHaveBeenCalled();
  });

  it("waits while the session is loading", () => {
    useSession.mockReturnValue({ session: null, loading: true });
    renderAdmin();
    expect(navigate).not.toHaveBeenCalled();
    expect(getAdminMe).not.toHaveBeenCalled();
  });

  it("signs out and goes to login when the server answers Unauthorized", async () => {
    getAdminMe.mockRejectedValue(new Error("Unauthorized: Invalid token"));
    renderAdmin();
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "/login", search: { next: "/admin" }, replace: true }),
    );
    expect(signOut).toHaveBeenCalled();
  });

  it("shows a retryable message when the access check fails for other reasons", async () => {
    getAdminMe.mockRejectedValueOnce(new Error("boom"));
    renderAdmin();
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดข้อมูลไม่สำเร็จ");
    getAdminOverview.mockResolvedValue({ newMessages: 1, inProgressMessages: 0, teamCount: 1 });
    await act(async () => {
      screen.getByRole("button", { name: "ลองอีกครั้ง" }).click();
    });
    expect(await screen.findByText("ข้อความใหม่")).toBeInTheDocument();
  });

  it("keeps the menu and offers a retry when only the overview numbers fail", async () => {
    getAdminOverview.mockRejectedValueOnce(new Error("boom"));
    renderAdmin();
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดข้อมูลไม่สำเร็จ");
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    getAdminOverview.mockResolvedValue({ newMessages: 2, inProgressMessages: 0, teamCount: 1 });
    await act(async () => {
      screen.getByRole("button", { name: "ลองอีกครั้ง" }).click();
    });
    expect(await screen.findByText("ข้อความใหม่")).toBeInTheDocument();
    expect(getAdminMe).toHaveBeenCalledTimes(1);
  });

  it("shows labelled, clickable counts and the menu for staff", async () => {
    getAdminOverview.mockResolvedValue({ newMessages: 7, inProgressMessages: 3, teamCount: 4 });
    renderAdmin();
    expect(await screen.findByText("ข้อความใหม่")).toBeInTheDocument();
    const newCard = screen.getByRole("link", { name: /ข้อความใหม่.*7.*ข้อความ/ });
    expect(newCard).toHaveAttribute("href", "/admin/messages?status=new");
    expect(screen.getByRole("link", { name: /กำลังดูแล.*3.*ข้อความ/ })).toHaveAttribute(
      "href",
      "/admin/messages?status=in_progress",
    );
    expect(screen.getByRole("link", { name: /สมาชิกทีม.*4.*คน/ })).toHaveAttribute("href", "/admin/team");

    const nav = screen.getByRole("navigation");
    const labels = Array.from(nav.querySelectorAll("a")).map((a) => [a.textContent, a.getAttribute("href")]);
    expect(labels).toEqual([
      ["ภาพรวม", "/admin"],
      ["ข้อความ", "/admin/messages"],
      ["ทีม", "/admin/team"],
      ["บันทึก", "/admin/log"],
    ]);
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent("ภาพรวม");
  });
});
