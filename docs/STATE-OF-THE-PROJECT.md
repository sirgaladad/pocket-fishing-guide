# State of the Project — March 2026
## Tale Waters & Tides · Pocket Fishing Guide for Arkansas Waters

---

## What We Set Out to Build

Arkansas anglers needed a smarter way to decide when and where to fish. Existing apps were either too generic (national coverage, shallow data) or too static (printed guides, outdated PDFs). We set out to build something different: a lightweight, mobile-first fishing intelligence tool that delivers real-time water conditions, species-specific spawn intelligence, and local knowledge — all in your browser, no install required.

The first hypothesis: a single lake done right is more valuable than 50 lakes done shallow. We started with Lake Maumelle and proved the model. Then we scaled.

---

## What We've Built

### Data Layer
- **39 Arkansas water bodies** — lakes, rivers, tailwaters, streams across Ozark, Ouachita, and Delta regions
- **3 live data sources** — USGS Water Services, NWS (National Weather Service), USACE (Army Corps of Engineers)
- **No API keys required** — all public APIs, zero cost, zero vendor lock-in
- **Automated 6-hour data refresh** — GitHub Actions fetches and snapshots all data on a 6-hour schedule; full validation runs on relevant pushes/PRs
- **20 JSON data files** — water bodies, species, lures, gauges, stations, regulations, access points, moon phases
- **5-tier water temperature fallback** — USGS primary → USGS alternate → Open-Meteo soil proxy → NWS air temp offset → localStorage 48-hour cache
- **USGS turbidity integration** — FNU/NTU sensor data overrides flow-based clarity derivation where available

### Fishing Intelligence
- **White Bass and Crappie** — 6 fishing phases per species, temperature-driven, science-backed
- **21-lure canonical library** — condition scores, phase affinity, AGFC citations, bait type classification
- **Lure Scoring Engine** — condition-aware ranking: clarity × flow × phase, runs on live USGS data
- **Live Bait Toggle** — artificial / live bait filter across the full tackle library
- **Spawn Tracker** — countdown to spawn-trigger water temperatures per species
- **Moon Phase Matrix** — species activity correlations by lunar cycle
- **Pro Intel Accordion** — local expert tips per water body and species

### UX & UI
- **Single-file React app** — `index.html`, zero build step, zero npm, opens in any browser
- **5-tab bottom navigation** — OVERVIEW · DASHBOARD · FORECAST · INTEL · ACCESS
- **Visual Dashboard** — heat maps, spawn phase badges, 7-day sparklines across all 39 waters
- **Tackle Box modal** — top-5 ranked lures per species and phase with condition context chips
- **Conditions Strip** — temperature + spawn phase + trend chips, above the fold
- **Desktop two-column grid** — primary signals + secondary media/gear panels on screens ≥1024px
- **Snapshot sharing** — mobile share sheet + clipboard fallback
- **Preference persistence** — localStorage for water body + species + bait mode

### Infrastructure
- **GitHub Pages deployment** — push to main, live in under 60 seconds
- **3 GitHub Actions workflows** — deployment + data fetch, data validation, AI issue triage
- **8 Node.js build/validation scripts** — schema validation, cross-file integrity, API fetching
- **Green Team AI triage** — auto-classifies `user-feedback` issues, swaps labels, updates project board
- **Conventional commits** — enforced via commitlint with 72-char header limit
- **ESLint + Prettier** — consistent code style across all scripts
- **GA4 analytics via Google Tag Manager (`GTM-M36K8X2Q`)** — custom event taxonomy in progress

---

## By the Numbers

| Metric | Value |
|--------|-------|
| Arkansas waters covered | 39 |
| Primary species | 2 (White Bass, Crappie) |
| Lures in canonical library | 21 |
| Live data sources | 3 (USGS, NWS, USACE) |
| API keys required | 0 |
| Automated data refresh | Every 6 hours |
| JSON data files | 20 |
| Build / validation scripts | 8 |
| GitHub Actions workflows | 3 |
| Lines of application code | ~13,500 (single index.html) |
| Versions shipped | 3 (v0.1.0 – v0.3.0) |
| Time from first commit to 39 waters | ~4 weeks |

---

## What We Learned

**The single-file architecture is a superpower — until it isn't.** No build step, no npm, no CI failures from dependency hell. Any angler with a text editor can open the file and understand it. That was the right call for v0.1.0 through v0.4.0. Past that, we'll need to think about componentization.

**Free public APIs are surprisingly reliable.** USGS, NWS, and USACE have been rock-solid. The 5-tier temperature fallback exists because some gauges don't have sensors, not because the APIs go down.

**Local knowledge is the moat.** The lure recommendations backed by AGFC citations, the water-specific pro tips, the access point details — that's what makes this different from pulling a weather widget. The data layer is a commodity. The intelligence layer is the product.

**Validation CI pays for itself immediately.** The cross-file lure/species integrity checks caught real bugs before they hit production. Every new data file gets a validator now.

**Users want to know "should I go today?" first.** The Conditions Strip and heat map dashboard emerged directly from that insight — surface the go/scout/wait signal before anything else.

---

## What's Next

Two immediate priorities — see [ROADMAP.md](../ROADMAP.md):

1. **UX Revision** — compress the header, water selector as bottom-sheet, touch target audit
2. **Analytics Hardening** — GA4 custom event taxonomy, funnel baseline, data-driven roadmap

---

## How to Help

See [CONTRIBUTING.md](../CONTRIBUTING.md) for ways to contribute — local knowledge, code, screenshots, bug reports, and feature ideas are all welcome.

**Quick links:**
- [Submit a bug report](https://github.com/sirgaladad/pocket-fishing-guide/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/sirgaladad/pocket-fishing-guide/issues/new?template=feature_request.md)
- [Share local fishing intel](https://github.com/sirgaladad/pocket-fishing-guide/issues)
- [Support on Ko-fi](https://ko-fi.com/coreytheideaguy)
