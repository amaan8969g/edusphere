import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders main element', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeTruthy();
  });
});
