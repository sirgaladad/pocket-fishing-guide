# Navigation & UX Scaling Strategy

**Last Updated:** February 14, 2026
**Status:** Draft — Ready for Review
**Relates To:** [NAVIGATION-UX-EVALUATION.md](../NAVIGATION-UX-EVALUATION.md), [SCOPING-BODY-OF-WATER-SELECTOR.md](../SCOPING-BODY-OF-WATER-SELECTOR.md), [ROADMAP.md](../../ROADMAP.md)

---

## Purpose

This document defines how the Pocket Fishing Guide's navigation, information architecture, and UX patterns evolve as the product scales from 9 Arkansas water bodies / 2 species to nationwide coverage with 50+ species and 500+ water bodies. Every decision is anchored to the product's competitive moat: **real-time data intelligence from USGS/NWS/USACE sources, presented through modern visual design with actionable analytics.**

---

## The Moat: Data Intelligence First

The app's differentiation is not features — it's the quality and depth of data intelligence delivered per screen. Competitors (Fishbrain, OnWater, FishAngler) rely on crowdsourced data or generic weather feeds. This app ties directly to USGS gauge stations, NWS forecast points, and USACE release schedules. That's the moat.

**Navigation decisions must protect this moat** by ensuring:

1. **Data density stays high** — never sacrifice dashboard real estate for navigation chrome
2. **Context is always visible** — users must know what water body + species + data source they're viewing without scrolling
3. **Switching context is fast** — changing species or location should take 1–2 taps, not a page reload
4. **Discovery drives engagement** — users should stumble into new water bodies and species they didn't plan to explore

---

## Scale Tiers

The navigation architecture must handle three distinct scale tiers. Each tier triggers specific UX pattern changes.

### Tier 1: Regional (Current → 20 water bodies, 5 species)

**Status:** Active — Arkansas-focused, 9 water bodies, 2 species

**Nav Pattern:** The current horizontal pills work at this scale with minor compression. The priority is getting the header down from 6 lines to 2 and proving the bottom-sheet selector pattern.

**Actions:**
- Compress header to 2 lines (P0 — see evaluation doc)
- Prototype bottom-sheet species selector (replaces pills)
- Add scroll-collapse header behavior
- localStorage persistence already shipped (v0.2.0)

### Tier 2: Multi-State (20–100 water bodies, 10–25 species)

**Triggers:** Expanding beyond Arkansas into neighboring states (MO, OK, TN, TX, MS, LA)

**Nav Pattern:** Horizontal pills fully retired. Location picker becomes hierarchical (State → Water Body). Species selector uses categorized bottom sheet (Bass → Largemouth, Smallmouth, Spotted, White, Striped). Search becomes essential.

**New Components:**
- **Location Picker (bottom sheet):** Recent/Favorites → Nearby (GPS) → Browse by State → Search
- **Species Selector (bottom sheet):** Categories (Bass, Panfish, Catfish, Trout, Saltwater) → Individual species with thumbnail
- **Search Bar (header icon):** Unified search across water bodies, species, and regions
- **Favorites System:** Pin up to 5 "home" water bodies for instant switching

**Data Architecture Impact:**
- Species taxonomy data needed (family → genus → common name)
- Water body metadata needs state/region/lat-lon for grouping
- Search index across water bodies + species (can start with simple client-side filter)

### Tier 3: National (100–500+ water bodies, 50+ species)

**Triggers:** USGS gauge coverage expansion, user demand beyond initial states

**Nav Pattern:** Map-centric discovery becomes primary. The bottom tab bar may evolve to include a dedicated MAP tab. Search is the primary entry point for new users. Power users rely on favorites and recents.

**New Components:**
- **Map View (new bottom tab):** Interactive map with water body markers, colored by conditions (green = great fishing, yellow = fair, red = poor). Tap marker → mini-card with current conditions → tap card → full dashboard.
- **Smart Recommendations:** "Fishing is hot at Table Rock Lake right now" — surfaced on the dashboard based on conditions across all tracked water bodies.
- **Region Grouping:** Browse by state, by watershed, or by species range map.
- **Bottom Nav Evolution:** `MAP · DASHBOARD · FORECAST · INTEL · MORE`

**Data Architecture Impact:**
- Needs a lightweight backend or static JSON API for water body index (too many for a single HTML file)
- Map tile integration (Leaflet + OSM, no API key needed)
- Push notification infrastructure for condition alerts
- Consider Progressive Web App (PWA) with offline caching

---

## Header Architecture (All Tiers)

The header is the most constrained real estate on mobile. Here's the target across all tiers:

```
┌──────────────────────────────────────────┐
│ [≡]  📍 Beaver Lake, AR · 🐟 Crappie ▾  [🔍] │  ← Line 1: Context + selectors
│      Live · 10 min ago · USGS #07049000  │  ← Line 2: Data source + freshness
└──────────────────────────────────────────┘
```

**Rules:**
- Maximum 2 lines before content
- Brand name in hamburger menu or settings, never in header
- Location and species are tappable selectors (open bottom sheets)
- Data attribution always visible (this IS the moat — show it)
- Scroll-collapse to 1 line when scrolling down, expand on scroll up
- Refresh / search actions in header bar

---

## Bottom Navigation (All Tiers)

### Current (Tier 1)

```
OVERVIEW · DASHBOARD · FORECAST · INTEL · ACCESS
```

### Tier 2 Recommendation

```
DASHBOARD · FORECAST · INTEL · ACCESS · MORE
```

Merge OVERVIEW into DASHBOARD (the overview IS the dashboard). FREE the fifth slot for future use.

### Tier 3 Recommendation

```
MAP · DASHBOARD · FORECAST · INTEL · MORE
```

MAP becomes the discovery engine. ACCESS moves into MORE alongside Settings, Account, and overflow features.

---

## Design Principles for Scale

1. **Progressive Disclosure:** Show the minimum needed to act. Details are one tap away, never blocking the main view.
2. **Context Compression:** As data grows, headers shrink. The more content you have, the less chrome you can afford.
3. **Familiar Patterns:** Bottom sheets, tab bars, scroll-collapse headers — use patterns users already know from Uber, Weather apps, Google Maps. Don't invent navigation.
4. **Data as the Hero:** Every pixel above the fold should be fishing intelligence, not app UI. The data is the product.
5. **One Tap to Switch:** Changing species or location should never take more than 2 taps. Current context → bottom sheet → select → done.
6. **Search Scales Everything:** At Tier 1, search is nice. At Tier 3, search is essential. Build it early, before it's urgent.

---

## Implementation Sequence

This maps to the existing ROADMAP.md phases:

| Phase | Roadmap Phase | Nav Work | Tier |
|---|---|---|---|
| Now | Phase 1 (Measurement) | Compress header, prototype bottom-sheet selectors | Tier 1 |
| Next | Phase 2–3 (Maumelle + Retention) | Ship bottom-sheet selectors, add favorites, add search icon | Tier 1→2 |
| Later | Phase 4 (Data & Scale) | Hierarchical location picker, species taxonomy, map view | Tier 2 |
| Future | Phase 5 (Intelligence) | Smart recommendations, condition-based map markers, regional browse | Tier 3 |

---

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-02-14 | Compress header from 6 lines to 2 | Every pixel matters on mobile; competitors use 1–2 lines |
| 2026-02-14 | Bottom-sheet selectors over pills | Pills don't scale past 10 items; bottom sheets are platform standard |
| 2026-02-14 | Keep 5-tab bottom nav | iOS HIG / Material Design sweet spot; matches all competitors |
| 2026-02-14 | Plan for MAP tab at Tier 3 | Map-centric discovery is proven at national scale (Fishbrain, OnWater) |
| 2026-02-14 | Data attribution stays in header | USGS/NWS sourcing is the moat — always visible, never hidden |

---

## Open Questions

- [ ] Should the MAP tab be introduced at Tier 2 (replacing OVERVIEW early) or wait for Tier 3?
- [ ] What's the threshold for moving from single-file React to a lightweight build system? (likely Tier 2 at 20+ water bodies)
- [ ] How do we handle species that exist across many water bodies differently than water-body-specific species?
- [ ] Should favorites sync across devices (requires backend) or stay localStorage-only through Tier 2?
- [ ] Does the hamburger menu (≡) work for this audience, or should brand/settings use a profile avatar approach?

---

*This is a living document. Update it as navigation decisions are made and validated with real user data.*
