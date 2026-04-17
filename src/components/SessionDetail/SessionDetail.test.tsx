import React from "react";
import { render, screen } from "@testing-library/react";
import SessionDetail from "./SessionDetail";
import { EventType } from "../../../types/act";

const baseEvent: EventType = {
  name: "The New UX — Tejas Kumar",
  short: "cjs26-gh-ux",
  start: "2026-04-17 09:30",
  end: "2026-04-17 10:00",
};

describe("SessionDetail", () => {
  it("renders nothing when there are no enrichments", () => {
    const { container } = render(<SessionDetail event={baseEvent} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows session copy from the official schedule when present", () => {
    const event: EventType = {
      ...baseEvent,
      description: "First paragraph.\n\nSecond paragraph.",
      speakerBio: "Tejas Kumar — IBM\n\nBio line.",
      url: "https://london.cityjsconf.org/speakers",
    };
    render(<SessionDetail event={event} />);
    expect(screen.getByRole("heading", { name: /about this session/i })).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /about the speaker\(s\)/i })).toBeInTheDocument();
    expect(screen.getByText("Bio line.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /official cityjs london speakers page/i })).toHaveAttribute(
      "href",
      "https://london.cityjsconf.org/speakers"
    );
  });
});
