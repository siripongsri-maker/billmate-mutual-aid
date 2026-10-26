import { beforeEach, describe, expect, it, vi } from "vitest";

const maybeSingle = vi.fn();
const insert = vi.fn();
const from = vi.fn();
vi.mock("@/integrations/supabase/client.server", () => ({ supabaseAdmin: { from: (...a: unknown[]) => from(...a) } }));

import {
  authorizeAdmin,
  canAccessAdmin,
  isForbidden,
  isUnauthorized,
  logAction,
  type StaffProfile,
} from "@/server/admin-guard";

const NOW = new Date("2026-10-26T12:00:00Z");
const profile = (over: Partial<StaffProfile>): StaffProfile => ({
  userId: "u1",
  role: "admin",
  suspendedUntil: null,
  ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
  from.mockImplementation((table: string) =>
    table === "profiles"
      ? { select: () => ({ eq: () => ({ maybeSingle }) }) }
      : { insert },
  );
  insert.mockResolvedValue({ error: null });
});

describe("error helpers", () => {
  it("recognises Unauthorized errors from requireSupabaseAuth", () => {
    expect(isUnauthorized(new Error("Unauthorized: Invalid token"))).toBe(true);
    expect(isUnauthorized(new Error("Forbidden: x"))).toBe(false);
    expect(isUnauthorized("Unauthorized")).toBe(false);
  });

  it("recognises forbidden by statusCode or by message", () => {
    expect(isForbidden({ statusCode: 403 })).toBe(true);
    expect(isForbidden(new Error("Forbidden: not staff"))).toBe(true);
    expect(isForbidden(new Error("Unauthorized: x"))).toBe(false);
    expect(isForbidden(null)).toBe(false);
  });
});

describe("canAccessAdmin", () => {
  it("rejects a missing profile and requesters", () => {
    expect(canAccessAdmin(null, NOW)).toBe(false);
    expect(canAccessAdmin(profile({ role: "requester" }), NOW)).toBe(false);
  });

  it("accepts admin and owner", () => {
    expect(canAccessAdmin(profile({ role: "admin" }), NOW)).toBe(true);
    expect(canAccessAdmin(profile({ role: "owner" }), NOW)).toBe(true);
  });

  it("rejects while suspended and accepts once the suspension has passed", () => {
    expect(canAccessAdmin(profile({ suspendedUntil: "2026-10-27T00:00:00Z" }), NOW)).toBe(false);
    expect(canAccessAdmin(profile({ suspendedUntil: "2026-10-25T00:00:00Z" }), NOW)).toBe(true);
    expect(canAccessAdmin(profile({ suspendedUntil: "2026-10-26T12:00:00Z" }), NOW)).toBe(true);
  });
});

describe("authorizeAdmin", () => {
  it("returns userId and role for an admin profile", async () => {
    maybeSingle.mockResolvedValue({ data: { user_id: "u1", role: "owner", suspended_until: null }, error: null });
    await expect(authorizeAdmin("u1")).resolves.toEqual({ userId: "u1", role: "owner" });
  });

  it("throws a 403 for a requester", async () => {
    maybeSingle.mockResolvedValue({ data: { user_id: "u1", role: "requester", suspended_until: null }, error: null });
    const err = await authorizeAdmin("u1").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(Error);
    expect((err as { statusCode?: number }).statusCode).toBe(403);
    expect(isForbidden(err)).toBe(true);
  });

  it("throws a 403 when there is no profile", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(isForbidden(await authorizeAdmin("u1").catch((e: unknown) => e))).toBe(true);
  });

  it("does not turn a database failure into a 403", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: "boom" } });
    const err = await authorizeAdmin("u1").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(Error);
    expect(isForbidden(err)).toBe(false);
  });
});

describe("logAction", () => {
  it("writes an audit row", async () => {
    await logAction("u1", "team.invite", "profile", "u2", { role: "admin" });
    expect(from).toHaveBeenCalledWith("audit_log");
    expect(insert).toHaveBeenCalledWith({
      actor_id: "u1",
      action: "team.invite",
      target_type: "profile",
      target_id: "u2",
      detail: { role: "admin" },
    });
  });

  it("defaults detail to an empty object", async () => {
    await logAction("u1", "a", "t", "id");
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ detail: {} }));
  });

  it("never throws into the caller when the write fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    insert.mockResolvedValue({ error: { message: "nope" } });
    await expect(logAction("u1", "a", "t", "id")).resolves.toBeUndefined();
    insert.mockRejectedValue(new Error("network"));
    await expect(logAction("u1", "a", "t", "id")).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
});
