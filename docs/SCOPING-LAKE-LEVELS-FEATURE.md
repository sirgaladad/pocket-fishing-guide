# Lake Levels & Flow Intelligence Feature - Technical Scoping

**Issue Reference:** User Feedback - "[Feedback] Feature Idea: We would like to know the Lake Levels, flow meaning"
**Date:** 2026-02-14
**Status:** Scoping Complete

---

## Executive Summary

This document provides a comprehensive technical scoping analysis for the Lake Levels & Flow Intelligence feature based on user feedback requesting:
1. Lake level information (gage height)
2. Flow rate interpretation for dam generation and its impact on trout fishing
3. Historical rise/fall trends

**Key Findings:**
- Current implementation already displays gage height and flow rate but lacks context and historical trends
- USGS API provides 7 days of historical data for both gage height (00065) and discharge/flow (00060)
- Feature aligns with Phase 2 roadmap goals (Maumelle Deep Dive - historical data capture)
- Recommendation: Enhance existing display with historical trend charts, flow interpretation, and fishing impact analysis

---

## User Feedback Breakdown

### Original Feedback Summary
User requests:
1. **Lake Levels** - Display current lake levels (gage height)
2. **Flow Meaning** - Explain what flow rates mean for dam generation and fishing
3. **Trout Impact** - How generation affects trout fishing
4. **Historical Trends** - Show rise/fall patterns over time

### User Context
- **Interest:** Understanding water conditions for fishing success
- **Current gap:** Raw gage height and flow numbers lack context
- **Desired outcome:** Interpret data for fishing decisions

---

## Current Implementation Analysis

### What's Already Working
The app currently displays:
- **Gage Height:** Displayed in hero card and dashboard (line 1090: `{usgs.gage.toFixed(2)} ft`)
- **Flow Rate:** Displayed in cfs (cubic feet per second) (line 1089: `{usgs.flow.toLocaleString()} cfs`)
- **Data Source:** USGS Water Services API with 7 days of historical data available
- **USGS Parameters:**
  - `00010` - Water temperature (°C)
  - `00060` - Discharge/flow (cfs)
  - `00065` - Gage height (ft)

### Current Data Structure
```javascript
// From fetchUSGS function (lines 841-898)
{
  temp: 56.3,           // Water temp in °F
  tempTrend24: +2.1,    // 24hr trend
  tempTrend7: +5.4,     // 7-day trend
  temps7: [],           // 7 days of daily averages
  flow: 1250,           // Discharge in cfs
  gage: 8.42,           // Gage height in ft
  lastReading: Date     // Timestamp
}
```

### What's Missing
1. **Historical trends for gage height** - No trend calculation or chart
2. **Historical trends for flow** - No trend calculation or chart
3. **Flow interpretation** - No context for what flow rates mean
4. **Generation impact** - No explanation of dam generation effects
5. **Lake level status** - No indication if levels are high/low/normal
6. **Fishing impact analysis** - No advice based on flow/level conditions

---

## Feature Scoping & Technical Feasibility

### Feature 1: Lake Level (Gage Height) Historical Trends

#### Description
Display 7-day gage height trend chart similar to existing water temperature chart, with rise/fall analysis.

#### Technical Approach
**Enhance fetchUSGS function:**
```javascript
// Add to result object
gages7: [],           // 7 days of gage height readings
gageTrend24: null,    // 24hr change in ft
gageTrend7: null,     // 7-day change in ft
```

**Add chart component:**
- Similar to existing 7-day water temp chart (lines 1154-1181)
- Color code: rising (red/orange), falling (blue), stable (green)
- Show rise/fall in feet over 7 days

#### Complexity
- **Effort:** Low-Medium (3-4 hours)
- **Risk:** Very low - reuses existing chart pattern
- **Data availability:** ✅ Already fetched from USGS

#### Alignment with Roadmap
- ✅ Phase 2: Historical Data Capture (ROADMAP.md lines 152-158)
- ✅ Phase 2: Historical Trend Charts (ROADMAP.md lines 298-305)

---

### Feature 2: Flow Rate Historical Trends

#### Description
Display 7-day flow rate trend chart with high/low/average flow indicators.

#### Technical Approach
**Enhance fetchUSGS function:**
```javascript
// Add to result object
flows7: [],           // 7 days of flow readings
flowTrend24: null,    // 24hr change in cfs
flowTrend7: null,     // 7-day change in cfs
```

**Add chart component:**
- Bar chart showing daily average flow
- Reference lines for "normal" flow ranges per water body
- Color coding: high flow (red), normal (green), low (blue)

#### Complexity
- **Effort:** Low-Medium (3-4 hours)
- **Risk:** Very low - same pattern as gage height
- **Data availability:** ✅ Already fetched from USGS

#### Alignment with Roadmap
- ✅ Phase 2: Historical Data Capture
- ✅ Phase 2: Water body context - flow patterns (ROADMAP.md line 123)

---

### Feature 3: Flow & Generation Interpretation

#### Description
Add contextual information explaining what current flow rates mean for fishing, particularly dam generation effects on tailwaters.

#### Technical Approach
**Create interpretation logic:**
```javascript
function interpretFlow(water, flow, gage) {
  const w = WATERS[water];
  // Define normal ranges per water body
  const ranges = {
    'white': { low: 500, normal: [1000, 3000], high: 5000 },
    'buffalo': { low: 200, normal: [400, 2000], high: 3000 },
    // ... etc
  };

  // Return status and fishing advice
  if (flow < ranges[water].low) {
    return { status: 'Low', advice: 'Minimal generation. Focus on pools and deeper runs.' };
  }
  // ... etc
}
```

**Add to UI:**
- Status badge: "Low Flow" / "Normal Flow" / "High Generation"
- Fishing impact text explaining what it means
- Specific tips for current conditions

#### Water Body Specific Context

**White River (Tailwater):**
- Generation from Bull Shoals Dam
- High flow: trout pushed to edges, structure important
- Low flow: fish more aggressive, excellent wading
- Reference generation schedules from USACE

**Buffalo River:**
- Free-flowing, no dam
- Flow indicates rainfall/runoff
- Ideal range: 400-2000 cfs for fishing floats
- Low: concentrate on pools
- High: dangerous wading conditions

**Lakes (Maumelle, Greers Ferry, etc):**
- Gage height more important than flow
- Stable levels = good spawn conditions
- Fluctuating levels = scattered fish
- Low levels = concentrate on deeper water
- High levels = expanded shoreline access

#### Complexity
- **Effort:** Medium (4-6 hours)
- **Risk:** Low - requires water body research
- **Maintenance:** Medium - may need updates as conditions change

#### Alignment with Roadmap
- ✅ Phase 2: Enhanced Water Body Context (ROADMAP.md lines 119-123)
- ✅ Phase 2: Enhanced Pro Tips with Seasonal Detail (ROADMAP.md lines 160-166)

---

### Feature 4: Lake Level Status Indicators

#### Description
Show if current lake levels are high, normal, or low based on historical averages and seasonal patterns.

#### Technical Approach
**Define normal ranges:**
```javascript
const NORMAL_RANGES = {
  'maumelle': { low: 315, normal: [318, 322], high: 325, pool: 319 },
  'greers': { low: 455, normal: [460, 465], high: 468, pool: 462.5 },
  // ... per water body
};
```

**Status calculation:**
```javascript
function getLakeStatus(water, gageHeight) {
  const range = NORMAL_RANGES[water];
  if (gageHeight < range.low) return { status: 'Low', color: 'orange', icon: '📉' };
  if (gageHeight > range.high) return { status: 'High', color: 'blue', icon: '📈' };
  return { status: 'Normal', color: 'green', icon: '✓' };
}
```

**Display:**
- Badge next to gage height showing status
- Seasonal context: "2.5 ft below normal pool"
- Fishing advice based on level

#### Complexity
- **Effort:** Medium (4-5 hours)
- **Risk:** Medium - requires research on normal pool levels
- **Data source:** USACE lake level data, USGS historical averages

#### Alignment with Roadmap
- ✅ Phase 2: Deeper Access Point Information (ROADMAP.md lines 143-150)
- ✅ Addresses user feedback directly

---

## Risk Assessment

### Technical Risks
- **Low Risk:** All data already available from USGS API
- **Low Risk:** Chart patterns already established in codebase
- **Medium Risk:** Normal ranges require research and validation

### User Experience Risks
- **Low Risk:** Additive feature, doesn't break existing functionality
- **Medium Risk:** Too much data could overwhelm users - must be clear and concise

### Data Quality Risks
- **Low Risk:** USGS data is reliable and well-maintained
- **Medium Risk:** Not all water bodies have gage height sensors
- **Mitigation:** Gracefully handle missing data, show "Not available"

---

## Backlog Tasks

### Design Tasks
1. Sketch 7-day gage height chart layout
2. Design flow interpretation status badges
3. Create lake level status indicator mockups
4. Define color schemes for status indicators

### Engineering Tasks
1. **Task 1.1:** Enhance fetchUSGS to calculate gage height trends (24hr, 7-day)
2. **Task 1.2:** Add gages7 array to store historical gage height readings
3. **Task 2.1:** Enhance fetchUSGS to calculate flow trends (24hr, 7-day)
4. **Task 2.2:** Add flows7 array to store historical flow readings
5. **Task 3.1:** Create GageHeightChart component (similar to water temp chart)
6. **Task 3.2:** Create FlowRateChart component
7. **Task 4.1:** Define NORMAL_RANGES constant with pool levels per water body
8. **Task 4.2:** Create interpretFlow function with water body specific logic
9. **Task 4.3:** Create getLakeStatus function
10. **Task 5.1:** Add lake level status badge to hero card
11. **Task 5.2:** Add flow interpretation section to dashboard
12. **Task 5.3:** Add gage height trend chart below water temp chart
13. **Task 5.4:** Add flow rate trend chart
14. **Task 6.1:** Research and document normal pool levels for all 9 water bodies
15. **Task 6.2:** Research and document typical flow ranges for rivers/tailwaters
16. **Task 6.3:** Write fishing advice content for various flow/level conditions
17. **Task 7.1:** Test across all water bodies
18. **Task 7.2:** Handle edge cases (no gage data, missing flow data)

### Content Tasks
1. Research USACE normal pool elevations for each lake
2. Document ideal flow ranges for White River and Buffalo River
3. Write flow interpretation guidance for each water body type
4. Create fishing tips for high/low/normal conditions
5. Add generation schedule references (USACE links)

---

## User Questions (for validation)

1. **Priority:** Is this a high priority feature for you, or just nice-to-have?
2. **Tailwater focus:** Are you primarily interested in tailwater fishing (White River) or all water bodies?
3. **Historical depth:** Is 7 days of history sufficient, or do you want longer-term trends?
4. **Generation schedules:** Do you want direct links to USACE generation schedules?
5. **Trout-specific:** Should we add trout-specific phases alongside white bass/crappie?

---

## Recommendations

### Phase 1 (MVP) - Quick Win
**Timeline:** 1-2 days
**Scope:**
- Add gage height 7-day trend calculation and display
- Add flow rate 7-day trend calculation and display
- Add basic flow interpretation (high/normal/low) with fishing advice

**Why this first:**
- Leverages existing data and patterns
- Low risk, high user value
- Proves the concept before deeper investment

### Phase 2 (Enhanced Context)
**Timeline:** 2-3 days
**Scope:**
- Research and add normal pool levels for all water bodies
- Create lake level status indicators
- Add water body specific flow interpretation
- Add generation schedule references

**Why this second:**
- Requires more research and validation
- Builds on Phase 1 foundation
- Higher maintenance overhead

### Phase 3 (Advanced Features) - Future
**Timeline:** Phase 4+ roadmap
**Scope:**
- Real-time generation schedules from USACE API
- Predictive flow modeling
- Multi-year historical comparison
- User-submitted flow/level reports

**Why deferred:**
- Requires backend infrastructure
- Aligns with Phase 4 roadmap (database, historical data)
- Can validate user demand first

---

## Success Metrics

### Phase 1 Success Criteria
- ✅ Gage height trend chart displays correctly for all water bodies with sensors
- ✅ Flow rate trend chart displays correctly
- ✅ Flow interpretation provides clear fishing advice
- ✅ User feedback indicates feature is useful
- ✅ No performance degradation from additional data processing

### User Validation
- Track engagement: % of users who view trend charts
- Gather feedback: "Was flow interpretation helpful?"
- Monitor GitHub Issues for follow-up requests or clarifications

---

## Next Steps

1. **User validation:** Confirm this scoping matches user expectations
2. **Priority setting:** Determine urgency vs. other roadmap items
3. **Research phase:** Gather normal pool levels and flow ranges
4. **Implementation:** Start with Phase 1 MVP
5. **Iterate:** Gather feedback and enhance in Phase 2

---

## Technical Architecture Notes

### Data Flow
```
USGS API → fetchUSGS() → Enhanced data object → React state → Chart components
```

### New Data Structure
```javascript
{
  // Existing
  temp, tempTrend24, tempTrend7, temps7, flow, gage, lastReading,

  // NEW
  gageTrend24: +0.5,    // ft change in 24hr
  gageTrend7: +2.1,     // ft change in 7 days
  gages7: [             // 7 days of gage height
    { day: 'Feb 8', avg: 318.2 },
    { day: 'Feb 9', avg: 318.5 },
    // ...
  ],
  flowTrend24: +500,    // cfs change in 24hr
  flowTrend7: +1200,    // cfs change in 7 days
  flows7: [             // 7 days of flow
    { day: 'Feb 8', avg: 1250 },
    { day: 'Feb 9', avg: 1400 },
    // ...
  ]
}
```

### Performance Considerations
- All data already fetched in single USGS API call
- Processing trends adds ~10-20ms to fetch time
- Chart rendering is pure React - no performance impact
- Total data size increase: ~2-3KB per water body

---

## Appendix A: USGS Parameter Codes

- **00010:** Water temperature (°C)
- **00060:** Discharge/flow (cfs - cubic feet per second)
- **00065:** Gage height (ft - feet above datum)
- **Period:** P7D (past 7 days of data)

All data is public domain, no API key required.

---

## Appendix B: Roadmap Alignment Matrix

| Feature | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 |
|---------|---------|---------|---------|---------|---------|
| Lake Level Trends | ✅ Measure | 🎯 **Implement** | | | |
| Flow Interpretation | ✅ Measure | 🎯 **Implement** | | | |
| Historical Charts | | 🎯 **Aligned** | | | |
| Generation Schedules | | 🎯 **Context** | | | |
| Lake Status Indicators | | 🎯 **Implement** | | | |

**🎯 = Current scope aligns with this phase**

This feature is perfectly aligned with Phase 2 goals: "Maumelle Deep Dive" and "Historical Data Capture".

---

## Document History

- **v1.0** — 2026-02-14: Initial technical scoping created based on user feedback

---

*This scoping document is ready for implementation. Pending user validation and priority confirmation.*
