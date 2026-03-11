#!/usr/bin/env node

/**
 * Fetch current water temperature for Arkansas reservoirs from the USACE CWMS REST API.
 *
 * Strategy:
 *   1. Query the CWMS timeseries catalog for each USACE district office (SWL, MVK)
 *      to discover which reservoirs have an active Temp-Water timeseries.
 *   2. For each matched timeseries, fetch the latest reading (6-hour window).
 *   3. Write data/lake_temps_snapshot.json with per-reservoir results.
 *      Lakes without a CWMS sensor are recorded as source: "cwms-unavailable" so
 *      the browser can fall back to monthly historical normals instead of soil proxy.
 *
 * Accessible at: /pocket-fishing-guide/data/lake_temps_snapshot.json
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const OUT_PATH = path.resolve(__dirname, "..", "data", "lake_temps_snapshot.json");
const CWMS_BASE = "https://cwms-data.usace.army.mil/cwms-data";

/**
 * Map from app water key → CWMS office + partial location name hints.
 * Hints are matched case-insensitively against the location portion
 * (everything before the first ".") of each CWMS timeseries name.
 *
 * SWL = Little Rock / Southwestern Division (NW, Central, W Arkansas)
 * MVK = Vicksburg / Mississippi Valley Division (S Arkansas)
 */
const RESERVOIR_MAP = {
  greers:       { office: "SWL", hints: ["greers ferry", "greers"] },
  bullshoals:   { office: "SWL", hints: ["bull shoals", "bullshoals", "bull_shoals"] },
  beaver:       { office: "SWL", hints: ["beaver"] },
  norfork:      { office: "SWL", hints: ["norfork"] },
  millwood:     { office: "SWL", hints: ["millwood"] },
  blueMountain: { office: "SWL", hints: ["blue mountain", "blue mtn", "bluemtn", "blue_mtn"] },
  nimrod:       { office: "SWL", hints: ["nimrod"] },
  dardanelle:   { office: "SWL", hints: ["dardanelle"] },
  lakeGreeson:  { office: "SWL", hints: ["greeson", "narrows"] },
  ouachita:     { office: "MVK", hints: ["blakely", "ouachita"] },
  degray:       { office: "MVK", hints: ["degray", "de gray"] },
};

/**
 * Perform a curl GET and parse the JSON response.
 * Returns parsed object or null on any failure.
 *
 * @param {string} url
 * @returns {Object|null}
 */
async function curlJson(url) {
  try {
    const resp = await fetch(url, {
      headers: { Accept: "application/json;version=2" },
      signal: AbortSignal.timeout(30000), // 30s timeout
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch (_) {
    return null;
  }
}

/**
 * Extract the location name (segment before first ".") from a CWMS timeseries ID.
 * E.g. "BULL SHOALS.Temp-Water.Inst.1Hour.0.lrgs-rev" → "bull shoals"
 *
 * @param {string} name - Full CWMS timeseries name.
 * @returns {string} Lower-cased location segment.
 */
function locationOf(name) {
  return (name || "").split(".")[0].toLowerCase().trim();
}

/**
 * Build the unavailable record for a lake that has no CWMS sensor.
 *
 * @param {string|null} timeseriesId - Matched CWMS ID if any, null otherwise.
 * @returns {Object}
 */
function unavailable(timeseriesId = null) {
  return { tempC: null, tempF: null, source: "cwms-unavailable", dateTime: null, timeseriesId };
}

function main() {
  const generatedAt = new Date().toISOString();

  // ── Step 1: Fetch CWMS Temp-Water catalog for each district office ─────────
  const catalogByOffice = {};
  for (const office of ["SWL", "MVK"]) {
    const url =
      `${CWMS_BASE}/catalog/timeseries` +
      `?office=${office}&like=Temp-Water&page-size=500`;
    console.log(`Fetching CWMS catalog for office ${office}…`);
    const data = curlJson(url);
    catalogByOffice[office] = data?.entries || [];
    console.log(`  → ${catalogByOffice[office].length} Temp-Water entries`);
    if (catalogByOffice[office].length > 0) {
      // Log a few sample names to help with diagnostics / hint-tuning
      catalogByOffice[office].slice(0, 5).forEach((e) =>
        console.log(`     sample: ${e.name}`)
      );
    }
  }

  // ── Step 2: Match catalog entries to our reservoir map ────────────────────
  const lakes = {};
  const beginISO = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const endISO   = new Date().toISOString();

  for (const [waterKey, config] of Object.entries(RESERVOIR_MAP)) {
    const entries = catalogByOffice[config.office] || [];
    const matched = entries.find((e) => {
      const loc = locationOf(e.name);
      return config.hints.some((h) => loc.includes(h));
    });

    if (!matched) {
      console.log(`  [${waterKey}] No CWMS Temp-Water series found → cwms-unavailable`);
      lakes[waterKey] = unavailable();
      continue;
    }

    // ── Step 3: Fetch the latest timeseries value (6-hour window) ─────────
    const tsUrl =
      `${CWMS_BASE}/timeseries` +
      `?office=${config.office}` +
      `&name=${encodeURIComponent(matched.name)}` +
      `&begin=${encodeURIComponent(beginISO)}` +
      `&end=${encodeURIComponent(endISO)}` +
      `&unit=F`;                              // request Fahrenheit directly

    console.log(`  [${waterKey}] Fetching "${matched.name}"…`);
    const tsData = curlJson(tsUrl);

    // CWMS returns values as [[epoch_ms, value, quality_code], …]
    // Quality code 5 = missing/rejected; 0 = good; 3 = estimated.
    const values = Array.isArray(tsData?.values) ? tsData.values : [];
    const latest = [...values]
      .reverse()
      .find((v) => v[1] !== null && v[1] !== undefined && v[2] !== 5);

    if (!latest) {
      console.log(`  [${waterKey}] No valid readings in last 6 hours → cwms-unavailable`);
      lakes[waterKey] = unavailable(matched.name);
      continue;
    }

    // When the API returns °F (unit=F), store as-is; also compute °C for reference.
    const tempF = Math.round(latest[1] * 10) / 10;
    const tempC = Math.round(((tempF - 32) * 5) / 9 * 10) / 10;
    const dateTime = new Date(latest[0]).toISOString();

    console.log(`  [${waterKey}] ${tempF}°F (${tempC}°C) @ ${dateTime}`);
    lakes[waterKey] = { tempC, tempF, source: "cwms", dateTime, timeseriesId: matched.name };
  }

  // ── Overall status ────────────────────────────────────────────────────────
  const results    = Object.values(lakes);
  const liveCount  = results.filter((r) => r.source === "cwms").length;
  const allFailed  = liveCount === 0;
  const overallStatus = allFailed ? "error" : liveCount < results.length ? "degraded" : "ok";

  const output = { status: overallStatus, generatedAt, lakes };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`Wrote ${OUT_PATH}`);
  console.log(
    `Status: ${overallStatus} — ${liveCount}/${results.length} lakes have live CWMS data`
  );
}

main();
