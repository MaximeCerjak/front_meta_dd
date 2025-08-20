require('jest-canvas-mock');

// Mock global de Phaser
global.Phaser = {
  Scene: class MockScene {
    constructor() {
      this.add = {
        text: jest.fn(),
        image: jest.fn(),
        sprite: jest.fn()
      };
      this.load = {
        image: jest.fn(),
        audio: jest.fn(),
        json: jest.fn()
      };
      this.input = {
        on: jest.fn()
      };
    }
  },
  Game: class MockGame {
    constructor() {
      this.scene = {
        add: jest.fn(),
        start: jest.fn(),
        switch: jest.fn()
      };
    }
  },
  AUTO: 'AUTO',
  Scale: {
    FIT: 'FIT',
    CENTER_BOTH: 'CENTER_BOTH'
  }
};

// Mock WebGL context
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => ({
    clearRect: jest.fn(),
    drawImage: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: [] })),
    putImageData: jest.fn(),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    save: jest.fn(),
    restore: jest.fn()
  }))
});

// Mock pour les événements du navigateur
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3002',
    origin: 'http://localhost:3002'
  }
});

// Mock pour les WebSockets
global.WebSocket = class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 1;
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
  }
  
  send(data) {
    // Mock implementation
  }
  
  close() {
    // Mock implementation
  }
};

// Configuration des timers pour les tests asynchrones
jest.setTimeout(10000);

// Suppression des warnings console pendant les tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});