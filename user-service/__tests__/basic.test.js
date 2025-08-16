// __tests__/basic.test.js
describe('Basic Tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-secret');
  });

  it('should test basic math', () => {
    expect(2 + 2).toBe(4);
  });
});