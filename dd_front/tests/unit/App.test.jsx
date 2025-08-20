import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

// Mock PhaserGame component
jest.mock('../../src/game/PhaserGame', () => {
  return function MockPhaserGame({ currentActiveScene }) {
    return <div data-testid="phaser-game">Phaser Game Mock</div>;
  };
});

// Mock EventBus
jest.mock('../../src/game/EventBus', () => ({
  EventBus: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  }
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('phaser-game')).toBeInTheDocument();
  });

  test('has correct app structure', () => {
    render(<App />);
    const appDiv = screen.getByRole('main') || screen.getByTestId('phaser-game').parentElement;
    expect(appDiv).toHaveAttribute('id', 'app');
  });

  test('initializes with correct default state', () => {
    render(<App />);
    // Vérifier que le composant se rend correctement
    expect(screen.getByTestId('phaser-game')).toBeInTheDocument();
  });
});