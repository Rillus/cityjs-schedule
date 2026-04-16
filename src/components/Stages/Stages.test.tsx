import React from "react";
import { render, screen } from "@testing-library/react";
import Stages from "./Stages";
import {BrowserRouter} from "react-router-dom";
import {Data} from "../../../types/act";

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

describe("Stages", () => {
  it("renders Stages component", () => {
    render(
      <BrowserRouter>
        <Stages data={data} />
      </BrowserRouter>
    );
    const stagesHeader = screen.getByText(/Tracks & rooms/i);
    expect(stagesHeader).toBeInTheDocument();
  });

  it("renders the number of stages", () => {
    render(
      <BrowserRouter>
        <Stages data={data} />
      </BrowserRouter>
    );
    // get stages by Stage Chip class
    const stages = screen.getAllByTestId("StageChip");
    expect(stages).toHaveLength(data.locations.length);
  });

  it.skip('allows you to search for a stage', () => {
    render(
      <BrowserRouter>
        <Stages data={data} />
      </BrowserRouter>
    );

    // get input field
    const input: HTMLInputElement = screen.getByTestId("Search");
    // type in input field
    input.value = "Main";
    // trigger change event
    // input.dispatchEvent(new Event("input"));
    // get stages by Stage Chip class
    console.log(input.value)

    screen.debug();
    const stages = screen.getAllByTestId("StageChip");
    expect(stages).toHaveLength(1);
  });
});
