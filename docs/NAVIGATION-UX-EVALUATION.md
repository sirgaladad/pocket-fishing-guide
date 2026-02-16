# Pocket Fishing Guide — Header & Navigation UX Evaluation

**Date:** February 14, 2026
**Evaluator:** Claude (AI) + Corey Boelkens
**Target:** Mobile-first fishing intelligence app
**Context:** Scaling to 50+ species, 500+ water bodies, nationwide USA coverage

---

## 1. Current State Assessment

### What's Working Well

**Bottom Navigation (5-tab bar)** — OVERVIEW · DASHBOARD · FORECAST · INTEL · ACCESS is a solid foundation. Five items is the Material Design / iOS HIG sweet spot. The icons + labels combo is accessible and scannable. This mirrors patterns from Fishbrain, OnWater, and FishAngler — all use bottom tab bars with 4–6 items.

**Data Attribution Bar** — The USGS station ID and NWS reference build trust. For a data-driven product, showing your sources is a differentiator. Most competitors hide this.

**Species Pill Selector** — The horizontal pill toggle (WHITE BASS / CRAPPIE) works cleanly for 2 species. Tactile, thumb-friendly, clear active state.

**Water Body Pills** — The horizontal scrolling row (Greers Ferry, Maumelle, White R., etc.) is a familiar mobile pattern and works at the current scale (~8 items).

---

## 2. Scalability Red Flags

### 🔴 Critical: Species Selector Won't Scale

**Current:** 2 horizontal pills (White Bass, Crappie)
**At 10+ species:** Pills overflow into multi-row chaos or require horizontal scrolling that hides options
**At 50+ species:** Completely breaks

**How competitors solve this:**
- **Fishbrain:** Map-layer filter with searchable species list (300+ species)
- **OnWater:** Filterable species map with multi-select (20 at once from 100+)
- **FishAngler:** Species filter with categories (bass, panfish, catfish, trout, etc.)

### 🔴 Critical: Water Body Selector Won't Scale

**Current:** ~8 horizontal pills (all in AR)
**At 50+ bodies of water:** Horizontal scroll becomes a guessing game — users can't see what's off-screen
**At 500+ (nationwide):** Completely breaks, needs hierarchical selection

**How competitors solve this:**
- **Fishbrain:** Map-centric (tap on the water body directly), with search
- **OnWater:** Map + search bar with autocomplete for water bodies
- **FishAngler:** Location-aware map with manual search fallback

### 🟡 Warning: Header Vertical Space

The current header stack consumes significant vertical real estate on mobile:

```
Line 1: TALE WATERS & TIDES (brand)
Line 2: 🐟 Crappie Intelligence (title)
Line 3: Beaver Lake, AR · USGS Live Data (location)
Line 4: [Species pills]
Line 5: Data timestamp + station ID
Line 6: [Water body pills]
```

That's ~6 lines before any content appears. On a 375px-wide iPhone SE or similar, this could push the actual dashboard content below the fold. Fishbrain and OnWater both collapse context into 1–2 lines at the top, maximizing data viewport.

### 🟡 Warning: No Search or Discovery Mechanism

There's no search bar, no "find a lake" flow, and no browse/explore pattern. As you scale nationally, users need to discover new water bodies — not just pick from a pre-loaded list.

---

## 3. How Might We (HMW) Recommendations

### HMW #1: Replace Species Pills with a Smart Selector

**Pattern:** Collapsible chip + bottom sheet
**How it works:** Show the currently selected species as a single tappable chip in the header (e.g., `🐟 Crappie ▾`). Tapping it opens a bottom sheet with categories (Bass, Panfish, Catfish, Trout, Saltwater) → individual species within each. Include a search bar at the top of the sheet.

**Why:** Bottom sheets are the iOS/Android standard for contextual selection. They scale to hundreds of items, support search, and don't consume header space.

**Competitive proof:** Fishbrain uses this pattern for species filtering on their map. OnWater supports up to 20 species selected simultaneously via a filterable list.

**Implementation complexity:** Medium — requires bottom sheet component + species taxonomy data

### HMW #2: Replace Water Body Pills with Location Picker

**Pattern:** Tappable location header + search/map hybrid bottom sheet
**How it works:** The header shows `📍 Beaver Lake, AR ▾` as a single tappable element. Tapping opens a full bottom sheet with three sections:
1. **Recent / Favorites** — pinned water bodies (the user's "home" lakes)
2. **Nearby** — GPS-aware suggestions
3. **Search** — type-ahead for any water body in the database

As you scale, add state/region grouping: `Arkansas → Beaver Lake, Bull Shoals, Greers Ferry...`

**Why:** This is exactly how Uber, DoorDash, and weather apps handle location switching — one tap to see current, one tap to change. Scales from 8 to 8,000 locations.

**Competitive proof:** Fishbrain's 3D globe + search is delightful but complex. OnWater's search + map is the pragmatic gold standard. Your USGS data integration actually gives you an advantage here — you can surface real-time conditions in the picker itself.

**Implementation complexity:** Medium-high — needs search indexing, GPS integration, favorites system

### HMW #3: Compress the Header to 2 Lines Max

**Current (6 lines):**
```
TALE WATERS & TIDES
🐟 Crappie Intelligence
Beaver Lake, AR · USGS Live Data
[WHITE BASS] [CRAPPIE]
Data: Feb 14, 2026 · 10:00 AM CST
[Greers Ferry] [Maumelle] [White R.] ...
```

**Proposed (2 lines):**
```
[≡]  📍 Beaver Lake, AR  ·  🐟 Crappie  ▾    [⟳]
     Data: 10:00 AM CST · USGS #07049000
```

- Brand name moves to a hamburger/side menu or settings
- Location and species become inline tappable selectors
- Timestamp + station stay as a subtle secondary line
- Refresh button stays accessible

**Why:** Every pixel above the fold matters on mobile. Fishbrain and OnWater both use 1–2 line headers. The dashboard data IS your product — make it the hero.

**Implementation complexity:** Low-medium — mostly layout restructuring

### HMW #4: Add a Global Search / Explore Flow

**Pattern:** Persistent search icon in header → full-screen search experience
**How it works:** A magnifying glass icon in the header opens a full-screen search that unifies:
- Water bodies ("Beaver Lake", "Lake of the Ozarks")
- Species ("Largemouth Bass", "Rainbow Trout")
- Regions ("Northwest Arkansas", "Missouri")

Results show mini-cards with current conditions, making search itself a discovery tool.

**Why:** This is how you get users from "I fish Beaver Lake" to "I wonder what's biting at Table Rock." Discovery drives engagement, which drives retention as you scale.

**Competitive proof:** Every successful fishing app with national scale has search-first discovery. OnWater's search + access points + species maps is the benchmark.

**Implementation complexity:** High — needs search infrastructure, but could start with simple text matching

### HMW #5: Evolve Bottom Nav for Scale

**Current tabs:** OVERVIEW · DASHBOARD · FORECAST · INTEL · ACCESS

These are solid for now, but consider the roadmap:

| Current Tab | What It Might Absorb as You Scale |
|---|---|
| OVERVIEW | Quick glance, conditions summary |
| DASHBOARD | The main data view (current) |
| FORECAST | Multi-day forecasting, BiteTime-style hourly |
| INTEL | Community reports, AI insights, historical patterns |
| ACCESS | Boat ramps, put-ins, regulations, licenses |

**HMW:** Keep 5 tabs but make DASHBOARD the default landing (it is now). Consider whether OVERVIEW and DASHBOARD could merge — if the overview IS the dashboard, you free up a tab slot for future needs like a MAP view or COMMUNITY/SOCIAL tab.

**Potential future nav:**
```
MAP · DASHBOARD · FORECAST · INTEL · MORE
```

Where MORE houses Access, Settings, Account, and overflow features. This gives you runway.

---

## 4. Prioritized Action Plan

| Priority | HMW | Impact | Effort | Do When |
|---|---|---|---|---|
| **P0** | #3 Compress header | High (immediate UX win) | Low | Now — before adding more data |
| **P1** | #1 Smart species selector | Critical for scale | Medium | Before adding 5+ species |
| **P2** | #2 Location picker | Critical for scale | Medium-High | Before expanding beyond AR |
| **P3** | #4 Search / Explore | Growth driver | High | When launching multi-state |
| **P4** | #5 Evolve bottom nav | Future-proofing | Low | When adding community/map features |

---

## 5. Competitive Landscape Summary

| Feature | Your App | Fishbrain | OnWater | FishAngler |
|---|---|---|---|---|
| **Species selection** | Horizontal pills | Searchable list + photo ID | Map filter (20 at once) | Category filter |
| **Location selection** | Horizontal pills | 3D globe + search + map tap | Search + map + GPS | Map + search |
| **Header density** | ~6 lines | 1–2 lines | 1–2 lines | 1–2 lines |
| **Bottom nav** | 5 tabs ✓ | 5 tabs | 5 tabs | 5 tabs |
| **Data sources** | USGS + NWS (unique!) | Crowdsourced + weather | NOAA + state data | Weather APIs |
| **Offline support** | TBD | Limited | Yes (3D maps) | Limited |
| **Search/Discovery** | None yet | Full search | Full search + species maps | Location + species filter |

**Your unique edge:** Real-time USGS and NWS data integration. No competitor shows USGS station IDs or ties forecasts to official hydrology data this directly. Lean into that.

---

## 6. Quick Wins (Ship This Week)

1. **Collapse the header** — move brand to menu, inline the selectors
2. **Add a subtle scroll-collapse behavior** — header compresses to 1 line on scroll down, expands on scroll up (like iOS Safari)
3. **Add visual active state** to bottom nav — the selected tab should have more contrast/weight
4. **Add "last updated" relative time** — "10 min ago" is more scannable than "10:00 AM CST"

---

*Prepared for Tale Waters & Tides roadmap planning. Reference competitive apps directly for further UI pattern inspiration.*
