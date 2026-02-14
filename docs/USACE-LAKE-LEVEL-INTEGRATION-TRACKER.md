# USACE Lake Level Integration Tracker

## Purpose
Track integration of Army Corps dam/reservoir level + release data for all focused waters in Pocket Fishing Guide.

## Current Constraint
Direct browser scraping of USACE tabular pages is blocked by CORS.  
Solution implemented in this repo: scrape during GitHub Actions and publish same-origin snapshot at `data/usace_levels.json`.

## Focused Waters Coverage

| Water | Type | Primary Source | Status |
|---|---|---|---|
| Greers Ferry Lake | Lake | USACE-SWL tabular + USGS | Implemented |
| Bull Shoals Lake | Lake | USACE-SWL tabular + USGS | Implemented |
| Beaver Lake | Lake | USACE-SWL tabular + USGS | Implemented |
| Lake Ouachita | Lake | USGS (USACE district endpoint pending) | Pending |
| DeGray Lake | Lake | USGS (USACE district endpoint pending) | Pending |
| Lake Maumelle | Lake | USGS / local operator updates | Not a Corps integration target |
| Lake Conway | Lake | AGFC status updates | Not a Corps integration target |
| White River | River | USGS river gauge | Not a reservoir-level target |
| Buffalo National River | River | USGS river gauge | Not a reservoir-level target |

## GitHub Workflow Tracking

- Snapshot builder: `scripts/fetch_usace_levels.js`
- Output: `data/usace_levels.json`
- Deploy workflow: `.github/workflows/static.yml`
- Scheduled refresh: every 6 hours via GitHub Actions schedule

## Suggested GitHub Issue Draft

Title: `USACE integration completion for Ouachita + DeGray Corps endpoints`

Body:

```md
## Goal
Complete Corps-backed level/release integration for all Corps-managed focused lakes.

## Already Done
- Greers Ferry, Bull Shoals, Beaver integrated via SWL tabular scrape -> `data/usace_levels.json`
- Dashboard consumes same-origin snapshot and displays source/status

## Remaining
- Identify official Corps machine-readable/tabular feeds for:
  - Lake Ouachita
  - DeGray Lake
- Add parsers and snapshot entries in `scripts/fetch_usace_levels.js`
- Validate trend outputs (24h, 7-day) and source link rendering

## Acceptance Criteria
- Ouachita and DeGray appear as `status: ok` in `data/usace_levels.json`
- Dashboard shows non-placeholder level/flow status for both when data is available
- Actions run succeeds on push and schedule
```

