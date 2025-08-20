import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';
import { EventBus } from '../../src/game/EventBus';

// Mock du composant PhaserGame
jest.mock('../../src/game/PhaserGame', () => {
  return function MockPhaserGame({ currentActiveScene }) {
    return (
      <div 
        data-testid="phaser-game" 
        onClick={() => currentActiveScene?.({ scene: { key: 'TestScene' } })}
      >
        Phaser Game Mock
      </div>
    );
  };
});

// Mock de l'EventBus
jest.mock('../../src/game/EventBus', () => ({
  EventBus: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  }
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('phaser-game')).toBeInTheDocument();
  });

  test('has correct app structure', () => {
    render(<App />);
    const appDiv = screen.getByTestId('phaser-game').parentElement;
    expect(appDiv).toHaveAttribute('id', 'app');
  });

  test('initializes with correct default state', () => {
    render(<App />);
    // Vérifier que le composant se rend correctement
    expect(screen.getByTestId('phaser-game')).toBeInTheDocument();
  });

  test('sets up EventBus listener for player position', () => {
    render(<App />);
    
    // Vérifier que EventBus.on a été appelé
    expect(EventBus.on).toHaveBeenCalledWith(
      'player-position-updated',
      expect.any(Function)
    );
  });

  test('handles scene change correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<App />);
    
    // Simuler un clic pour déclencher handleSceneChange
    const phaserGame = screen.getByTestId('phaser-game');
    phaserGame.click();
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Scène active mise à jour : TestScene');
    });

    consoleSpy.mockRestore();
  });

  test('EventBus callback updates player position', () => {
    render(<App />);
    
    // Récupérer la callback passée à EventBus.on
    const eventBusCall = EventBus.on.mock.calls.find(
      call => call[0] === 'player-position-updated'
    );
    
    expect(eventBusCall).toBeDefined();
    
    const callback = eventBusCall[1];
    const newPosition = { x: 100, y: 200 };
    
    // Exécuter la callback - elle ne devrait pas lever d'erreur
    expect(() => callback(newPosition)).not.toThrow();
  });
});