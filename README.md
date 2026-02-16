# Pocket Fishing Guide
## Tale Waters & Tides

[![Live Site](https://img.shields.io/badge/Live%20Site-sirgaladad.github.io-blue?style=flat-square)](https://sirgaladad.github.io/pocket-fishing-guide/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20On-GitHub%20Pages-4CAF50?style=flat-square)](https://github.com/sirgaladad/pocket-fishing-guide)

A lightweight, mobile-first **fishing intelligence app** for Arkansas waters. Built as a single-file React app that runs entirely in your browser—no servers, no build step, no dependencies to manage. Just real-time fishing data in your pocket.

**Now covering 9 major Arkansas water bodies** with comprehensive White Bass and Crappie fishing intelligence:
- **Lake Maumelle** (Central AR primary drinking water reservoir) 
- **White River** (Legendary tailwater and spawn run)
- **Buffalo National River** (Wild scenic river)
- **Greers Ferry Lake** (Premier white bass and crappie fishery)
- **Bull Shoals Lake** (Massive Ozark reservoir)
- **Beaver Lake** (Northwest AR trophy fishery)
- **Lake Ouachita** (Arkansas's largest and clearest lake)
- **DeGray Lake** (Resort lake near Hot Springs)
- **Lake Conway** (AGFC managed crappie hotspot - currently under renovation)

---

## Features

- **Visual Dashboard Overview**: Compare all 9 Arkansas waters at a glance with temperature heat maps, spawn phase indicators, and 7-day trend sparklines
- **Phase-Based Fishing Intelligence**: Species-specific, temperature-driven fishing phases (6 per species) with science-backed recommendations
- **Live Water Data**: Real-time temperature, flow rate, and gage height from USGS Water Services
- **7-Day Weather Integration**: NWS forecasts to help you plan trips
- **Species Toggles**: Switch between White Bass and Crappie with a tap
- **Lure Recommendations**: GO-TO picks and backups for each phase
- **Access Point Directory**: Ramp locations with status, restrictions, and regulations
- **Snapshot Sharing**: Share conditions with fellow anglers (mobile share sheet + clipboard fallback)
- **Spawn Tracker**: Countdown to spawn-trigger water temperatures
- **Pro Tips**: Local knowledge per water body and species
- **Preference Persistence**: Your water body and species selections are remembered across visits
- **Mobile-First Design**: Optimized for phones, tablets, and desktop

---

## Quick Start

### Option 1: Visit the Live Site
Head to [sirgaladad.github.io/pocket-fishing-guide/](https://sirgaladad.github.io/pocket-fishing-guide/) and start fishing smarter right now.

**Publishing updates to the live site:** The live site is served from the **pocket-fishing-guide** repo, not AiProjects. See [docs/DEPLOY-LIVE-SITE.md](docs/DEPLOY-LIVE-SITE.md) for how to sync and deploy.

### Option 2: Run Locally
1. Clone or download this repo
2. Open `index.html` in your browser
3. That's it—no build step, no npm, no setup

The app fetches live USGS and NWS data automatically. Your browser does the rest.

---

## Screenshots

*Screenshots coming soon—check back or [contribute one](CONTRIBUTING.md)!*

---

## How It Works

### Repo Local Structure
This project is part of a **monorepo structure**:
- Local directory: `aiprojects/dev/projects`.
- GitHub repository: [sirgaladad/pocket-fishing-guide](https://github.com/sirgaladad/pocket-fishing-guide).

If contributing or utilizing the code:
- **Avoid duplicating files or creating redundant structures.**
- Follow the established project structure and guidelines specified in documentation.
- Ensure to commit changes with clear and meaningful messages.

### Water Data
Live water metrics (temperature, flow, gage height) come from **USGS Water Services**:
- **Greers Ferry Lake**: Gauge 07075900 (primary)
- **Lake Maumelle**: Gauge 072632995 (temp, flow, gage height)
- **Bull Shoals Lake**: Gauge 07054500
- **Beaver Lake**: Gauge 07049000  
- **Lake Ouachita**: Gauge 07357000
- **DeGray Lake**: Gauge 07360200 (Caddo River below dam)
- **White River**: Gauge 07074500 (flow, gage height)
- **Buffalo National River**: Gauge 07056000 (flow, gage height)
- **Lake Conway**: AGFC monitoring (currently under renovation - check AGFC for status)

No API key required. Data refreshes on app load and updates every 5–15 minutes.

**Note**: Not all gauges provide real-time water temperature. Where USGS temp data is unavailable, the app provides comprehensive fishing intelligence, access information, and seasonal guidance. Future updates will integrate additional data sources (USACE, AGFC) for complete coverage.
---

## Contributing Tips
When working on updates:
- Review GitHub action logs if the workflow triggers duplicate files unexpectantly.
- AI Agents today, possibly future updates to be in place.