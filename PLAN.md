# Water Signal Hardening & Arkansas Waters Expansion Plan

## Branch: `claude/improve-water-temp-data-CZ3k2`

---

## Executive Summary

Expand coverage from **23 to 39+ water bodies**, harden all environmental data signals with multi-source fallback APIs, and add USGS turbidity-based water clarity. All free, no-key APIs. Static site architecture preserved — no backend required.

---

## Part A — Water Temperature Hardening (5-Tier Fallback)

### Current state
USGS param `00010` → if null, estimate from NWS air temp. Many rivers (Kings, Mulberry, War Eagle, etc.) have no `00010` sensor at all.

### New waterfall
| Tier | Source | How |
|------|--------|-----|
| 1 | USGS `00010` primary station | Already implemented |
| 2 | USGS `00010` alternate configured station | Already implemented |
| 3 | **Open-Meteo** `soil_temperature_0cm` proxy | NEW — free, no key |
| 4 | NWS air temp + seasonal offset | Already implemented |
| 5 | `localStorage` cached last-known-good (48hr TTL) | NEW |

**Open-Meteo endpoint (runtime):**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}
  &hourly=soil_temperature_0cm&forecast_days=1&timezone=America%2FChicago
```
Correction offset: rivers subtract 3°F, reservoirs subtract 5°F.

**Open-Meteo fallback (build-time in fetch_river_stations.js):**
Same endpoint, called via `curl` when USGS `00010` is null for a station.

### Files changed
- `scripts/fetch_river_stations.js` — add `fetchOpenMeteoTemp()`, coordinate lookup from `usgs_gauges.json`
- `index.html` — add `fetchOpenMeteoTemp(lat, lon, waterType)` function, insert Tier 3 + Tier 5 in `loadData`

---

## Part B — Barometric Pressure Hardening

### Current state
NWS observation stations only. If NWS fails, pressure is null.

### Fallback
**Open-Meteo surface pressure:**
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}
  &hourly=surface_pressure&forecast_days=1&timezone=America%2FChicago
```
Convert hPa → inHg (`× 0.02953`). Derive trend from first two hourly values.

### Files changed
- `index.html` — add `fetchOpenMeteoBarometer(lat, lon)`, call in `loadData` when `wxObs.pressure === null`

---

## Part C — Water Clarity Hardening (USGS Turbidity Sensor)

### Current state
Clarity derived from flow rate thresholds only (simple 3-tier: <500=clear, 500-1500=stained, >1500=muddy).

### Enhancement
Add USGS turbidity parameter to `fetchUSGS()`:
- `63680` = Turbidity in FNU (sensor-based, preferred)
- `00076` = Turbidity in NTU (historic)

**FNU thresholds:** <12 = clear, 12–50 = stained, >50 = muddy

When turbidity sensor data is available, it overrides flow-based derivation. Flow fallback retained for when no sensor exists.

### Files changed
- `index.html` — add `63680,00076` to `parameterCd`, add turbidity parse block in `fetchUSGS()`, update `deriveClarity(waterKey, flow, turbidityFNU)` signature and both call sites

---

## Part D — USGS Station ID Conflict Resolution (First Step)

**Verify these two before any data file changes:**

| Site | Current registry label | Likely actual river | Verification |
|------|------------------------|--------------------|-|
| `07049000` | "War Eagle Creek near Hindsville" | Kings River near Berryville | `curl https://waterservices.usgs.gov/nwis/iv/?sites=07049000&format=json` |
| `07056000` | "Buffalo River near St. Joe" | May be Crooked Creek near Yellville | `curl https://waterservices.usgs.gov/nwis/iv/?sites=07056000&format=json` |

Verification happens in-script before any JSON edits.

---

## Part E — New Bodies of Water (23 → 39)

### Ozark Rivers
| # | Water Body | Primary USGS | County | Species |
|---|-----------|-------------|--------|---------|
| 1 | Kings River | 07049000 | Carroll/Madison | Smallmouth, spotted bass |
| 2 | Mulberry River | 07247000, 07246500 | Crawford/Franklin | Smallmouth, channel cat |
| 3 | War Eagle Creek | 07049300 | Madison/Benton | Smallmouth, largemouth |
| 4 | Crooked Creek | 07055500 (verify 07056000) | Marion/Baxter/Boone | Smallmouth, rock bass |
| 5 | Strawberry River | 07069500, 07069000 | Izard/Sharp/Lawrence | Smallmouth, bass, trout (stocked) |
| 6 | Piney Creek (Ozark NF) | 07247500 | Johnson | Smallmouth, longear sunfish |

### Ouachita Rivers & Lakes
| # | Water Body | Primary USGS | County | Species |
|---|-----------|-------------|--------|---------|
| 7 | Cossatot River | 07340300 | Polk/Howard | Smallmouth, largemouth |
| 8 | Little Missouri River (above Narrows) | 07356500 | Pike/Howard/Polk | Largemouth, smallmouth, cat |
| 9 | Caddo River proper (above DeGray) | 07359610, 07359700 (reassign) | Montgomery/Pike | Smallmouth, largemouth |
| 10 | Fourche LaFave River | 07257000 | Perry/Yell/Scott | Smallmouth, largemouth, cat |
| 11 | Lake Greeson (Narrows Reservoir) | USACE SWL only | Pike/Howard | Largemouth, crappie, striped bass |

### Delta / Central AR
| # | Water Body | Primary USGS | County | Species |
|---|-----------|-------------|--------|---------|
| 12 | Arkansas River proper | 07252000, 07255000, 07263000 | Crawford→Pulaski | Sauger, white/striped bass, catfish |
| 13 | Saline River | 07363500, 07361500 | Garland/Saline/Grant | Largemouth, crappie, catfish, buffalo |
| 14 | Lake Chicot | No active USGS (AGFC managed) | Chicot | Crappie, largemouth, catfish |
| 15 | Lake Monticello | No active USGS (AGFC managed) | Drew | Largemouth, crappie |
| 16 | Little River | 07340000 | Sevier/Little River | Largemouth, crappie, catfish |

---

## Part F — File-by-File Change List

### 1. `data/water_bodies.json`
Add 16 new water body records following existing schema.
- Fix: reassign Caddo River gauges from `wb_degray_lake` to `wb_caddo_river`

### 2. `data/waters.json`
Add 16 new entries (id, name, type, managing_agency, parent_system, county[], primary_species[], has_segments, usace?).

### 3. `data/usgs_gauges.json`
- **Correct** `07049000` label/water_body_id based on verification result
- **Correct** `07056000` label/water_body_id based on verification result
- Add ~22 new gauge records for all new waters

### 4. `data/rivers_map.json`
Add 10 new river entries (rivers only; Lake Chicot/Monticello/Greeson are reservoirs, not rivers).

### 5. `data/stations_registry.json`
- Correct labels for `07049000` and `07056000`
- Add ~22 new station registry entries

### 6. `scripts/fetch_usace_levels.js`
Add Lake Greeson to SOURCES config:
```js
lakeGreeson: {
  name: "Lake Greeson (Narrows Reservoir)",
  provider: "USACE-SWL",
  format: "swl-tabular",
  url: "https://r.jina.ai/http://www.swl-wc.usace.army.mil/pages/data/tabular/htm/greeson.htm",
}
```

### 7. `scripts/fetch_river_stations.js`
- Add `fetchOpenMeteoTemp(lat, lon)` function
- Load `usgs_gauges.json` for station coordinates
- Apply Open-Meteo fallback when `temperature.value === null`
- Tag records with `tempSource: 'open-meteo-estimated'`

### 8. `index.html`
- Add `fetchOpenMeteoTemp(lat, lon, waterType)` — runtime Tier 3
- Add `fetchOpenMeteoBarometer(lat, lon)` — barometric fallback
- Add turbidity parsing to `fetchUSGS()`
- Update `deriveClarity(waterKey, flow, turbidityFNU)` + both call sites
- Insert Tier 3 Open-Meteo temp fallback in `loadData`
- Insert Open-Meteo barometer fallback in `loadData`
- Add `localStorage` Tier 5 cache (48hr TTL)
- Add 16 new `WATERS` constant entries (minimal viable structure first, full tips/access in follow-up)

---

## Part G — Implementation Sequence

**Phase 1**: Verify station ID conflicts via USGS API (scripts)
**Phase 2**: Update all JSON data files (water_bodies, waters, usgs_gauges, rivers_map, stations_registry)
**Phase 3**: Update build-time scripts (fetch_river_stations.js, fetch_usace_levels.js)
**Phase 4**: Update runtime JS in index.html (Open-Meteo functions, turbidity, WATERS entries, loadData fallbacks)
**Phase 5**: Validate (run validate_stations.js), commit, push

---

## Known Risks

1. `07049000` / `07056000` label conflicts — must verify before editing
2. Lake Greeson USACE page format may differ from other SWL pages — graceful fallback already present
3. Lake Chicot and Lake Monticello have no USGS gauges — will show NWS weather only (no flow/gage data)
4. Open-Meteo soil temp is an approximation — always marked as `tempSource: 'estimated'`, never as live sensor data
5. `index.html` WATERS additions are large — add minimal viable entries first to avoid runtime errors from missing required fields
