import { describe, expect, it } from "vitest";

import { legacyRedirect } from "./legacy-routes";

const KL = "/konlanid/index.html";

describe("legacyRedirect", () => {
  it("sends old demo pages to the matching คนละนิด page", () => {
    expect(legacyRedirect("/onboarding")).toBe(KL);
    expect(legacyRedirect("/browse")).toBe(`${KL}#/bills`);
    expect(legacyRedirect("/bills/abc")).toBe(`${KL}#/bills`);
    expect(legacyRedirect("/bills/abc/contribute")).toBe(`${KL}#/bills`);
    expect(legacyRedirect("/requests")).toBe(`${KL}#/request`);
    expect(legacyRedirect("/requests/new")).toBe(`${KL}#/request`);
    expect(legacyRedirect("/profile")).toBe(`${KL}#/me`);
    expect(legacyRedirect("/notifications")).toBe(`${KL}#/me`);
    expect(legacyRedirect("/impact")).toBe(`${KL}#/activity`);
    expect(legacyRedirect("/circles")).toBe(`${KL}#/activity`);
    expect(legacyRedirect("/circles/xyz")).toBe(`${KL}#/activity`);
    expect(legacyRedirect("/corporate")).toBe(KL);
    expect(legacyRedirect("/moderator")).toBe(KL);
    expect(legacyRedirect("/how-it-works")).toBe(KL);
  });

  it("ignores a trailing slash", () => {
    expect(legacyRedirect("/onboarding/")).toBe(KL);
  });

  it("leaves new pages alone", () => {
    expect(legacyRedirect("/")).toBeNull();
    expect(legacyRedirect("/login")).toBeNull();
    expect(legacyRedirect("/admin")).toBeNull();
    expect(legacyRedirect("/admin/messages")).toBeNull();
    expect(legacyRedirect("/konlanid/index.html")).toBeNull();
  });

  it("matches whole path segments only", () => {
    expect(legacyRedirect("/profiles")).toBeNull();
    expect(legacyRedirect("/browsers")).toBeNull();
  });
});
