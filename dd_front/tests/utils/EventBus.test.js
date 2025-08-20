import { EventBus } from '../../src/game/EventBus';

describe('EventBus', () => {
  beforeEach(() => {
    // Nettoyer tous les listeners avant chaque test
    EventBus.removeAllListeners?.();
  });

  afterEach(() => {
    // Nettoyer après chaque test
    EventBus.removeAllListeners?.();
  });

  test('should exist and have required methods', () => {
    expect(EventBus).toBeDefined();
    expect(typeof EventBus.on).toBe('function');
    expect(typeof EventBus.emit).toBe('function');
    expect(typeof EventBus.off).toBe('function');
  });

  test('should register and call event listener', () => {
    const mockCallback = jest.fn();
    const testData = { x: 100, y: 200 };

    EventBus.on('test-event', mockCallback);
    EventBus.emit('test-event', testData);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(testData);
  });

  test('should handle multiple listeners for same event', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const testData = 'test data';

    EventBus.on('multi-listener-event', mockCallback1);
    EventBus.on('multi-listener-event', mockCallback2);
    EventBus.emit('multi-listener-event', testData);

    expect(mockCallback1).toHaveBeenCalledWith(testData);
    expect(mockCallback2).toHaveBeenCalledWith(testData);
  });

  test('should remove specific event listener', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    EventBus.on('remove-test', mockCallback1);
    EventBus.on('remove-test', mockCallback2);
    
    EventBus.off('remove-test', mockCallback1);
    EventBus.emit('remove-test', 'data');

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalledWith('data');
  });

  test('should handle events with no listeners gracefully', () => {
    expect(() => {
      EventBus.emit('non-existent-event', 'data');
    }).not.toThrow();
  });

  test('should handle player position updates', () => {
    const mockCallback = jest.fn();
    const playerPosition = { x: 250, y: 300 };

    EventBus.on('player-position-updated', mockCallback);
    EventBus.emit('player-position-updated', playerPosition);

    expect(mockCallback).toHaveBeenCalledWith(playerPosition);
  });

  test('should handle scene changes', () => {
    const mockCallback = jest.fn();
    const sceneData = { scene: { key: 'TestScene' } };

    EventBus.on('scene-changed', mockCallback);
    EventBus.emit('scene-changed', sceneData);

    expect(mockCallback).toHaveBeenCalledWith(sceneData);
  });

  test('should not call removed listeners', () => {
    const mockCallback = jest.fn();

    EventBus.on('temp-event', mockCallback);
    EventBus.emit('temp-event', 'first');
    
    EventBus.off('temp-event', mockCallback);
    EventBus.emit('temp-event', 'second');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('first');
  });

  test('should handle complex event data', () => {
    const mockCallback = jest.fn();
    const complexData = {
      player: { id: 1, name: 'TestPlayer' },
      position: { x: 100, y: 200 },
      inventory: ['item1', 'item2'],
      metadata: { timestamp: Date.now() }
    };

    EventBus.on('complex-event', mockCallback);
    EventBus.emit('complex-event', complexData);

    expect(mockCallback).toHaveBeenCalledWith(complexData);
  });

  test('should handle rapid successive events', () => {
    const mockCallback = jest.fn();

    EventBus.on('rapid-event', mockCallback);
    
    for (let i = 0; i < 10; i++) {
      EventBus.emit('rapid-event', i);
    }

    expect(mockCallback).toHaveBeenCalledTimes(10);
    expect(mockCallback).toHaveBeenLastCalledWith(9);
  });
});