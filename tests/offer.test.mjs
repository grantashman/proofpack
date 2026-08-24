import test from 'node:test';
import assert from 'node:assert/strict';
import { pilotOffer } from '../src/data/offer.mjs';

test('Australian founding pilot has an explicit GST-inclusive monthly price', () => {
  assert.deepEqual(pilotOffer.price, {
    amount: 39,
    currency: 'AUD',
    interval: 'month',
    gstInclusive: true,
  });
});

test('pilot terms are self-serve and bounded', () => {
  assert.equal(pilotOffer.trialDays, 14);
  assert.equal(pilotOffer.activeSites, 5);
  assert.equal(pilotOffer.reportLimit, null);
  assert.equal(pilotOffer.lockIn, false);
  assert.equal(pilotOffer.features.some((feature) => /secure/i.test(feature)), false);
});
