import React from "react";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import {render} from "@testing-library/react";
import Stage from "./Stage";
import {Data} from "../../../types/act";
import {MemoryRouter, Route, Routes} from "react-router-dom";

describe("Stage", () => {
  const stageData: Data = {
    locations: [
      {
        id: 1,
        name: 'Main Stage',
        events: [
          {
            id: 3,
            name: 'The Sky at Night',
            short: 'night',
            description: 'The Sky at Night is a band from the UK',
            image: 'https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b',
            spotify: '',
            youtube: '',
            instagram: '',
            facebook: '',
            twitter: '',
            soundcloud: '',
            website: '',
            start: '2028-06-26 13:00',
            end: '2028-06-26 13:30',
          },
          {
            id: 1,
            name: 'The Sky at Day',
            short: 'day',
            description: 'The Sky at Day is a band from the UK',
            image: 'https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b',
            spotify: '',
            youtube: '',
            instagram: '',
            facebook: '',
            twitter: '',
            soundcloud: '',
            website: '',
            start: '2028-06-26 12:00',
            end: '2028-06-26 12:30',
          },
          {
            id: 2,
            name: 'Yoga like water',
            short: 'yoga',
            description: 'Yoga like water is a band from the UK',
            image: 'https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b',
            spotify: '',
            youtube: '',
            instagram: '',
            facebook: '',
            twitter: '',
            soundcloud: '',
            website: '',
            start: '2028-06-26 14:00',
            end: '2028-06-26 14:30',
          },
        ]
      },
      {
        id: 2,
        name: "Second Stage",
        events: [
          {
            id: 4,
            name: "The Sky at Day",
            short: 'day',
            description: "The Sky at Day is a band from the UK",
            image: "https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b",
            spotify: "",
            youtube: "",
            instagram: "",
            facebook: "",
            twitter: "",
            soundcloud: "",
            website: "",
            start: "2028-06-26T12:00:00Z",
            end: "2028-06-26T12:30:00Z",
          },
          {
            id: 5,
            name: "Yoga like water",
            short: 'water',
            description: "Yoga like water is a band from the UK",
            image: "https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b",
            spotify: "",
            youtube: "",
            instagram: "",
            facebook: "",
            twitter: "",
            soundcloud: "",
            website: "",
            start: "2028-06-26T12:30:00Z",
            end: "2028-06-26T13:00:00Z",
          },
          {
            id: 6,
            name: "The Sky at Night",
            short: 'night',
            description: "The Sky at Night is a band from the UK",
            image: "https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b",
            spotify: "",
            youtube: "",
            instagram: "",
            facebook: "",
            twitter: "",
            soundcloud: "",
            website: "",
            start: "2028-06-26T13:00:00Z",
            end: "2028-06-26T13:30:00Z",
          },
        ],
      }
    ],
    modified: '2025-01-01 00:00'
  };

  it("should render the stage", async () => {
    render(
      <MemoryRouter initialEntries={['/stage/main-stage']}>
        <Routes>
          <Route path="/stage/:name" element={<Stage data={stageData} />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Main Stage")).toBeInTheDocument();
    });
  });

  it("should render the events", () => {
    render(
      <MemoryRouter initialEntries={['/stage/main-stage']}>
        <Routes>
          <Route path="/stage/:name" element={<Stage data={stageData}/>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("The Sky at Day")).toBeInTheDocument();
    expect(screen.getByText("Yoga like water")).toBeInTheDocument();
    expect(screen.getByText("The Sky at Night")).toBeInTheDocument();
  });

  it('should return null if no stages matching the url are found', () => {
    render(
      <MemoryRouter initialEntries={['/stage/unknown-stage']}>
        <Routes>
          <Route path="/stage/:name" element={<Stage data={stageData}/>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Main Stage")).not.toBeInTheDocument();
  });

  it('should give the stage the class with the right index', () => {
    render(
      <MemoryRouter initialEntries={['/stage/second-stage']}>
        <Routes>
          <Route path="/stage/:name" element={<Stage data={stageData}/>} />
        </Routes>
      </MemoryRouter>
    );

    const stage = screen.getByText('Second Stage');
    expect(stage).toHaveAttribute('class', 'StageChip-name StageChip-name--2');
  });
});
