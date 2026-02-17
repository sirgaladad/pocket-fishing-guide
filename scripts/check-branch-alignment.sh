#!/bin/bash
# check-branch-alignment.sh
# Checks alignment between local and remote branches
# Usage: ./scripts/check-branch-alignment.sh [branch-name]
# If no branch name is provided, uses current branch

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get branch name from argument or use current branch
BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

echo -e "${BLUE}=== Git Branch Alignment Check ===${NC}"
echo -e "Repository: $(git remote get-url origin)"
echo -e "Branch: ${BRANCH}"
echo ""

# Check if fetch refspec is properly configured
FETCH_REFSPEC=$(git config --get remote.origin.fetch || echo "")
if [[ ! "$FETCH_REFSPEC" =~ ^\+refs/heads/\*:refs/remotes/origin/\*$ ]]; then
    echo -e "${YELLOW}WARNING: Fetch refspec is not configured for all branches${NC}"
    echo -e "Current refspec: ${FETCH_REFSPEC}"
    echo ""
    echo -e "${YELLOW}To track all remote branches, run:${NC}"
    echo -e "  git config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'"
    echo -e "  git fetch origin --prune"
    echo ""
fi

# Fetch latest remote refs
echo -e "${BLUE}Fetching remote refs...${NC}"
git fetch origin "${BRANCH}":"refs/remotes/origin/${BRANCH}" 2>&1 | sed 's/^/  /' || true
echo ""

# Check if local branch exists
if ! git rev-parse --verify "${BRANCH}" >/dev/null 2>&1; then
    echo -e "${YELLOW}WARNING: Local branch '${BRANCH}' not found${NC}"
    echo "You may need to check out this branch first."
    exit 1
fi

# Get local commit
LOCAL=$(git rev-parse "${BRANCH}" 2>/dev/null)

# Get remote commit - try to fetch it if not available
if ! REMOTE=$(git rev-parse "origin/${BRANCH}" 2>/dev/null); then
    # Try to fetch the branch and get the remote commit from FETCH_HEAD
    if git fetch origin "${BRANCH}" >/dev/null 2>&1; then
        REMOTE=$(git rev-parse FETCH_HEAD 2>/dev/null)
    else
        echo -e "${RED}ERROR: Unable to fetch remote branch 'origin/${BRANCH}'${NC}"
        echo "This branch may not exist on the remote repository."
        exit 1
    fi
fi

# Calculate ahead/behind counts
# Use FETCH_HEAD to compare with remote
COUNTS=$(git rev-list --left-right --count "${REMOTE}...${LOCAL}" 2>/dev/null || echo "0 0")
BEHIND=$(echo "$COUNTS" | awk '{print $1}')
AHEAD=$(echo "$COUNTS" | awk '{print $2}')

# Determine alignment status
echo -e "${BLUE}Alignment Status:${NC}"
echo ""

if [ "$LOCAL" = "$REMOTE" ]; then
    echo -e "${GREEN}✓ UP-TO-DATE${NC}"
    echo "  Local and remote branches are identical"
    echo "  Commits ahead:  0"
    echo "  Commits behind: 0"
    STATUS="up-to-date"
elif [ "$AHEAD" -gt 0 ] && [ "$BEHIND" -gt 0 ]; then
    echo -e "${YELLOW}⚠ DIVERGED${NC}"
    echo "  Local and remote branches have diverged"
    echo "  Commits ahead:  ${AHEAD}"
    echo "  Commits behind: ${BEHIND}"
    echo ""
    echo -e "${YELLOW}  Action needed: Merge or rebase to reconcile${NC}"
    STATUS="diverged"
elif [ "$AHEAD" -gt 0 ]; then
    echo -e "${BLUE}↑ AHEAD${NC}"
    echo "  Local branch is ahead of remote"
    echo "  Commits ahead:  ${AHEAD}"
    echo "  Commits behind: 0"
    echo ""
    echo -e "${BLUE}  You can push your changes: git push origin ${BRANCH}${NC}"
    STATUS="ahead"
elif [ "$BEHIND" -gt 0 ]; then
    echo -e "${YELLOW}↓ BEHIND${NC}"
    echo "  Local branch is behind remote"
    echo "  Commits ahead:  0"
    echo "  Commits behind: ${BEHIND}"
    echo ""
    echo -e "${YELLOW}  You should pull changes: git pull origin ${BRANCH}${NC}"
    STATUS="behind"
else
    echo -e "${GREEN}✓ UP-TO-DATE${NC}"
    echo "  Local and remote branches are identical"
    echo "  Commits ahead:  0"
    echo "  Commits behind: 0"
    STATUS="up-to-date"
fi

echo ""
echo -e "${BLUE}Branch Details:${NC}"
echo "  Local commit:  ${LOCAL:0:8}"
echo "  Remote commit: ${REMOTE:0:8}"

# Show recent commits if behind or diverged
if [ "$STATUS" = "behind" ] || [ "$STATUS" = "diverged" ]; then
    echo ""
    echo -e "${BLUE}Recent remote commits (from FETCH_HEAD):${NC}"
    git log --oneline --no-decorate -5 "${REMOTE}" 2>/dev/null | sed 's/^/  /' || true
fi

echo ""
echo -e "${BLUE}=== Check Complete ===${NC}"

# Exit with status code based on alignment
case "$STATUS" in
    "up-to-date")
        exit 0
        ;;
    "ahead")
        exit 0
        ;;
    "behind")
        exit 2
        ;;
    "diverged")
        exit 3
        ;;
esac
