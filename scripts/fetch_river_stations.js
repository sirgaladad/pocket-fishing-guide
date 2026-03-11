#!/usr/bin/env node

/**
 * Fetch current USGS readings for all river segment primary stations and
 * write a snapshot to data/river_stations_snapshot.json.
 *
 * Features:
 *   - Loads primary station IDs from rivers_map.json (segment layer only).
 *   - Fetches gage height, streamflow, and temperature from USGS Water Services.
 *   - Calculates deltas vs previous snapshot when one exists.
 *   - Graceful error handling: a missing or unreachable station produces a
 *     degraded record rather than failing the entire build.
 *
 * Accessible at: /pocket-fishing-guide/data/river_stations_snapshot.json
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const RIVERS_MAP_PATH = path.resolve(__dirname, "..", "data", "rivers_map.json");
const REGISTRY_PATH = path.resolve(__dirname, "..", "data", "stations_registry.json");
const GAUGES_PATH = path.resolve(__dirname, "..", "data", "usgs_gauges.json");
const SNAPSHOT_PATH = path.resolve(__dirname, "..", "data", "river_stations_snapshot.json");

// USGS parameter codes
const PARAM_GAGE_HEIGHT = "00065";
const PARAM_STREAMFLOW = "00060";
const PARAM_TEMPERATURE = "00010";

// Open-Meteo soil temperature proxy endpoint (no API key required)
const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";

// Month-specific soil-to-water correction offsets (°C) for rivers.
// Smaller offsets in spring/summer when stream temps track groundwater more closely.
const RIVER_OFFSETS_BY_MONTH  = [2.2, 2.0, 1.5, 1.2, 1.0, 0.8, 0.7, 0.7, 0.9, 1.2, 1.8, 2.0];
// Seasonal minimum floors (°C) — Ozark groundwater baselines.
// Prevents unrealistically cold estimates for spring-fed rivers in winter/spring.
const RIVER_FLOORS_C_BY_MONTH = [3.3, 4.4, 10.0, 13.3, 16.7, 19.4, 21.7, 21.7, 18.3, 13.9, 8.9, 4.4];

/**
 * Fetch soil temperature from Open-Meteo as a water temperature proxy.
 * Used when a USGS station has no 00010 temperature sensor.
 *
 * Uses 6 cm soil depth (more thermally stable than bare surface) with
 * month-specific correction offsets and Ozark groundwater-based minimum
 * floors to avoid unrealistically cold estimates for spring-fed rivers.
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {number|null} Estimated water temperature in °C, or null on failure.
 */
function fetchOpenMeteoTemp(lat, lng) {
  const url =
    `${OPEN_METEO_BASE}?latitude=${lat}&longitude=${lng}` +
    `&hourly=soil_temperature_0cm,soil_temperature_6cm&forecast_days=1&timezone=America%2FChicago`;
  try {
    const raw = execFileSync("curl", ["-sS", "--max-time", "20", url], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const data = JSON.parse(raw);
    // Prefer 6 cm depth — more thermally stable than bare surface layer.
    // Track index to retrieve the matching timestamp for month derivation.
    const vals6 = (data && data.hourly && data.hourly.soil_temperature_6cm) || [];
    const vals0 = (data && data.hourly && data.hourly.soil_temperature_0cm) || [];
    let latest = undefined;
    let latestIdx = -1;
    for (let i = vals6.length - 1; i >= 0; i--) {
      if (vals6[i] != null) { latest = vals6[i]; latestIdx = i; break; }
    }
    if (latest === undefined) {
      for (let i = vals0.length - 1; i >= 0; i--) {
        if (vals0[i] != null) { latest = vals0[i]; latestIdx = i; break; }
      }
    }
    if (latest === undefined || latest === null) return null;
    // Derive month from the API response timestamp (America/Chicago) to match
    // the data timezone and avoid off-by-one errors near month boundaries.
    const times = (data && data.hourly && data.hourly.time) || [];
    const timeStr = latestIdx >= 0 ? times[latestIdx] : null;
    // Open-Meteo returns timestamps as "YYYY-MM-DDTHH:MM" in the requested timezone,
    // so slicing the month digits is safe and avoids any UTC-conversion ambiguity.
    const month = timeStr
      ? parseInt(timeStr.slice(5, 7), 10) - 1
      : +new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", month: "numeric" }).format(new Date()) - 1;
    const offsetC = RIVER_OFFSETS_BY_MONTH[month];
    const floorC  = RIVER_FLOORS_C_BY_MONTH[month];
    return Math.round(Math.max(latest - offsetC, floorC) * 10) / 10;
  } catch (_) {
    return null;
  }
}

const USGS_BASE_URL =
  "https://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=" +
  [PARAM_GAGE_HEIGHT, PARAM_STREAMFLOW, PARAM_TEMPERATURE].join(",") +
  "&siteStatus=all&sites=";

/**
 * Collect the unique set of primary station IDs referenced across all
 * river segments in rivers_map.json.
 *
 * @param {Object} riversMap - Parsed rivers_map.json content.
 * @returns {string[]} Deduplicated array of station IDs.
 */
function collectPrimaryStationIds(riversMap) {
  const ids = new Set();
  for (const river of (riversMap.rivers || [])) {
    for (const section of (river.sections || [])) {
      for (const segment of (section.segments || [])) {
        if (segment.primary_station_id) {
          ids.add(segment.primary_station_id);
        }
      }
    }
  }
  return Array.from(ids);
}

/**
 * Fetch USGS instantaneous values for a batch of station IDs.
 * Returns parsed JSON or null on network/parse failure.
 *
 * @param {string[]} stationIds
 * @returns {Object|null}
 */
function fetchUSGS(stationIds) {
  const url = USGS_BASE_URL + stationIds.join(",");
  try {
    const raw = execFileSync("curl", ["-sS", "--max-time", "30", url], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return JSON.parse(raw);
  } catch (err) {
    console.warn(
      `USGS fetch failed for stations [${stationIds.join(", ")}]: ${err.message}`
    );
    return null;
  }
}

/**
 * Parse the latest value for a given parameter code from a USGS time series.
 *
 * @param {Object[]} timeSeries - Array from USGS response value.timeSeries.
 * @param {string} siteNo - Station ID to match.
 * @param {string} paramCd - USGS parameter code.
 * @returns {{ value: number|null, dateTime: string|null }}
 */
function parseLatestValue(timeSeries, siteNo, paramCd) {
  const series = (timeSeries || []).find(
    (ts) =>
      ts.sourceInfo &&
      ts.sourceInfo.siteCode &&
      ts.sourceInfo.siteCode[0] &&
      ts.sourceInfo.siteCode[0].value === siteNo &&
      ts.variable &&
      ts.variable.variableCode &&
      ts.variable.variableCode[0] &&
      ts.variable.variableCode[0].value === paramCd
  );
  if (!series) return { value: null, dateTime: null };

  const values = (series.values && series.values[0] && series.values[0].value) || [];
  const latest = values[values.length - 1];
  if (!latest) return { value: null, dateTime: null };

  const parsed = parseFloat(latest.value);
  return {
    value: isNaN(parsed) ? null : parsed,
    dateTime: latest.dateTime || null,
  };
}

/**
 * Calculate the delta between the current and previous value.
 * Returns null when either value is unavailable.
 *
 * @param {number|null} current
 * @param {number|null} previous
 * @returns {number|null}
 */
function calcDelta(current, previous) {
  if (current === null || previous === null) return null;
  return Math.round((current - previous) * 100) / 100;
}

async function main() {
  const generatedAt = new Date().toISOString();

  // ── Load rivers_map.json ──────────────────────────────────────────────────
  let riversMap;
  try {
    riversMap = JSON.parse(fs.readFileSync(RIVERS_MAP_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read rivers_map.json: ${err.message}`);
    process.exit(1);
  }

  // ── Load registry for label lookup ───────────────────────────────────────
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  } catch (err) {
    console.error(`Cannot read stations_registry.json: ${err.message}`);
    process.exit(1);
  }
  const registryById = Object.fromEntries(
    (registry.stations || []).map((s) => [s.station_id, s])
  );

  // ── Load USGS gauges for coordinate lookup (needed for Open-Meteo fallback) ─
  let coordsByStation = {};
  try {
    const gauges = JSON.parse(fs.readFileSync(GAUGES_PATH, "utf8"));
    for (const g of (gauges.usgs_gauges || [])) {
      if (g.usgs_site_number && g.coordinates) {
        coordsByStation[g.usgs_site_number] = g.coordinates;
      }
    }
  } catch (_) {
    // Non-fatal — Open-Meteo fallback will simply be skipped if coordinates unavailable
  }

  // ── Load previous snapshot for delta calculation ──────────────────────────
  let previousSnapshot = null;
  try {
    previousSnapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
  } catch (_) {
    // No previous snapshot — deltas will be null on first run
  }

  const previousById = {};
  if (previousSnapshot && Array.isArray(previousSnapshot.stations)) {
    for (const s of previousSnapshot.stations) {
      previousById[s.station_id] = s;
    }
  }

  // ── Collect station IDs from river segments ───────────────────────────────
  const stationIds = collectPrimaryStationIds(riversMap);
  if (stationIds.length === 0) {
    console.error("No primary station IDs found in rivers_map.json.");
    process.exit(1);
  }

  console.log(`Fetching USGS readings for ${stationIds.length} river stations...`);

  // ── Fetch USGS data ───────────────────────────────────────────────────────
  const usgsData = fetchUSGS(stationIds);
  const timeSeries =
    usgsData &&
    usgsData.value &&
    Array.isArray(usgsData.value.timeSeries)
      ? usgsData.value.timeSeries
      : [];

  // ── Build station records ─────────────────────────────────────────────────
  const stationRecords = stationIds.map((id) => {
    const reg = registryById[id];
    const label = reg ? reg.label : id;
    const tailwater = reg ? reg.tailwater : false;

    let status = "ok";
    let note = null;

    const gageHeight = parseLatestValue(timeSeries, id, PARAM_GAGE_HEIGHT);
    const streamflow = parseLatestValue(timeSeries, id, PARAM_STREAMFLOW);
    const temperature = parseLatestValue(timeSeries, id, PARAM_TEMPERATURE);

    // Graceful degradation: mark station as missing if no readings found
    if (
      gageHeight.value === null &&
      streamflow.value === null &&
      temperature.value === null
    ) {
      status = "missing";
      note = `No current readings returned by USGS for station ${id}. Station may be offline or ID may be inactive.`;
    }

    // ── Open-Meteo temperature fallback ──────────────────────────────────────
    // When USGS 00010 sensor is absent, estimate water temp from Open-Meteo
    // soil surface temperature with a correction offset. Tagged as 'estimated'
    // so the UI can distinguish live sensor data from proxy estimates.
    let tempSource = "usgs";
    let tempValue = temperature.value;
    let tempDateTime = temperature.dateTime;
    if (tempValue === null) {
      const coords = coordsByStation[id];
      if (
        coords &&
        Number.isFinite(coords.lat) &&
        Number.isFinite(coords.lng)
      ) {
        const estimated = fetchOpenMeteoTemp(coords.lat, coords.lng);
        if (estimated !== null) {
          tempValue = estimated;
          tempDateTime = new Date().toISOString();
          tempSource = "open-meteo-estimated";
          console.log(`  [${id}] No USGS temp — used Open-Meteo proxy: ${estimated}°C`);
        }
      }
    }

    const prev = previousById[id] || null;

    return {
      station_id: id,
      label,
      tailwater,
      status,
      note,
      gageHeight: {
        value: gageHeight.value,
        unit: "ft",
        dateTime: gageHeight.dateTime,
        delta: prev && prev.gageHeight
          ? calcDelta(gageHeight.value, prev.gageHeight.value)
          : null,
      },
      streamflow: {
        value: streamflow.value,
        unit: "cfs",
        dateTime: streamflow.dateTime,
        delta: prev && prev.streamflow
          ? calcDelta(streamflow.value, prev.streamflow.value)
          : null,
      },
      temperature: {
        value: tempValue,
        unit: "°C",
        dateTime: tempDateTime,
        source: tempSource,
        delta: prev && prev.temperature
          ? calcDelta(tempValue, prev.temperature.value)
          : null,
      },
    };
  });

  // ── Overall status ────────────────────────────────────────────────────────
  const statuses = stationRecords.map((s) => s.status);
  let overallStatus = "ok";
  if (statuses.every((s) => s === "missing")) {
    overallStatus = "error";
  } else if (statuses.some((s) => s === "missing")) {
    overallStatus = "degraded";
  }

  const output = {
    status: overallStatus,
    generatedAt,
    stationCount: stationRecords.length,
    stations: stationRecords,
  };

  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`Wrote ${SNAPSHOT_PATH}`);

  const missing = stationRecords.filter((s) => s.status === "missing");
  if (missing.length > 0) {
    console.warn(
      `Warning: ${missing.length} station(s) returned no data: ${missing.map((s) => s.station_id).join(", ")}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
