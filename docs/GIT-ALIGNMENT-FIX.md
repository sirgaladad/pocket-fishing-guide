# Git Remote and Local Alignment Fix

## Issue Description
The repository had a misalignment between local and remote Git configuration, causing limited branch visibility and shallow history.

## Problems Identified

### 1. Limited Fetch Refspec
**Problem:** The Git configuration had a restricted fetch refspec that only fetched the current working branch.

**Original Configuration:**
```
fetch = +refs/heads/copilot/fix-git-remote-local-misalignment:refs/remotes/origin/copilot/fix-git-remote-local-misalignment
```

This meant that only the current branch was being tracked, and other remote branches were not visible locally.

### 2. Shallow Repository
**Problem:** The repository was a shallow clone with only 2 commits, indicated by the presence of a `.git/shallow` file and the "grafted" notation in git log output.

This limited the ability to:
- View complete history
- Perform certain git operations (rebasing, bisecting, etc.)
- Understand the full context of changes

## Solutions Applied

### 1. Fixed Fetch Refspec
Updated the Git configuration to use the standard fetch refspec that fetches all remote branches:

```bash
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
```

**Result:** All remote branches are now tracked and visible locally:
- `origin/main`
- `origin/claude/add-lake-levels-feature`
- `origin/codex/add-visual-dashboard-for-streams`
- `origin/copilot/fix-conway-location-crash`
- `origin/copilot/fix-git-remote-local-misalignment`
- `origin/sirgaladad-feedbackupdate-1`
- `origin/sirgaladad-patch-1`

### 2. Unshallowed Repository
Executed `git fetch --unshallow` to retrieve the complete repository history.

**Result:**
- Repository now has full history (83 commits instead of 2)
- `.git/shallow` file removed
- `git rev-parse --is-shallow-repository` now returns `false`
- Full commit graph is now visible

## Verification

### Remote Configuration
```bash
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/sirgaladad/pocket-fishing-guide
  Push  URL: https://github.com/sirgaladad/pocket-fishing-guide
  HEAD branch: main
  Remote branches:
    claude/add-lake-levels-feature            tracked
    codex/add-visual-dashboard-for-streams    tracked
    copilot/fix-conway-location-crash         tracked
    copilot/fix-git-remote-local-misalignment tracked
    main                                      tracked
    sirgaladad-feedbackupdate-1               tracked
    sirgaladad-patch-1                        tracked
```

### Repository Status
```bash
$ git rev-parse --is-shallow-repository
false

$ git log --oneline --all | wc -l
83
```

## Benefits

1. **Full Branch Visibility:** All remote branches are now tracked and visible locally
2. **Complete History:** Full commit history is available for analysis and operations
3. **Standard Git Operations:** All Git operations (rebase, bisect, etc.) now work properly
4. **Better Collaboration:** Team members can see and work with all branches
5. **Improved CI/CD:** Workflows that depend on full history will now function correctly

## Technical Details

- **Configuration File:** `.git/config`
- **Changed Setting:** `remote.origin.fetch`
- **Commands Executed:**
  1. `git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"`
  2. `git fetch origin --prune`
  3. `git fetch --unshallow`

## Date
2026-02-15
