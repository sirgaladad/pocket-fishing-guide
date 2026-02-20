# Changelog

All notable changes to the Pocket Fishing Guide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-02-20 — Version 1.5: Lure Inventory Expansion + Schema Normalization

### Added
- **Normalized lure schema**: all lure entries now include `type`, `water_type`, `depth_range`, `forage_match`, `youtube_link`, and `purchase_link` fields
- **Expanded white bass lure inventory**: lake-specific white bass lures added for all pre-summer phases (Winter Hold, Pre-Spawn Staging, Spawn Trigger, Peak Spawn), doubling the WB arsenal from 18 to 30 entries
- **Water-type filtering**: `IntelTab` now filters the 3-lure arsenal by the current water body type (lake vs. river), surfacing the most relevant setup for each location
- **Targeted tackle links**: `youtube_link` and `purchase_link` on each lure entry replace generic search fallbacks; `ytSearch`/`walmartSearch` remain as fallback for any unlisted lure
- **Lure metadata display**: depth range and forage match shown on each lure card for quick at-a-glance context

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
