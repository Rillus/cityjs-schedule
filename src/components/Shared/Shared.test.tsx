import React from "react";
import { render, screen } from "@testing-library/react";
import Shared from "./Shared";
import {MemoryRouter, Route, Routes} from "react-router-dom";

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
    const {container} = render(
      <MemoryRouter initialEntries={['/shared']}>
        <Routes>
          <Route path="/shared" element={<Shared data={data} />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/No sessions in this link/i)).toBeInTheDocument();
    expect(screen.getByText(/Shared schedule/i)).toBeInTheDocument();
  });

  it('should show saved acts from a comma-separated lineup that includes hyphenated ids', () => {
    const dataWithHyphenatedShort = {
      locations: [
        {
          id: 1,
          name: "Main Stage",
          events: [
            {
              id: 1,
              name: "Hyphenated Act",
              short: "cjs26-d1-reg",
              description: "This is a test act",
              image: "test-act.jpg",
              start: "2024-06-26T00:00:00.000Z",
              end: "2024-06-26T01:00:00.000Z",
            },
          ],
        },
      ],
    };

    render(
      <MemoryRouter initialEntries={['/shared/act_cjs26-d1-reg']}>
        <Routes>
          <Route path="/shared/:lineup" element={<Shared data={dataWithHyphenatedShort} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Hyphenated Act')).toBeInTheDocument();
    expect(screen.queryByText(/No sessions in this link/i)).not.toBeInTheDocument();
  });

  it('should still support legacy hyphen-separated links for non-hyphenated ids', () => {
    const dataWithTwoActs = {
      locations: [
        {
          id: 1,
          name: "Main Stage",
          events: [
            {
              id: 1,
              name: "First Act",
              short: "firstact",
              description: "This is a test act",
              image: "test-act.jpg",
              start: "2024-06-26T00:00:00.000Z",
              end: "2024-06-26T01:00:00.000Z",
            },
            {
              id: 2,
              name: "Second Act",
              short: "secondact",
              description: "This is a test act",
              image: "test-act.jpg",
              start: "2024-06-26T02:00:00.000Z",
              end: "2024-06-26T03:00:00.000Z",
            },
          ],
        },
      ],
    };

    render(
      <MemoryRouter initialEntries={['/shared/act_firstact-act_secondact']}>
        <Routes>
          <Route path="/shared/:lineup" element={<Shared data={dataWithTwoActs} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('First Act')).toBeInTheDocument();
    expect(screen.getByText('Second Act')).toBeInTheDocument();
  });
});
