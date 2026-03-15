# Roadmap — Tale Waters & Tides
## Pocket Fishing Guide for Arkansas Waters

> The full original Phase 1–5 vision is archived at
> [`docs/archive/ROADMAP-v0.3-VISION.md`](docs/archive/ROADMAP-v0.3-VISION.md).

---

## Where We Are

**v0.3.0 shipped.** v0.4.0 is feature-complete and in final QA:

- 39 Arkansas water bodies — lakes, rivers, tailwaters, streams
- White Bass + Crappie fishing intelligence (phases, lures, spawn tracking)
- Real-time data from USGS, NWS, and USACE — no API keys required
- 21-lure canonical library with condition-aware scoring
- Automated 6-hour data refresh via GitHub Actions
- Zero backend — static site on GitHub Pages

---

## Guiding Principles

1. **Measure first, build second** — data-driven decisions drive every priority
2. **Pocket means local** — depth on Arkansas waters beats shallow national coverage
3. **Users before features** — a great experience for 100 active users beats a bloated app
4. **Progressive enhancement** — static now, backend only when the user base justifies it

---

## Now — Ship v0.4.0

Finalize and tag the unreleased work already built:

- Tackle Box bottom-sheet modal with top-5 ranked lures per species + phase
- Live Bait Toggle — artificial / live bait filter with `bait_type` field across all 21 lures
- Lure Scoring Engine — condition-aware ranking: clarity × flow × phase
- Conditions Strip — temperature + spawn phase + trend chips below the hero
- Pro Intel + Local Tips accordion — expandable expert knowledge per water
- Desktop two-column grid — primary signals + secondary media/gear panels

---

## Next — UX Revision

**Goal:** Compress and clarify the mobile experience. Every pixel counts on a phone screen on the water.

Priorities (see [`docs/architecture/NAVIGATION-SCALING-STRATEGY.md`](docs/architecture/NAVIGATION-SCALING-STRATEGY.md)):

- Header compression — maximum 2 lines, always visible data attribution
- Water selector as bottom-sheet — replaces current dropdown, supports search + favorites
- Bottom nav evolution — current 5-tab bar polished for Tier 1 (9–39 waters)
- Scroll-collapse behavior — header collapses on scroll, re-appears on scroll-up
- Touch target audit — minimum 44px on all interactive elements

Success metric: p50 first-interaction time under 3 seconds on a mid-range phone.

---

## Next — Analytics Hardening

**Goal:** Know exactly how users engage with the app so every roadmap decision is grounded in data.

GA4 is live (G-929WWD4EZ4). What's missing is a clean event taxonomy and funnel definition:

| Event | Trigger |
|-------|---------|
| `water_selected` | User changes water body |
| `species_toggled` | User switches White Bass ↔ Crappie |
| `tab_viewed` | Any bottom-nav tab tap |
| `tackle_box_opened` | Tackle Box modal open |
| `lure_clicked` | How-To or Shop link tap |
| `snapshot_shared` | Share button tap |
| `donation_clicked` | Ko-fi button tap |
| `feedback_opened` | GitHub Issues link tap |

**Funnel:** Load → Water Selected → Tab Engaged → Lure Clicked → Return Visit

Success metric: funnel baseline established, top drop-off point identified, and one experiment run to address it.

---

## Later — Maumelle Deep Dive

Become the definitive Maumelle resource:

- YouTube how-to links per lure / technique
- Local tackle shop directory (family-owned shops near Maumelle)
- Deeper access point info — photos, seasonal status, crowd patterns
- USGS historical data capture — daily cron building time-series JSON
- Enhanced pro tips — seasonal breakdowns, temp correlation, moon phase guidance

---

## Later — User Retention & Personalization

Build the habit loop:

- Weekly fishing reports via EmailJS (Friday digest)
- `.ics` calendar downloads for predicted spawn windows
- PWA manifest — add to home screen, standalone display mode
- Browser push notifications — spawn window and condition alerts
- Optional zip code entry for nearest-water suggestions

---

## Later — Backend & Scale

When the user base justifies it:

- Supabase or Firebase database — user accounts, historical conditions, catch reports
- Community catch reporting with optional photo upload
- Expand to 4+ new Arkansas waters (Ouachita, Ozark rivers, Delta waters)
- Patreon tier foundation — free + premium + patron

---

## Later — Intelligence & Automation

The capstone layer:

- Claude API agentic feedback processing — pattern detection → auto-scoped GitHub Issues
- ML spawn prediction model — >75% accuracy within ±3 days after 2 seasons of training
- Automated weekly narrative fishing reports — LLM-generated, multi-channel
- Calendar sync, weather alerts, social sharing automation

---

## Document History

- **v2.0** — 2026-03-15: Condensed for public launch. Archived original at `docs/archive/ROADMAP-v0.3-VISION.md`
- **v1.0** — 2026-02-10: Initial 5-phase roadmap

---

*This roadmap is a living document. Fluid by design — priorities shift as we hear from anglers.*
