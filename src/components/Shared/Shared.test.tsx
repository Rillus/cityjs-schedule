import React, {ReactElement} from "react";
import { render, screen } from "@testing-library/react";
import Shared from "./Shared";
import {BrowserRouter, useParams} from "react-router-dom";

const data = {
  locations: [
    {
      id: 1,
      name: "Main Stage",
      events: [
        {
          id: 1,
          name: "Test Act",
          short: "test-act",
          description: "This is a test act",
          image: "test-act.jpg",
          start: "2024-06-26T00:00:00.000Z",
          end: "2024-06-26T01:00:00.000Z",
        },
      ],
    },
  ],
};

describe("Shared", () => {
  it("renders correctly", () => {
    const { container } = render(
      <BrowserRouter>
        <Shared data={data} />
      </BrowserRouter>
    );
    expect(screen.getByText(/No sessions in this link/i)).toBeInTheDocument();
    expect(screen.getByText(/Shared schedule/i)).toBeInTheDocument();
  });

  it.skip('should show saved acts based on url', () => {
  });
});
