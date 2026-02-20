#!/usr/bin/env node

/**
 * Generate data/status.json — a static status endpoint for Pocket Fishing Guide.
 *
 * Aggregates build-time data source health from the USACE snapshot and notes
 * which other sources (USGS, NWS) are fetched live by the browser.
 *
 * Accessible at: /pocket-fishing-guide/data/status.json
 */

const fs = require("fs");
const path = require("path");

const USACE_PATH = path.resolve(__dirname, "..", "data", "usace_levels.json");
const OUT_PATH = path.resolve(__dirname, "..", "data", "status.json");

function main() {
  const generatedAt = new Date().toISOString();

  // ── USACE (build-time snapshot) ──────────────────────────────────────────
  let usaceStatus = "error";
  let usaceWaters = {};

  try {
    const usace = JSON.parse(fs.readFileSync(USACE_PATH, "utf8"));
    usaceWaters = Object.fromEntries(
      Object.entries(usace.waters || {}).map(([key, val]) => [
        key,
        {
          status: val.status,
          provider: val.provider,
          lastReading: val.lastReading || null,
        },
      ])
    );

    const statuses = Object.values(usaceWaters).map((w) => w.status);
    if (statuses.length === 0) {
      usaceStatus = "error";
    } else if (statuses.every((s) => s === "ok")) {
      usaceStatus = "ok";
    } else if (statuses.some((s) => s === "ok")) {
      usaceStatus = "degraded";
    } else {
      usaceStatus = "error";
    }
  } catch (err) {
    usaceStatus = "error";
    console.warn("Could not read usace_levels.json:", err.message);
  }

  // ── Overall status ───────────────────────────────────────────────────────
  // USGS and NWS are live browser fetches; their health is not known at
  // build time, so overall status reflects only the USACE snapshot.
  const overallStatus = usaceStatus === "ok" ? "ok" : "degraded";

  const output = {
    status: overallStatus,
    generatedAt,
    dataSources: {
      usace: {
        status: usaceStatus,
        note: "Reservoir elevation and release data fetched at build time from USACE district pages.",
        waters: usaceWaters,
      },
      usgs: {
        status: "live",
        note: "Water temperature, flow, and gage height fetched live in the browser from USGS Water Services (waterservices.usgs.gov).",
      },
      nws: {
        status: "live",
        note: "7-day weather forecasts fetched live in the browser from NWS (api.weather.gov).",
      },
    },
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`Wrote ${OUT_PATH}`);
}

main();
