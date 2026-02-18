# USGS Multi-Station Review (Current Feedback Pass)

## What was observed
- Current production behavior only surfaced multi-station comparisons for **Lake Maumelle**.
- Other waters were configured with a single legacy `usgs` gauge ID, which prevented `Compare N stations` from appearing broadly.
- Several legacy IDs still work for continuity but do not consistently return modern IV series for `00010/00060/00065`, so they should not always be used as the primary summary source.

## Suggestions applied
1. Configure `usgsStations` for every water body that has a USGS signal.
2. Keep legacy IDs in each list for continuity/reference.
3. Promote stations with active IV data as `primary` where possible.
4. Update primary-station selection logic so a designated primary with no data does not mask a better station that does have data.

## Coverage update summary
| Water body | Before | After |
|---|---:|---:|
| Greers Ferry Lake | 1 | 3 |
| Lake Maumelle | 2 | 3 |
| White River | 1 | 3 |
| Buffalo National River | 1 | 3 |
| Bull Shoals Lake | 1 | 3 |
| Beaver Lake | 1 | 3 |
| Lake Ouachita | 1 | 3 |
| DeGray Lake | 1 | 3 |
| Lake Conway | 0 | 0 |

## Notes
- Lake Conway remains intentionally without a USGS gauge configuration.
- This update broadens station comparison visibility and gives each water body a primary + fallback station strategy.
