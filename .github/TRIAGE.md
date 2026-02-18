# Triage Pipeline — Green Team / Red Team SOP

> **Pocket Fishing Guide** · AI-Assisted Human-in-the-Loop Workflow
> Last updated: 2026-02-18

---

## Overview

All end-user feedback, bug reports, feature requests, and enhancements enter a structured triage pipeline before reaching the product backlog. This prevents noise from bypassing quality gates and ensures every work item is properly scoped, categorized, and prioritized before a human decision is required.

### Pipeline Flow

```
User Submits Feedback (in-app widget)
         |
   [Status: Triage]
   Label: user-feedback, green-team
         |
   GREEN TEAM - AI Intake & Scoping
   (Claude: review, scope, rewrite, categorize)
         |
   [Status: Human Review]
   Label: red-team
         |
   RED TEAM - Human Review Gate
   (sirgaladad: approve, reject, or provide feedback)
         |
   [Status: Backlog] <- Approved
   Label: epic / bug / enhancement / ux
         |
   Priority & Impact Evaluation
         |
   [Status: Ready to Build]
         |
   AI Agent Assignment -> In Progress -> Done
```

---

## Stage 1: Intake

**Trigger:** User submits feedback via the in-app widget at sirgaladad.github.io/pocket-fishing-guide

**Current State (Known Bug #40):** The widget redirects to GitHub new issue page with pre-filled content, but requires the user to manually click Create. This means anonymous users cannot submit (requires GitHub login), the issue lands directly in Backlog bypassing Triage, and no AI review happens before the item reaches the board.

**Target State:** All feedback submissions auto-create an issue with Status: Triage and labels user-feedback + green-team, then trigger AI review without the user needing a GitHub account.

---

## Stage 2: Green Team - AI Intake and Scoping

**Label:** green-team
**Status:** Triage
**AI Agent:** Claude (primary), Codex (secondary for tech-heavy bugs)

### Green Team Checklist

When a new issue lands in Triage, the AI agent should:

- Classify the issue type: Bug / Feature Request / Enhancement / Fishing Tip / Question
- Rewrite the title to follow the convention: [Type] Short descriptive title
- Add missing context from the submission (water body, species, screen, action, result)
- Apply appropriate labels from the label set
- Estimate impact (High / Medium / Low) based on user journey disruption, frequency, alignment with current phase
- Estimate effort (S / M / L / XL) based on scope
- Link to parent Epic if the issue falls under an active epic
- Set Phase field to the appropriate ROADMAP phase
- Set AI Agent field to Claude, Codex, or Copilot based on work type
- Add a scoping comment on the issue summarizing findings and recommending action
- Change Status to Human Review and swap label to red-team

### AI Agent Assignment Guide

| Task Type | Assigned Agent |
|---|---|
| Release notes, versioning, changelog | Copilot |
| Design decisions, scoping, specs, UX write-ups | Claude |
| Code implementation, bug fixes, PR-level work | Codex |
| Strategic decisions, approval gates | Human |

---

## Stage 3: Red Team - Human Review Gate

**Label:** red-team
**Status:** Human Review
**Responsible:** @sirgaladad
**Notification:** GitHub notification (auto via watch)

### Red Team Checklist

When an issue moves to Human Review, you should:

- Read the AI scoping comment
- Verify the title and labels are accurate
- Agree or disagree with the impact/effort estimate
- Check if this duplicates an existing open issue
- Decide: Approve to Backlog, Reject to Close as not planned, or Needs more info - Comment and leave in Human Review
- If approved: set Milestone (if applicable), confirm AI Agent assignment

### Decision Outcomes

| Decision | Action |
|---|---|
| Approved | Change Status to Backlog, remove red-team label |
| Rejected | Close as not planned, add brief reason comment |
| Needs info | Leave in Human Review, add comment with specific question |
| Duplicate | Close as duplicate, link to existing issue |

---

## Stage 4: Priority and Impact Evaluation

Once in Backlog, issues are evaluated for scheduling based on:

| Factor | Weight |
|---|---|
| User journey impact | High |
| Alignment with active Phase | High |
| Effort estimate | Medium |
| Frequency of report | Medium |
| Strategic value (roadmap fit) | Medium |
| Nice-to-have / low urgency | Low |

Priority Labels: P0 (Critical/blocking), P1 (High priority, next sprint), P2 (Medium priority, current milestone), P3 (Low priority, future consideration)

---

## Stage 5: Scheduling and Execution

1. Items move from Backlog to Ready to Build when sprint-prioritized
2. The assigned AI Agent picks up the item when work begins (In Progress)
3. Human reviews the PR/output before merge
4. On merge: item moves to Done, Copilot manages release notes

---

## Labels Reference

| Label | Meaning |
|---|---|
| user-feedback | Originated from end-user in-app submission |
| green-team | AI is working on this item |
| red-team | Human review required |
| epic | Parent issue grouping sub-tasks |
| bug | Something is not working |
| enhancement | Improvement to existing feature |
| ux | User experience focused |
| onboarding | New user experience |
| v0.4-nav | v0.4 navigation sprint |

---

## Known Gaps and Future Improvements

1. Feedback form bypass - Issue #40: The in-app widget redirects to GitHub instead of auto-creating an issue. Fix: use a GitHub Action or API-based submission to auto-create issues and route them to Triage.
2. No anonymous feedback - Current flow requires a GitHub account. Fix: proxy submission endpoint to accept anonymous feedback and create issues on behalf of the app.
3. No AI trigger automation - Currently Claude/Codex must be manually assigned. Fix: GitHub Action on labeled:user-feedback to auto-trigger an AI agent review.
4. Status ordering - Triage and Human Review should appear before Backlog in the board column order for visual clarity.
