// tests for act.js
import React from 'react';
import {act, fireEvent, screen, waitFor} from '@testing-library/react';
import {render} from '@testing-library/react';
import Acts from './Acts';
import {BrowserRouter, MemoryRouter, Route, Routes} from 'react-router-dom';
import {Data} from "../../../types/act";

beforeEach(() => {
  localStorage.setItem('hidePastActs', 'false');
});

const actsData: Data = {
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
          start: '2026-04-17 13:00',
          end: '2026-04-17 13:30',
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
          start: '2026-04-17 12:00',
          end: '2026-04-17 12:30',
        },
        {
          id: 2,
          name: 'Yoga like water',
          short: 'water',
          description: 'Yoga like water is a band from the UK',
          image: 'https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b',
          spotify: '',
          youtube: '',
          instagram: '',
          facebook: '',
          twitter: '',
          soundcloud: '',
          website: '',
          start: '2026-04-17 12:30',
          end: '2026-04-17 13:00',
        },
      ],
    },
    {
      id: 2,
      name: 'Second Stage',
      events: [
        {
          id: 1,
          name: 'The Sky Anytime',
          short: 'any',
          description: 'The Sky Whenever is a band from the UK',
          image: 'https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b',
          spotify: '',
          youtube: '',
          instagram: '',
          facebook: '',
          twitter: '',
          soundcloud: '',
          website: '',
          start: '2026-04-17 12:00',
          end: '2026-04-17 12:30',
        },
      ],
    },
  ],
};

describe('Acts component', () => {
  it('should render Acts component', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>, {}
    );
    const actsElement = screen.queryAllByLabelText('Add to schedule');
    expect(actsElement).not.toBeNull();
  });

  it('should show search bar', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );
    const searchBar = screen.getByLabelText('Search for a session');
    expect(searchBar).toBeInTheDocument();
  });

  it('should show acts', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );
    const acts = screen.getAllByText('The Sky at Day');
    expect(acts).not.toBeNull();
  });

  it('should search for results based on search input', async () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );
    const searchBar: HTMLInputElement = screen.getByLabelText('Search for a session');
    fireEvent.change(searchBar, { target: { value: 'Yoga like water' } });

    expect(searchBar.value).toBe('Yoga like water');
    await waitFor(() => {
      const acts = screen.queryAllByText('Yoga like water');
      expect(acts).not.toHaveLength(0);
    });
  });

  it ('should show no results if search input does not match any act', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );
    const searchBar: HTMLInputElement = screen.getByLabelText('Search for a session');
    fireEvent.change(searchBar, { target: { value: 'Yoga like fire' } });

    expect(searchBar.value).toBe('Yoga like fire');
    const noResults = screen.getByText(/No results found/i);
    expect(noResults).toBeInTheDocument();
  });

  it ('should clear search input when clear button is clicked', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );
    const searchBar: HTMLInputElement = screen.getByLabelText('Search for a session');
    fireEvent.change(searchBar, { target: { value: 'Yoga like water' } });

    expect(searchBar.value).toBe('Yoga like water');
    const clearButton = screen.getByText('×');
    fireEvent.click(clearButton);

    expect(searchBar.value).toBe('');
  });

  it('should show no results if search input is less than 3 characters',  () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );
    const searchBar: HTMLInputElement = screen.getByLabelText('Search for a session');
    fireEvent.change(searchBar, { target: { value: 'Y' } });

    expect(searchBar.value).toBe('Y');
    const noResults = screen.getByText(/3 or more characters required to search/i);
    expect(noResults).toBeInTheDocument();

  });

  it('should give each stage the appropriate id', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );

    const stage = screen.queryAllByText('Main Stage');
    expect(stage[0]).toHaveAttribute('class', 'StageChip-name StageChip-name--1');

    const stage2 = screen.queryAllByText('Second Stage');
    expect(stage2[0]).toHaveAttribute('class', 'StageChip-name StageChip-name--2');
  });

  it('should render acts in time order', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );

    const acts = screen.queryAllByTestId('ActName');
    expect(acts[0]).toHaveTextContent('The Sky at Day');
    expect(acts[1]).toHaveTextContent('The Sky Anytime');
    expect(acts[2]).toHaveTextContent('Yoga like water');
    expect(acts[3]).toHaveTextContent('The Sky at Night');
  });

  it('should hide the day selector when only one day is available', () => {
    render(
      <BrowserRouter>
        <Acts data={actsData} />
      </BrowserRouter>
    );

    expect(screen.queryByText('Day 3')).not.toBeInTheDocument();
    expect(screen.queryByText('All')).not.toBeInTheDocument();
    expect(screen.queryByText('Day 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Day 2')).not.toBeInTheDocument();
  });

  it('should load more acts when the user scrolls to the bottom of the page', () => {
    // fill new act data with 30 acts
    const newActData: Data = {
      locations: [
        {
          id: 1,
          name: 'Main Stage',
          events: [],
        }
      ]
    };

    // add 30 acts to the new act data
    if (newActData.locations[0].events.length < 30) {
      for(let i = 0; i < 30; i++) {
        newActData.locations[0].events = [
          ...newActData.locations[0].events,
          {
            id: i + 1,
            name: `The Sky at Day ${i + 1}`,
            short: `day${i + 1}`,
            description: `The Sky at Day ${i + 1} is a band from the UK`,
            image: 'https://images.unsplash.com/photo-1631149170000-7b3b3b3b3b3b',
            spotify: '',
            youtube: '',
            instagram: '',
            facebook: '',
            twitter: '',
            soundcloud: '',
            website: '',
            start: '2026-04-17 12:00',
            end: '2026-04-17 12:30',
          },
        ];
      }
    }

    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
    Object.defineProperty(document.documentElement, 'scrollTop', { writable: true, configurable: true, value: 1000 });

    const mainElement = { offsetHeight: 1500 };
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: mainElement });

    render(
      <MemoryRouter initialEntries={['/acts']}>
        <Routes>
          <Route path="/acts" element={<Acts data={newActData} />} />
        </Routes>
      </MemoryRouter>
    );

    const acts = screen.getAllByText('The Sky at Day 1');
    expect(acts).not.toBeNull();

    // expect last act not to be in the document
    const act29 = screen.queryAllByText('The Sky at Day 29');
    expect(act29).toHaveLength(0);

    // expect only first page of acts to be in the document
    const actsElement = screen.queryAllByLabelText('Add to schedule');
    expect(actsElement).toHaveLength(20);

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // expect last act to be in the document
    const act29Again = screen.queryAllByText('The Sky at Day 29');
    expect(act29Again).not.toBeNull();

    const actsElementAgain = screen.queryAllByLabelText('Add to schedule');
    expect(actsElementAgain).toHaveLength(30);
  })
});
