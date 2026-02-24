#!/usr/bin/env node
'use strict';

// ─── Moon Phase unit tests ────────────────────────────────────────────────────
// Tests TWO implementations that mirror index.html:
//
//  1. USNO events-based (primary): _getMoonPhaseFromEvents()
//     Uses official USNO phase event timestamps to determine phase name and
//     computes illumination anchored to the exact New Moon time.
//     Official Feb 2026 USNO data:
//       Jan 18 02:52 UTC – New Moon   (prev cycle)
//       Jan 25 01:47 UTC – First Quarter
//       Feb  1 22:09 UTC – Full Moon
//       Feb  8 12:01 UTC – Last Quarter
//       Feb 17 00:01 UTC – New Moon
//       Feb 24 20:28 UTC – First Quarter  ← key: NOT 01:47 UTC
//       Mar  3 10:38 UTC – Full Moon
//
//  2. Formula fallback: _getMoonPhaseCalc()
//     Cosine model from Feb 1, 2026 22:11 UTC full-moon reference.
//     Used when the USNO API is unavailable.

const MOON_FULL_REF_MS = Date.UTC(2026, 1, 1, 22, 11); // Feb 1, 2026 22:11 UTC
const LUNAR_CYCLE = 29.53059;

const MOON_PHASE_EMOJI = {
  'New Moon':       '\uD83C\uDF11',
  'Waxing Crescent':'\uD83C\uDF12',
  'First Quarter':  '\uD83C\uDF13',
  'Waxing Gibbous': '\uD83C\uDF14',
  'Full Moon':      '\uD83C\uDF15',
  'Waning Gibbous': '\uD83C\uDF16',
  'Last Quarter':   '\uD83C\uDF17',
  'Waning Crescent':'\uD83C\uDF18',
};

// ── USNO events-based (primary) ────────────────────────────────────────────────
// Official USNO data for the Jan–Mar 2026 lunar cycles.
const USNO_EVENTS_2026 = [
  { ms: Date.UTC(2026, 0, 18,  2, 52), phase: 'New Moon' },
  { ms: Date.UTC(2026, 0, 25,  1, 47), phase: 'First Quarter' },
  { ms: Date.UTC(2026, 1,  1, 22,  9), phase: 'Full Moon' },
  { ms: Date.UTC(2026, 1,  8, 12,  1), phase: 'Last Quarter' },
  { ms: Date.UTC(2026, 1, 17,  0,  1), phase: 'New Moon' },
  { ms: Date.UTC(2026, 1, 24, 20, 28), phase: 'First Quarter' },
  { ms: Date.UTC(2026, 2,  3, 10, 38), phase: 'Full Moon' },
  { ms: Date.UTC(2026, 2, 11,  2, 37), phase: 'Last Quarter' },
  { ms: Date.UTC(2026, 2, 18, 18,  4), phase: 'New Moon' },
].sort((a, b) => a.ms - b.ms);

function _phaseNameFromEvents(nowMs, events) {
  let prev = null;
  for (const ev of events) {
    if (ev.ms <= nowMs) prev = ev;
    else break;
  }
  if (!prev) return 'Waxing Crescent';
  const daysSince = (nowMs - prev.ms) / 86400000;
  if (daysSince <= 1.85) return prev.phase;
  switch (prev.phase) {
    case 'New Moon':      return 'Waxing Crescent';
    case 'First Quarter': return 'Waxing Gibbous';
    case 'Full Moon':     return 'Waning Gibbous';
    case 'Last Quarter':  return 'Waning Crescent';
    default:              return prev.phase;
  }
}

function _getMoonPhaseFromEvents(date, events) {
  const nowMs = date.getTime();
  const name  = _phaseNameFromEvents(nowMs, events);
  const emoji = MOON_PHASE_EMOJI[name] || '\uD83C\uDF15';

  const lastNew = events.filter(e => e.phase === 'New Moon' && e.ms <= nowMs)
    .sort((a, b) => b.ms - a.ms)[0];
  let illum = 50, age = 0;
  if (lastNew) {
    const d = (nowMs - lastNew.ms) / 86400000;
    age   = Math.round(d * 10) / 10;
    illum = Math.round((1 - Math.cos(2 * Math.PI * d / LUNAR_CYCLE)) / 2 * 100);
  }

  let daysToFull = 0, daysToNew = 0;
  for (const ev of events) {
    if (ev.ms > nowMs) {
      if (!daysToFull && ev.phase === 'Full Moon')
        daysToFull = Math.round((ev.ms - nowMs) / 86400000 * 10) / 10;
      if (!daysToNew && ev.phase === 'New Moon')
        daysToNew = Math.round((ev.ms - nowMs) / 86400000 * 10) / 10;
      if (daysToFull && daysToNew) break;
    }
  }
  if (name === 'Full Moon') daysToFull = 0;
  if (name === 'New Moon')  daysToNew  = 0;

  return { emoji, name, illumination: illum, daysToFull, daysToNew, age };
}

// ── Formula fallback ────────────────────────────────────────────────────────────
function _getMoonPhaseCalc(date) {
  const MS_PER_DAY = 86400000;
  const rawAge = (date.getTime() - MOON_FULL_REF_MS) / MS_PER_DAY;
  const age = ((rawAge % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  const illum = Math.round((1 + Math.cos(2 * Math.PI * age / LUNAR_CYCLE)) / 2 * 100);
  let name;
  if (age < 1.85 || age >= 27.68)      name = 'Full Moon';
  else if (age < 7.38)                  name = 'Waning Gibbous';
  else if (age < 9.22)                  name = 'Last Quarter';
  else if (age < 14.77)                 name = 'Waning Crescent';
  else if (age < 16.61)                 name = 'New Moon';
  else if (age < 22.15)                 name = 'Waxing Crescent';
  else if (age < 24.0)                  name = 'First Quarter';
  else                                  name = 'Waxing Gibbous';
  const emoji = MOON_PHASE_EMOJI[name] || '\uD83C\uDF15';
  let daysToFull;
  if (age < 1.85 || age >= 27.68) {
    daysToFull = 0;
  } else {
    daysToFull = Math.round((27.68 - age) * 10) / 10;
  }
  let daysToNew;
  if (age >= 14.77 && age < 16.61) {
    daysToNew = 0;
  } else if (age < 14.77) {
    daysToNew = Math.round((14.77 - age) * 10) / 10;
  } else {
    daysToNew = Math.round((LUNAR_CYCLE - age + 14.77) * 10) / 10;
  }
  return { emoji, name, illumination: illum, daysToFull, daysToNew, age: Math.round(age * 10) / 10 };
}

// ── Test harness ────────────────────────────────────────────────────────────────
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

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 1: USNO events-based (primary path)
// ════════════════════════════════════════════════════════════════════════════════
console.log('\n══ USNO events-based (primary path) ══════════════════════════════════════════');

// ─── Full Moon – Feb 1, 2026 22:09 UTC (USNO exact time) ─────────────────────
console.log('\nFull Moon – Feb 1, 2026 22:09 UTC (USNO exact)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 1, 22, 9)), USNO_EVENTS_2026);
  assert('name is Full Moon at USNO exact time', p.name, 'Full Moon');
  assert('illumination is 100% at full moon', p.illumination, 100);
  assert('daysToFull is 0', p.daysToFull, 0);
}

// ─── Still Full Moon 1 day after USNO exact time ─────────────────────────────
console.log('\nFull Moon – Feb 2, 2026 22:09 UTC (1 day after USNO exact)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 2, 22, 9)), USNO_EVENTS_2026);
  assert('name is still Full Moon 1d after USNO event', p.name, 'Full Moon');
  assertRange('illumination >90% 1d after full moon', p.illumination, 90, 100);
}

// ─── Waning Gibbous 3 days after Full Moon ───────────────────────────────────
console.log('\nWaning Gibbous – Feb 4, 2026 22:09 UTC');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 4, 22, 9)), USNO_EVENTS_2026);
  assert('name is Waning Gibbous', p.name, 'Waning Gibbous');
  assertRange('illumination 70–90%', p.illumination, 70, 90);
}

// ─── Last Quarter – Feb 8, 2026 (USNO exact: 12:01 UTC) ─────────────────────
console.log('\nLast Quarter – Feb 8, 2026 12:01 UTC (USNO exact)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 8, 12, 1)), USNO_EVENTS_2026);
  assert('name is Last Quarter at USNO time', p.name, 'Last Quarter');
  assertRange('illumination 45–65% at Last Quarter (cosine formula offset is normal)', p.illumination, 45, 65);
}

// ─── Last Quarter – +7.5 days after old reference (regression guard) ─────────
console.log('\nLast Quarter – +7.5 days after Feb 1 22:11 ref');
{
  const d = new Date(MOON_FULL_REF_MS + 7.5 * 86400000);
  const p = _getMoonPhaseFromEvents(d, USNO_EVENTS_2026);
  assert('name is Last Quarter at +7.5d', p.name, 'Last Quarter');
  assertRange('illumination 40–55% at +7.5d', p.illumination, 40, 55);
}

// ─── New Moon – Feb 17, 2026 00:01 UTC (USNO exact) ──────────────────────────
console.log('\nNew Moon – Feb 17, 2026 00:01 UTC (USNO exact)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 17, 0, 1)), USNO_EVENTS_2026);
  assert('name is New Moon at USNO time', p.name, 'New Moon');
  assertRange('illumination ≤5% at New Moon', p.illumination, 0, 5);
  assert('daysToNew is 0', p.daysToNew, 0);
}

// ─── CST boundary: 11:30 PM CST Feb 16 = 05:30 UTC Feb 17 ───────────────────
console.log('\nTimezone boundary – 11:30 PM CST Feb 16 = 05:30 UTC Feb 17');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 17, 5, 30)), USNO_EVENTS_2026);
  assert('name is New Moon at CST boundary', p.name, 'New Moon');
  assertRange('illumination ≤5% at CST boundary', p.illumination, 0, 5);
}

// ─── Waxing Crescent – Feb 23, 2026 midnight CST (06:00 UTC) ─────────────────
console.log('\nBug regression – Feb 23, 2026 midnight CST (06:00 UTC) must be Waxing Crescent');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 23, 6, 0)), USNO_EVENTS_2026);
  assert('name is Waxing Crescent on Feb 23 (not Waning)', p.name, 'Waxing Crescent');
  assertRange('illumination 30–50% on Feb 23', p.illumination, 30, 50);
}

// ─── BUG REGRESSION: Feb 24 04:21 UTC – user-reported bug time ───────────────
console.log('\nBUG REGRESSION – Feb 24, 2026 04:21 UTC must be Waxing Crescent (not First Quarter)');
{
  const p = _getMoonPhaseFromEvents(new Date('2026-02-24T04:21:57.675Z'), USNO_EVENTS_2026);
  assert('name is Waxing Crescent at bug report time', p.name, 'Waxing Crescent');
  assertRange('illumination 40–55% at bug report time', p.illumination, 40, 55);
}

// ─── Still Waxing Crescent at Feb 24 midnight CST (06:00 UTC) ────────────────
// First Quarter event is at 20:28 UTC – midnight CST is still Waxing Crescent
console.log('\nWaxing Crescent – Feb 24, 2026 midnight CST (06:00 UTC)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 24, 6, 0)), USNO_EVENTS_2026);
  assert('name is Waxing Crescent at midnight CST Feb 24', p.name, 'Waxing Crescent');
  assertRange('illumination 40–55% at midnight CST Feb 24', p.illumination, 40, 55);
}

// ─── First Quarter – Feb 24, 2026 20:28 UTC (USNO exact) ─────────────────────
console.log('\nFirst Quarter – Feb 24, 2026 20:28 UTC (USNO exact)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 24, 20, 28)), USNO_EVENTS_2026);
  assert('name is First Quarter at USNO exact time', p.name, 'First Quarter');
  assertRange('illumination ~50% at First Quarter', p.illumination, 49, 56);
}

// ─── Waxing Gibbous – Feb 27 (26 days after old ref) ─────────────────────────
console.log('\nWaxing Gibbous – Feb 27, 2026');
{
  const d = new Date(MOON_FULL_REF_MS + 26 * 86400000);
  const p = _getMoonPhaseFromEvents(d, USNO_EVENTS_2026);
  assert('name is Waxing Gibbous', p.name, 'Waxing Gibbous');
  assertRange('illumination 70–95%', p.illumination, 70, 95);
}

// ─── Full Moon – Mar 3, 2026 (next cycle) ────────────────────────────────────
console.log('\nFull Moon – Mar 3, 2026 (next cycle, USNO exact 10:38 UTC)');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 2, 3, 10, 38)), USNO_EVENTS_2026);
  assert('name is Full Moon next cycle', p.name, 'Full Moon');
  assert('illumination is 100% next cycle', p.illumination, 100);
}

// ─── daysToFull / daysToNew sanity check ────────────────────────────────────
console.log('\ndaysToFull / daysToNew – Waxing Crescent Feb 20, 2026');
{
  const p = _getMoonPhaseFromEvents(new Date(Date.UTC(2026, 1, 20, 0, 0)), USNO_EVENTS_2026);
  assert('name is Waxing Crescent', p.name, 'Waxing Crescent');
  assertRange('daysToFull is ~11 days', p.daysToFull, 10, 12);
  assertRange('daysToNew is ~25 days', p.daysToNew, 24, 27);
}

// ════════════════════════════════════════════════════════════════════════════════
// SECTION 2: Formula fallback (used when USNO API is unavailable)
// ════════════════════════════════════════════════════════════════════════════════
console.log('\n══ Formula fallback (used when USNO API is unavailable) ═════════════════════');

// ─── Full Moon at reference ───────────────────────────────────────────────────
console.log('\nFull Moon – Feb 1, 2026 22:11 UTC (formula reference)');
{
  const p = _getMoonPhaseCalc(new Date(Date.UTC(2026, 1, 1, 22, 11)));
  assert('name is Full Moon at ref', p.name, 'Full Moon');
  assert('illumination is 100% at ref', p.illumination, 100);
  assert('daysToFull is 0', p.daysToFull, 0);
}

// ─── Full Moon still 1 day after reference ───────────────────────────────────
console.log('\nFull Moon – Feb 2, 2026 (1 day after ref)');
{
  const p = _getMoonPhaseCalc(new Date(Date.UTC(2026, 1, 2, 22, 11)));
  assert('name is Full Moon 1d after ref', p.name, 'Full Moon');
  assertRange('illumination >90%', p.illumination, 90, 100);
}

// ─── Waning Gibbous 3 days after reference ───────────────────────────────────
console.log('\nWaning Gibbous – Feb 4, 2026 (~3d after ref)');
{
  const p = _getMoonPhaseCalc(new Date(Date.UTC(2026, 1, 4, 22, 11)));
  assert('name is Waning Gibbous', p.name, 'Waning Gibbous');
  assertRange('illumination 70–90%', p.illumination, 70, 90);
}

// ─── Last Quarter ─────────────────────────────────────────────────────────────
console.log('\nLast Quarter – +7.5 days after formula reference');
{
  const p = _getMoonPhaseCalc(new Date(MOON_FULL_REF_MS + 7.5 * 86400000));
  assert('name is Last Quarter', p.name, 'Last Quarter');
  assertRange('illumination ~50%', p.illumination, 45, 55);
}

// ─── New Moon (formula predicts ~12:03 UTC for this cycle) ───────────────────
console.log('\nNew Moon – Feb 17, 2026 12:03 UTC (formula midpoint)');
{
  const p = _getMoonPhaseCalc(new Date(Date.UTC(2026, 1, 17, 12, 3)));
  assert('name is New Moon', p.name, 'New Moon');
  assertRange('illumination ≤5%', p.illumination, 0, 5);
  assert('daysToNew is 0', p.daysToNew, 0);
}

// ─── CST boundary ─────────────────────────────────────────────────────────────
console.log('\nTimezone boundary – 11:30 PM CST Feb 16 = 05:30 UTC Feb 17');
{
  const p = _getMoonPhaseCalc(new Date(Date.UTC(2026, 1, 17, 5, 30)));
  assert('name is New Moon at CST boundary', p.name, 'New Moon');
  assertRange('illumination ≤5%', p.illumination, 0, 5);
}

// ─── Waxing Crescent ─────────────────────────────────────────────────────────
console.log('\nWaxing Crescent – Feb 23, 2026 midnight CST (06:00 UTC)');
{
  const p = _getMoonPhaseCalc(new Date(Date.UTC(2026, 1, 23, 6, 0)));
  assert('name is Waxing Crescent on Feb 23', p.name, 'Waxing Crescent');
  assertRange('illumination 30–50% on Feb 23', p.illumination, 30, 50);
}

// ─── Next Full Moon ────────────────────────────────────────────────────────────
console.log('\nFull Moon – Mar 3, 2026 (one cycle after formula reference)');
{
  const p = _getMoonPhaseCalc(new Date(MOON_FULL_REF_MS + LUNAR_CYCLE * 86400000));
  assert('name is Full Moon next cycle', p.name, 'Full Moon');
  assert('illumination is 100% next cycle', p.illumination, 100);
}

// ─── Historical full moon ──────────────────────────────────────────────────────
console.log('\nHistorical full moon – one cycle before reference');
{
  const p = _getMoonPhaseCalc(new Date(MOON_FULL_REF_MS - LUNAR_CYCLE * 86400000));
  assert('name is Full Moon prev cycle', p.name, 'Full Moon');
  assert('illumination is 100% prev cycle', p.illumination, 100);
}

// ─── Summary ───────────────────────────────────────────────────────────────────
console.log('\n─────────────────────────────────────────');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  process.exit(1);
}
