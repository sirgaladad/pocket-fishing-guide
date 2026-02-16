# Documentation

This directory contains product and technical documentation for the Pocket Fishing Guide project.

## Contents

### Evaluations & Analysis
- **[NAVIGATION-UX-EVALUATION.md](./NAVIGATION-UX-EVALUATION.md)** — Header & navigation UX evaluation with competitive analysis (Fishbrain, OnWater, FishAngler). Includes HMW recommendations and prioritized action plan.

### Scoping Documents
Technical analysis documents that break down user feedback into actionable backlog tasks with feasibility, risk, and implementation assessments.

- **[SCOPING-BODY-OF-WATER-SELECTOR.md](./SCOPING-BODY-OF-WATER-SELECTOR.md)** — Technical scoping for Body of Water selector enhancement (Issue #8). Includes feasibility analysis, backlog tasks, risk assessment, and prioritization recommendations.
- **[IMPLEMENTATION-ASSESSMENT-BODY-OF-WATER-SELECTOR.md](./IMPLEMENTATION-ASSESSMENT-BODY-OF-WATER-SELECTOR.md)** — Implementation assessment for the body of water selector feature.
- **[ISSUE-8-RESPONSE-TEMPLATE.md](./ISSUE-8-RESPONSE-TEMPLATE.md)** — Response template for Issue #8 community feedback.

### Architecture Documents
System architecture, scaling strategy, and technical design specifications.

- **[architecture/NAVIGATION-SCALING-STRATEGY.md](./architecture/NAVIGATION-SCALING-STRATEGY.md)** — How navigation and UX patterns evolve across three scale tiers (Regional → Multi-State → National). Tied to the data intelligence moat and ROADMAP.md phases.

### Integration Trackers
- **[USACE-LAKE-LEVEL-INTEGRATION-TRACKER.md](./USACE-LAKE-LEVEL-INTEGRATION-TRACKER.md)** — Corps lake-level/release integration coverage, workflow implementation, and remaining endpoint discovery.

### Deployment
- **[DEPLOY-LIVE-SITE.md](./DEPLOY-LIVE-SITE.md)** — How to sync and deploy updates to the live GitHub Pages site.

---

## Document Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| Evaluations | `{TOPIC}-EVALUATION.md` | `NAVIGATION-UX-EVALUATION.md` |
| Scoping | `SCOPING-{FEATURE}.md` | `SCOPING-BODY-OF-WATER-SELECTOR.md` |
| Architecture | `architecture/{TOPIC}.md` | `architecture/NAVIGATION-SCALING-STRATEGY.md` |
| Trackers | `{FEATURE}-TRACKER.md` | `USACE-LAKE-LEVEL-INTEGRATION-TRACKER.md` |
| Issue Responses | `ISSUE-{N}-RESPONSE-TEMPLATE.md` | `ISSUE-8-RESPONSE-TEMPLATE.md` |

---

For general contribution guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).
For product roadmap, see [ROADMAP.md](../ROADMAP.md).
