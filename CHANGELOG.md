# Changelog

All notable changes to the Pocket Fishing Guide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
