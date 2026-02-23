#!/usr/bin/env node

/**
 * Validate data/stations.json integrity.
 *
 * Tests:
 *   1. File loads and has a non-empty stations array.
 *   2. Every station has all required fields with correct types.
 *   3. No duplicate station IDs.
 *   4. station_type values are within the allowed set (USGS | Corps | NWS).
 *   5. metrics_supported values are within the allowed set.
 *   6. Every waterbody_id resolves in water_bodies.json.
 *   7. Every non-null segment_id resolves in rivers_map.json.
 *   8. Each waterbody has at least one primary station (is_primary === true).
 *   9. No orphan stations — every station's waterbody_id exists in water_bodies.json.
 *  10. Lake Maumelle has all 3 required USGS stations.
 *  11. Each Corps station key maps to an entry in usace_levels.json.
 *
 * Exit 0 on success, exit 1 on any failure.
 */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "..", "data");
const STATIONS_PATH = path.join(DATA_DIR, "stations.json");
const WATER_BODIES_PATH = path.join(DATA_DIR, "water_bodies.json");
const RIVERS_MAP_PATH = path.join(DATA_DIR, "rivers_map.json");
const USACE_LEVELS_PATH = path.join(DATA_DIR, "usace_levels.json");

const VALID_STATION_TYPES = new Set(["USGS", "Corps", "NWS"]);
const VALID_METRICS = new Set(["temp", "flow", "elevation", "turbidity"]);
const REQUIRED_MAUMELLE_STATION_NUMBERS = ["07263300", "072632966", "072632995"];

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
  let stations, waterBodies, riversMap, usaceLevels;

  try {
    stations = JSON.parse(fs.readFileSync(STATIONS_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read stations.json: ${err.message}`);
    process.exit(1);
  }

  try {
    waterBodies = JSON.parse(fs.readFileSync(WATER_BODIES_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read water_bodies.json: ${err.message}`);
    process.exit(1);
  }

  try {
    riversMap = JSON.parse(fs.readFileSync(RIVERS_MAP_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read rivers_map.json: ${err.message}`);
    process.exit(1);
  }

  try {
    usaceLevels = JSON.parse(fs.readFileSync(USACE_LEVELS_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read usace_levels.json: ${err.message}`);
    process.exit(1);
  }

  // ── Test 1: Non-empty stations array ─────────────────────────────────────
  assert(
    Array.isArray(stations.stations) && stations.stations.length > 0,
    "stations.json has a non-empty stations array"
  );

  // ── Build lookup indexes ──────────────────────────────────────────────────
  const waterBodyIds = new Set(
    (waterBodies.water_bodies || []).map((wb) => wb.water_body_id)
  );

  const segmentIds = new Set();
  for (const river of (riversMap.rivers || [])) {
    for (const section of (river.sections || [])) {
      for (const segment of (section.segments || [])) {
        segmentIds.add(segment.segment_id);
      }
    }
  }

  const corpsKeys = new Set(Object.keys(usaceLevels.waters || {}));

  // ── Test 2–9: Per-station field validation ────────────────────────────────
  const seenIds = new Set();
  const primaryByWaterbody = new Map();

  for (const station of (stations.stations || [])) {
    const sid = station.id;

    // Test 2a: required string fields
    assert(
      typeof sid === "string" && sid.length > 0,
      `Station has a valid id: ${JSON.stringify(sid)}`
    );
    assert(
      typeof station.station_number === "string" && station.station_number.length > 0,
      `Station ${sid} has a station_number`
    );
    assert(
      typeof station.waterbody_id === "string" && station.waterbody_id.length > 0,
      `Station ${sid} has a waterbody_id`
    );
    assert(
      typeof station.is_primary === "boolean",
      `Station ${sid} has a boolean is_primary`
    );

    // Test 2b: station_type allowed value
    assert(
      VALID_STATION_TYPES.has(station.station_type),
      `Station ${sid} station_type "${station.station_type}" is valid (USGS | Corps | NWS)`
    );

    // Test 2c: metrics_supported is non-empty array of valid values
    assert(
      Array.isArray(station.metrics_supported) && station.metrics_supported.length > 0,
      `Station ${sid} has a non-empty metrics_supported array`
    );
    const invalidMetrics = (station.metrics_supported || []).filter(
      (m) => !VALID_METRICS.has(m)
    );
    assert(
      invalidMetrics.length === 0,
      `Station ${sid} metrics_supported contains only valid values (invalid: ${invalidMetrics.join(", ") || "none"})`
    );

    // Test 2d: segment_id is string or null
    assert(
      station.segment_id === null || (typeof station.segment_id === "string" && station.segment_id.length > 0),
      `Station ${sid} segment_id is null or a non-empty string`
    );

    // Test 3: No duplicate IDs
    assert(
      !seenIds.has(sid),
      `Station id "${sid}" is unique`
    );
    seenIds.add(sid);

    // Test 6: waterbody_id resolves
    assert(
      waterBodyIds.has(station.waterbody_id),
      `Station ${sid} waterbody_id "${station.waterbody_id}" resolves in water_bodies.json`
    );

    // Test 7: non-null segment_id resolves
    if (station.segment_id !== null) {
      assert(
        segmentIds.has(station.segment_id),
        `Station ${sid} segment_id "${station.segment_id}" resolves in rivers_map.json`
      );
    }

    // Test 11: Corps station_number resolves in usace_levels.json
    if (station.station_type === "Corps") {
      assert(
        corpsKeys.has(station.station_number),
        `Corps station ${sid} station_number "${station.station_number}" resolves in usace_levels.json`
      );
    }

    // Collect primary stations per waterbody (for Test 8)
    if (station.is_primary) {
      if (!primaryByWaterbody.has(station.waterbody_id)) {
        primaryByWaterbody.set(station.waterbody_id, []);
      }
      primaryByWaterbody.get(station.waterbody_id).push(sid);
    }
  }

  // ── Test 8: Each waterbody with any station has at least one primary ───────
  console.log("\n  Primary station coverage by waterbody:");
  const waterbodiesWithStations = new Set(
    (stations.stations || []).map((s) => s.waterbody_id)
  );
  for (const wbId of waterbodiesWithStations) {
    const primaries = primaryByWaterbody.get(wbId) || [];
    assert(
      primaries.length > 0,
      `Waterbody "${wbId}" has at least one primary station`
    );
  }

  // ── Test 10: Lake Maumelle has all 3 required USGS stations ──────────────
  console.log("\n  Lake Maumelle station coverage:");
  const maumelleStationNumbers = new Set(
    (stations.stations || [])
      .filter((s) => s.waterbody_id === "wb_lake_maumelle" && s.station_type === "USGS")
      .map((s) => s.station_number)
  );
  for (const required of REQUIRED_MAUMELLE_STATION_NUMBERS) {
    assert(
      maumelleStationNumbers.has(required),
      `Lake Maumelle includes required USGS station ${required}`
    );
  }

  // Confirm Lake Maumelle primary station is 07263300
  const maumellePrimary = (stations.stations || []).find(
    (s) => s.waterbody_id === "wb_lake_maumelle" && s.is_primary && s.station_type === "USGS"
  );
  assert(
    maumellePrimary !== undefined && maumellePrimary.station_number === "07263300",
    "Lake Maumelle primary USGS station is 07263300 (at Dam)"
  );

  // ── Coverage report: water bodies with no station (informational) ─────────
  console.log("\n  Water body coverage report (informational):");
  const coveredWaterBodyIds = new Set(
    (stations.stations || []).map((s) => s.waterbody_id)
  );
  for (const wb of (waterBodies.water_bodies || [])) {
    if (!coveredWaterBodyIds.has(wb.water_body_id)) {
      console.log(
        `    ℹ No station in stations.json for "${wb.water_body_id}" (${wb.name}) — no real-time monitoring data available`
      );
    }
  }

  // ── Coverage report: river segments whose governing station is shared ──────
  console.log("\n  Segment coverage report (informational):");
  const stationsBySegment = new Set(
    (stations.stations || []).filter((s) => s.segment_id).map((s) => s.segment_id)
  );
  for (const river of (riversMap.rivers || [])) {
    for (const section of (river.sections || [])) {
      for (const segment of (section.segments || [])) {
        if (!stationsBySegment.has(segment.segment_id)) {
          console.log(
            `    ℹ Segment "${segment.segment_id}" shares gauge ${segment.primary_station_id} with an adjacent segment — coverage via rivers_map.json`
          );
        }
      }
    }
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
