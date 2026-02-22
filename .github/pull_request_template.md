Title

Landing Page Redesign (Mobile-First) + Navigation Refactor: Hero + Forecast Hierarchy, Preserve All Sections, Keep How-To + Shop Paired

Objective

Refactor the lake landing page UI to introduce a clear hierarchy and a premium, mobile-first experience while preserving 100% of existing functionality, data, and sections.

Key upgrades:

Add hero image + decision controls (species/activity) at the top

Promote Forecast/Conditions and “Today’s Pattern” above the fold

Preserve and reorganize existing content into clear categories (no truncation)

Keep the proven How-To + Shop pairing on lure cards and in the Media + Gear area

Add scalable browsing via horizontal scroll shelves (videos, shopping, optional more lures)

No backend changes. Presentation-layer refactor only.

References

Wireframes:

Mobile: pfg_wireframe_mobile_v2_actionpair.png

Desktop: pfg_wireframe_desktop_v2_actionpair.png

Component spec: pfg_component_3lure_actionpair.png

Inspiration pattern (already in current UI): “3-Lure Arsenal” cards with How-To + Shop tied together.

Non-Negotiables

Do not remove or truncate any existing content/sections

Do not change existing data sources, JSON structures, or selection logic

Do not break existing navigation between lakes/rivers/species

Preserve “Forecast”, “Pro info”, “Local pro tips”, “YouTube”, and “Shopping” content

Keep How-To + Shop paired everywhere it appears today

Proposed Information Architecture (Keep All Content)
Header (All pages)

Logo (left)

Hamburger (right)

Lakes / Rivers

Species

About

Feedback

Lake Landing Page (Template)

Hero (new)

AI hero image per lake

Lake name + tagline

Species dropdown (existing logic)

Activity dropdown (existing logic)

CTA: “View Today’s Pattern”

Forecast/Conditions Strip (prominent)

Water temp, level, wind, clarity (existing data)

Keep near top of page

Today’s Pattern (promoted)

Preserve existing pattern outputs and detail

Include “3-Lure Arsenal” module with the same UX pattern:

Ranked lures (1–3)

One-line usage tip

How-To + Shop buttons paired

Pro Intel + Local Tips (full content preserved)

On mobile: accordion/collapsible for cognition and scroll control

On desktop: full sections visible, standard scroll

Media + Gear (paired shelves)

Keep YouTube + Shopping adjacent (this is a proven pattern)

Add horizontal scroll carousels:

How-To Videos shelf

Shopping Picks shelf

No loss of existing links

All other existing sections

Remain accessible by vertical scroll, in categorized blocks

Nothing removed

UX Requirements

Mobile-first (primary breakpoint ~390px)

Desktop layout supports wide screens (1440px)

No horizontal page scroll (except intended carousels)

Buttons must remain thumb-friendly on mobile

Maintain current dark theme aesthetics and styling coherence

Performance Requirements

Hero image optimized (WebP preferred)

Lazy-load below-the-fold content

Avoid adding heavy dependencies

Analytics (GA4)

Add/confirm events (do not remove existing tracking):

hero_species_select

hero_activity_select

pattern_cta_click

lure_howto_click

lure_shop_click

media_video_click

media_shop_click

Implementation Tasks

Create hero section component (supports per-lake hero image)

Move/promote forecast strip directly below hero

Promote Today’s Pattern section above the fold

Implement/standardize “3-Lure Arsenal” card pattern

Ensure How-To + Shop pairing on every lure card

Reorganize remaining content into clear category blocks

Pro Intel + Local Tips preserved in full

Implement Media + Gear paired shelves

YouTube shelf + Shopping shelf with horizontal scroll

Add mobile accordion behavior for long sections (no truncation)

Regression test across lakes/rivers/species selection flows

Acceptance Criteria (Definition of Done)

All existing features and data still present and functioning

New hero + decision controls visible and functional

Forecast/Conditions is prominent near top

“3-Lure Arsenal” preserves paired How-To + Shop

Media + Gear keeps YouTube + Shopping adjacent and scrollable

Mobile UX clean, readable, and fast

No broken links, filters, or selection logic

Performance not worse than current baseline
## Scope
- [ ] Landing page layout hierarchy refactor (mobile-first)
- [ ] Header + hamburger navigation refactor
- [ ] Hero section added (per-lake hero support)
- [ ] Forecast/Conditions promoted near top
- [ ] Today’s Pattern promoted near top
- [ ] 3-Lure Arsenal preserved with How-To + Shop paired actions
- [ ] Media + Gear preserved with YouTube + Shopping paired, scalable via horizontal scroll
- [ ] All existing sections retained (no truncation, no removal)

## Non-Negotiables Validation
- [ ] No data removed
- [ ] No sections removed
- [ ] No selection logic changed (species, activity, lake routing)
- [ ] No broken links (How-To, Shop, Local)
- [ ] Existing functionality still present and reachable by scroll

## Screenshots / Visual Proof
### Mobile (390px)
- [ ] Before
- [ ] After

### Desktop (1440px)
- [ ] Before
- [ ] After

## UX Behavior Notes
- Mobile: accordions/collapsible sections (content remains fully accessible)
- Desktop: sections visible via normal scroll
- Carousels: horizontal scroll shelves (videos, shopping, optional more lures)

## Analytics (GA4)
Events added or confirmed in this PR:
- [ ] hero_species_select
- [ ] hero_activity_select
- [ ] pattern_cta_click
- [ ] lure_howto_click
- [ ] lure_shop_click
- [ ] media_video_click
- [ ] media_shop_click

GA4 Validation Steps
- [ ] Open site in an incognito window
- [ ] Perform key interactions above
- [ ] Confirm events in GA4 DebugView or Realtime
- [ ] Confirm event names match exactly (no duplicates, no typos)

## Testing
### Functional
- [ ] Lake selection still works (all existing lake buttons)
- [ ] Species selection still works
- [ ] Activity selection still works
- [ ] Today’s Pattern renders correctly
- [ ] 3-Lure Arsenal renders correctly
- [ ] How-To links open correct videos
- [ ] Shop links open correct destinations
- [ ] YouTube + Shopping pairing present and usable
- [ ] All prior sections still visible below (scroll)

### Responsive
- [ ] 390px (iPhone)
- [ ] 768px (tablet)
- [ ] 1024px
- [ ] 1440px

### Performance
- [ ] Hero images optimized (WebP preferred)
- [ ] Lazy-load below fold
- [ ] Lighthouse score not worse than baseline

## Risk and Rollback
Primary risk:
- Layout regression on small screens
Rollback plan:
- Revert PR or disable hero + new hierarchy via a simple config flag (if implemented)

---

## Release Plan (practical, low-risk)

### Release Strategy

**Two-phase rollout** so you do not break your current momentum.

#### Phase 0: Baseline (same day)

1. Record baseline Lighthouse (mobile + desktop)
2. Record baseline GA4 events you already track (if any)
3. Capture “before” screenshots for Lake Maumelle landing view

Deliverable: “Baseline captured” comment in the Issue.

#### Phase 1: Template Implementation (flagship lake first)

Implement the new landing template for **Lake Maumelle** first.

* Hero + decision card
* Forecast strip moved/promoted
* Today’s Pattern promoted
* Preserve “3-Lure Arsenal” and keep How-To + Shop paired
* Preserve YouTube + Shopping paired, add shelves for scrolling scale
* Keep all other sections below, grouped and accessible (accordion on mobile)
* Apply same layout template across all lake pages
* Confirm no lake-specific regressions (missing hero fallback, missing sections)

## QA Checklist (what to test before merge)

**Critical path in under 2 minutes:**

1. Pick a lake
2. Pick species
3. Pick activity
4. Tap “View Today’s Pattern”
5. Confirm “3-Lure Arsenal” shows 3 ranked lures
6. Tap How-To, confirm correct video
7. Tap Shop, confirm correct destination
8. Scroll and confirm all legacy sections still exist and are reachable

**Mobile specific:**

* Accordions expand and do not hide content permanently
* Buttons are thumb-friendly and do not overlap

**Desktop specific:**

* YouTube + Shopping appear paired and visually aligned

**GA4:**

* Confirm events appear in DebugView
* Confirm no duplicate event firing on a single tap
