import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const listTeam = vi.fn();
const setRole = vi.fn();
vi.mock("@/lib/admin-team.functions", () => ({
  listTeam: (...a: unknown[]) => listTeam(...a),
  setRole: (...a: unknown[]) => setRole(...a),
}));

const getAdminMe = vi.fn();
vi.mock("@/lib/admin-me.functions", () => ({ getAdminMe: (...a: unknown[]) => getAdminMe(...a) }));

import { TeamPage } from "@/routes/admin.team";

const OWNER = { userId: "o1", email: "owner@example.com", displayName: "พี่เจ้าของ", role: "owner" as const };
const ADMIN = { userId: "a1", email: "nid@example.com", displayName: "น้องนิด", role: "admin" as const };

beforeEach(() => {
  getAdminMe.mockResolvedValue({ userId: "o1", role: "owner" });
  listTeam.mockResolvedValue([OWNER, ADMIN]);
  setRole.mockResolvedValue({ ok: true });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin/team", () => {
  it("shows staff with roles as text, and the add form and remove button to the owner", async () => {
    render(<TeamPage />);
    expect(await screen.findByText("owner@example.com")).toBeInTheDocument();
    expect(screen.getByText("nid@example.com")).toBeInTheDocument();
    expect(screen.getByText("เจ้าของระบบ")).toBeInTheDocument();
    expect(screen.getByText("แอดมิน")).toBeInTheDocument();
    expect(screen.getByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน")).toBeInTheDocument();
    // The owner cannot remove themselves, so only the admin card has the button.
    expect(screen.getAllByRole("button", { name: "เอาออกจากทีม" })).toHaveLength(1);
  });

  it("shows only the list to an admin who is not the owner", async () => {
    getAdminMe.mockResolvedValue({ userId: "a1", role: "admin" });
    render(<TeamPage />);
    expect(await screen.findByText("nid@example.com")).toBeInTheDocument();
    expect(screen.queryByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน")).toBeNull();
    expect(screen.queryByRole("button", { name: "เอาออกจากทีม" })).toBeNull();
    expect(screen.queryByRole("button", { name: "เพิ่มเป็นแอดมิน" })).toBeNull();
  });

  it("adds an admin by email, confirms, and reloads the list", async () => {
    render(<TeamPage />);
    fireEvent.change(await screen.findByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน"), { target: { value: " New@Example.com " } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "เพิ่มเป็นแอดมิน" }));
    });
    expect(setRole).toHaveBeenCalledWith({ data: { email: "New@Example.com", role: "admin" } });
    expect(await screen.findByText("เพิ่ม New@Example.com เป็นแอดมินแล้ว")).toBeInTheDocument();
    expect(listTeam).toHaveBeenCalledTimes(2);
    expect(screen.getByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน")).toHaveValue("");
  });

  it("shows the server's message next to the form when the email has no account", async () => {
    setRole.mockResolvedValue({ ok: false, message: "ยังไม่มีบัญชีนี้ ให้เขาล็อกอินครั้งแรกก่อน" });
    render(<TeamPage />);
    fireEvent.change(await screen.findByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน"), { target: { value: "ghost@example.com" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "เพิ่มเป็นแอดมิน" }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("ยังไม่มีบัญชีนี้ ให้เขาล็อกอินครั้งแรกก่อน");
    expect(screen.getByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน")).toHaveValue("ghost@example.com");
  });

  it("says so and keeps the typed email when adding fails unexpectedly", async () => {
    setRole.mockRejectedValue(new Error("boom"));
    render(<TeamPage />);
    fireEvent.change(await screen.findByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน"), { target: { value: "x@example.com" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "เพิ่มเป็นแอดมิน" }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("บันทึกไม่สำเร็จ ลองอีกครั้งนะ");
    expect(screen.getByLabelText("อีเมลของคนที่จะเพิ่มเป็นแอดมิน")).toHaveValue("x@example.com");
  });

  it("asks for confirmation before removing, and cancel changes nothing", async () => {
    render(<TeamPage />);
    fireEvent.click(await screen.findByRole("button", { name: "เอาออกจากทีม" }));
    expect(screen.getByText(/เอา nid@example\.com ออกจากทีมนะ/)).toBeInTheDocument();
    expect(setRole).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "ยกเลิก" }));
    expect(setRole).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "เอาออกจากทีม" })).toBeInTheDocument();
  });

  it("removes the admin after confirming and reloads the list", async () => {
    render(<TeamPage />);
    fireEvent.click(await screen.findByRole("button", { name: "เอาออกจากทีม" }));
    listTeam.mockResolvedValueOnce([OWNER]);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ยืนยัน เอาออก" }));
    });
    expect(setRole).toHaveBeenCalledWith({ data: { email: "nid@example.com", role: "requester" } });
    await waitFor(() => expect(screen.queryByText("nid@example.com")).toBeNull());
  });

  it("shows a refusal from the server beside the member being removed", async () => {
    setRole.mockResolvedValue({ ok: false, message: "ต้องมีเจ้าของระบบอย่างน้อย 1 คน" });
    render(<TeamPage />);
    fireEvent.click(await screen.findByRole("button", { name: "เอาออกจากทีม" }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ยืนยัน เอาออก" }));
    });
    const card = screen.getByText("nid@example.com").closest("article")!;
    expect(within(card).getByRole("alert")).toHaveTextContent("ต้องมีเจ้าของระบบอย่างน้อย 1 คน");
  });

  it("shows a retryable error when loading fails", async () => {
    listTeam.mockRejectedValueOnce(new Error("boom"));
    render(<TeamPage />);
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ลองอีกครั้ง" }));
    });
    expect(await screen.findByText("nid@example.com")).toBeInTheDocument();
  });
});
