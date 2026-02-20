# CLAUDE.md — Pocket Fishing Guide (Tale Waters & Tides)

This file provides guidance for AI assistants (Claude Code and similar tools) working on this repository.

---

## Project Overview

**Pocket Fishing Guide** is a lightweight, mobile-first fishing intelligence app for Arkansas waters. It is intentionally architected as a **zero-build, single-file React application** — no npm, no bundler, no server required.

- **Live site**: https://sirgaladad.github.io/pocket-fishing-guide/
- **Stack**: React 18 + Babel Standalone (both via CDN), vanilla CSS, native browser APIs
- **Hosting**: GitHub Pages, deployed by GitHub Actions on push to `master`

---

## Architecture: Single-File App

The **entire application lives in `index.html`** (~6,200 lines). This is intentional — do not split it into separate files or introduce a build step unless explicitly requested by the maintainer.

```
index.html         ← The entire React app (components, data, styles)
scripts/
  fetch_usace_levels.js  ← Node.js script run by CI to snapshot USACE lake data
data/
  usace_levels.json      ← Generated USACE snapshot (committed output, do not edit manually)
docs/                    ← Supplementary documentation and decision records
.github/
  workflows/
    static.yml           ← Deploy to GitHub Pages + USACE data refresh (cron: every 6 h)
    triage.yml           ← AI-assisted issue triage (Green Team automation)
  ISSUE_TEMPLATE/        ← Bug, feature, feedback, design, UX templates
```

### What lives in `index.html`

1. **Global data constants** (UPPER_SNAKE_CASE):
   - `WATERS` — 9 Arkansas water bodies, each with USGS gauges, NWS office, access points, regulations, and species-specific tips
   - `LURES_BY_PHASE` — White Bass lure recommendations keyed by phase
   - `CR_LURES_BY_PHASE` — Crappie lure recommendations keyed by phase
   - `WATER_LEVEL_SOURCES` — Metadata for USACE and USGS gauge references

2. **Data-fetching functions**:
   - `fetchUSGS(siteId)` — Real-time temperature, flow, gauge height from USGS Water Services
   - `fetchUSGSStations(stations)` — Multi-station fetch with primary/fallback logic (uses the station with `primary: true` as the preferred source)
   - `fetchUSACESnapshot(waterKey)` — Reads `data/usace_levels.json` for lake elevation/release data
   - `fetchNWS(lat, lon)` — 7-day weather forecast from National Weather Service gridpoint API

3. **Domain logic functions**:
   - `getPhase(temp, species)` — Returns the current fishing phase string based on water temp and species
   - `getPhaseIndex(temp, species)` — Ordinal position in the 6-phase progression
   - `rateFishing(period)` — Rates a forecast period (Good / Fair / Poor) for fishing activity
   - `estimateTempFromForecast(...)` — Derives approximate water temp when USGS data is unavailable

4. **React components** (functional, hooks only):
   - `App` — Root; owns water selection, species toggle, tab state, all data fetching
   - `DashboardTab` — Overview of all 9 waters: temp heatmaps, sparklines, spawn phase badges
   - `ForecastTab` — 7-day NWS weather with fishing activity ratings
   - `IntelTab` — Species-specific tips, spawn phase, lure recommendations
   - `AccessTab` — Launch sites, facilities, regulations per water body
   - `ShareSnapshot` — Export current conditions to clipboard or native share sheet
   - `FeedbackWidget` — In-app form linking to GitHub Issues

5. **CSS** (~1,700 lines): CSS custom properties, dark theme, mobile-first (480 px max-width). No CSS-in-JS.

---

## Development Workflow

### Local development (no setup needed)

```bash
# Just open the file in a browser
open index.html
# OR serve locally if you want network-like behavior:
npx serve .
```

There is no `npm install`, no build, no compilation. Edit `index.html` and refresh your browser.

### Linting (optional but expected before PRs)

ESLint and Prettier are configured but require local installation:

```bash
npm install -g eslint prettier
eslint index.html
prettier --check index.html
```

Key rules (from `.eslintrc.json` / `.prettierrc`):
- Semicolons required
- Double quotes for JSX/JS strings
- 2-space indentation
- Trailing commas (ES5 style)

### Commit messages

This project enforces **Conventional Commits** via `commitlint.config.js`. Every commit message **must** follow this format:

```
<type>(<optional scope>): <short description>
```

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Max header length:** 72 characters

Examples:
```
feat: add Lake Hamilton water body support
fix: correct USGS station fallback for Beaver Lake
docs: update USGS gauge table in README
chore: refresh usace_levels.json snapshot
```

---

## Data Sources & APIs

All data is fetched client-side (browser). No backend server.

| Source | API | Used for |
|--------|-----|----------|
| USGS Water Services | `waterservices.usgs.gov/nwis/iv/` | Water temp, flow rate, gauge height (real-time) |
| National Weather Service | `api.weather.gov/gridpoints/{office}/{x,y}/forecast` | 7-day weather forecast |
| USACE (via snapshot) | `data/usace_levels.json` (CI-generated) | Lake elevation, storage, release rate |

### USGS Station Configuration

Each water body in `WATERS` has a `stations` array. Stations with `primary: true` are used as the preferred data source; others are fallbacks. When editing station data, always mark exactly one station as primary per water body.

USGS station IDs in use:
- Greers Ferry: `07075900`
- Lake Maumelle: `072632995`
- Bull Shoals: `07054500`
- Beaver Lake: `07049000`
- Lake Ouachita: `07357000`
- DeGray Lake: `07360200`
- White River: `07074500`
- Buffalo National River: `07056000`

Not all gauges report water temperature — some provide only flow and gauge height. Account for missing temp data gracefully.

### USACE Snapshot

`scripts/fetch_usace_levels.js` runs in CI every 6 hours via the `static.yml` workflow. It fetches HTML from USACE district pages, parses tabular data, and writes `data/usace_levels.json`. Do not edit that JSON file manually; regenerate it by running the script.

---

## CI/CD

### `static.yml` — Deploy to GitHub Pages

- **Triggers**: push to `master`, manual dispatch, cron (`0 23 * * *` = every 6 h UTC)
- **Steps**: checkout → setup Node 20 → run USACE snapshot script → configure Pages → upload artifact → deploy
- The entire repository (including `data/`) is served as the static site

### `triage.yml` — AI Issue Triage (Green Team)

- **Trigger**: any issue labeled `user-feedback`
- **Steps**: classify type (Bug/Feature/UX/Feedback) → rewrite title with `[Type]` prefix → estimate impact/effort → post scoping comment → swap label to `red-team` → update project board to "Human Review"
- This is AI-assisted; a human (Red Team) makes final decisions before work begins

---

## Coding Conventions

### JavaScript / React

- **Components**: PascalCase (`DashboardTab`, `FeedbackWidget`)
- **Functions**: camelCase (`fetchUSGS`, `getPhase`, `rateFishing`)
- **Constants**: UPPER_SNAKE_CASE (`WATERS`, `LURES_BY_PHASE`)
- **Handlers**: prefix with `handle` (`handleTabChange`, `handleWaterSelect`)
- Use **React functional components with hooks only** — no class components
- Avoid adding new CDN dependencies without explicit discussion

### CSS

- Use **CSS custom properties** (`--bg`, `--accent`, `--spawn`) — never hardcode color values
- Follow the existing dark theme palette defined at the top of the `<style>` block
- Mobile-first: design for 480 px max-width before larger screens
- BEM-like flat class names (`.card`, `.card-title`, `.card-body`) — no deep nesting

### Data Structures

- Water body keys are **lowercase identifiers** (e.g., `greers`, `maumelle`, `bullshoals`)
- Species-specific content uses paired keys: `tips` (White Bass) and `crTips` (Crappie)
- Phase logic is **temperature-driven** — 6 phases per species, boundaries encoded in `getPhase()`

### localStorage

Two keys are used for preference persistence:
- `pocketFishingGuide_water` — selected water body key
- `pocketFishingGuide_species` — `"whitebass"` or `"crappie"`

---

## Adding a New Water Body

1. Add an entry to the `WATERS` object in `index.html` with all required fields:
   - `name`, `lat`, `lon` (for NWS)
   - `stations` array (USGS site IDs with `primary: true` on one)
   - `nwsOffice`, `nwsX`, `nwsY` (NWS gridpoint)
   - `tips` (White Bass) and `crTips` (Crappie) arrays
   - `access` array (launch sites, facilities)
   - `regulations` string
2. Add any USACE-monitored reservoirs to `scripts/fetch_usace_levels.js`
3. Update the USGS gauge table in `README.md`
4. Test locally by selecting the new water body and confirming API calls succeed

---

## Project Philosophy

> **"Pocket means local."** Depth over breadth — serve one lake exceptionally well before scaling to more.

- **Single-file architecture is a feature, not a limitation.** It eliminates build friction for contributors.
- **No servers, no auth, no data storage.** The browser does everything; users own their experience.
- **Community knowledge is as valuable as code.** Anglers submitting local intel via Issues are first-class contributors.
- **Progressive enhancement.** Infrastructure complexity is only introduced when clearly justified by user need.

---

## Issue & PR Workflow

1. In-app feedback widget → GitHub Issue (auto-labeled `user-feedback`)
2. `triage.yml` (Green Team AI) → classifies, scopes, estimates, re-labels to `red-team`
3. Human maintainer (Red Team) → reviews, approves scope, sets priority
4. Board progression: **Triage → Human Review → Backlog → Ready to Build → In Progress → Done**

When contributing code:
- Open a PR against `master`
- Reference the relevant Issue number in the PR description
- Keep changes focused — this is a small app and PRs should be reviewable in minutes
- Do not introduce npm dependencies, build steps, or server-side logic without prior discussion

---

## Files to Never Edit Directly

| File | Reason |
|------|--------|
| `data/usace_levels.json` | Auto-generated by CI; manual edits will be overwritten |
| `.github/workflows/static.yml` | Deployment pipeline; changes affect the live site |

---

## Quick Reference

| Task | How |
|------|-----|
| Run the app locally | Open `index.html` in any modern browser |
| Lint the code | `eslint index.html` |
| Refresh USACE data | `node scripts/fetch_usace_levels.js` |
| Deploy to production | Merge to `master` (GitHub Actions handles the rest) |
| Add a water body | Edit `WATERS` in `index.html` + update `README.md` |
| Report a bug | Open a GitHub Issue with label `Bug` |
| Propose a feature | Open a GitHub Issue with label `Feature Request` |
