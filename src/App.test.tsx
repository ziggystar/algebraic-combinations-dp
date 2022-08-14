import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Find input elem', () => {
  render(<App />);
  const linkElement = screen.getByLabelText("Wiederholungen");
  expect(linkElement).toBeDefined();
});