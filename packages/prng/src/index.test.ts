import { PRNG } from './index'

test('0 <= PRNG.prototype.unit() < 1', () => {
  const prng = new PRNG('test')
  for (let i = 0; i < 100; i++) {
    expect(prng.unit()).toBeGreaterThanOrEqual(0)
    expect(prng.unit()).toBeLessThan(1)
  }
})
