# Feedback Process Evaluation & Agentic Workflow (v1)

## Why change
The current in-app feedback flow is lightweight, but binary sentiment (thumbs up/down) does not create enough signal to prioritize work, reproduce issues, or identify high-impact roadmap opportunities.

## Current-state assessment

### What works
- Fast to submit from inside the app.
- Creates a GitHub issue quickly.
- Category tagging already exists (Bug, Feature Idea, Fishing Tip, General).

### Gaps to fix
- Sentiment-only rating creates weak product signal.
- Missing user intent and expected outcome details.
- No journey-stage capture (planning vs checking conditions vs sharing report).
- No urgency/priority framing.
- No explicit context fields for current water body, species, and active app tab.

## New feedback data model
Capture compact but actionable fields:

- `category` (Bug, Feature Idea, Fishing Tip, General)
- `priority` (Low, Medium, High, Critical)
- `journey_stage` (where in workflow user experienced issue/opportunity)
- `goal` (what user was trying to do)
- `problem` (what happened; required)
- `expected_outcome` (what should happen)
- `contact_optional` (if user wants follow-up)
- `app_context` (water body, species, active tab)

## Agentic feedback workflow

### Stage 1 — Capture
1. User submits structured feedback in-app.
2. App opens prefilled GitHub issue with standardized template.
3. Payload is copied to clipboard as backup.

### Stage 2 — Triage (daily or on new issue)
Use a lightweight triage agent/human checklist:
1. Validate problem statement quality.
2. Assign severity (`S1` critical blocker → `S4` nice-to-have).
3. Assign type (`bug`, `ux`, `content`, `feature`).
4. Assign affected area (`overview`, `dashboard`, `forecast`, `intel`, `access`, `feedback`).
5. Add `next-action` label (`investigate`, `needs-design`, `ready-dev`, `duplicate`, `closed-no-action`).

### Stage 3 — Decide
Use an impact/effort score:
- Impact: 1-5
- Reach: 1-5
- Confidence: 1-5
- Effort: 1-5

Prioritize using `(Impact * Reach * Confidence) / Effort`.

### Stage 4 — Respond
- For accepted items: confirm, state scope, and target milestone.
- For deferred items: acknowledge value and explain trigger conditions.
- For closed items: explain rationale and suggest alternatives.

### Stage 5 — Learn
Weekly review metrics:
- Feedback-to-action rate
- Median time-to-first-response
- Median time-to-resolution
- Top repeated themes
- Category distribution trend

## Practical implementation checklist

### Immediate (this release)
- Remove thumbs up/down from feedback UI.
- Require a short “what happened” entry.
- Add priority and journey stage selects.
- Auto-attach current app context.

### Next sprint
- Add issue form template in `.github/ISSUE_TEMPLATE/feedback.yml`.
- Add triage label automation via GitHub Actions.
- Build a simple feedback dashboard from issues data.

### Later
- Add optional anonymous session ID for cluster analysis.
- Detect duplicate feedback themes with an AI summarizer.
- Add in-app status page: “You said → We shipped”.

## Success criteria
You are improving the process if:
- Fewer low-context issues are submitted.
- Time to reproduce bugs decreases.
- More roadmap decisions cite user evidence.
- Repeat requests are consolidated and discoverable.
