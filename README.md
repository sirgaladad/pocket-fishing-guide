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

### Weather Forecasts
7-day outlooks powered by **NWS API** (weather.gov). No API key needed.

### Fishing Phases
Each species has 6 fishing phases, each triggered by water temperature ranges:
- Water temps drive fish behavior
- Each phase gets tailored lure picks and tactics
- Pro tips provide local context

### Preference Persistence
Your selected water body and species are saved in your browser via localStorage. Come back tomorrow and the app remembers your last selection — no more defaulting to Lake Maumelle every visit.

---

## Tech Stack

- **React 18** via unpkg CDN
- **Babel Standalone** for JSX transpilation (browser-based)
- **Google Fonts** (Inter typeface)
- **USGS Water Services API** (free, real-time)
- **NWS Weather API** (free, 7-day)
- **GitHub Pages** for hosting
- **No build tools, npm, or backend required**

Everything runs in the browser. One HTML file. Zero dependencies to install.

---

## API Credits

This app relies on two fantastic free, public APIs:

### USGS Water Services
[waterservices.usgs.gov](https://waterservices.usgs.gov/)  
Provides real-time water temperature, discharge (flow), and gage height data. No API key required. Data is public domain.

### National Weather Service (NWS)
[api.weather.gov](https://api.weather.gov/)  
7-day forecasts for any location in the US. No API key required. Public service.

Thank you to these agencies for maintaining public data infrastructure that makes apps like this possible.

---

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features, current focus, and future water bodies.

---

## Contributing

Found a bug? Have a lure recommendation? Want to help cover another river?  
See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute.

---

## Support

This is a passion project built for fellow Arkansas anglers. If Pocket Fishing Guide helps you catch more fish, consider:

- Sharing it with other anglers
- Reporting issues or suggesting features on [GitHub](https://github.com/sirgaladad/pocket-fishing-guide/issues)
- Supporting development via [Ko-fi](https://ko-fi.com/coreytheideaguy) (coming soon)

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Built With

- Real-world fishing knowledge from Arkansas water bodies
- Free public APIs from USGS and NWS
- React and modern web standards
- A passion for fishing and good software

---

**Tight lines and tight code.**  
Built by an Arkansas angler who believes fishing intel should be simple, fast, and free.

For questions or just fishing talk, open an issue or reach out on GitHub.
