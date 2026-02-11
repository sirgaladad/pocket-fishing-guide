# Contributing to Tale Waters & Tides

Welcome to the Pocket Fishing Guide for Arkansas waters! We're glad you're here.

This is a **community-driven project**, and we believe that local knowledge is just as valuable as code. Whether you're an angler with decades of experience on your home lake or a developer who loves open source, there's a place for you here.

---

## How You Can Help

### 1. Share Your Local Intel

Know a hidden gem fishing spot? Found an amazing tackle shop? Have tips that work year-round on your favorite lake? **That's exactly what we need.**

**How to submit:**
- Open a [GitHub Issue](../../issues) with the label `Local Intel`
- Include as much detail as you can: location, what fish you catch, best seasons, access tips, or shop recommendations
- No need for technical knowledge—just share what you know

**For tackle shop recommendations:**
- Shop name and address
- What they specialize in (live bait, fly gear, catfish supplies, etc.)
- Why you recommend them (friendly staff, best selection, fair prices, etc.)
- Any special services (guide referrals, repair work, etc.)

### 2. Contribute Code

Love the idea of building a lightweight, no-build-step fishing app? Let's collaborate.

**Getting started:**
1. Fork this repository
2. The entire app lives in a single `index.html` file—this is intentional (see our philosophy below)
3. Open `index.html` in your browser to test your changes locally
4. Make your edits using React functional components with hooks
5. Push to your fork and submit a pull request with a clear description of what you changed and why

**Code style notes:**
- All code is in one `index.html` file (React 18 + Babel standalone via CDN—no build step needed)
- Write React functional components with hooks
- Use CSS custom properties (variables) for theming
- Follow mobile-first design principles (480px max-width breakpoint)
- Dependencies: React, Babel, and Google Fonts only—everything else is vanilla CSS and JavaScript

**Testing:**
- Open the file in your browser (Chrome, Firefox, Safari, Edge all work)
- Test on mobile devices or use your browser's device emulation
- Check that USGS/NWS API calls work as expected

### 3. Report Bugs

Found something broken? Help us fix it.

**How to report:**
- Open a [GitHub Issue](../../issues) with the label `Bug`
- Describe what went wrong, what you expected to happen, and how to reproduce it
- Include your browser and device info if relevant
- Screenshots are helpful!

### 4. Request Features

Have an idea for a new feature? We'd love to hear it.

**How to suggest:**
- Open a [GitHub Issue](../../issues) with the label `Feature Request`
- Explain the problem it solves or the need it fills
- Share your use case (e.g., "I wish I could track water temperature changes for my favorite lake")
- Keep in mind our philosophy (see below)—we prioritize depth over breadth

---

## Our Philosophy

**Pocket means local.** We'd rather have 10 deeply useful features for one lake than 100 shallow features across many lakes.

This app is designed to help anglers get to know *their* waters better—not to be a comprehensive guide to every fishery in the world. Every feature should make you a better angler on *your* home waters, whether that's a small creek or a sprawling reservoir.

---

## Code of Conduct

- **Be kind.** We're all here because we love fishing and want to build something useful together.
- **Fish responsibly.** This app should help people catch more fish *and* be better stewards of our waters.
- **Respect the waters.** Leave no trace, follow local regulations, and help protect the fisheries you love.

---

## Questions?

Open an issue or start a discussion. We're friendly, and no question is too basic. This is a community project—by anglers, for anglers.

**Tight lines!**

