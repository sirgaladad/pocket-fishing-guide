# Body of Water Selector Enhancement - Technical Scoping

**Issue Reference:** [#8](https://github.com/sirgaladad/pocket-fishing-guide/issues/8)  
**Date:** 2026-02-14  
**Status:** Scoping Complete

---

## Executive Summary

This document provides a comprehensive technical scoping analysis for user-requested enhancements to the Body of Water selector. The feedback originates from an Oklahoma-based user who found the default Lake Maumelle selection unhelpful and requested smarter location-aware features.

**Key Findings:**
- Current implementation defaults all users to Lake Maumelle regardless of location (line 1413 in index.html)
- All requested features are technically feasible but vary significantly in complexity and alignment with product roadmap
- Some features align with existing Phase 3 and Phase 4 roadmap items; others introduce new scope
- Recommendation: Prioritize quick wins (localStorage default) and defer complex features to Phase 3/4 as planned

---

## User Feedback Breakdown

### Original Feedback Summary
From issue #8, the user (based in Oklahoma) requests:

1. **Don't default to Lake Maumelle** - avoid forcing all users to start at Lake Maumelle
2. **Location awareness** - consider user location via geo-lookup, zipcode, or IP
3. **Map/smarter navigation** - provide a map or improved navigation showing distance and spawn status
4. **Alerts and calendar invitations** - ability to sign up for notifications when spawn events occur

### User Context
- **Location:** Oklahoma (non-Arkansas user)
- **Use case:** Checking spawn status and finding nearby bodies of water
- **Current friction:** Must manually change from default Lake Maumelle each visit

---

## Current Implementation Analysis

### Technical Architecture
- **Platform:** Single-page React 18 app in index.html (no build step, Babel standalone)
- **Data:** Static WATERS object (9 Arkansas lakes/rivers) defined in-app
- **State Management:** React useState for current water body selection
- **Default:** Hardcoded to "maumelle" (line 1413: `const [water, setWater] = useState("maumelle");`)
- **Persistence:** No localStorage or session storage; defaults reset on page reload

### Available Water Bodies (9 total)
1. Greers Ferry Lake
2. Bull Shoals Lake
3. Beaver Lake
4. Lake Ouachita
5. Lake Maumelle (current default)
6. DeGray Lake
7. Lake Conway
8. White River
9. Buffalo River

### Data Structure per Water Body
Each entry includes:
- Name, short name, type (lake/river)
- USGS gauge ID (or null), lat/lon coordinates
- NWS office, alert status
- Access points (with GPS, facilities, restrictions)
- Regulations, tips, crappie-specific tips

---

## Feature Scoping & Technical Feasibility

### Feature 1: Remove Default to Lake Maumelle

#### Description
Allow users to persist their water body selection across sessions, eliminating the forced default to Lake Maumelle.

#### Technical Approach
**Option A: localStorage (Recommended)**
- Store user's last selected water body in browser localStorage
- On app load, check for saved preference, fall back to Maumelle only if none exists
- Implementation: ~10-15 lines of code
```javascript
// On load
const savedWater = localStorage.getItem('selectedWater') || 'maumelle';
const [water, setWater] = useState(savedWater);

// On change
const handleWaterChange = (newWater) => {
  setWater(newWater);
  localStorage.setItem('selectedWater', newWater);
};
```

**Option B: URL Parameter**
- Use query string (e.g., `?water=greers`) to allow direct links to specific water bodies
- Persists across shares/bookmarks but not across general browsing

**Option C: Smart Geographic Default (see Feature 2)**

#### Complexity
- **Effort:** Low (1-2 hours)
- **Risk:** Very low
- **Testing:** Simple - verify localStorage read/write, test cross-browser

#### Dependencies
- None

#### Alignment with Roadmap
- Not explicitly in roadmap but aligns with Phase 3 "User Retention & Personalization"
- Quick win that improves UX immediately

#### Recommendation
**Priority: HIGH**  
Implement Option A (localStorage) immediately. This is a simple fix that addresses the core user complaint with minimal effort and zero risk.

---

### Feature 2: Location-Based Water Body Selection

#### Description
Use user location (geolocation API, IP lookup, or zip code entry) to suggest or default to nearest water body.

#### Technical Approach

**Option A: Browser Geolocation API (Recommended for MVP)**
- Request user permission for location via `navigator.geolocation.getCurrentPosition()`
- Calculate distance to all 9 water bodies using haversine formula
- Suggest or default to nearest body of water
- Respects user privacy: explicit opt-in, no data sent to server
```javascript
// Calculate distance using haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Returns distance in miles
}

// Find nearest water body
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const distances = Object.entries(WATERS).map(([key, w]) => ({
      key,
      distance: calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        w.lat,
        w.lon
      )
    }));
    const nearest = distances.sort((a, b) => a.distance - b.distance)[0];
    setWater(nearest.key);
  });
}
```

**Option B: IP Geolocation**
- Use third-party service (MaxMind GeoIP Lite, IP2Location, ipapi.co)
- Free tiers available but rate-limited
- Less accurate than GPS (city-level vs. precise coordinates)
- Privacy concerns: IP sent to third party
- Requires API key management

**Option C: Zip Code Entry**
- User manually enters zip code
- Geocode zip to lat/lon using free service (Nominatim, US Census API)
- Calculate distance to water bodies
- Most privacy-respecting but adds friction

**Option D: Hybrid Approach**
1. Check localStorage for saved preference (Feature 1)
2. If no preference, offer location permission prompt
3. If denied, show manual selector or zip code entry
4. Remember user's choice

#### Complexity
- **Effort:** Medium (Option A: 4-8 hours; Option B/C: 8-16 hours; Option D: 12-20 hours)
- **Risk:** Medium
  - Browser API support varies (mobile vs. desktop)
  - Permission denial handling required
  - IP geolocation accuracy concerns
  - Privacy considerations

#### Dependencies
- For Option B: API key from geolocation service
- For Option C: Geocoding service integration
- UI design for permission prompts and fallback UX

#### Alignment with Roadmap
- **Phase 3:** "Zip Code Entry (Foundation for Phase 4)" - explicitly listed
- **Phase 3:** "IP Geolocation Fallback (Privacy-Respecting)" - explicitly listed
- This feature is already planned but not prioritized for immediate implementation

#### Recommendation
**Priority: MEDIUM (defer to Phase 3)**  
This feature is already on the roadmap for Phase 3. Do not prioritize over Phase 1 (Measurement Foundation) and Phase 2 (Maumelle Deep Dive) work. 

**Suggested Sequencing:**
1. Implement Feature 1 (localStorage) now as quick win
2. Defer location features to Phase 3 as planned in roadmap
3. When implementing in Phase 3, use Option A (Browser Geolocation) or Option D (Hybrid) for best UX

---

### Feature 3: Map or Smarter Navigation with Distance/Spawn Status

#### Description
Provide a visual map or enhanced navigation showing:
- Geographic locations of all water bodies
- Distance from user's location to each body of water
- Current spawn status for each location

#### Technical Approach

**Option A: Interactive Map (Leaflet.js or Mapbox)**
- Embed map with markers for each of the 9 water bodies
- Show user's location (if permission granted)
- Display distance from user to each marker
- Color-code markers by spawn phase (pre-spawn, spawn, post-spawn)
- Clicking marker selects that water body
```javascript
// Using Leaflet.js (open source, no API key required)
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

const map = L.map('map').setView([35.0, -92.5], 7); // Arkansas center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

Object.entries(WATERS).forEach(([key, w]) => {
  const phase = getPhase(w.currentTemp, species);
  const markerColor = getPhaseColor(phase);
  L.marker([w.lat, w.lon], { icon: getColoredIcon(markerColor) })
    .bindPopup(`${w.name}<br/>Distance: ${distance}mi<br/>Phase: ${phase}`)
    .on('click', () => setWater(key))
    .addTo(map);
});
```

**Option B: Enhanced List View with Distance/Status**
- Keep current button layout but add metadata
- Show distance (if location available) and spawn phase
- Sort by distance or spawn readiness
```jsx
<div className="water-sel">
  {Object.entries(WATERS)
    .map(([key, w]) => ({
      key,
      ...w,
      distance: calculateDistance(userLat, userLon, w.lat, w.lon),
      phase: getPhase(w.currentTemp, species)
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(w => (
      <button className={`water-btn ${water === w.key ? 'active' : ''}`}>
        {w.short}
        <span className="distance">{w.distance.toFixed(0)}mi</span>
        <span className="phase-indicator">{getPhaseIcon(w.phase)}</span>
      </button>
    ))}
</div>
```

**Option C: Separate "Explore Waters" Tab**
- Add new tab to existing tabs (Dashboard, Forecast, Intel, Access)
- Dedicated view for browsing all water bodies
- Map + list hybrid: map on top, sortable/filterable list below

#### Complexity
- **Effort:** High (Option A: 20-40 hours; Option B: 8-16 hours; Option C: 30-50 hours)
- **Risk:** Medium-High
  - Map library integration increases bundle size (~200KB for Leaflet)
  - Real-time spawn status requires fetching USGS data for all 9 water bodies (9x API calls)
  - Rate limiting concerns from USGS API
  - Performance impact on mobile devices
  - UI/UX design work required

#### Dependencies
- Feature 2 (location awareness) for distance calculations
- Background data fetching for all water bodies (currently only fetches selected water)
- Map library (Leaflet.js or Mapbox) if using Option A
- Potential need for data caching/background jobs to avoid rate limits

#### Technical Challenges
1. **Data fetching:** Currently app only fetches data for selected water body. Showing spawn status for all 9 requires parallel fetching or backend caching
2. **USGS rate limits:** Making 9 simultaneous API calls on every page load may hit rate limits
3. **Performance:** Processing and rendering data for all locations impacts load time
4. **Spawn phase calculation:** Requires water temperature for each body (not all have USGS gauges)

#### Alignment with Roadmap
- Not explicitly listed in roadmap
- Conceptually aligns with Phase 4 "Backend Infrastructure & Multi-Water Expansion" 
- Conflicts with Phase 1 principle: "One Lake, Done Right" - roadmap prioritizes depth over breadth

#### Recommendation
**Priority: LOW (defer to Phase 4+)**  
This is the most complex feature requested and introduces significant technical scope. 

**Rationale:**
- Conflicts with current roadmap philosophy of depth-first (Maumelle focus) before breadth
- Requires infrastructure that doesn't exist yet (backend, data aggregation, caching)
- High effort-to-value ratio for current user base
- Better suited for Phase 4 when multi-water expansion is prioritized

**Alternative Quick Win:**
- Implement Option B (Enhanced List View) in Phase 3 as lighter-weight solution
- Add distance-only without spawn status initially (spawn requires full data pipeline)
- Defer full map implementation to Phase 4

---

### Feature 4: Alerts and Calendar Invitations for Spawn Events

#### Description
Allow users to:
- Sign up for alerts (email, push notifications) when spawn windows approach
- Download calendar invitations (.ics files) to block fishing time
- Receive notifications when specific species are entering spawn phase

#### Technical Approach

**Option A: Email Alerts (Phase 3 Roadmap)**
- User provides email address via signup form
- Weekly digest emails include spawn predictions
- Email service: EmailJS (free tier) or Mailchimp
- Server-side or GitHub Actions scheduled job generates emails
```javascript
// Frontend: Email signup
<form onSubmit={handleEmailSignup}>
  <input type="email" placeholder="your@email.com" />
  <button>Sign up for spawn alerts</button>
</form>

// Backend: GitHub Actions cron job
// - Runs weekly (Friday PM)
// - Fetches current USGS data
// - Calculates spawn phases for all subscribed species
// - Sends email via EmailJS/Mailchimp API
```

**Option B: Browser Push Notifications (Phase 3 Roadmap)**
- Service Worker + Web Push API
- User grants notification permission
- Push alerts when water temp hits thresholds
```javascript
// Request permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // Subscribe to push service
    navigator.serviceWorker.ready.then(registration => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      });
    });
  }
});

// Backend: Monitor conditions, send push when triggered
```

**Option C: Calendar Download (.ics files) (Phase 3 Roadmap)**
- Generate iCalendar files for predicted spawn windows
- User downloads and imports to Google Calendar, Outlook, etc.
```javascript
function generateSpawnICS(species, startDate, endDate) {
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${species} Spawn Window - Lake Maumelle
DESCRIPTION:Prime fishing window for ${species}. Water temp predicted to hit spawn threshold.
URL:https://talewaters.com/?water=maumelle&species=${species}
END:VEVENT
END:VCALENDAR`;
}

<button onClick={() => downloadICS('largemouth-bass', '2026-04-15', '2026-05-10')}>
  📅 Add to Calendar
</button>
```

**Option D: SMS Alerts (Future, out of scope)**
- Requires Twilio or similar service ($$$)
- More expensive and complex than email/push

#### Complexity
- **Effort:** High (Option A: 16-24 hours; Option B: 24-40 hours; Option C: 8-12 hours)
- **Risk:** Medium-High
  - Email signup requires backend to store email addresses (privacy, GDPR, CAN-SPAM compliance)
  - Push notifications require service worker, push service integration, server backend
  - Calendar downloads are simpler but require accurate spawn predictions
  - Spawn prediction accuracy depends on Phase 2 USGS historical data pipeline

#### Dependencies
- **Phase 2:** USGS historical data capture (GitHub Actions) - required for spawn predictions
- **Phase 3:** Email signup infrastructure already planned in roadmap
- **Backend:** Email list storage, push notification server, or GitHub Actions automation
- **Data:** Accurate spawn window predictions (currently based on water temp thresholds)

#### Alignment with Roadmap
- **Phase 3:** "Email Signup for Weekly Fishing Reports" - explicitly listed
- **Phase 3:** "Calendar .ics Downloads" - explicitly listed
- **Phase 3:** "Browser Push Notifications" - explicitly listed
- **Phase 5:** "Smart Alerts: ML-Based Spawn Prediction" - explicitly listed (advanced version)

This feature is already fully scoped in the roadmap across Phase 3 and Phase 5.

#### Recommendation
**Priority: MEDIUM (already planned for Phase 3)**  
This is core to the Phase 3 "User Retention & Personalization" roadmap and should be implemented as scheduled.

**Suggested Implementation Order:**
1. **Now (Phase 2):** Establish USGS historical data pipeline (dependency for predictions)
2. **Phase 3:** Implement calendar downloads first (simplest, no backend required)
3. **Phase 3:** Implement email signup and weekly reports
4. **Phase 3:** Implement push notifications last (most complex)
5. **Phase 5:** Enhance with ML-based predictions (higher accuracy)

**Quick Win for Current User:**
- Add calendar download feature now (Option C) with current water temp threshold logic
- Requires minimal backend - can generate .ics client-side
- Addresses immediate user need while full Phase 3 infra is built

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| USGS API rate limiting with multi-water fetching | High | High | Implement backend caching, background jobs, or reduce polling frequency |
| Browser compatibility issues (geolocation, push) | Medium | Medium | Feature detection, graceful fallbacks, testing matrix |
| localStorage cleared by user | Low | Low | Accept as normal behavior, provide clear UI messaging |
| Privacy concerns with location tracking | Medium | High | Explicit opt-in only, transparent privacy policy, no data collection |
| Email deliverability (spam filters) | Medium | Medium | Use reputable email service, authenticate domain (SPF/DKIM), keep content valuable |
| Service worker browser support | Low | Low | Progressive enhancement - works on supported browsers, degrades gracefully |
| Map performance on mobile devices | Medium | Medium | Optimize bundle size, lazy load map library, test on low-end devices |

### Roadmap Alignment Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Feature scope creep delaying Phase 1/2 priorities | High | Prioritize localStorage fix only, defer complex features |
| Building complex features before measurement foundation | High | Follow roadmap sequence, complete Phase 1 before Phase 3 features |
| Implementing breadth before depth (anti-pattern to roadmap) | High | Focus on Maumelle excellence first, multi-water later |

### User Experience Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Permission prompt fatigue (location, notifications) | High | Medium | Thoughtful UX timing, clear value proposition, allow "maybe later" |
| Complex UI overwhelming mobile users | Medium | High | Keep UI simple, progressive disclosure, mobile-first design |
| False expectations from spawn predictions | Medium | High | Clear disclaimers, show confidence levels, educate users on variability |

---

## Backlog Task Breakdown

### Immediate (Current Sprint)

#### Task 1.1: Implement localStorage for Water Body Persistence
**Component:** Frontend (index.html)  
**Effort:** 2 story points (1-2 hours)  
**Owner:** Engineering

**Acceptance Criteria:**
- User's selected water body is saved to localStorage on change
- On app load, user's saved preference is loaded if available
- Falls back to Lake Maumelle only if no saved preference exists
- Works across all modern browsers (Chrome, Firefox, Safari, Edge)

**Implementation Notes:**
- Modify line 1413: `const [water, setWater] = useState(localStorage.getItem('selectedWater') || 'maumelle');`
- Add useEffect hook to save to localStorage on water change
- Test localStorage availability (private browsing mode handling)

**Testing:**
- Verify preference persists across page reloads
- Verify works in incognito/private browsing (degrades gracefully)
- Test on mobile (iOS Safari, Chrome Android)

---

### Phase 3 (User Retention & Personalization)

#### Task 3.1: Design Location Permission UX Flow
**Component:** Design, Product  
**Effort:** 3 story points (3-5 hours)  
**Owner:** Product + Design

**Acceptance Criteria:**
- Wireframes for location permission prompt timing and messaging
- Fallback UX for denied permissions
- Privacy policy language for location usage
- User research validation on value proposition

**Implementation Notes:**
- Permission should be requested contextually (e.g., on first water body selection, not on page load)
- Clear value prop: "Find lakes near you" vs. vague "Allow location"
- Design for permission denied state (manual selector still works)

#### Task 3.2: Implement Browser Geolocation for Nearest Water Body
**Component:** Frontend (index.html)  
**Effort:** 5 story points (4-8 hours)  
**Owner:** Engineering

**Acceptance Criteria:**
- Request location permission using navigator.geolocation API
- Calculate distance to all 9 water bodies using haversine formula
- Suggest nearest water body to user (don't auto-switch)
- Handle permission denied gracefully
- Works on mobile (GPS) and desktop (IP-based geolocation)

**Implementation Notes:**
- Use `navigator.geolocation.getCurrentPosition()` with error handling
- Calculate distance in miles (match US conventions)
- Store "location permission status" in localStorage to avoid re-prompting
- UI: Show banner "We found lakes near you: [Greers Ferry] [Bull Shoals]"

**Testing:**
- Test with location services enabled/disabled
- Verify accuracy on mobile GPS vs. desktop IP geolocation
- Test edge cases (user in Texas, user in Arkansas)

**Dependencies:**
- Task 3.1 (Design) must be complete

#### Task 3.3: Add Distance Display to Water Body Selector
**Component:** Frontend (index.html)  
**Effort:** 3 story points (3-5 hours)  
**Owner:** Engineering

**Acceptance Criteria:**
- If user location is available, show distance in miles next to each water body button
- Sort water bodies by distance (nearest first)
- Visual indicator for nearest 2-3 bodies of water
- Works without location (shows unsorted list)

**Implementation Notes:**
- Enhance water-btn CSS to accommodate distance badge
- Add sorting logic to Object.entries(WATERS) map
- Use small font size for distance to avoid clutter

**Testing:**
- Verify layout on mobile (buttons still readable with distance)
- Test with location denied (graceful degradation)

**Dependencies:**
- Task 3.2 (Geolocation) must be complete

#### Task 3.4: Implement Calendar Download for Spawn Windows
**Component:** Frontend (index.html)  
**Effort:** 5 story points (6-10 hours)  
**Owner:** Engineering

**Acceptance Criteria:**
- Generate .ics (iCalendar) file for predicted spawn window
- User can download for current species and water body
- Calendar event includes: species name, water body, date range, description, link back to app
- Works on mobile (iOS, Android) and desktop
- File downloads correctly and imports to Google Calendar, Outlook, Apple Calendar

**Implementation Notes:**
- Generate .ics client-side using template string
- Spawn window dates based on current water temp and threshold (Phase 2 historical data ideal but not required)
- Use `data:text/calendar` data URL for download
- Button placement: Intel tab, near spawn phase indicator

**Testing:**
- Import to Google Calendar, Outlook, Apple Calendar
- Verify dates, times, descriptions render correctly
- Test on mobile Safari (iOS calendar integration)

**Dependencies:**
- Nice-to-have: Phase 2 historical data for better spawn predictions
- Can implement with current threshold logic (water temp = 50°F for white bass)

#### Task 3.5: Implement Email Signup for Weekly Reports
**Component:** Frontend + Backend (GitHub Actions or EmailJS)  
**Effort:** 13 story points (16-24 hours)  
**Owner:** Engineering + Product

**Acceptance Criteria:**
- Email signup form on home page or footer
- Validates email format client-side
- Stores email address securely (Firebase, Supabase, or GitHub Issues-based hack)
- User receives confirmation email
- Weekly automated email sent (Friday PM) with spawn status, water temp, tips
- Unsubscribe link in every email
- Privacy policy and GDPR compliance

**Implementation Notes:**
- Email service: EmailJS (free tier, 200 emails/month) or Mailchimp (free tier, 500 subscribers)
- GitHub Actions cron job (weekly) to generate and send emails
- Email template: plain text or simple HTML (avoid spam filters)
- Personalization: user's saved water body and species preferences

**Testing:**
- Verify email delivery to Gmail, Outlook, Yahoo
- Test spam score (use mail-tester.com)
- Verify unsubscribe works
- GDPR compliance review

**Dependencies:**
- Privacy policy page
- Phase 2 USGS data pipeline for accurate weekly reports

#### Task 3.6: Implement Browser Push Notifications
**Component:** Frontend (Service Worker) + Backend (Push Service)  
**Effort:** 21 story points (24-40 hours)  
**Owner:** Engineering

**Acceptance Criteria:**
- Service worker registered for push notifications
- User can grant notification permission
- Push alert sent when water temp hits spawn threshold
- User can configure alert preferences (species, timing)
- Works on mobile (Android, iOS Safari with limitations)
- Unsubscribe option available

**Implementation Notes:**
- Use Web Push API with service like Firebase Cloud Messaging or OneSignal
- Backend required to trigger push (GitHub Actions monitoring USGS data?)
- Service worker caches app for offline use (bonus feature)
- iOS Safari has limited push support - document limitations

**Testing:**
- Test on Android Chrome, Firefox, Edge
- Test on iOS Safari (document if unsupported)
- Verify notification arrives even when app is closed
- Test unsubscribe/preference changes

**Dependencies:**
- Task 3.5 (email signup) for user preference storage infrastructure
- Phase 2 USGS data pipeline for trigger conditions

---

### Phase 4 (Data & Scale)

#### Task 4.1: Design Multi-Water Browse Experience
**Component:** Design, Product  
**Effort:** 8 story points (8-16 hours)  
**Owner:** Product + Design

**Acceptance Criteria:**
- Wireframes for "Explore Waters" tab or map view
- Information architecture: how users browse, filter, compare water bodies
- Mobile-first design (80% of users on mobile)
- User research validation

**Implementation Notes:**
- Consider map view vs. list view vs. hybrid
- Incorporate distance, spawn status, species availability
- Design for 9 current water bodies, scalable to 15+

#### Task 4.2: Implement Backend Data Aggregation Service
**Component:** Backend (Supabase/Firebase + GitHub Actions)  
**Effort:** 21 story points (24-40 hours)  
**Owner:** Engineering

**Acceptance Criteria:**
- Background job fetches USGS data for all water bodies (not just selected one)
- Data cached in database to avoid rate limits
- API endpoint returns cached data for all water bodies
- Updates every 15-30 minutes
- Handles USGS API failures gracefully

**Implementation Notes:**
- GitHub Actions scheduled workflow (every 15 min) or cloud function
- Store in Supabase/Firebase (timestamp, water_body, temp, flow_rate, gauge_height)
- Frontend fetches from cache, not directly from USGS

**Testing:**
- Load test: verify can handle 1000+ concurrent users
- Verify USGS rate limits not exceeded
- Test failure scenarios (USGS down, network timeout)

**Dependencies:**
- Phase 4 backend database (Supabase/Firebase) must be provisioned

#### Task 4.3: Implement Multi-Water Map View
**Component:** Frontend (index.html + Leaflet.js)  
**Effort:** 21 story points (30-50 hours)  
**Owner:** Engineering + Design

**Acceptance Criteria:**
- Interactive map showing all 9 water bodies
- Markers color-coded by spawn phase
- Click marker to select water body
- Show user location (if permission granted)
- Mobile-optimized (touch interactions, responsive)
- Bundle size <500KB total

**Implementation Notes:**
- Use Leaflet.js (open source, no API key) or Mapbox (better design, requires API key)
- Lazy load map library (don't load until "Explore Waters" tab opened)
- Consider separate tab vs. modal overlay

**Testing:**
- Performance test on mobile (low-end Android devices)
- Verify bundle size impact
- Test on iOS Safari, Android Chrome

**Dependencies:**
- Task 4.1 (Design) must be complete
- Task 4.2 (Backend aggregation) must be complete

---

### Phase 5 (Intelligence Automation)

#### Task 5.1: ML-Based Spawn Prediction Model
**Component:** Backend (Python ML pipeline)  
**Effort:** 34 story points (40-60 hours)  
**Owner:** ML Engineer + Engineering

**Acceptance Criteria:**
- ML model trained on 2+ years historical USGS data
- Input: water temp, date, day-length, moon phase, barometric trend
- Output: spawn probability (0-100%) for each species
- Model retrained weekly with new data
- Accuracy >75% (±3 days)

**Implementation Notes:**
- Use Phase 2 historical data pipeline (GitHub Actions collecting USGS data)
- Time-series prediction model (ARIMA, LSTM, or ensemble)
- Features: water temp trend, calendar date, photoperiod, lunar phase, barometric pressure
- Train separate models per species and water body

**Testing:**
- Backtesting on historical data (2024-2025 seasons)
- A/B test: ML predictions vs. simple temp threshold
- Monitor user feedback on accuracy

**Dependencies:**
- Phase 2 historical data collection (minimum 2 years data)
- Phase 4 backend infrastructure for model serving

---

## Questions for User Follow-Up

### Clarification Questions

1. **Primary Use Case**
   - Q: Are you primarily looking for lakes in Oklahoma, or are you interested in Arkansas lakes that are near the Oklahoma border?
   - **Why:** This determines if we need to expand beyond Arkansas (out of current scope) or if location-based sorting within Arkansas is sufficient.

2. **Frequency of Use**
   - Q: How often do you check the app? Daily, weekly, or only when planning fishing trips?
   - **Why:** This informs whether push notifications (daily) or email alerts (weekly) are more valuable.

3. **Location Sharing Comfort**
   - Q: Are you comfortable with the app requesting your device location, or would you prefer to manually enter a zip code or city?
   - **Why:** This determines whether we prioritize GPS geolocation or zip code entry.

4. **Alert Preferences**
   - Q: Would you prefer email alerts, push notifications, or calendar reminders (or all three)?
   - **Why:** This helps prioritize which alert mechanism to build first (calendar is simplest, push is most complex).

5. **Spawn Status Importance**
   - Q: Is seeing spawn status across all lakes the primary reason for wanting a map, or is distance/navigation more important?
   - **Why:** If navigation is primary, we can implement distance sorting sooner. If spawn status is primary, it requires backend work (Phase 4).

### Feedback Questions

6. **localStorage Solution**
   - Q: If we save your last selected lake and restore it on your next visit, would that solve your immediate frustration with defaulting to Lake Maumelle?
   - **Why:** This validates whether the quick win (Task 1.1) addresses the core complaint or if more complex features are needed.

7. **Phase 3 vs. Immediate**
   - Q: Would you be willing to wait 4-8 weeks for location-based features if we delivered the localStorage fix (remembers your last lake) immediately?
   - **Why:** This helps gauge urgency and whether user is satisfied with incremental improvements.

---

## Recommendations & Prioritization

### Immediate Action (Current Sprint)

**✅ Implement Task 1.1: localStorage for Water Body Persistence**

**Rationale:**
- Addresses core user complaint (forced Lake Maumelle default)
- Minimal effort (1-2 hours)
- Zero risk
- Aligns with "smallest possible changes" principle
- Provides immediate value to all users

**Impact:**
- User selects Bull Shoals once, app remembers forever
- Oklahoma user never sees Lake Maumelle again unless they choose it
- No privacy concerns, no API dependencies, no complexity

---

### Phase 3 Priorities (User Retention & Personalization)

**✅ Implement in this order:**
1. **Task 3.4: Calendar Downloads** - Quick win, no backend required
2. **Task 3.1 + 3.2 + 3.3: Location-Based Selection** - Core user request, medium complexity
3. **Task 3.5: Email Signup** - High value, requires backend work
4. **Task 3.6: Push Notifications** - Most complex, implement last

**Rationale:**
- Calendar downloads address user's "calendar invite" request immediately
- Location features address user's "geo-lookup/zipcode" request
- Email and push are infrastructure-heavy but high retention value
- Sequence balances quick wins with complex infrastructure

---

### Phase 4 Deferrals (Data & Scale)

**⏸️ Defer to Phase 4:**
- Map view with spawn status across all water bodies
- Multi-water browse experience

**Rationale:**
- Conflicts with "One Lake, Done Right" roadmap principle
- Requires backend infrastructure (data aggregation, caching)
- High complexity-to-value ratio for current user base
- Better suited for Phase 4 multi-water expansion

**Alternative:**
- Implement distance sorting (Task 3.3) in Phase 3 as lighter-weight solution
- Defer full map and spawn status display to Phase 4

---

### Out of Scope

**❌ Not Recommended:**
- Expanding to Oklahoma lakes (out of geographic scope)
- Real-time crowd-sourced spawn reports (requires community, moderation)
- SMS alerts (expensive, complex)

---

## Success Metrics

### Immediate (Task 1.1)
- **Engagement:** % of users who change from default water body
- **Retention:** % of users whose selected water persists across sessions
- **Feedback:** Reduction in "defaults to wrong lake" complaints

### Phase 3 (Location Features)
- **Adoption:** % of users who grant location permission
- **Relevance:** % of users for whom nearest lake is within 100 miles
- **Engagement:** % of users who use calendar downloads
- **Retention:** Email open rate (target >25%), push notification open rate (target >40%)

### Phase 4 (Map View)
- **Usage:** % of users who engage with map view
- **Discovery:** % of users who select a water body from map vs. button list
- **Satisfaction:** User feedback on map usability

---

## Next Steps

### For Product/Engineering Team
1. **Review and approve this scoping document**
2. **Prioritize Task 1.1 for immediate implementation** (current sprint)
3. **Backlog Tasks 3.1-3.6 for Phase 3** (after Phase 2 completion)
4. **Backlog Tasks 4.1-4.3 for Phase 4**
5. **Reach out to user for clarification questions** (optional but recommended)

### For Stakeholder Communication
- **User:** "We're implementing your localStorage fix immediately. Location features and alerts are planned for Phase 3 in 6-8 weeks."
- **Team:** "This feature aligns well with roadmap. Quick win now, structured rollout in Phase 3/4."

---

## Appendix A: Technical Architecture Notes

### Current State
```
User (Browser)
  ↓
index.html (React 18)
  ↓
USGS API (direct fetch) ← Only fetches selected water body
  ↓
NWS API (direct fetch)
```

### Phase 3 Target State (with location/email/push)
```
User (Browser)
  ↓
index.html (React 18)
  ├→ localStorage (water body preference)
  ├→ navigator.geolocation (nearest water)
  ├→ Service Worker (push notifications)
  ↓
GitHub Actions (scheduled)
  ├→ USGS API (all water bodies)
  ├→ EmailJS/Mailchimp (weekly reports)
  └→ Push Service (spawn alerts)
```

### Phase 4 Target State (with backend)
```
User (Browser)
  ↓
index.html (React 18)
  ↓
API Gateway (custom backend)
  ├→ Supabase/Firebase (user accounts, preferences, historical data)
  ├→ USGS Data Cache (updated every 15 min)
  └→ ML Model (spawn predictions)
```

---

## Appendix B: Roadmap Alignment Matrix

| User Request | Existing Roadmap Item | Phase | Status |
|--------------|----------------------|-------|--------|
| Don't default to Lake Maumelle | *(not explicitly listed)* | Immediate | **NEW** - quick win |
| Geo-lookup/zipcode/IP location | "Zip Code Entry", "IP Geolocation Fallback" | Phase 3 | ✅ Already planned |
| Map/smarter navigation | *(not explicitly listed)* | Phase 4 | **NEW** - defer to Phase 4 |
| Distance to location | *(not explicitly listed)* | Phase 3 | **NEW** - add to Phase 3 |
| Spawn status across locations | *(implicit in multi-water)* | Phase 4 | ⚠️ Requires backend |
| Alerts for spawn events | "Email Signup", "Push Notifications" | Phase 3 | ✅ Already planned |
| Calendar invitations | "Calendar .ics Downloads" | Phase 3 | ✅ Already planned |

**Key:**
- ✅ Already planned in roadmap
- **NEW** - New request, should be added
- ⚠️ - Requires prerequisites

---

## Document Approval

- [ ] Engineering Lead
- [ ] Product Manager
- [ ] Designer (if applicable)
- [ ] Stakeholder (user sirgaladad)

**Approved Date:** ___________  
**Implementation Start:** ___________

---

*This scoping document is a living artifact. Update as implementation progresses and new information emerges.*
