#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = ['id', 'name', 'sub', 'detail', 'rank', 'condition_score', 'type', 'agfc_cited', 'bait_type'];
const CONDITION_SCORE_KEYS = ['clear', 'stained', 'muddy', 'high_flow', 'low_flow'];
const VALID_TYPES = ['jig', 'spinner', 'crankbait', 'topwater', 'fly', 'live_bait', 'spoon', 'blade'];
const VALID_BAIT_TYPES = ['artificial', 'live', 'cut', 'scented_soft'];
const MIN_RANK = 1;
const MAX_RANK = 5;

const lureMasterPath = path.join(__dirname, '../data/lure-master.json');
if (!fs.existsSync(lureMasterPath)) {
  console.error('ERROR: data/lure-master.json not found');
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(fs.readFileSync(lureMasterPath, 'utf8'));
} catch (e) {
  console.error('ERROR: Failed to parse data/lure-master.json as valid JSON');
  console.error(e.message);
  process.exit(1);
}

if (!parsed || !Array.isArray(parsed.lures)) {
  console.error('ERROR: data/lure-master.json must contain a top-level "lures" array');
  process.exit(1);
}

const lures = parsed.lures;
let errors = 0;

lures.forEach((lure, i) => {
  REQUIRED_FIELDS.forEach(f => {
    if (lure[f] == null) {
      console.error(`Lure[${i}] ${lure.id || '?'}: missing required field "${f}"`);
      errors++;
    }
  });
  if (lure.condition_score !== undefined && lure.condition_score !== null) {
    if (typeof lure.condition_score !== 'object' || Array.isArray(lure.condition_score)) {
      console.error(`Lure[${i}] ${lure.id || '?'}: condition_score must be a non-null object`);
      errors++;
    } else {
      CONDITION_SCORE_KEYS.forEach(k => {
        const score = lure.condition_score[k];
        if (score == null) {
          console.error(`Lure[${i}] ${lure.id || '?'}: condition_score missing key "${k}"`);
          errors++;
        } else if (typeof score !== 'number' || !Number.isFinite(score) || score < 1 || score > 10) {
          console.error(`Lure[${i}] ${lure.id || '?'}: condition_score["${k}"] value ${score} out of range [1,10] or not a number`);
          errors++;
        }
      });
    }
  }
  if (lure.type && !VALID_TYPES.includes(lure.type)) {
    console.error(`Lure[${i}] ${lure.id}: invalid type "${lure.type}"`);
    errors++;
  }
  if (lure.bait_type && !VALID_BAIT_TYPES.includes(lure.bait_type)) {
    console.error(`Lure[${i}] ${lure.id}: invalid bait_type "${lure.bait_type}"`);
    errors++;
  }
  if (lure.rank !== undefined && (lure.rank < MIN_RANK || lure.rank > MAX_RANK)) {
    console.error(`Lure[${i}] ${lure.id}: rank ${lure.rank} out of range [${MIN_RANK},${MAX_RANK}]`);
    errors++;
  }
});

if (errors) {
  console.error(`\n${errors} validation error(s) found.`);
  process.exit(1);
} else {
  console.log(`✓ lure-master.json validated: ${lures.length} lures OK`);
}
