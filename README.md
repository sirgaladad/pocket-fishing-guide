# Pocket Fishing Guide
## Tale Waters & Tides

[![Live Site](https://img.shields.io/badge/Live%20Site-sirgaladad.github.io-blue?style=flat-square)](https://sirgaladad.github.io/pocket-fishing-guide/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Deploy](https://github.com/sirgaladad/pocket-fishing-guide/actions/workflows/static.yml/badge.svg)](https://github.com/sirgaladad/pocket-fishing-guide/actions/workflows/static.yml)
[![Data Validation](https://github.com/sirgaladad/pocket-fishing-guide/actions/workflows/data-validate.yml/badge.svg)](https://github.com/sirgaladad/pocket-fishing-guide/actions/workflows/data-validate.yml)

A lightweight, mobile-first **fishing intelligence app** for Arkansas waters. Built as a single-file React app that runs entirely in your browser — no servers, no build step, no dependencies to manage. Just real-time fishing data in your pocket.

**Covering 39 Arkansas waters** — lakes, rivers, tailwaters, and streams — with White Bass and Crappie fishing intelligence:

- **Lake Maumelle** — Central AR primary drinking water reservoir
- **White River** — Legendary tailwater and spawn run
- **Buffalo National River** — Wild scenic river
- **Greers Ferry Lake** — Premier white bass and crappie fishery
- **Bull Shoals Lake** — Massive Ozark reservoir
- **Beaver Lake** — Northwest AR trophy fishery
- **Lake Ouachita** — Arkansas's largest and clearest lake
- **DeGray Lake** — Resort lake near Hot Springs
- **Lake Conway** — AGFC managed crappie hotspot (currently under renovation)
- **+ 30 more Arkansas waters** — Ozark rivers, Ouachita rivers, Delta lakes

---

## What's New

| Version | Highlights |
|---------|-----------|
| **v0.4.0** *(in progress)* | Tackle Box modal, Live Bait Toggle, Lure Scoring Engine, Conditions Strip, Pro Intel accordion |
| **v0.3.0** | Visual Dashboard Overview — heat maps, spawn badges, 7-day sparklines across all 39 waters |
| **v0.2.0** | Preference persistence, GA4 analytics, GitHub Issues templates |
| **v0.1.0** | Core fishing intelligence — USGS water data, 7-day forecasts, spawn tracking, access points |

See [CHANGELOG.md](CHANGELOG.md) for full release notes.

---

## Features

- **Visual Dashboard** — Compare all 39 Arkansas waters at a glance: temperature heat maps, spawn phase indicators, 7-day trend sparklines
- **Tackle Box** — Condition-ranked top-5 lures per species and phase, scored by water clarity, flow rate, and temperature. Includes How-To video links and direct purchase options. Sourced from AGFC reports
- **Live Bait Toggle** — Switch between artificial and live bait recommendations with a tap
- **Conditions Strip** — At-a-glance temperature + spawn phase + trend chips, no scrolling required
- **Pro Intel Accordion** — Local expert tips per water body and species, expandable on demand
- **Phase-Based Fishing Intelligence** — Species-specific, temperature-driven fishing phases (6 per species) with science-backed recommendations
- **Live Water Data** — Real-time temperature, flow rate, and gage height from USGS Water Services
- **7-Day Weather Forecasts** — NWS forecasts to help plan trips
- **Species Toggles** — Switch between White Bass and Crappie with a tap
- **Access Point Directory** — Ramp locations with status, restrictions, and GPS coordinates
- **Snapshot Sharing** — Share conditions with fellow anglers (mobile share sheet + clipboard fallback)
- **Spawn Tracker** — Countdown to spawn-trigger water temperatures
- **Preference Persistence** — Your water body and species selections are remembered across visits
- **Mobile-First Design** — Optimized for phones, tablets, and desktop

---

## Quick Start

### Visit the Live Site

[sirgaladad.github.io/pocket-fishing-guide/](https://sirgaladad.github.io/pocket-fishing-guide/)

No login, no install, no account required.

### Run Locally

```bash
git clone https://github.com/sirgaladad/pocket-fishing-guide.git
cd pocket-fishing-guide
open index.html   # or double-click the file
```

No build step, no npm, no setup. The app fetches live USGS and NWS data automatically.

---

## Screenshots

*We'd love to show the app on a variety of devices and waters. If you use Pocket Fishing Guide on the water, [submit a screenshot](CONTRIBUTING.md#screenshots-wanted) and help us build this gallery.*

---

## How It Works

### Architecture

The entire application lives in a single `index.html` file — React 18 + Babel via CDN, no build step required. Live data flows from three free public APIs:

- **USGS Water Services** — real-time temperature, flow rate, and gage height
- **NWS (National Weather Service)** — 7-day forecasts
- **USACE (Army Corps of Engineers)** — dam lake level snapshots

Data is also pre-fetched every 6 hours by GitHub Actions and stored as JSON snapshots in the `data/` directory, so the app renders immediately even before API calls resolve.

### Water Data

Live water metrics come from **USGS Water Services** with no API key required:

| Water Body | USGS Gauge |
|------------|-----------|
| Lake Maumelle | 072632995 |
| Greers Ferry Lake | 07075900 |
| Bull Shoals Lake | 07054500 |
| Beaver Lake | 07049000 |
| Lake Ouachita | 07357000 |
| DeGray Lake | 07360200 |
| White River | 07074500 |
| Buffalo National River | 07056000 |

Data refreshes on app load and updates every 5–15 minutes. Not all gauges provide real-time water temperature — where USGS temp data is unavailable, the app provides seasonal guidance and access information.

### Data Pipeline

```
USGS / NWS / USACE APIs
         ↓
  GitHub Actions (every 6 hrs)
  scripts/fetch_*.js
         ↓
  data/*.json snapshots
         ↓
  index.html (React)
         ↓
  GitHub Pages → your browser
```

Validation scripts (`scripts/validate-*.js`) run in CI for relevant data changes to verify JSON schema integrity, and you can also run them locally before deployment.

---

## Contributing

We welcome local knowledge as much as code. If you know a great spot, have tips for a particular water, or want to help build — see [CONTRIBUTING.md](CONTRIBUTING.md).

**Quick ways to help:**
- Submit a [bug report](../../issues/new?template=bug_report.md)
- Request a [new feature](../../issues/new?template=feature_request.md)
- Share local fishing intel via a [GitHub Issue](../../issues)
- [Submit a screenshot](CONTRIBUTING.md#screenshots-wanted) of the app on your device

---

## Support the Project

Tale Waters & Tides is free and open source. If it helps you catch more fish, consider buying us a coffee:

[![Ko-fi](https://img.shields.io/badge/Support%20on-Ko--fi-FF5E5B?style=flat-square&logo=ko-fi)](https://ko-fi.com/coreytheideaguy)

---

## License

[MIT](LICENSE) — free to use, fork, and build on.
