/**
 * Smoke test to verify Jest is working
 */
const { describe, it, expect } = require('@jest/globals');

describe('Smoke Test', () => {
  it('should verify Jest is configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should support async tests', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
