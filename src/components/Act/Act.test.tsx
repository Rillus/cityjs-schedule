import React from "react";
import { render, screen } from "@testing-library/react";
import Act from "./Act";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { Data } from "../../../types/act";
import Url from "../../helpers/url";

const data: Data = {
  locations: [
    {
      id: 1,
      name: "Main Stage",
      events: [],
    },
    {
      id: 2,
      name: "Second Stage",
      events: [],
    },
  ]
};

describe("Act", () => {
  it("renders Act component", () => {
    render(
      <BrowserRouter>
        <Act data={data} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Session not found/i)).toBeInTheDocument();
  });

  it("resolves a talk when the path param is decoded (e.g. em dash titles from CityJS)", () => {
    const sessionTitle = "Start of Track 1 — Sara Vieira";
    const pathParam = Url.decodePathSlug(Url.safeName(sessionTitle));
    const cityjsLike: Data = {
      locations: [
        {
          id: 1,
          name: "Great Hall - Ground Floor",
          events: [
            {
              name: sessionTitle,
              short: "cjs26-gh-t1s",
              start: "2026-04-17 09:15",
              end: "2026-04-17 09:30",
            },
          ],
        },
      ],
    };

    render(
      <MemoryRouter initialEntries={[`/acts/${pathParam}`]}>
        <Routes>
          <Route path="/acts/:name" element={<Act data={cityjsLike} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Session not found/i)).not.toBeInTheDocument();
    expect(
      screen.getAllByTestId("StageChip").some((el) => el.textContent === sessionTitle)
    ).toBe(true);
  });

  it("shows enriched session copy when the timetable entry includes it", () => {
    const sessionTitle = "The New UX — Tejas Kumar";
    const pathParam = Url.decodePathSlug(Url.safeName(sessionTitle));
    const cityjsLike: Data = {
      locations: [
        {
          id: 1,
          name: "Great Hall - Ground Floor",
          events: [
            {
              name: sessionTitle,
              short: "cjs26-gh-ux",
              start: "2026-04-17 09:30",
              end: "2026-04-17 10:00",
              description: "Session abstract from the official site.",
            },
          ],
        },
      ],
    };

    render(
      <MemoryRouter initialEntries={[`/acts/${pathParam}`]}>
        <Routes>
          <Route path="/acts/:name" element={<Act data={cityjsLike} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Session abstract from the official site.")).toBeInTheDocument();
  });
});
