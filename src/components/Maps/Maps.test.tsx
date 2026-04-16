import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Maps from './Maps';

function renderMapsRoute() {
  return render(
    <MemoryRouter initialEntries={['/map']}>
      <Routes>
        <Route path="/map" element={<Maps />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Maps', () => {
  it('names Kensington Town Hall as the venue', () => {
    renderMapsRoute();
    expect(
      screen.getByRole('heading', { level: 1, name: /Kensington Town Hall/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Hornton Street, London, W8 7NX/i)
    ).toBeInTheDocument();
  });

  it('embeds a street map centred on the venue', () => {
    renderMapsRoute();
    const map = screen.getByTitle(/map of Kensington Town Hall/i);
    expect(map).toBeInTheDocument();
    expect(map.tagName).toBe('IFRAME');
    expect(map).toHaveAttribute('src', expect.stringContaining('openstreetmap.org'));
  });

  it('links to official venue information and a virtual tour', () => {
    renderMapsRoute();
    expect(
      screen.getByRole('link', {
        name: /Kensington Conference and Events Centre on the Royal Borough website/i,
      })
    ).toHaveAttribute('href', expect.stringContaining('rbkc.gov.uk'));
  });

  it('links to reference floor plans for the building', () => {
    renderMapsRoute();
    expect(
      screen.getByRole('link', { name: /first-floor plan at RIBA Pix/i })
    ).toHaveAttribute('href', expect.stringContaining('ribapix.com'));
  });
});
