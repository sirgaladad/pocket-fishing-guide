# Issue #14 Response Template

**For: Product Owner / Community Manager**  
**Re: Feature idea — visual dashboard of top streams/waters with signals, trends, and heat maps**

---

## Suggested Response to User

Hey there! 👋 Thanks for the excellent idea. A visual dashboard that surfaces the top waters with quick signals, trends, and (eventually) heat maps is exactly where we want to go next.

- This aligns with our Phase 4 **Data & Scale** roadmap (historical trend charts, multi-water expansion) and Phase 5 **Intelligence** (richer visualizations like heat maps and predictive signals).  
- Near-term, we can prototype a “Top Waters” snapshot that highlights the most interesting Arkansas waters with quick metrics (temp, flow, level) and small trend indicators.  
- Longer-term, we’ll layer in heat maps and richer visuals once we have the backend + historical dataset in place.

To build the right thing, can you share a bit more?
1) Which waters matter most to you (Maumelle, White, Buffalo, Ouachita, Beaver, Bull Shoals, others)?  
2) Which signals should lead the dashboard (water temp, flow, gage height, weather, spawn readiness)?  
3) How fresh does the data need to be (hourly vs. daily)?  
4) Would a map heat map be your primary view, or do quick-glance cards/lists get you there faster on mobile?

Thanks again for the inspiration—we’ll scope this into the roadmap and keep you posted as the dashboard takes shape.

---

## Feature Outline (Internal)

- **Top Waters snapshot:** ranked cards with current temp/flow/level, sparkline trend, and spawn/readiness tag.  
- **Map/heat layer (Phase 5+):** choropleth or marker intensity by recent activity/conditions; tap for quick metrics.  
- **Signals & trends:** historical lines for temp/flow/level with typical-season bands; simple “rising/steady/falling” badges.  
- **Quick actions:** jump to detailed water view, share snapshot, save as favorite.

## Roadmap Placement & Dependencies

- **Phase 2–3 foundations:** reliable USGS ingestion and historical storage (JSON → DB), species/access metadata already in WATERS.  
- **Phase 4:** backend (Supabase/Firebase), historical trend charts, multi-water ranking logic.  
- **Phase 5:** heat maps, ML-assisted signals/predictions, automated weekly/real-time digests.

## Backlog Tasks (Draft)

- Define “Top Waters” scoring model (e.g., spawn proximity, temp trend, flow stability, recent reports).  
- Add API/data pipeline for historical conditions and cached “current snapshot” per water.  
- Design quick-glance cards + mobile-first map toggle; ensure graceful fallback for users who deny location.  
- Instrument usage analytics to learn which signals/visuals users value most.  
- Optional: export/share snapshot (image or link) for social/DM sharing.

## Related Resources

- [Product Roadmap](../ROADMAP.md) — Phase 4 (Data & Scale) and Phase 5 (Intelligence & visualizations)
