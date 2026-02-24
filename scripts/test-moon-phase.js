#!/usr/bin/env node
'use strict';

// ─── Moon Phase unit tests ────────────────────────────────────────────────────
// Mirrors the getMoonPhase() implementation in index.html.
// Keep both in sync when updating the formula or reference date.
//
// Reference: Feb 1, 2026 full moon at 22:11 UTC (Jean Meeus algorithm,
//            confirmed against USNO astronomical data)
// Previous full moon: Jan 3, 2026 at ~09:27 UTC (reference − 29.53 days)
// Next new moon:      Feb 17, 2026 at ~12:03 UTC (reference + 14.77 days)
// Next full moon:     Mar 3, 2026  at ~10:55 UTC (reference + 29.53 days)

const MOON_FULL_REF_MS = Date.UTC(2026, 1, 1, 22, 11); // Feb 1, 2026 22:11 UTC
const LUNAR_CYCLE = 29.53059;

function getMoonPhase(date) {
  const MS_PER_DAY = 86400000;
  const rawAge = (date.getTime() - MOON_FULL_REF_MS) / MS_PER_DAY;
  const age = ((rawAge % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const illum = Math.round((1 + Math.cos(2 * Math.PI * age / LUNAR_CYCLE)) / 2 * 100);
  var emoji, name;
  if (age < 1.85 || age >= 27.68)      { emoji = '\uD83C\uDF15'; name = 'Full Moon'; }
  else if (age < 7.38)                  { emoji = '\uD83C\uDF16'; name = 'Waning Gibbous'; }
  else if (age < 9.22)                  { emoji = '\uD83C\uDF17'; name = 'Last Quarter'; }
  else if (age < 14.77)                 { emoji = '\uD83C\uDF18'; name = 'Waning Crescent'; }
  else if (age < 16.61)                 { emoji = '\uD83C\uDF11'; name = 'New Moon'; }
  else if (age < 22.15)                 { emoji = '\uD83C\uDF12'; name = 'Waxing Crescent'; }
  else if (age < 24.0)                  { emoji = '\uD83C\uDF13'; name = 'First Quarter'; }
  else                                  { emoji = '\uD83C\uDF14'; name = 'Waxing Gibbous'; }
  var daysToFull;
  if (age < 1.85 || age >= 27.68) {
    daysToFull = 0;
  } else {
    var fullPhaseStartAge = 27.68;
    daysToFull = Math.round((fullPhaseStartAge - age) * 10) / 10;
  }
  var daysToNew;
  if (age >= 14.77 && age < 16.61) {
    daysToNew = 0;
  } else if (age < 14.77) {
    daysToNew = Math.round((14.77 - age) * 10) / 10;
  } else {
    daysToNew = Math.round((LUNAR_CYCLE - age + 14.77) * 10) / 10;
  }
  return { emoji, name, illumination: illum, daysToFull, daysToNew, age: Math.round(age * 10) / 10 };
}

// ─── Test harness ──────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(description, actual, expected) {
  if (actual === expected) {
    console.log('  PASS  ' + description);
    passed++;
  } else {
    console.error('  FAIL  ' + description);
    console.error('        expected: ' + JSON.stringify(expected));
    console.error('        actual:   ' + JSON.stringify(actual));
    failed++;
  }
}

function assertRange(description, actual, min, max) {
  if (actual >= min && actual <= max) {
    console.log('  PASS  ' + description + ' (' + actual + ' in [' + min + ',' + max + '])');
    passed++;
  } else {
    console.error('  FAIL  ' + description);
    console.error('        expected ' + actual + ' to be in range [' + min + ',' + max + ']');
    failed++;
  }
}

// ─── Test: Known full moon (Feb 1, 2026 22:11 UTC reference) ─────────────────
console.log('\nFull Moon – Feb 1, 2026 (22:11 UTC reference)');
{
  const p = getMoonPhase(new Date(Date.UTC(2026, 1, 1, 22, 11)));
  assert('name is Full Moon at peak', p.name, 'Full Moon');
  assert('illumination is 100% at peak', p.illumination, 100);
  assert('daysToFull is 0 at peak', p.daysToFull, 0);
  assertRange('age near 0 at peak', p.age, 0, 0.1);
}

// ─── Test: Still Full Moon 1 day after peak ───────────────────────────────────
console.log('\nFull Moon – Feb 2, 2026 (~1 day after peak)');
{
  const p = getMoonPhase(new Date(Date.UTC(2026, 1, 2, 22, 11)));
  assert('name is Full Moon 1d after peak', p.name, 'Full Moon');
  assertRange('illumination >90% 1d after peak', p.illumination, 90, 100);
}

// ─── Test: Waning Gibbous after Full Moon ────────────────────────────────────
console.log('\nWaning Gibbous – Feb 4, 2026 (~3 days after peak)');
{
  const p = getMoonPhase(new Date(Date.UTC(2026, 1, 4, 22, 11)));
  assert('name is Waning Gibbous', p.name, 'Waning Gibbous');
  assertRange('illumination 70–90%', p.illumination, 70, 90);
}

// ─── Test: Last Quarter (~7.4 days after full moon) ──────────────────────────
console.log('\nLast Quarter – Feb 9, 2026 (~7.5 days after peak)');
{
  // 7.5 days after full moon peak
  const d = new Date(MOON_FULL_REF_MS + 7.5 * 86400000);
  const p = getMoonPhase(d);
  assert('name is Last Quarter', p.name, 'Last Quarter');
  assertRange('illumination ~50%', p.illumination, 45, 55);
}

// ─── Test: Known new moon – Feb 17, 2026 ─────────────────────────────────────
// The New Moon phase label starts at age=14.77 days after full moon.
// Feb 17, 2026 12:03 UTC (age≈15.58) is confirmed by Jean Meeus algorithm.
console.log('\nNew Moon – Feb 17, 2026 (12:03 UTC, confirmed by Meeus algorithm)');
{
  const d = new Date(Date.UTC(2026, 1, 17, 12, 3));
  const p = getMoonPhase(d);
  assert('name is New Moon', p.name, 'New Moon');
  assertRange('illumination ≤5% at new moon', p.illumination, 0, 5);
  assert('daysToNew is 0 at new moon', p.daysToNew, 0);
}

// ─── Test: First Quarter (~22.2 days after full moon) ────────────────────────
console.log('\nFirst Quarter – Feb 24, 2026 (~22.2 days after peak)');
{
  const d = new Date(MOON_FULL_REF_MS + 22.2 * 86400000);
  const p = getMoonPhase(d);
  assert('name is First Quarter', p.name, 'First Quarter');
  assertRange('illumination ~50%', p.illumination, 45, 55);
}

// ─── Test: Waxing Gibbous between First Quarter and next Full Moon ────────────
console.log('\nWaxing Gibbous – Feb 27, 2026 (~26 days after peak)');
{
  const d = new Date(MOON_FULL_REF_MS + 26 * 86400000);
  const p = getMoonPhase(d);
  assert('name is Waxing Gibbous', p.name, 'Waxing Gibbous');
  assertRange('illumination 70–95%', p.illumination, 70, 95);
}

// ─── Test: Next full moon (Mar 3, 2026) ──────────────────────────────────────
console.log('\nFull Moon – Mar 3, 2026 (one cycle after reference)');
{
  const nextFullMs = MOON_FULL_REF_MS + LUNAR_CYCLE * 86400000;
  const p = getMoonPhase(new Date(nextFullMs));
  assert('name is Full Moon next cycle', p.name, 'Full Moon');
  assert('illumination is 100% next cycle', p.illumination, 100);
}

// ─── Test: Timezone boundary – 11:30 PM CST Feb 16 = 05:30 UTC Feb 17 ────────
// Verifies that a user in CST (UTC-6) at 11:30 PM on Feb 16 (= Feb 17 05:30 UTC)
// sees New Moon, not Waning Crescent.
console.log('\nTimezone boundary – 11:30 PM CST Feb 16 = 05:30 UTC Feb 17');
{
  const d = new Date(Date.UTC(2026, 1, 17, 5, 30)); // 11:30 PM CST Feb 16
  const p = getMoonPhase(d);
  assert('name is New Moon at CST boundary', p.name, 'New Moon');
  assertRange('illumination ≤5% at CST boundary', p.illumination, 0, 5);
}

// ─── Test: Historical full moon – Jan 3, 2026 ────────────────────────────────
// One cycle before the reference full moon.
console.log('\nHistorical full moon – Jan 3, 2026 (prev cycle)');
{
  const prevFullMs = MOON_FULL_REF_MS - LUNAR_CYCLE * 86400000;
  const p = getMoonPhase(new Date(prevFullMs));
  assert('name is Full Moon prev cycle', p.name, 'Full Moon');
  assert('illumination is 100% prev cycle', p.illumination, 100);
}

// ─── Test: Waxing Crescent (between new moon and first quarter) ───────────────
console.log('\nWaxing Crescent – ~18 days after reference full moon');
{
  const d = new Date(MOON_FULL_REF_MS + 18 * 86400000);
  const p = getMoonPhase(d);
  assert('name is Waxing Crescent', p.name, 'Waxing Crescent');
  assertRange('illumination 10–40%', p.illumination, 10, 40);
}

// ─── Test: Waning Crescent (between last quarter and new moon) ────────────────
// At 12 days past full moon, illumination is low (near new moon).
console.log('\nWaning Crescent – ~12 days after reference full moon');
{
  const d = new Date(MOON_FULL_REF_MS + 12 * 86400000);
  const p = getMoonPhase(d);
  assert('name is Waning Crescent', p.name, 'Waning Crescent');
  assertRange('illumination 5–15%', p.illumination, 5, 15);
}

// ─── Test: Bug regression – Feb 23, 2026 must be Waxing Crescent (not Waning) ─
// This was the core bug: old reference (Feb 12) caused the wrong phase.
// Actual astronomical data: Full Moon Feb 1, New Moon Feb 17, First Quarter Feb 24.
console.log('\nBug regression – Feb 23, 2026 midnight CST (06:00 UTC) must be Waxing Crescent');
{
  const d = new Date(Date.UTC(2026, 1, 23, 6, 0)); // midnight CST = 06:00 UTC
  const p = getMoonPhase(d);
  assert('name is Waxing Crescent on Feb 23 (not Waning)', p.name, 'Waxing Crescent');
  assertRange('illumination 30–50% on Feb 23 (increasing toward first quarter)', p.illumination, 30, 50);
}

// ─── Test: Feb 24, 2026 must be First Quarter ────────────────────────────────
console.log('\nFirst Quarter – Feb 24, 2026 midnight CST (06:00 UTC)');
{
  const d = new Date(Date.UTC(2026, 1, 24, 6, 0)); // midnight CST = 06:00 UTC
  const p = getMoonPhase(d);
  assert('name is First Quarter on Feb 24', p.name, 'First Quarter');
  assertRange('illumination ~50% on Feb 24', p.illumination, 45, 60);
}

// ─── Summary ───────────────────────────────────────────────────────────────────
console.log('\n─────────────────────────────────────────');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  process.exit(1);
}
