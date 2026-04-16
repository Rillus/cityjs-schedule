// Tests for ActGrid
import React from "react";
import { render, screen } from "@testing-library/react";
import ActGrid from "./ActGrid";
import {BrowserRouter} from "react-router-dom";

const actData = [
  {
    name: "Act 1",
    short: "act1",
    location: { name: "Stage 1", id: 1 },
    start: "2021-07-01T12:00:00Z",
    end: "2021-07-01T13:00:00Z",
  },
  {
    name: "Act 2",
    short: "act2",
    location: { name: "Stage 2", id: 2 },
    start: "2021-07-01T14:00:00Z",
    end: "2021-07-01T15:00:00Z",
  },
];

describe("ActGrid", () => {
  it("renders a list of acts", () => {
    render(
      <BrowserRouter>
        <ActGrid events={actData} />
      </BrowserRouter>
    );

    const actChips = screen.getAllByLabelText("Add to schedule");
    expect(actChips).toHaveLength(actData.length);

    expect(screen.queryAllByRole("link", { name: /stage 1/i })).toHaveLength(0);

  });

  it("renders a list of acts with stages", () => {
    actData[0] = { ...actData[0], location: { name: "Stage 1", id: 1 } };

    render(
      <BrowserRouter>
        <ActGrid
          events={actData}
          options={{ showStages: true }}
        />
      </BrowserRouter>
    );

    const stageChips = screen.getAllByRole("link", { name: /stage 1/i });
    expect(stageChips).toHaveLength(1);
  });
});
