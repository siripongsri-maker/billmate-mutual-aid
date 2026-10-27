import { describe, expect, it } from "vitest";

import { usesKlShell } from "./KlShell";

describe("usesKlShell", () => {
  it.each(["/login", "/admin", "/admin/messages", "/login/reset", "/draft-story"])("is true for %s", (path) => {
    expect(usesKlShell(path)).toBe(true);
  });

  it.each(["/", "/browse", "/administrator", "/loginx", "/x/admin"])("is false for %s", (path) => {
    expect(usesKlShell(path)).toBe(false);
  });
});
