import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusPill, type StatusTone } from "./StatusPill";

const TONES: StatusTone[] = ["new", "progress", "done", "muted", "danger"];

describe("StatusPill", () => {
  it("shows the text and a decorative svg icon", () => {
    const { container } = render(<StatusPill tone="new">ใหม่</StatusPill>);

    expect(screen.getByText("ใหม่")).toBeTruthy();
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("gives every tone its own class and an icon", () => {
    const classes = TONES.map((tone) => {
      const { container, unmount } = render(<StatusPill tone={tone}>{tone}</StatusPill>);
      const root = container.firstElementChild as HTMLElement;
      expect(root.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
      const cls = root.className;
      unmount();
      return cls;
    });

    expect(new Set(classes).size).toBe(TONES.length);
  });
});
