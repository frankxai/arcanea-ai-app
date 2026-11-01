import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateRhythm, detectOnsets } from '../../apps/web/lib/music-mentor/rhythm.ts';

const sampleRate = 12000;
function pulses(times, seconds = 4) {
  const data = new Float32Array(sampleRate * seconds);
  for (const time of times) {
    const start = Math.round(time * sampleRate / 1000);
    for (let i = 0; i < 100; i++) data[start + i] = 0.8;
  }
  return data;
}

test('silence abstains instead of inventing timing', () => {
  assert.equal(evaluateRhythm(new Float32Array(sampleRate * 3), sampleRate).status, 'insufficient_signal');
});
test('four evenly spaced attacks yield low interval error', () => {
  const result = evaluateRhythm(pulses([300, 967, 1634, 2301]), sampleRate);
  assert.equal(result.status, 'measured');
  assert.ok(result.meanAbsoluteIntervalErrorMs <= 25);
});
test('mistimed attack produces larger measured error', () => {
  const result = evaluateRhythm(pulses([300, 967, 1880, 2547]), sampleRate);
  assert.equal(result.status, 'measured');
  assert.ok(result.meanAbsoluteIntervalErrorMs > 70);
});
test('more than four attacks abstains rather than cherry picking', () => {
  assert.equal(evaluateRhythm(pulses([300, 700, 1100, 1500, 1900]), sampleRate).status, 'insufficient_signal');
});
test('invalid sample rate rejected', () => {
  assert.throws(() => detectOnsets(new Float32Array(1), 0));
});
