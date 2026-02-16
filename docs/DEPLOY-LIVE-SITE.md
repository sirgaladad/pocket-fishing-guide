# Publishing to the Live Site

The **live site** is at **[sirgaladad.github.io/pocket-fishing-guide/](https://sirgaladad.github.io/pocket-fishing-guide/)**.

## ✅ **Your Current Setup: Direct Deployment**

**Good news:** this repository is configured for direct deployment.

- **This folder** (`~/dev/pocket-fishing-guide/`) is connected to `https://github.com/sirgaladad/pocket-fishing-guide.git`
- **Pushing to this repo automatically deploys to the live site** via GitHub Actions
- **No separate sync step needed** - you're working directly in the deployment source

---

## How to update the live site

### 1. Make your changes and commit

```bash
cd /Users/talewatersandtides/dev/pocket-fishing-guide
# Make your edits to index.html or other files
git add -A
git status   # review changes
git commit -m "Your descriptive commit message"
git push origin main
```

### 2. Wait for automatic deployment

- **GitHub Actions will automatically deploy** (takes 15-30 seconds)
- **GitHub Pages CDN propagation** takes 5-20 minutes (sometimes longer)
- Check deployment status: [github.com/sirgaladad/pocket-fishing-guide/actions](https://github.com/sirgaladad/pocket-fishing-guide/actions)

### 3. Verify your changes

```bash
# Check deployment completed successfully
gh run list --repo sirgaladad/pocket-fishing-guide --limit 1

# Force browser to fetch fresh content
# 1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
# 2. Or open in incognito/private browsing window
# 3. View source and check for your changes
```

**Pro tip:** If changes don't appear immediately, it's usually browser/CDN caching. Wait 10-20 minutes and hard-refresh.

---

## Troubleshooting

### Changes not showing on live site?

**Check these in order:**

1. **Verify git push succeeded**
   ```bash
   git status  # should show "up to date with 'origin/main'"
   git log origin/main -1  # check latest remote commit
   ```

2. **Check GitHub Actions deployment**
   ```bash
   gh run list --repo sirgaladad/pocket-fishing-guide --limit 3
   # Look for "Deploy static content to Pages" with "completed" and "success"
   ```

3. **Wait for CDN propagation**
   - GitHub Pages uses a CDN that caches content
   - Can take 5-20 minutes (sometimes up to an hour)
   - Check with direct curl: `curl -sS https://sirgaladad.github.io/pocket-fishing-guide/ | head -10`

4. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private browsing
   - Or view source directly in browser

---

## Summary

| Action | Result |
|--------|--------|
| Push to this repo (`pocket-fishing-guide`) | ✅ Automatically deploys to live site via GitHub Actions |
| Wait 5-20 minutes | ⏱️ GitHub Pages CDN propagates new content |
| Hard refresh browser | 🔄 Bypass browser cache to see latest content |

**You're all set!** Just commit, push, and wait for deployment + cache propagation.
