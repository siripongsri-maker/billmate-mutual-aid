import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const listMessages = vi.fn();
const updateMessage = vi.fn();
vi.mock("@/lib/admin-messages.functions", () => ({
  listMessages: (...a: unknown[]) => listMessages(...a),
  updateMessage: (...a: unknown[]) => updateMessage(...a),
}));

import { TOPIC_LABELS, type ContactMessage } from "@/lib/admin-messages";
import { MessagesInbox } from "@/routes/admin.messages";

const COUNTS = { new: 3, in_progress: 2, done: 1, spam: 0 };

function msg(over: Partial<ContactMessage> = {}): ContactMessage {
  return {
    id: "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b",
    createdAt: "2026-10-26T05:30:00.000Z",
    topic: "ask_help",
    displayName: "น้องใบบัว",
    contact: "line: bua123",
    message: "ค่าไฟค้างอยู่ ช่วยดูให้หน่อยนะ",
    billId: null,
    amount: null,
    status: "new",
    teamNote: null,
    ...over,
  };
}

function renderInbox(status?: "new" | "in_progress" | "done" | "spam" | undefined, onStatusChange = vi.fn()) {
  render(<MessagesInbox status={status} onStatusChange={onStatusChange} />);
  return onStatusChange;
}

beforeEach(() => {
  listMessages.mockResolvedValue({ items: [msg()], counts: COUNTS, hasMore: false });
  updateMessage.mockResolvedValue({ ok: true });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("/admin/messages", () => {
  it("renders a 2,000-character message with emoji and no contact without breaking layout", async () => {
    const long = `${"สวัสดีค่ะ 🙏💚 ".repeat(150)}`.slice(0, 2000);
    listMessages.mockResolvedValue({
      items: [msg({ message: long, contact: null, displayName: null })],
      counts: COUNTS,
      hasMore: false,
    });
    renderInbox();
    expect(await screen.findByText("ไม่ได้ให้ช่องทางติดต่อ")).toBeInTheDocument();
    const body = screen.getByText(long, { exact: false });
    expect(body.className).toContain("break-words");
    expect(body.className).toContain("whitespace-pre-wrap");
    const card = body.closest("article")!;
    expect(card.className).toContain("break-words");
    expect(card.className).not.toMatch(/overflow-x-scroll|overflow-x-auto/);
  });

  it("labels the topic from TOPIC_LABELS and shows Thai time, amount and bill id", async () => {
    listMessages.mockResolvedValue({
      items: [msg({ topic: "paid", billId: "B-102", amount: 1250 })],
      counts: COUNTS,
      hasMore: false,
    });
    renderInbox();
    expect(await screen.findByRole("heading", { name: TOPIC_LABELS.paid })).toBeInTheDocument();
    expect(screen.getByText(/B-102/)).toBeInTheDocument();
    expect(screen.getByText(/฿1,250/)).toBeInTheDocument();
    // 05:30 UTC is 12:30 in Bangkok, whatever timezone the browser or test runner is in.
    expect(screen.getByText(new Date("2026-10-26T05:30:00.000Z").toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Bangkok" }))).toBeInTheDocument();
    expect(screen.getByText(/12[:.]30/)).toBeInTheDocument();
  });

  it("shows the status as text and counts on the filter chips", async () => {
    renderInbox("new");
    await screen.findByRole("heading", { name: TOPIC_LABELS.ask_help });
    expect(listMessages).toHaveBeenCalledWith({ data: { status: "new" } });
    const group = screen.getByRole("group", { name: "กรองตามสถานะ" });
    expect(within(group).getByRole("button", { name: /ทั้งหมด.*6/ })).toBeInTheDocument();
    expect(within(group).getByRole("button", { name: /ใหม่.*3/ })).toHaveAttribute("aria-pressed", "true");
    expect(within(group).getByRole("button", { name: /กำลังดูแล.*2/ })).toHaveAttribute("aria-pressed", "false");
    expect(within(group).getByRole("button", { name: /สแปม.*0/ })).toBeInTheDocument();
  });

  it("asks the page to change the filter when a chip is pressed", async () => {
    const onStatusChange = renderInbox();
    await screen.findByRole("heading", { name: TOPIC_LABELS.ask_help });
    fireEvent.click(screen.getByRole("button", { name: /กำลังดูแล/ }));
    expect(onStatusChange).toHaveBeenCalledWith("in_progress");
    fireEvent.click(screen.getByRole("button", { name: /ทั้งหมด/ }));
    expect(onStatusChange).toHaveBeenLastCalledWith(undefined);
  });

  it("keeps the typed note and says so when saving fails", async () => {
    updateMessage.mockRejectedValue(new Error("boom"));
    renderInbox();
    const note = await screen.findByLabelText("โน้ตทีม");
    fireEvent.change(note, { target: { value: "โทรหาแล้ว ไม่รับสาย" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("บันทึกไม่สำเร็จ ลองอีกครั้งนะ");
    expect(screen.getByLabelText("โน้ตทีม")).toHaveValue("โทรหาแล้ว ไม่รับสาย");
  });

  it("saves the chosen status and note, then confirms and updates the counts", async () => {
    renderInbox();
    fireEvent.change(await screen.findByLabelText("สถานะ"), { target: { value: "in_progress" } });
    fireEvent.change(screen.getByLabelText("โน้ตทีม"), { target: { value: "รับเรื่องแล้ว" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));
    });
    expect(updateMessage).toHaveBeenCalledWith({
      data: { id: "3f2b8c1e-5d4a-4e6f-9a7b-1c2d3e4f5a6b", status: "in_progress", teamNote: "รับเรื่องแล้ว" },
    });
    expect(await screen.findByText("บันทึกแล้ว")).toBeInTheDocument();
    const group = screen.getByRole("group", { name: "กรองตามสถานะ" });
    expect(within(group).getByRole("button", { name: /ใหม่.*2/ })).toBeInTheDocument();
    expect(within(group).getByRole("button", { name: /กำลังดูแล.*3/ })).toBeInTheDocument();
  });

  it("sends an empty note as null", async () => {
    listMessages.mockResolvedValue({ items: [msg({ teamNote: "เก่า" })], counts: COUNTS, hasMore: false });
    renderInbox();
    fireEvent.change(await screen.findByLabelText("โน้ตทีม"), { target: { value: "" } });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));
    });
    expect(updateMessage).toHaveBeenCalledWith({ data: expect.objectContaining({ teamNote: null }) });
  });

  it("loads the next page with the last created_at as the cursor", async () => {
    const first = Array.from({ length: 30 }, (_, i) =>
      msg({ id: `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`, createdAt: `2026-10-26T05:${String(59 - i).padStart(2, "0")}:00.123456+00:00` }),
    );
    listMessages.mockResolvedValueOnce({ items: first, counts: COUNTS, hasMore: true });
    renderInbox();
    await screen.findAllByRole("article");
    expect(screen.getAllByRole("article")).toHaveLength(30);
    listMessages.mockResolvedValueOnce({
      items: [msg({ id: "11111111-1111-4111-8111-111111111111", message: "ข้อความเก่า" })],
      counts: COUNTS,
      hasMore: false,
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ดูเพิ่ม" }));
    });
    expect(listMessages).toHaveBeenLastCalledWith({ data: { before: first[29]!.createdAt } });
    expect(await screen.findByText("ข้อความเก่า")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(31);
    expect(screen.queryByRole("button", { name: "ดูเพิ่ม" })).toBeNull();
  });

  it("re-enables ดูเพิ่ม on the new list when the filter changes during a load-more", async () => {
    const page = (prefix: string) =>
      Array.from({ length: 30 }, (_, i) =>
        msg({ id: `${prefix}000000-0000-4000-8000-${String(i).padStart(12, "0")}`, createdAt: `2026-10-26T05:${String(59 - i).padStart(2, "0")}:00.123456+00:00` }),
      );
    listMessages.mockResolvedValueOnce({ items: page("a"), counts: COUNTS, hasMore: true });
    const view = render(<MessagesInbox onStatusChange={vi.fn()} />);
    await screen.findAllByRole("article");

    let resolveMore!: (v: unknown) => void;
    listMessages.mockReturnValueOnce(new Promise((r) => (resolveMore = r)));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ดูเพิ่ม" }));
    });
    expect(screen.getByRole("button", { name: "กำลังโหลด…" })).toBeDisabled();

    listMessages.mockResolvedValueOnce({ items: page("b"), counts: COUNTS, hasMore: true });
    await act(async () => {
      view.rerender(<MessagesInbox status="new" onStatusChange={vi.fn()} />);
    });
    await act(async () => {
      resolveMore({ items: page("c"), counts: COUNTS, hasMore: false });
    });
    expect(await screen.findByRole("button", { name: "ดูเพิ่ม" })).toBeEnabled();
    expect(screen.getAllByRole("article")).toHaveLength(30);
  });

  it("shows an empty state, and a retryable error when loading fails", async () => {
    listMessages.mockResolvedValueOnce({ items: [], counts: { new: 0, in_progress: 0, done: 0, spam: 0 }, hasMore: false });
    renderInbox("done");
    expect(await screen.findByText("ยังไม่มีข้อความในหมวดนี้นะ")).toBeInTheDocument();
    cleanup();

    listMessages.mockRejectedValueOnce(new Error("boom"));
    renderInbox();
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดข้อมูลไม่สำเร็จ ลองอีกครั้งนะ");
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ลองอีกครั้ง" }));
    });
    await waitFor(() => expect(screen.getByRole("heading", { name: TOPIC_LABELS.ask_help })).toBeInTheDocument());
  });
});
