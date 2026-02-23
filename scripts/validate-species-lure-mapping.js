#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const lureMasterPath = path.join(__dirname, '../data/lure-master.json');
const salPath = path.join(__dirname, '../data/species_at_location.json');
const speciesPath = path.join(__dirname, '../data/species.json');

let errors = 0;

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`ERROR: ${filePath} not found`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`ERROR: Failed to parse ${filePath} as valid JSON`);
    console.error(e.message);
    process.exit(1);
  }
}

const lureMaster = loadJSON(lureMasterPath);
const sal = loadJSON(salPath);
const speciesData = loadJSON(speciesPath);

if (!Array.isArray(lureMaster.lures)) {
  console.error('ERROR: lure-master.json must contain a top-level "lures" array');
  process.exit(1);
}
if (!Array.isArray(sal.species_at_location)) {
  console.error('ERROR: species_at_location.json must contain a top-level "species_at_location" array');
  process.exit(1);
}
if (!Array.isArray(speciesData.species)) {
  console.error('ERROR: species.json must contain a top-level "species" array');
  process.exit(1);
}

const lureIds = new Set(lureMaster.lures.map(l => l.id));
const speciesIds = new Set(speciesData.species.map(s => s.species_id));

sal.species_at_location.forEach((record, i) => {
  const rid = record.record_id || `record[${i}]`;

  // Validate species_id resolves in species.json
  if (!record.species_id) {
    console.error(`${rid}: missing species_id`);
    errors++;
  } else if (!speciesIds.has(record.species_id)) {
    console.error(`${rid}: species_id "${record.species_id}" not found in species.json`);
    errors++;
  }

  // Validate every lure_id in best_lures[] resolves in lure-master.json
  if (Array.isArray(record.best_lures)) {
    record.best_lures.forEach(lureId => {
      if (!lureIds.has(lureId)) {
        console.error(`${rid}: best_lures ref "${lureId}" not found in lure-master.json`);
        errors++;
      }
    });
  }
});

if (errors) {
  console.error(`\n${errors} validation error(s) found in species-lure mapping.`);
  process.exit(1);
} else {
  console.log(`✓ species-lure mapping validated: ${sal.species_at_location.length} records, 0 orphaned refs`);
}
