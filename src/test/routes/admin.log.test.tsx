import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const listAudit = vi.fn();
vi.mock("@/lib/admin-log.functions", () => ({
  listAudit: (...a: unknown[]) => listAudit(...a),
}));

import type { AuditItem } from "@/lib/admin-log";
import { AuditLog } from "@/routes/admin.log";

function item(over: Partial<AuditItem> = {}): AuditItem {
  return {
    id: 10,
    at: "2026-10-26T05:30:00.000Z",
    actorName: "พี่มิ้นต์",
    action: "message.update",
    targetType: "contact_message",
    targetId: "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b",
    detail: { from: "new", to: "in_progress" },
    ...over,
  };
}

beforeEach(() => {
  listAudit.mockResolvedValue({ items: [item()], hasMore: false });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin/log", () => {
  it("shows who did what, with Thai text and Bangkok time, and no edit or delete controls", async () => {
    render(<AuditLog />);
    expect(await screen.findByText("เปลี่ยนสถานะข้อความจาก ใหม่ เป็น กำลังดูแล")).toBeInTheDocument();
    expect(listAudit).toHaveBeenCalledWith({ data: {} });
    expect(screen.getByText("พี่มิ้นต์")).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date("2026-10-26T05:30:00.000Z").toLocaleString("th-TH", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Bangkok",
        }),
      ),
    ).toBeInTheDocument();
    // 05:30 UTC is 12:30 in Bangkok
    expect(screen.getByText(/12:30|12\.30/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  it("falls back to the raw action for unknown actions and does not overflow on long values", async () => {
    const longId = "x".repeat(300);
    listAudit.mockResolvedValue({
      items: [item({ id: 11, action: "bill.archive", actorName: "ไม่ทราบชื่อ", targetId: longId, detail: {} })],
      hasMore: false,
    });
    render(<AuditLog />);
    const row = (await screen.findByText("bill.archive")).closest("article")!;
    expect(row.className).toContain("break-words");
    expect(row.className).not.toMatch(/overflow-x-scroll|overflow-x-auto/);
    expect(within(row).getByText("ไม่ทราบชื่อ")).toBeInTheDocument();
    expect(within(row).getByText(longId, { exact: false }).className).toContain("break-all");
  });

  it("loads the next page with the last id as the cursor", async () => {
    const first = Array.from({ length: 50 }, (_, i) => item({ id: 100 - i }));
    listAudit.mockResolvedValueOnce({ items: first, hasMore: true });
    render(<AuditLog />);
    await screen.findAllByRole("article");
    expect(screen.getAllByRole("article")).toHaveLength(50);
    listAudit.mockResolvedValueOnce({ items: [item({ id: 50, actorName: "คนเก่า" })], hasMore: false });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ดูเพิ่ม" }));
    });
    expect(listAudit).toHaveBeenLastCalledWith({ data: { before: 51 } });
    expect(await screen.findByText("คนเก่า")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(51);
    expect(screen.queryByRole("button", { name: "ดูเพิ่ม" })).toBeNull();
  });

  it("disables ดูเพิ่ม while loading and ignores a stale page after a reload", async () => {
    const first = Array.from({ length: 50 }, (_, i) => item({ id: 100 - i }));
    listAudit.mockResolvedValueOnce({ items: first, hasMore: true });
    const view = render(<AuditLog />);
    await screen.findAllByRole("article");

    let resolveMore!: (v: unknown) => void;
    listAudit.mockReturnValueOnce(new Promise((r) => (resolveMore = r)));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ดูเพิ่ม" }));
    });
    expect(screen.getByRole("button", { name: "กำลังโหลด…" })).toBeDisabled();

    // remount = fresh load; the slow page from the old mount must not append or leave the button stuck
    view.unmount();
    listAudit.mockResolvedValueOnce({ items: first, hasMore: true });
    render(<AuditLog />);
    await act(async () => {
      resolveMore({ items: [item({ id: 1, actorName: "เก่ามาก" })], hasMore: false });
    });
    await screen.findAllByRole("article");
    expect(screen.queryByText("เก่ามาก")).toBeNull();
    expect(screen.getByRole("button", { name: "ดูเพิ่ม" })).toBeEnabled();
  });

  it("keeps the list and offers a retry when loading more fails", async () => {
    const first = Array.from({ length: 50 }, (_, i) => item({ id: 100 - i }));
    listAudit.mockResolvedValueOnce({ items: first, hasMore: true });
    render(<AuditLog />);
    await screen.findAllByRole("article");
    listAudit.mockRejectedValueOnce(new Error("boom"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ดูเพิ่ม" }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดเพิ่มไม่สำเร็จ ลองอีกครั้งนะ");
    expect(screen.getAllByRole("article")).toHaveLength(50);
    expect(screen.getByRole("button", { name: "ดูเพิ่ม" })).toBeEnabled();
  });

  it("shows an empty state, and a retryable error when loading fails", async () => {
    listAudit.mockResolvedValueOnce({ items: [], hasMore: false });
    render(<AuditLog />);
    expect(await screen.findByText("ยังไม่มีบันทึกการทำงานนะ")).toBeInTheDocument();
    cleanup();

    listAudit.mockRejectedValueOnce(new Error("boom"));
    render(<AuditLog />);
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ลองอีกครั้ง" }));
    });
    await waitFor(() => expect(screen.getByText("เปลี่ยนสถานะข้อความจาก ใหม่ เป็น กำลังดูแล")).toBeInTheDocument());
  });
});
