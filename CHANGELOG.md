# Changelog

All notable changes to the Pocket Fishing Guide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Live Bait Toggle**: Artificial / Live Bait toggle in Tackle Box bottom-sheet header. Filters lure view by `bait_type`; falls back to *"Limited live bait data — check local bait shops"* when fewer than 2 live bait records match. Toggle state persists via `localStorage` key `pfg_tackle_mode`. Toggle buttons meet 44 px tap target with `role="radio"` and `aria-pressed` a11y attributes
- **`bait_type` field**: Added to all 21 lure records in `data/lure-master.json` (`"artificial"` | `"live"`). Seven new live bait master records added (lure_015–lure_021) covering White River white bass (live shad, nightcrawler) and crappie live minnow presentations
- **`scripts/validate-species-lure-mapping.js`**: Cross-file integrity validator — ensures every `lure_id` in `species_at_location.json#best_lures[]` resolves in `lure-master.json` and every `species_id` resolves in `species.json`
- **`data-validate.yml`**: Extended to run `validate-species-lure-mapping.js` on push/PR to `main`
- **`scoreLures()` `baitMode` param**: Accepts `"artificial"` (default, existing behavior) or `"live"` (sources from master by `phase_affinity`, filters to `bait_type !== "artificial"`)
- **`LURE_MASTER_STATE.lures`**: Raw lures array now stored alongside the index to enable live bait mode lookup by `phase_affinity`

### Changed
- **`scripts/validate-tackle-box.js`**: `bait_type` added to required fields; VALID_BAIT_TYPES check (`artificial`, `live`, `cut`, `scented_soft`) enforced
- **Tackle Box**: Artificial mode now explicitly excludes `bait_type === "live"` or `"cut"` lures from the ranked list (previously lure_010 "1/16oz Jig + Live Minnow" appeared in artificial mode)

### Added
- **🎒 Tackle Box**: Top-5 lure bottom-sheet modal per species and phase. Uses `deriveClarity()` to show condition context chips (clarity + live flow CFS). Lures are condition-ranked via `scoreLures()` once `lure-master.json` hydrates the phase arrays; falls back to phase order gracefully before hydration completes
- **`deriveClarity()` helper**: Derives water clarity (`clear`/`stained`/`muddy`) from water body type and live USGS flow CFS
- **`scoreLures()` engine**: Condition-aware lure ranking (clarity × flow × phase) using `hydrateLuresWithMaster()` to enrich phase lures with `condition_score` from the canonical library
- **`data/lure-master.json`**: Canonical 14-lure library with `condition_score`, `type`, `agfc_cited`, `phase_affinity` schema
- **`scripts/validate-tackle-box.js`**: Schema validation for lure-master.json
- **`.github/workflows/data-validate.yml`**: CI workflow to validate data files on push/PR
- **`data/species_at_location.json` v1.1**: Added `best_lures[]`, `clarity_profile`, `pattern` fields
- **CSS**: `.lure-num.n4`, `.lure-num.n5` badge colors; `.tackle-box-sheet`, `.tackle-box-backdrop`, `.tackle-box-trigger`, `.condition-chip-inline`, `@keyframes slideUp`
- **Conditions Strip**: Prominent temperature + spawn phase + trend chips displayed immediately below the hero on the Signals tab, giving at-a-glance water status without scrolling
- **Today's Pattern heading**: Labeled section with live data timestamp above the 3-Lure Arsenal on the Signals tab
- **Pro Intel + Local Tips accordion** on Signals tab: Water-specific expert tips surfaced directly on the main landing view (collapsed by default, expandable)
- **Desktop two-column landing grid**: On screens ≥1024px the Signals tab shows the 3-Lure Arsenal + Pro Tips in a primary column and Media + Gear in a sticky secondary column
- New CSS classes: `.landing-grid`, `.landing-primary`, `.landing-media`, `.conditions-strip`, `.conditions-chip`, `.conditions-chip-label`, `.todays-pattern-heading`, `.lure-card-actions`

### Changed
- **3-Lure Arsenal card layout**: How-To and Shop action buttons moved from below the lure description to inline on the right side of each lure row (`.lure-card-actions`), matching the "Action Pair" spec from the wireframe
- **Signals tab content order**: Conditions strip → Today's Pattern + lure arsenal + pro tips (left) / Media + Gear (right) → full water data (below fold). All existing data sections (temperature charts, level trends, flow) remain accessible via scroll

## [0.3.0] - 2026-02-14

### Added
- **Visual Dashboard Overview** tab: Compare all 9 Arkansas water bodies at a glance with live conditions (Issue #14)
- Temperature heat map indicators showing GO/SCOUT/WAIT status for each water body
- Spawn phase progress badges displaying current fishing phase per species
- 7-day temperature trend sparklines for quick visual comparison
- One-tap navigation from overview cards to detailed water body dashboards
- Visual legend explaining temperature status indicators
- Comprehensive documentation of Issue #14 resolution

## [0.2.0] - 2026-02-14

### Added
- localStorage persistence for water body and species selection (Issue #8, Task 1.1)
- MIT LICENSE file
- GitHub Issues templates for bug reports and feature requests
- CHANGELOG.md for release tracking

### Changed
- Google Analytics 4 configured with real measurement ID (G-929WWD4EZ4)
- README updated: replaced inaccurate PWA/offline claims with preference persistence docs

## [0.1.0] - 2026-02-14

### Added
- Core fishing intelligence UI for Lake Maumelle, White River, and Buffalo National River
- 6 additional Arkansas water bodies: Greers Ferry, Bull Shoals, Beaver, Ouachita, DeGray, Conway
- Species toggle between White Bass and Crappie with species-specific tips
- Real-time USGS water data integration (temperature, flow rate, gage height)
- 7-day NWS weather forecasts
- Spawn phase tracking with countdown timers
- Access point directory with GPS coordinates and facility info
- Snapshot sharing capability
- Ko-fi donation link and GitHub funding configuration
- Google Analytics 4 placeholder (not yet configured)
- In-app feedback widget linking to GitHub Issues
- Tackle recommendation links (YouTube, Walmart)
- Comprehensive documentation: README, CONTRIBUTING, ROADMAP
- Body of Water Selector scoping document (Issue #8)
- GitHub Pages deployment via GitHub Actions

### Fixed
- Conway location crash when USGS gauge is null
- Ko-fi username corrected to coreytheideaguy
- Header subtitle reflects data source availability per water body
