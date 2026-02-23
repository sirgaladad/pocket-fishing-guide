#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = ['id', 'name', 'sub', 'detail', 'rank', 'condition_score', 'type', 'agfc_cited'];
const CONDITION_SCORE_KEYS = ['clear', 'stained', 'muddy', 'high_flow', 'low_flow'];
const VALID_TYPES = ['jig', 'spinner', 'crankbait', 'topwater', 'fly', 'live_bait', 'spoon', 'blade'];

const lureMasterPath = path.join(__dirname, '../data/lure-master.json');
if (!fs.existsSync(lureMasterPath)) {
  console.error('ERROR: data/lure-master.json not found');
  process.exit(1);
}

const { lures } = JSON.parse(fs.readFileSync(lureMasterPath, 'utf8'));
let errors = 0;

lures.forEach((lure, i) => {
  REQUIRED_FIELDS.forEach(f => {
    if (lure[f] === undefined) {
      console.error(`Lure[${i}] ${lure.id || '?'}: missing required field "${f}"`);
      errors++;
    }
  });
  if (lure.condition_score) {
    CONDITION_SCORE_KEYS.forEach(k => {
      if (lure.condition_score[k] === undefined) {
        console.error(`Lure[${i}] ${lure.id}: condition_score missing key "${k}"`);
        errors++;
      }
    });
  }
  if (lure.type && !VALID_TYPES.includes(lure.type)) {
    console.error(`Lure[${i}] ${lure.id}: invalid type "${lure.type}"`);
    errors++;
  }
  if (lure.rank !== undefined && (lure.rank < 1 || lure.rank > 5)) {
    console.error(`Lure[${i}] ${lure.id}: rank ${lure.rank} out of range [1,5]`);
    errors++;
  }
});

if (errors) {
  console.error(`\n${errors} validation error(s) found.`);
  process.exit(1);
} else {
  console.log(`✓ lure-master.json validated: ${lures.length} lures OK`);
}
