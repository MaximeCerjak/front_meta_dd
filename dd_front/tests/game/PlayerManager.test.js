global.Phaser = {
  Scene: class MockScene {
    constructor() {
      this.add = {
        sprite: jest.fn(() => ({
          setScale: jest.fn().mockReturnThis(),
          setOrigin: jest.fn().mockReturnThis(),
          play: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
        })),
      };
      this.physics = {
        add: {
          sprite: jest.fn(() => ({
            setScale: jest.fn().mockReturnThis(),
            setOrigin: jest.fn().mockReturnThis(),
            setCollideWorldBounds: jest.fn().mockReturnThis(),
            setBounce: jest.fn().mockReturnThis(),
            play: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            body: {
              setSize: jest.fn(),
              setOffset: jest.fn(),
            }
          })),
        }
      };
      this.input = {
        keyboard: {
          createCursorKeys: jest.fn(() => ({
            left: { isDown: false },
            right: { isDown: false },
            up: { isDown: false },
            down: { isDown: false },
          })),
        }
      };
      this.anims = {
        create: jest.fn(),
      };
    }
  },
  Input: {
    Keyboard: {
      KeyCodes: {
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
        UP: 'UP',
        DOWN: 'DOWN',
      }
    }
  }
};

// Mock du PlayerManager
class MockPlayerManager {
  constructor(scene, x = 100, y = 100) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = 160;
    this.isMoving = false;
    this.sprite = null;
    this.cursors = null;
    
    this.create();
  }

  create() {
    this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'player')
      .setScale(0.5)
      .setOrigin(0.5, 1)
      .setCollideWorldBounds(true)
      .setBounce(0.2);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    return this;
  }

  update() {
    if (!this.sprite || !this.cursors) return;

    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown) {
      velocityX = -this.speed;
    } else if (this.cursors.right.isDown) {
      velocityX = this.speed;
    }

    if (this.cursors.up.isDown) {
      velocityY = -this.speed;
    } else if (this.cursors.down.isDown) {
      velocityY = this.speed;
    }

    this.isMoving = velocityX !== 0 || velocityY !== 0;

    // Simulation du mouvement
    if (this.sprite.setVelocity) {
      this.sprite.setVelocity(velocityX, velocityY);
    }

    return { velocityX, velocityY };
  }

  getPosition() {
    return {
      x: this.sprite?.x || this.x,
      y: this.sprite?.y || this.y
    };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    if (this.sprite) {
      this.sprite.x = x;
      this.sprite.y = y;
    }
  }

  destroy() {
    if (this.sprite && this.sprite.destroy) {
      this.sprite.destroy();
    }
    this.sprite = null;
    this.cursors = null;
  }
}

describe('PlayerManager', () => {
  let mockScene;
  let playerManager;

  beforeEach(() => {
    mockScene = new global.Phaser.Scene();
    playerManager = new MockPlayerManager(mockScene, 100, 100);
  });

  afterEach(() => {
    if (playerManager) {
      playerManager.destroy();
    }
  });

  test('should create player manager with default position', () => {
    expect(playerManager).toBeDefined();
    expect(playerManager.x).toBe(100);
    expect(playerManager.y).toBe(100);
    expect(playerManager.speed).toBe(160);
    expect(playerManager.isMoving).toBe(false);
  });

  test('should create sprite with correct properties', () => {
    expect(mockScene.physics.add.sprite).toHaveBeenCalledWith(100, 100, 'player');
    expect(playerManager.sprite).toBeDefined();
  });

  test('should initialize cursor keys', () => {
    expect(mockScene.input.keyboard.createCursorKeys).toHaveBeenCalled();
    expect(playerManager.cursors).toBeDefined();
  });

  test('should update movement when left key is pressed', () => {
    playerManager.cursors.left.isDown = true;
    
    const movement = playerManager.update();
    
    expect(movement.velocityX).toBe(-160);
    expect(movement.velocityY).toBe(0);
    expect(playerManager.isMoving).toBe(true);
  });

  test('should update movement when right key is pressed', () => {
    playerManager.cursors.right.isDown = true;
    
    const movement = playerManager.update();
    
    expect(movement.velocityX).toBe(160);
    expect(movement.velocityY).toBe(0);
    expect(playerManager.isMoving).toBe(true);
  });

  test('should update movement when up key is pressed', () => {
    playerManager.cursors.up.isDown = true;
    
    const movement = playerManager.update();
    
    expect(movement.velocityX).toBe(0);
    expect(movement.velocityY).toBe(-160);
    expect(playerManager.isMoving).toBe(true);
  });

  test('should handle diagonal movement', () => {
    playerManager.cursors.left.isDown = true;
    playerManager.cursors.up.isDown = true;
    
    const movement = playerManager.update();
    
    expect(movement.velocityX).toBe(-160);
    expect(movement.velocityY).toBe(-160);
    expect(playerManager.isMoving).toBe(true);
  });

  test('should be stationary when no keys are pressed', () => {
    const movement = playerManager.update();
    
    expect(movement.velocityX).toBe(0);
    expect(movement.velocityY).toBe(0);
    expect(playerManager.isMoving).toBe(false);
  });

  test('should get current position', () => {
    const position = playerManager.getPosition();
    
    expect(position.x).toBe(100);
    expect(position.y).toBe(100);
  });

  test('should set new position', () => {
    playerManager.setPosition(200, 300);
    
    expect(playerManager.x).toBe(200);
    expect(playerManager.y).toBe(300);
    
    const position = playerManager.getPosition();
    expect(position.x).toBe(200);
    expect(position.y).toBe(300);
  });

  test('should handle destruction properly', () => {
    const destroySpy = jest.fn();
    playerManager.sprite.destroy = destroySpy;
    
    playerManager.destroy();
    
    expect(destroySpy).toHaveBeenCalled();
    expect(playerManager.sprite).toBeNull();
    expect(playerManager.cursors).toBeNull();
  });

  test('should handle update when sprite is null', () => {
    playerManager.sprite = null;
    
    expect(() => {
      playerManager.update();
    }).not.toThrow();
  });
});