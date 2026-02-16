# Push Instructions — Navigation UX Evaluation (Feb 14, 2026)

> **Delete this file after pushing.** It's a one-time instruction set.

## Context

The sandbox couldn't push due to `.git/index.lock` filesystem restrictions.
Two repos need updating — AiProjects (monorepo) and pocket-fishing-guide (standalone).

---

## Step 1: Push to `pocket-fishing-guide` (standalone repo)

```bash
cd ~/talewatersandtides/AiProjects/dev/projects/pocket-fishing-guide

# Remove stale lock if present
rm -f .git/index.lock

git add \
  docs/NAVIGATION-UX-EVALUATION.md \
  docs/architecture/NAVIGATION-SCALING-STRATEGY.md \
  docs/README.md \
  docs/DEPLOY-LIVE-SITE.md \
  .github/ISSUE_TEMPLATE/ux_evaluation.md \
  README.md

git commit -m "Add navigation UX evaluation, scaling strategy, and docs restructure

- docs/NAVIGATION-UX-EVALUATION.md: competitive analysis + HMW recommendations
- docs/architecture/NAVIGATION-SCALING-STRATEGY.md: 3-tier scaling tied to data intelligence moat
- .github/ISSUE_TEMPLATE/ux_evaluation.md: template for future UX evaluations
- docs/README.md: full doc index with naming conventions
- docs/DEPLOY-LIVE-SITE.md: deployment workflow reference

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

git push origin main
```

## Step 2: Push to `AiProjects` (monorepo)

```bash
cd ~/talewatersandtides/AiProjects

# Remove stale lock if present
rm -f .git/index.lock

git add \
  dev/projects/pocket-fishing-guide/docs/NAVIGATION-UX-EVALUATION.md \
  dev/projects/pocket-fishing-guide/docs/architecture/NAVIGATION-SCALING-STRATEGY.md \
  dev/projects/pocket-fishing-guide/docs/README.md \
  dev/projects/pocket-fishing-guide/docs/DEPLOY-LIVE-SITE.md \
  dev/projects/pocket-fishing-guide/docs/USACE-LAKE-LEVEL-INTEGRATION-TRACKER.md

git commit -m "Sync pocket-fishing-guide docs: nav evaluation, scaling strategy, doc index

- Navigation UX evaluation with competitive analysis
- Architecture scaling strategy (3 tiers: Regional → Multi-State → National)
- Updated docs/README.md with full index and naming conventions
- USACE lake level tracker and deployment docs

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

git push origin main
```

## Step 3: Cleanup

```bash
# Delete this instruction file
rm ~/talewatersandtides/AiProjects/dev/projects/pocket-fishing-guide/docs/PUSH-INSTRUCTIONS.md

# Delete the loose evaluation file from monorepo root (already copied into docs/)
rm ~/talewatersandtides/AiProjects/pocket-fishing-guide-nav-evaluation.md
```

---

## What Changed

| File | PFG Repo | AiProjects Repo | Type |
|---|---|---|---|
| `docs/NAVIGATION-UX-EVALUATION.md` | NEW | NEW | Evaluation |
| `docs/architecture/NAVIGATION-SCALING-STRATEGY.md` | NEW | NEW | Architecture |
| `docs/README.md` | MODIFIED | MODIFIED | Index |
| `docs/DEPLOY-LIVE-SITE.md` | NEW | NEW | Deployment |
| `.github/ISSUE_TEMPLATE/ux_evaluation.md` | NEW | N/A (PFG only) | Template |
| `README.md` | MODIFIED | N/A | Readme |
| `docs/USACE-LAKE-LEVEL-INTEGRATION-TRACKER.md` | already tracked | NEW | Tracker |

## Alignment Note

The `pocket-fishing-guide` directory exists in **both** repos:
- **`sirgaladad/pocket-fishing-guide.git`** — standalone, deploys to GitHub Pages
- **`sirgaladad/AiProjects.git`** — monorepo, shared AI workspace

AiProjects `.gitignore` correctly excludes `dev/projects/*/.git/` so there's no submodule conflict. But changes should be pushed to both repos to stay in sync. Consider automating this with a sync script in `_shared/scripts/`.
