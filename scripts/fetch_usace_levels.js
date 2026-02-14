#!/usr/bin/env node

/**
 * Build a same-origin USACE snapshot for reservoir elevation/release data.
 * This avoids browser CORS limitations against district tabular pages.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const OUT_PATH = path.resolve(__dirname, "..", "data", "usace_levels.json");

const SOURCES = {
  greers: {
    name: "Greers Ferry Lake",
    provider: "USACE-SWL",
    format: "swl-tabular",
    url: "https://r.jina.ai/http://www.swl-wc.usace.army.mil/pages/data/tabular/htm/greersf.htm",
  },
  bullshoals: {
    name: "Bull Shoals Lake",
    provider: "USACE-SWL",
    format: "swl-tabular",
    url: "https://r.jina.ai/http://www.swl-wc.usace.army.mil/pages/data/tabular/htm/bulsdam.htm",
  },
  beaver: {
    name: "Beaver Lake",
    provider: "USACE-SWL",
    format: "swl-tabular",
    url: "https://r.jina.ai/http://www.swl-wc.usace.army.mil/pages/data/tabular/htm/beaver.htm",
  },
  ouachita: {
    name: "Lake Ouachita (Blakely)",
    provider: "USACE-MVK",
    format: "mvk-resrep",
    reservoirName: "Blakely",
    url: "https://r.jina.ai/http://www.mvk-wc.usace.army.mil/resrep.htm",
  },
  degray: {
    name: "DeGray Lake",
    provider: "USACE-MVK",
    format: "mvk-resrep",
    reservoirName: "DeGray",
    url: "https://r.jina.ai/http://www.mvk-wc.usace.army.mil/resrep.htm",
  },
};

const MONTHS = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

function parseDateTimeToken(dateToken, timeToken) {
  const day = parseInt(dateToken.slice(0, 2), 10);
  const mon = MONTHS[dateToken.slice(2, 5)];
  const year = parseInt(dateToken.slice(5, 9), 10);
  if (Number.isNaN(day) || Number.isNaN(mon) || Number.isNaN(year)) return null;
  let hh = parseInt(timeToken.slice(0, 2), 10);
  let mm = parseInt(timeToken.slice(2, 4), 10);
  if (hh === 24) {
    hh = 23;
    mm = 59;
  }
  return new Date(Date.UTC(year, mon, day, hh, mm));
}

function asNumber(raw) {
  if (!raw || raw.includes("-") || raw === "----") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= -99) return null;
  return n;
}

function nearestValue(records, ts, field) {
  let best = null;
  for (const r of records) {
    if (r[field] === null) continue;
    const diff = Math.abs(r.ts - ts);
    if (!best || diff < best.diff) best = { diff, value: r[field] };
  }
  return best ? best.value : null;
}

function dailyAverages(records, field) {
  const buckets = new Map();
  for (const r of records) {
    const value = r[field];
    if (value === null) continue;
    const d = new Date(r.ts);
    const key = d.toISOString().slice(0, 10);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(value);
  }
  const rows = Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([key, vals]) => {
      const dt = new Date(`${key}T00:00:00Z`);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return {
        day: dt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
        avg,
      };
    });
  return rows;
}

function roundMaybe(v, places = 2) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Number(v.toFixed(places));
}

function parseTabularHtml(html) {
  const topFloodMatch = html.match(/Top Flood Pool:\s*([0-9.]+)/i);
  const currentPowerMatch = html.match(/Current Power Pool:\s*([0-9.]+)/i);
  const topFloodPool = topFloodMatch ? Number(topFloodMatch[1]) : null;
  const currentPowerPool = currentPowerMatch ? Number(currentPowerMatch[1]) : null;
  const feetBelowFloodPool =
    topFloodPool !== null && currentPowerPool !== null
      ? roundMaybe(topFloodPool - currentPowerPool, 2)
      : null;

  const lineRe = /^\s*(\d{2}[A-Z]{3}\d{4})\s+(\d{4})\s+([-\d.]+|----)\s+([-\d.]+|----)\s+([-\d.]+|----)\s+([-\d.]+|----)\s+([-\d.]+|----)\s+([-\d.]+|----)\s*$/gm;
  const records = [];
  let m;
  while ((m = lineRe.exec(html)) !== null) {
    const date = parseDateTimeToken(m[1], m[2]);
    if (!date) continue;
    records.push({
      ts: date.getTime(),
      elevation: asNumber(m[3]),
      totalRelease: asNumber(m[8]),
    });
  }
  records.sort((a, b) => a.ts - b.ts);
  if (records.length === 0) return null;

  const latest = records[records.length - 1];
  const ts24 = latest.ts - 24 * 60 * 60 * 1000;
  const ts7 = latest.ts - 7 * 24 * 60 * 60 * 1000;
  const latestElevation = nearestValue(records, latest.ts, "elevation");
  const latestFlow = nearestValue(records, latest.ts, "totalRelease");

  const elev24 = nearestValue(records, ts24, "elevation");
  const elev7 = nearestValue(records, ts7, "elevation");
  const flow24 = nearestValue(records, ts24, "totalRelease");
  const flow7 = nearestValue(records, ts7, "totalRelease");

  const gages7 = dailyAverages(records, "elevation").map((r) => ({ day: r.day, avg: roundMaybe(r.avg, 2) }));
  const flows7 = dailyAverages(records, "totalRelease").map((r) => ({ day: r.day, avg: Math.round(r.avg) }));

  return {
    topFloodPool: roundMaybe(topFloodPool, 2),
    currentPowerPool: roundMaybe(currentPowerPool, 2),
    feetBelowFloodPool,
    gage: roundMaybe(latestElevation, 2),
    flow: latestFlow !== null ? Math.round(latestFlow) : null,
    gageTrend24: latestElevation !== null && elev24 !== null ? roundMaybe(latestElevation - elev24, 2) : null,
    gageTrend7: latestElevation !== null && elev7 !== null ? roundMaybe(latestElevation - elev7, 2) : null,
    flowTrend24: latestFlow !== null && flow24 !== null ? Math.round(latestFlow - flow24) : null,
    flowTrend7: latestFlow !== null && flow7 !== null ? Math.round(latestFlow - flow7) : null,
    gages7,
    flows7,
    lastReading: new Date(latest.ts).toISOString(),
  };
}

function parseMvkResrepByReservoir(markdown, reservoirName) {
  const yearMatch = markdown.match(/Last Updated\s*-\s*[A-Z]+\s+\d{1,2},\s*(\d{4})\s*@/i);
  const year = yearMatch ? Number(yearMatch[1]) : (new Date()).getUTCFullYear();

  const escaped = reservoirName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rowRe = new RegExp(
    `\\[${escaped}\\]\\([^)]*\\)\\s*(\\d{1,2})\\/(\\d{1,2})\\s*@\\s*(\\d{3,4})\\s*\\[([+-]?\\d+(?:\\.\\d+)?)\\]\\([^)]*\\)\\s*([+-]?(?:\\d+\\.\\d+|\\.\\d+))\\s+([+-]?\\d+(?:\\.\\d+)?)([+-]\\d+(?:\\.\\d+)?)`,
    "i"
  );
  const match = markdown.match(rowRe);
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const hhmmRaw = match[3].padStart(4, "0");
  const hour = Number(hhmmRaw.slice(0, 2));
  const minute = Number(hhmmRaw.slice(2, 4));
  const poolElevation = Number(match[4]);
  const gageTrend24 = Number(match[5]);
  const powerPoolElevation = Number(match[6]);
  const aboveBelowPowerPool = Number(match[7]);

  const reading = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const dayLabel = reading.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return {
    topFloodPool: null,
    // MVK table does not publish top flood pool on this report.
    // We use the reported pool elevation as the primary lake-level figure.
    currentPowerPool: roundMaybe(poolElevation, 2),
    feetBelowFloodPool: null,
    gage: roundMaybe(poolElevation, 2),
    flow: null,
    gageTrend24: roundMaybe(gageTrend24, 2),
    gageTrend7: null,
    flowTrend24: null,
    flowTrend7: null,
    gages7: [{ day: dayLabel, avg: roundMaybe(poolElevation, 2) }],
    flows7: [],
    // Preserve additional MVK context for potential UI surfacing later.
    powerPoolElevation: roundMaybe(powerPoolElevation, 2),
    aboveBelowPowerPool: roundMaybe(aboveBelowPowerPool, 2),
    lastReading: reading.toISOString(),
  };
}

async function fetchText(url) {
  try {
    return execFileSync("curl", ["-sS", url], { encoding: "utf8" });
  } catch (err) {
    throw new Error(`curl failed for ${url}: ${err.message}`);
  }
}

async function main() {
  const out = {
    generatedAt: new Date().toISOString(),
    waters: {},
  };

  for (const [key, src] of Object.entries(SOURCES)) {
    try {
      const html = await fetchText(src.url);
      const parsed = src.format === "mvk-resrep"
        ? parseMvkResrepByReservoir(html, src.reservoirName)
        : parseTabularHtml(html);
      if (!parsed) throw new Error("No tabular rows parsed");
      out.waters[key] = {
        status: "ok",
        provider: src.provider,
        sourceUrl: src.url,
        ...parsed,
      };
    } catch (err) {
      out.waters[key] = {
        status: "error",
        provider: src.provider,
        sourceUrl: src.url,
        error: String(err && err.message ? err.message : err),
      };
    }
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
