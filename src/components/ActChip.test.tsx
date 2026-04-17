// tests for ActChip component

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import ActChip from './ActChip';

describe('ActChip', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  it('renders with the correct label', () => {
    render(
      <BrowserRouter>
        <ActChip
          short={'TST'}
          isSelected={false}
          name={'Test'}
        />
      </BrowserRouter>
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('uses a plain button type so mobile taps never behave like a submit control', () => {
    render(
      <BrowserRouter>
        <ActChip short="TST" isSelected={false} name="Test" />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Add to schedule')).toHaveAttribute('type', 'button');
  });

  it('toggles the selected state when clicked', () => {
    render(
      <BrowserRouter>
        <ActChip
          short={'TST'}
          isSelected={false}
          name={'Test'}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByLabelText('Add to schedule'));
    expect(screen.getByLabelText('Remove from schedule')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Remove from schedule'));
    expect(screen.getByLabelText('Add to schedule')).toBeInTheDocument();
  });

  it('adds the selected act to localStorage', () => {
    render(
      <BrowserRouter>
        <ActChip
          short={'TST'}
          isSelected={false}
          name={'Test'}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByLabelText('Add to schedule'));
    expect(localStorage.getItem('act_TST')).toEqual('true');
  });

  it('removes the selected act from localStorage', () => {
    localStorage.setItem('act_TST', 'true');
    render(
      <BrowserRouter>
        <ActChip
          short={'TST'}
          isSelected={true}
          name={'Test'}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByLabelText('Remove from schedule'));
    expect(localStorage.getItem('act_TST')).toEqual('false');
  });

  it('checks if act is in lineup', () => {
    localStorage.setItem('act_TST', 'true');
    render(
      <BrowserRouter>
        <ActChip
          short={'TST'}
          isSelected={true}
          name={'Test'}
        />
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Remove from schedule')).toBeInTheDocument();
  });
});
