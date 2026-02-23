# USACE Lake Level Integration Tracker

## Purpose
Track integration of Army Corps dam/reservoir level + release data for all focused waters in Pocket Fishing Guide.

## Current Constraint
Direct browser scraping of USACE tabular pages is blocked by CORS.  
Solution implemented in this repo: scrape during GitHub Actions and publish same-origin snapshot at `data/usace_levels.json`.

## Primary Validation Source

All SWL-managed lakes and dams can be cross-validated against:

> **https://www.swl-wc.usace.army.mil/WM_Reports/current_conditions.html**

This page provides a unified current-conditions summary for all SWL Water Management projects and serves as the canonical reference when validating individual tabular scrapes.

Secondary source for MVK-managed waters (Ouachita, DeGray):

> **https://www.mvk-wc.usace.army.mil/resrep.htm**

## Key User Metric Implemented

For Corps-covered reservoirs, snapshot now computes:

- `topFloodPool` (ft)
- `currentPowerPool` (ft) - treated as lake level
- `feetBelowFloodPool = topFloodPool - currentPowerPool` (ft)

## Focused Waters Coverage

| Water | Type | Primary Source | WATERS Key | Snapshot Key | Status |
|---|---|---|---|---|---|
| Greers Ferry Lake | Lake | USACE-SWL tabular + USGS | `greers` | `greers` | ✅ Implemented |
| Bull Shoals Lake | Lake | USACE-SWL tabular + USGS | `bullshoals` | `bullshoals` | ✅ Implemented |
| Beaver Lake | Lake | USACE-SWL tabular + USGS | `beaver` | `beaver` | ✅ Implemented |
| Norfork Lake | Lake | USACE-SWL tabular + USGS | `norfork` | `norfork` | ✅ Added (pending first fetch) |
| Millwood Lake | Lake | USACE-SWL tabular + USGS | `millwood` | `millwood` | ✅ Added (pending first fetch) |
| Blue Mountain Lake | Lake | USACE-SWL tabular + USGS | `blueMountain` | `blueMountain` | ✅ Added (pending first fetch) |
| Nimrod Lake | Lake | USACE-SWL tabular + USGS | `nimrod` | `nimrod` | ✅ Added (pending first fetch) |
| Lake Dardanelle | Lake | USACE-SWL tabular + USGS | `dardanelle` | `dardanelle` | ✅ Added (pending first fetch) |
| Lake Ouachita | Lake | USACE-MVK reservoir report + USGS | `ouachita` | `ouachita` | ✅ Implemented |
| DeGray Lake | Lake | USACE-MVK reservoir report + USGS | `degray` | `degray` | ✅ Implemented |
| Beaver Tailwater | Tailwater | Derived from Beaver snapshot | `beaverTailwater` | `beaverTailwater` | ✅ Derived |
| Bull Shoals Tailwater | Tailwater | Derived from Bull Shoals snapshot | `bullShoalsTailwater` | `bullShoalsTailwater` | ✅ Derived |
| Norfork Tailwater | Tailwater | Derived from Norfork snapshot | `norforkTailwater` | `norforkTailwater` | ✅ Derived (pending norfork fetch) |
| Greers Ferry Tailwater | Tailwater | Derived from Greers snapshot | `greersTailwater` | `greersTailwater` | ✅ Derived |
| Narrows Tailwater | Tailwater | USACE-SWL tabular + USGS | `narrowsTailwater` | `narrowsTailwater` | ✅ Added (pending first fetch) |
| Ouachita Tailwater | Tailwater | USACE-SWL tabular + USGS | `ouachitaTailwater` | `ouachitaTailwater` | ✅ Added (pending first fetch) |
| Lake Maumelle | Lake | USGS / local operator updates | `maumelle` | — | Not a Corps integration target |
| Lake Conway | Lake | AGFC status updates | `conway` | — | Not a Corps integration target |
| Lake Hamilton | Lake | SWEPCO / USGS gauge | `hamilton` | — | Not a Corps integration target |
| Lake Catherine | Lake | SWEPCO / USGS gauge | `catherine` | — | Not a Corps integration target |
| White River | River | USGS river gauge | `whiteRiver` | — | Not a reservoir-level target |
| Buffalo National River | River | USGS river gauge | `buffalo` | — | Not a reservoir-level target |
| Spring River | Stream | USGS gauge (07068000) | `springRiver` | — | Not a Corps integration target |

## Derived Tailwater Keys

Some tailwaters share dam release data with their upstream reservoir. The script
copies the reservoir entry under the tailwater key so the app UI can load dam
release flow and elevation context directly:

```
beaverTailwater     → derived from beaver
bullShoalsTailwater → derived from bullshoals
norforkTailwater    → derived from norfork
greersTailwater     → derived from greers
```

`narrowsTailwater` and `ouachitaTailwater` have independent SWL tabular pages and
are fetched separately.

## GitHub Workflow Tracking

- Snapshot builder: `scripts/fetch_usace_levels.js`
- Output: `data/usace_levels.json`
- Deploy workflow: `.github/workflows/static.yml`
- Scheduled refresh: every 6 hours via GitHub Actions schedule

