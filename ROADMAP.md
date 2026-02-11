# Tale Waters & Tides — Product Roadmap
## Pocket Fishing Guide for Arkansas Waters

---

## Guiding Principles

1. **One Lake, Done Right**: Prove the model thoroughly on Lake Maumelle before expanding to other waters. Build trust and quality first; scale later.

2. **Measure First, Build Second**: Before adding features, establish analytics to understand how users engage with the product. Data-driven decisions drive roadmap priority.

3. **The Pocket Guide Ethos**: Deliver local, actionable intelligence—not generic fishing advice. Users come for Maumelle-specific insights they can't find elsewhere.

4. **Users Before Features**: A well-crafted experience for 100 active users beats a feature-bloated app with nobody using it.

5. **Progressive Enhancement**: Start with static, GitHub-hosted data; evolve toward dynamic backend infrastructure only when the user base justifies it.

6. **The Agent is the Capstone**: Agentic AI and automation are Phase 5 features. The foundation must be solid before intelligent layers add value.

7. **Community & Monetization**: Bootstrap with Ko-fi donations and GitHub community feedback. Introduce Patreon tiers only when there's a real community to support.

---

## Current Status

### Completed
- Core fishing guide UI/UX for Lake Maumelle
- Species database with seasonal presence data
- Water body selection dropdown
- Species toggle functionality
- Basic responsive design
- GitHub repository infrastructure

### In Progress (Phase 1)
- Google Analytics 4 integration setup
- In-app feedback widget implementation
- Ko-fi donation link integration
- GitHub Issues templates for community feedback

### Next Up
- Phase 1 launch and early user validation
- Measure baseline metrics for Phase 2 prioritization

---

## Phase 1: Measurement Foundation
### Current Sprint — Build the Metrics Layer

**Rationale**  
Before we can iterate intelligently, we need to understand how users interact with the app. Phase 1 establishes a lightweight analytics and feedback loop. We measure what works, what confuses users, and what features they request. This data directly informs Phase 2 scope.

### Features

#### Google Analytics 4 Integration
- Track **page views** to understand overall traffic and session patterns
- Monitor **tab engagement**: which water bodies and species get the most attention?
- Measure **feature usage**: species toggle interactions, water selection changes, time spent on each section
- Set up **conversion funnels**: donation clicks, GitHub navigation, feedback submissions
- Establish **baseline metrics**: daily/weekly active users, session duration, bounce rate

#### In-App Feedback Widget
- **Thumbs up/down** quick-reaction buttons for each species or water section
- **Category selection**: bug report, feature request, general praise/criticism
- **Optional text field** for detailed user comments
- Lightweight design—doesn't distract from the fishing guide content
- Responses stored in Firebase/GitHub Issues for review

#### Ko-fi/Donation Support
- Embed Ko-fi widget or donation button (non-intrusive placement)
- Position as voluntary appreciation for the guide
- Builds initial community support and validates market interest
- Lower friction than subscription—no commitment required

#### GitHub Issues Templates
- Create structured templates for **bug reports** (description, steps to reproduce, browser/device info)
- Create **feature request** template (user problem statement, desired outcome, use case)
- Create **general feedback** template (topic, sentiment, suggestion)
- Link template URLs in the feedback widget for guided community contributions
- Enables transparent issue tracking and community visibility

### Success Metrics
- **GA4 Events**: >100 daily active users by end of sprint
- **Feedback Volume**: >10 contributions via widget or Issues per week
- **Donation Traction**: $10+ in Ko-fi donations (validates willingness to support)
- **Data Quality**: Clear insights into which species/water bodies drive engagement

### Dependencies
- GA4 property already created and approved
- Ko-fi account established
- GitHub repo has Issues enabled with visibility

---

## Phase 2: Maumelle Deep Dive
### The Flagship Water Body — Become the Maumelle Authority

**Rationale**  
Analytics from Phase 1 show us what users care about. Phase 2 doubles down on Lake Maumelle exclusively. We transform the app from "a fishing guide" into "the Maumelle fishing guide"—the resource locals and visitors bookmark and share. This depth builds brand loyalty and positions us as the authoritative source. We capture data, integrate tools, and expand context.

### Features

#### Expanded Water Body Context
- **Lake Maumelle core**: deeper seasonal ecology, water temperature ranges, clarity patterns
- **Surrounding watershed**: Big Maumelle River (upstream), Little Maumelle River (downstream), feeding creeks and tributaries
- Explain how each waterway connects—spawning migrations, temperature gradients, food web relationships
- Seasonal flow patterns: high water (spring), low water (summer/fall), winter dynamics

#### Tackle Links with YouTube Videos
- For each **recommended lure/bait** in the species guide, embed or link a **YouTube how-to video**
- Prioritize local anglers or regional guides demonstrating techniques
- Include timestamps: lure selection, casting, retrieval, when to switch
- Videos answer the "how do I actually use this?" question—concrete value

#### Local Bait & Tackle Directory
- Curate **non-big-box tackle shops** near Lake Maumelle (family-owned, knowledgeable staff)
- Include: shop name, address, phone, hours, specialty (saltwater vs. freshwater, fly fishing, etc.)
- Link to Google Maps for directions
- Contrast with big-box (Walmart, Bass Pro) for user convenience

#### Walmart Product Links
- Direct links to **tackle availability** on Walmart.com for recommended lures
- Includes price, in-stock status (if API available), customer reviews
- Monetization opportunity: affiliate links (Amazon Associates or Walmart Partner Network)
- Balances local shop promotion with accessibility

#### Deeper Access Point Information
- Expand **launch site/access point** entries with:
  - **GPS coordinates** (decimal format) for mapping
  - **High-resolution photos**: parking area, ramp condition, seasonal vegetation
  - **Seasonal status**: open year-round vs. seasonal closures (e.g., hunting season)
  - **Facilities**: restrooms, shade, boat rental, cleaning stations
  - **Crowd patterns**: best times to visit (weekday vs. weekend, season)
- Enable users to plan trips with confidence

#### USGS Historical Data Capture (GitHub Actions)
- **Daily cron job** pulls water temperature, flow rate, gauge height from USGS Maumelle gauge
- Appends data to a **JSON file** in the repository (timestamped)
- Builds a **time-series dataset** for future trend analysis and ML models
- No external backend required initially—GitHub Actions is free
- Sets foundation for Phase 4 historical charts and Phase 5 spawn prediction

#### Enhanced Pro Tips with Seasonal Detail
- Expand existing "Pro Tips" section with:
  - **Seasonal breakdowns**: Spring spawn patterns, summer heat strategies, fall migration, winter sluggish periods
  - **Water temp correlation**: "When water hits 65°F, expect this behavior..."
  - **Barometric pressure tips**: how falling pressure affects bite
  - **Moon phase guidance**: spawning correlations with lunar cycles
- Position as expert local knowledge—differentiate from generic fishing advice

### Success Metrics
- **Page Time**: >5 min average session on Maumelle species sections
- **Tackle/Shop Clicks**: >50% of users engage with business directory or video links
- **Video Engagement**: >30% click-through to YouTube tutorials
- **Historical Data**: 90 days of continuous USGS data collected (validates pipeline)
- **User Feedback**: >80% indicate Maumelle content is "very useful" or "critical"

### Dependencies
- Phase 1 analytics operational and showing user engagement trends
- USGS API access validated for Maumelle gauge
- Local tackle shop partnerships or willing shop proprietors identified
- YouTube channel curated for tutorial videos
- Walmart affiliate account (or decision to defer monetization)

---

## Phase 3: User Retention & Personalization
### Build the Habit Loop — Make Users Return Weekly

**Rationale**  
We've established Maumelle expertise. Now we build habits. Phase 3 introduces personalization and notifications—the mechanics that bring users back. Weekly reports, push alerts, and saved preferences turn occasional visitors into regular checkers. The PWA (Progressive Web App) installation puts our app on their home screen.

### Features

#### Email Signup for Weekly Fishing Reports
- **Simple email form** on homepage or sidebar
- **Automated weekly digest** (Friday evening?):
  - Water temperature trends (past week)
  - Active species + predicted bite windows
  - Tackle recommendations based on current conditions
  - Pro tip of the week (seasonal focus)
  - Local tackle shop feature
- Email provider: **EmailJS** (simple, free tier) or **Mailchimp/Buttondown** (more features, free tier)
- Include **unsubscribe** link and privacy statement
- Position as "Your weekly Maumelle fishing brief"—actionable, not spam

#### Calendar .ics Downloads
- Generate **iCalendar (.ics) files** for predicted **spawn windows** (species-specific)
- Users download and import into Google Calendar, Outlook, Apple Calendar
- Includes:
  - Spawn event name (e.g., "Largemouth Bass Spawn Peak")
  - Date range (e.g., April 15–May 15)
  - Description with water temp thresholds
  - Link back to app for live conditions
- Enable multiple species downloads (user selects which to add)
- Drives app usage during critical fishing periods

#### Zip Code Entry (Foundation for Phase 4)
- **Optional zip code input** in user preferences or email signup
- Initially stored locally or not used (privacy-first approach)
- Prepares data infrastructure for Phase 4:
  - Route planning to nearest access point
  - Multi-state expansion (future: Oklahoma, Missouri, Louisiana waters near Maumelle)
  - Local weather integration
- **No forced geolocation**—explicit user opt-in only

#### IP Geolocation Fallback (Privacy-Respecting)
- **Only activate with explicit user consent** ("Let me find Maumelle from your location?")
- Use **privacy-respecting geolocation service** (e.g., MaxMind GeoIP Lite, IP2Location)
- Calculate distance to Lake Maumelle and nearby access points
- Suggest "nearest launch in your area" if outside Maumelle region
- Clear UI showing "Your IP is ~X miles from Lake Maumelle"
- Option to dismiss or override

#### Browser Push Notifications
- **Service Worker + Web Push API** for temperature and condition alerts
- Alert types:
  - "Water temp hit 68°F—prime spawn window for largemouth bass"
  - "Barometric pressure falling—expect increased feeding activity"
  - "New pro tip added: March tactics for crappie"
- **User controls**: toggle notifications on/off, select species/conditions of interest
- Timing: sent at user-specified hour (e.g., 6 AM before work)
- Drives daily or every-other-day app engagement

#### PWA Manifest & Home Screen Installation
- Create **manifest.json** with:
  - App name: "Tale Waters & Tides — Maumelle Fishing Guide"
  - App icon (multiple resolutions: 192x192, 512x512, favicon)
  - Theme colors (blues/greens, water-inspired)
  - Start URL
  - Display mode: "standalone" (looks like native app)
- Add **Apple meta tags** for iOS support (non-PWA mobile install)
- Enable users to "Install" from browser: "Add to Home Screen"
- Offline fallback (service worker caches critical assets)
- Increases perceived value and return visits

### Success Metrics
- **Email Subscribers**: >500 by end of phase
- **Email Open Rate**: >25% (fishing/outdoor niche typically 20–30%)
- **Click-Through**: >10% of subscribers engage with weekly content link
- **PWA Installs**: >10% of mobile users add to home screen
- **Push Notification Engagement**: >40% open rate (higher for alerts vs. newsletters)
- **Return Visit Rate**: >40% of weekly active users return within 7 days

### Dependencies
- Phase 2 access points and species data complete and stable
- USGS data pipeline (Phase 2) feeding real water conditions
- Email/push service accounts provisioned and tested
- Spawn window data curated (seasonal timing for Maumelle fish species)

---

## Phase 4: Data & Scale
### Backend Infrastructure & Multi-Water Expansion

**Rationale**  
We've built habit and personalization on static data. Phase 4 introduces a backend database to handle user accounts, historical analytics, and expansion beyond Maumelle. The "one lake, done right" principle shifts to "one region, replicated model": we apply the Maumelle playbook to additional Arkansas waters. Community contributions (catch reports) add real-time flavor.

### Features

#### Backend Database
- Provider: **Supabase** or **Firebase** (free tier with cost scaling)
- Initial schema:
  - **Users**: email, preferences (favorite species, alert settings, zip code), created_at, last_active
  - **Historical Conditions**: water_temp, flow_rate, gauge_height, date, source (USGS)
  - **Catch Reports**: user_id, species, weight/length, date, access_point, notes, photo_url
  - **Access Points**: name, lat, lon, facilities, seasonal_status, photos
- Migration from GitHub Actions JSON → database (Phase 2 data ingest)
- API endpoints for app frontend (read-heavy for conditions, write for catch reports)

#### User Accounts & Personalization
- **Authentication**: email + password or OAuth (Google, Apple)
- Saved preferences:
  - Favorite species (auto-load on app open)
  - Alert preferences (push notifications, email frequency)
  - Saved access points ("My favorite launch sites")
  - Catch history (optional user tracking of their own catches)
- **Premium toggle** (foundation for Phase 5 Patreon tiers):
  - Free: weekly emails, push alerts, basic catch logging
  - Premium: daily emails, advanced historical charts, catch analytics, ad-free

#### Historical Trend Charts
- **Water temperature over time**: line chart (past 30/90/365 days)
  - Overlay with "typical spawn window" bands for each species
  - Compare: "2024 peak vs. historical average"
- **Flow rate trends**: seasonal patterns, drought vs. flood years
- **Gauge height fluctuations**: visibility into seasonal lake level
- Interactive: date range selector, compare multiple years
- Educate users: why these metrics matter for fishing

#### Expand to Additional Arkansas Waters
- **Selection criteria**:
  - USGS gauge with temperature data available
  - Significant fishery (public access, established angling community)
  - Geographic diversity (within 3–4 hours of Maumelle for cohesive region)
- **Candidate waters**:
  - Lake Ouachita (USGS gauge available, deep lake, striped bass fishery)
  - Bull Shoals Lake (tailwater, trout, smallmouth bass)
  - Beaver Lake (northern Arkansas, diverse species)
  - Current River (tailwater float trips, smallmouth bass)
- **Rollout**: 1–2 new waters per quarter, same playbook (species guide → deep dive → personalization)
- **Data sharing**: USGS pipeline replicates across waters, reducing per-lake overhead

#### Community Fishing Reports
- **Catch submission form**:
  - Species, weight/length, date, time, access point, lure/bait used, water temp (if known), notes
  - Optional photo upload
  - User reputation system (angler ID or anonymous)
- **Feed/map view**: recent catches displayed on interactive map (by access point) or timeline
- **Filtering**: last 7 days, specific species, top-performing lure, specific access point
- **Gamification** (optional): top contributors, species badges, monthly leaderboard
- **Data value**: patterns emerging from community (e.g., "shad-colored crankbaits dominate this week")
- Privacy: optional anonymity, user controls over data visibility

#### Patreon Tier System (Foundation)
- **Free tier** (default):
  - Weekly email, basic push alerts, community catch reports, access to all species guides
  - Ad-supported (discrete banner ads for local businesses, affiliate links)
  
- **Premium tier** ($5/month):
  - Daily email, advanced alerts (barometric pressure, moon phase), premium historical charts
  - Ad-free experience
  - Early access to new waters
  
- **Patron tier** ($20/month):
  - Everything in Premium
  - Monthly 1-on-1 consultation call (video) with experienced local angler
  - Private Discord community
  - Direct input on roadmap priorities
  
- Roll out once community reaches >1000 active users (Phase 5)
- Ko-fi remains as one-time donation option (complementary to Patreon)

### Success Metrics
- **User Accounts**: >1000 registered users
- **Active Database**: >90 days of continuous historical conditions (all waters)
- **Catch Reports**: >100 community submissions in first month post-launch
- **Multi-Water Traffic**: >20% of sessions engage with non-Maumelle waters
- **Historical Chart Views**: >30% of users explore trend data
- **Patreon Signups** (end of phase): >50 subscribers (early adopters)

### Dependencies
- Phase 3 user engagement and personalization infrastructure stable
- USGS data pipeline (Phase 2) running reliably
- Database provider (Supabase/Firebase) account created, tested, cost modeling done
- Additional water species guides authored and reviewed
- Community moderation guidelines established

---

## Phase 5: Intelligence Automation
### The Agentic Layer — Intelligent Insights & Automation

**Rationale**  
By Phase 5, we have a rich data layer, an engaged community, and measurable user behaviors. Now we add the intelligent agent: AI reads feedback patterns, identifies emerging feature requests, predicts spawn windows with ML, and automates report generation. The agent becomes the product: it senses what users need, tells us what to build, and delivers insights before users ask.

### Features

#### Agentic Feedback Processing
- **Feedback aggregation**: collect GitHub Issues, email replies, push notification engagement, in-app feedback widget, Discord messages
- **LLM analysis** (Claude API):
  - Categorize feedback (feature request, bug, praise, question)
  - Extract topics (e.g., "users asking for Striped Bass spawn timing")
  - Detect sentiment (positive, negative, neutral)
  - Identify patterns ("3+ users requested X in last 2 weeks")
- **Weekly feedback report** (digest sent to product team):
  - Top 5 emerging requests with user count
  - Critical bugs flagged for immediate attention
  - Trend analysis ("interest in tailwater species increasing")
  - Actionable summary

#### Auto-Scoping: Feedback → GitHub Issues
- **Agentic issue creation**:
  - Agent detects pattern ("4 users requested Moon Phase alerts in push notifications")
  - Auto-creates GitHub Issue with:
    - Title: "Feature: Moon Phase Alerts in Push Notifications"
    - Body: description, affected user count, links to original feedback
    - Labels: "feature-request", "phase-5-candidate", "community-driven"
    - Acceptance criteria (auto-generated from feedback analysis)
  - Tags @ product team for review/prioritization
- **Transparency**: issue is public, users see their feedback shaped the roadmap
- **Voting**: users can upvote GitHub Issues (external emoji reaction widget) to influence priority

#### Smart Alerts: ML-Based Spawn Prediction
- **Historical data training**: 2+ years of USGS temperature, catch reports, community feedback
- **ML model** (time-series prediction):
  - Input: water temp, date, day-length (photoperiod), moon phase, barometric trend, past spawn windows
  - Output: spawn probability for each species (0–100%)
  - Learns local Maumelle patterns (not generic)
- **Alert triggers**:
  - "Largemouth Bass spawn window opening in 3 days (78% confidence, water hitting 63°F)"
  - Sent 3–5 days before predicted window (actionable timing)
  - Includes: expected duration, competing species predictions, recommended tackle
- **Iterative improvement**: users log catches, model retrains weekly, accuracy improves over seasons
- **Transparency**: show users the confidence level and key factors ("based on temp trend + moon phase")

#### Automated Weekly Fishing Reports
- **Report generation** (each Friday PM):
  - Fetch current USGS data, historical trends, catch report summaries, spawn predictions, weather forecast
  - LLM writes narrative report (conversational, not templated):
    - "This week, water temps crept up to 62°F—we're approaching prime pre-spawn for largemouth. Local anglers reported success on shad crankbaits Thursday evening..."
    - Graphics: temp chart (this year vs. average), species activity heatmap, top lures used
    - Call to action: "Try this technique" or "Visit this access point"
  - Personalization: users receive species-specific variant (e.g., "For your favorite—smallmouth bass—expect...")
  - Multi-channel distribution: email, push notification, in-app feed, Discord
- **Volume**: ~500–2000 word narrative weekly, not automated spam

#### Integration Ecosystem Automation
- **Calendar sync**: auto-push spawn window events to user's Google Calendar / Apple Calendar (if permitted)
- **Weather alerts**: integrate with weather API, notify users if severe weather expected at favorite access point
- **Social sharing automation**:
  - User catches a fish, submits photo, agent auto-posts to community Discord: "Great catch by [username]! [species] at [access point]"
  - User can opt-in to "auto-brag" feature (share catch to social media with one click)
- **Webhook integrations** (future):
  - Notify smartwatch apps (e.g., Wear OS) of alerts
  - IFTTT integration ("If water temp hits X, turn on my coffee maker")
- **API exposure**: developers can build third-party tools (access point GPS + weather + forecast)

### Success Metrics
- **Feedback Processing**: agent processes 100% of community feedback within 1 week
- **Pattern Detection**: identifies 3–5 actionable insights per week
- **Issue Auto-Creation**: >80% of auto-generated Issues are validated and prioritized by team
- **Spawn Prediction Accuracy**: >75% hit rate within ±3 days (after 2 seasons of training)
- **Report Engagement**: >35% email open rate (higher than Phase 3 baseline), >15% CTR
- **Automation Adoption**: >50% of users enable calendar/alert integrations
- **API Usage**: >20 external developers building with the API

### Dependencies
- Phase 4 data infrastructure (users, historical conditions, catch reports) operational and rich
- LLM API account (Claude API with reasonable rate limits)
- ML infrastructure (Python backend for model training, scheduled jobs)
- Feedback aggregation pipeline (multiple data sources feeding agent)
- Community Trust: transparent about agent capabilities, clear when humans vs. agent respond

---

## Timeline & Resource Allocation

### Phase 1: Measurement Foundation
- **Duration**: 2–3 weeks (current sprint)
- **Team**: 1 full-stack engineer, 1 product/analytics
- **Deliverable**: Analytics live, feedback widget operational, Ko-fi integrated

### Phase 2: Maumelle Deep Dive
- **Duration**: 4–6 weeks
- **Team**: 1 full-stack engineer, 1 content creator (species guides + videos), 1 local partnership coordinator
- **Deliverable**: Complete Maumelle encyclopedia, YouTube video library, USGS pipeline running, local shop directory

### Phase 3: User Retention & Personalization
- **Duration**: 3–4 weeks
- **Team**: 1 full-stack engineer, 1 email/marketing (EmailJS setup, weekly content)
- **Deliverable**: PWA live, 500+ email subscribers, push notifications enabled

### Phase 4: Data & Scale
- **Duration**: 6–8 weeks
- **Team**: 1 backend engineer, 1 frontend engineer, 1 content creator (new water guides), 1 community moderator
- **Deliverable**: Database live, user accounts, catch reporting, second water body launched, Patreon tiers ready

### Phase 5: Intelligence Automation
- **Duration**: 8–10 weeks
- **Team**: 1 ML engineer, 1 backend engineer, 1 product/agent orchestration
- **Deliverable**: Feedback agent operational, spawn prediction model trained, automated reports deployed, integrations live

---

## Contingencies & Pivots

### If Adoption is Slower Than Expected
- **Extended Phase 1**: Spend 4–6 weeks validating product-market fit through user interviews
- **Delay Phase 4**: Database can wait; continue with static data longer if it's working
- **Monetization Pivot**: If Ko-fi donations <$50/month by end of Phase 1, pivot to affiliate-only model

### If USGS Data Becomes Unavailable
- **Fallback**: Partner with local dam operator or university environmental lab for temperature data
- **Workaround**: Community-submitted water conditions (angler thermometers) as secondary source

### If Community Feedback Is Sparse
- **Engagement Push**: Hire local fishing influencer to promote app, stream fishing trips with app overlay
- **Incentive**: monthly raffle for all feedback contributors ($25 tackle shop gift card)

### If Patreon Adoption Fails
- **Alternative**: Premium tier funded by Walmart/local shop affiliate revenue
- **Sponsorship**: local tackle shops sponsor weekly reports ("This week's guide brought to you by [Shop]")

---

## Success Definition

**By end of Phase 5, Tale Waters & Tides is considered successful if:**

1. **Community**: >5000 monthly active users, >500 Patreon supporters, >100 Discord members
2. **Data**: 2+ years historical USGS data, 1000+ community catch reports, >75% spawn prediction accuracy
3. **Monetization**: $3000+/month recurring (Patreon + affiliate), covering server & email costs
4. **Expansion**: 3–5 Arkansas waters launched (same model replicated), emerging interest in adjacent states
5. **Retention**: >50% month-over-month retention of active users, viral growth driven by word-of-mouth
6. **Product**: "The definitive fishing guide for Arkansas anglers" mentioned in local fishing communities, outdoor blogs, regional publications

**Success is NOT measured by:**
- Feature count (depth over breadth)
- Press coverage or VC funding
- Competing with established apps (we're niche, not mainstream)
- Monthly revenue targets (mission-driven, sustainable)

---

## Appendix: Guiding Questions for Phase Transitions

Before moving to the next phase, ask:

1. **Has the previous phase delivered on its core hypothesis?**
   - Phase 1: Do users engage with analytics-backed data?
   - Phase 2: Do Maumelle-specific features drive loyalty?
   - Phase 3: Do personalized features increase return visits?

2. **Do we have >100 weekly active users from the previous phase?**
   - If no, extend that phase or diagnose why engagement is low

3. **Is the team confident in the data quality and reliability?**
   - Phase 2 USGS pipeline must be rock-solid before Phase 3 sends alerts based on it

4. **Have we received >50 pieces of community feedback?**
   - Signals real user interest; feedback informs priorities

5. **Is the codebase sustainable for the next phase's scope?**
   - If not, allocate a sprint to refactor before expanding

---

## Document History

- **v1.0** — 2026-02-10: Initial roadmap created, all 5 phases documented, guiding principles established

---

*This roadmap is a living document. It evolves based on user feedback, team capacity, and market signals. Review quarterly and adjust as needed.*
