import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Category, L } from "./data";

export type Role = "helper" | "requester" | "moderator";
export type ReqStatus = "pending" | "verified" | "rejected" | "funded";
export type MyRequest = { id: string; title: string; category: Category; amount: number; due: string; story: string; status: ReqStatus; created: number; flagged?: boolean };
export type Contribution = { id: string; billId: string; amount: number; at: number };
export type Notif = { id: string; text: L; at: number; read: boolean };

type State = {
  lang: "th" | "en";
  role: Role;
  onboarded: boolean;
  contributions: Contribution[];
  requests: MyRequest[];
  joined: string[];
  extraRaised: Record<string, number>;
  notifs: Notif[];
  privacy: { anon: boolean; hideRegion: boolean; showGivers: boolean };
  disputes: { id: string; billId: string; reason: L; resolved: boolean }[];
};

const now = Date.now();
const initial: State = {
  lang: "th",
  role: "helper",
  onboarded: false,
  contributions: [],
  joined: [],
  extraRaised: {},
  privacy: { anon: true, hideRegion: false, showGivers: true },
  requests: [
    { id: "r-demo1", title: "ค่าแว่นสายตาลูก (ตัวอย่าง)", category: "education", amount: 1800, due: "2026-11-20", story: "ลูกมองกระดานไม่ชัด", status: "pending", created: now - 86400000 },
    { id: "r-demo2", title: "ค่าน้ำประปา (ตัวอย่าง)", category: "utility", amount: 640, due: "2026-11-05", story: "ค้างชำระ 1 เดือน", status: "verified", created: now - 3 * 86400000 },
  ],
  notifs: [
    { id: "n1", read: false, at: now - 3600000, text: { th: "บิลค่าไฟของครอบครัวสมใจใกล้ครบเป้าแล้ว 80%", en: "Somjai family's electricity bill is 80% funded" } },
    { id: "n2", read: false, at: now - 7200000, text: { th: "วงไรเดอร์ช่วยไรเดอร์มีบิลใหม่ 3 รายการ", en: "Riders for Riders has 3 new bills" } },
    { id: "n3", read: true, at: now - 86400000, text: { th: "ยินดีต้อนรับสู่ ช่วยกน (เดโม)", en: "Welcome to chuaykan (demo)" } },
  ],
  disputes: [
    { id: "d1", billId: "b6", resolved: false, reason: { th: "ผู้ใช้รายงาน: ข้อมูลเรื่องราวไม่ตรงกับเอกสาร", en: "User report: story doesn't match document" } },
    { id: "d2", billId: "b3", resolved: false, reason: { th: "ผู้ใช้รายงาน: ยอดสูงกว่าค่าเทอมทั่วไป", en: "User report: amount above typical tuition" } },
  ],
};

const KEY = "chuaykan-demo-v1";
type Ctx = State & { set: (fn: (s: State) => State) => void; reset: () => void; t: (th: string, en: string) => string; l: (x: L) => string };
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.lang = state.lang;
  }, [state, loaded]);
  const t = (th: string, en: string) => (state.lang === "th" ? th : en);
  return (
    <StoreCtx.Provider value={{ ...state, set: setState, reset: () => setState({ ...initial, onboarded: true }), t, l: (x) => x[state.lang] }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
