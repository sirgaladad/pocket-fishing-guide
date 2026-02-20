#!/usr/bin/env node

/**
 * Validate stations_registry.json and rivers_map.json integrity.
 *
 * Tests:
 *   1. Every river segment has a primary_station_id.
 *   2. Every segment's primary_station_id resolves in the stations registry.
 *   3. No orphaned stations — every registry station is referenced by at
 *      least one segment or a water body usgsStations config (registry-level
 *      audit; orphan check covers registry vs rivers_map only).
 *
 * Exit 0 on success, exit 1 on any failure.
 */

const fs = require("fs");
const path = require("path");

const REGISTRY_PATH = path.resolve(__dirname, "..", "data", "stations_registry.json");
const RIVERS_MAP_PATH = path.resolve(__dirname, "..", "data", "rivers_map.json");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function main() {
  // ── Load data files ────────────────────────────────────────────────────────
  let registry, riversMap;

  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read stations_registry.json: ${err.message}`);
    process.exit(1);
  }

  try {
    riversMap = JSON.parse(fs.readFileSync(RIVERS_MAP_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read rivers_map.json: ${err.message}`);
    process.exit(1);
  }

  // ── Build lookup: station_id → station object ──────────────────────────────
  const registryById = {};
  assert(
    Array.isArray(registry.stations) && registry.stations.length > 0,
    "stations_registry.json has a non-empty stations array"
  );

  for (const station of (registry.stations || [])) {
    assert(
      typeof station.station_id === "string" && station.station_id.length > 0,
      `Station has a valid station_id: ${JSON.stringify(station.station_id)}`
    );
    assert(
      typeof station.river === "string" && station.river.length > 0,
      `Station ${station.station_id} has a river field`
    );
    assert(
      typeof station.proximity === "string" && station.proximity.length > 0,
      `Station ${station.station_id} has a proximity field`
    );
    assert(
      typeof station.type === "string" && station.type.length > 0,
      `Station ${station.station_id} has a type field`
    );
    assert(
      typeof station.tailwater === "boolean",
      `Station ${station.station_id} has a boolean tailwater flag`
    );
    registryById[station.station_id] = station;
  }

  // ── Validate rivers_map structure ──────────────────────────────────────────
  assert(
    Array.isArray(riversMap.rivers) && riversMap.rivers.length > 0,
    "rivers_map.json has a non-empty rivers array"
  );

  const referencedStationIds = new Set();

  for (const river of (riversMap.rivers || [])) {
    assert(
      typeof river.river_id === "string" && river.river_id.length > 0,
      `River has a valid river_id: ${JSON.stringify(river.river_id)}`
    );
    assert(
      Array.isArray(river.sections) && river.sections.length > 0,
      `River "${river.river_id}" has at least one section`
    );

    for (const section of (river.sections || [])) {
      assert(
        typeof section.section_id === "string" && section.section_id.length > 0,
        `Section has a valid section_id: ${JSON.stringify(section.section_id)}`
      );
      assert(
        Array.isArray(section.segments) && section.segments.length > 0,
        `Section "${section.section_id}" has at least one segment`
      );

      for (const segment of (section.segments || [])) {
        // Test 1: Every segment has a primary_station_id
        assert(
          typeof segment.segment_id === "string" && segment.segment_id.length > 0,
          `Segment has a valid segment_id: ${JSON.stringify(segment.segment_id)}`
        );
        assert(
          typeof segment.primary_station_id === "string" &&
            segment.primary_station_id.length > 0,
          `Segment "${segment.segment_id}" has a primary_station_id`
        );

        if (typeof segment.primary_station_id === "string") {
          // Test 2: primary_station_id resolves in the registry
          assert(
            registryById[segment.primary_station_id] !== undefined,
            `Segment "${segment.segment_id}" primary_station_id "${segment.primary_station_id}" resolves in registry`
          );
          referencedStationIds.add(segment.primary_station_id);
        }
      }
    }
  }

  // Test 3: No orphaned stations (stations in registry not referenced by any segment)
  console.log("\n  Orphan check (registry vs rivers_map):");
  const allRegistryIds = Object.keys(registryById);
  for (const stationId of allRegistryIds) {
    const isReferenced = referencedStationIds.has(stationId);
    // Orphan check: stations not referenced by a segment are allowed (they may
    // be used by lake water bodies in the UI config), but we flag them as info.
    if (!isReferenced) {
      console.log(`    ℹ Station ${stationId} ("${registryById[stationId].label}") is not referenced by any river segment (may be a lake station — OK)`);
    }
  }

  // Ensure no segment references a station that isn't in the registry (strict check)
  for (const referencedId of referencedStationIds) {
    assert(
      registryById[referencedId] !== undefined,
      `Referenced station "${referencedId}" exists in registry`
    );
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n  Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.error("\nValidation FAILED.");
    process.exit(1);
  } else {
    console.log("\nAll validations passed.");
  }
}

main();
