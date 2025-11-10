# Performance Exercise: Debugging and Fixing Performance Issues

This exercise helps you identify and fix common performance issues in Edge Delivery Services sites, focusing on Core Web Vitals: LCP, CLS, and INP.

## What are Core Web Vitals?

**LCP (Largest Contentful Paint):** Measures loading performance. Target: < 2.5s

**CLS (Cumulative Layout Shift):** Measures visual stability. Target: < 0.1

**INP (Interaction to Next Paint):** Measures interactivity. Target: < 200ms

## Getting Started

**Branch:** `performance`

**Prerequisites:**
1. Fork the repository: https://github.com/cloudadoption/eds-masterclass
2. Switch to the `performance` branch
3. Chrome DevTools (for performance analysis)
4. PageSpeed Insights access: https://pagespeed.web.dev/

**Test Page:** After forking and deploying, use your fork's URL:
`https://performance--YOUR_REPO--YOUR_ORG.aem.live/performance`

## Exercise Steps

### Step 1: Set Up Your Environment

**Note:** You should have already forked and cloned the repository earlier in the day. If not, do that now.

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/eds-masterclass.git
   cd eds-masterclass
   ```

2. **Switch to the performance branch:**
   ```bash
   git checkout performance
   ```

3. **Start the local dev server:**
   ```bash
   aem up
   ```

### Step 2: Create Performance Page in Document Authoring

1. **Open Document Authoring (DA)** in your browser
2. **Create a new page** at the `/performance` path
3. **Get the page content:**
   - Go to: https://main--eds-masterclass--cloudadoption.aem.page/performance
   - Use the "View Document Source" function of the Sidekick
   - Click the copy button
   - Paste into the DA page you just created
4. **Preview the page** to ensure it loads correctly

### Step 3: Measure Performance

1. **Run PageSpeed Insights check:**
   - Go to https://pagespeed.web.dev/
   - Test your fork's performance page: `https://performance--YOUR_REPO--YOUR_ORG.aem.live/performance`
   - Note the LCP, CLS, and INP scores

2. **Run Chrome DevTools Performance check:**
   - Open Chrome DevTools (F12)
   - Go to the Performance tab
   - Click Record, then reload the page
   - Stop recording and analyze:
     - Network waterfall (look for resources loaded before LCP)
     - Long tasks (potential INP issues)
     - Layout shifts (CLS issues)

### Step 4: Debug Performance Issues

**For LCP:**
- Collect network waterfall and look for things loaded before LCP that should be deferred to lazy phase
- Ensure LCP elements are in the first section or tweak load eager to load multiple sections

**For CLS:**
- Disable cache, throttle connection to slow 3G, and watch page load to identify causes
- Ensure elements that load late have appropriate space reserved (min height/width)
- Match fonts with fallbacks as close as possible: https://screenspan.net/fallback

**For INP:**
- Hardest to debug/fix - Often caused by third-party martech tags
- Chrome DevTools Performance tab can help identify long tasks
- **Note:** You can ignore INP for this exercise

### Step 5: Find and Fix Issues

Find and fix as many performance issues as you can. Look for:

- Resources loading too early (should be lazy)
- Missing image dimensions (causing layout shift)
- Font fallback mismatches
- Unoptimized images
- Scripts loading eagerly that should be delayed
- Missing placeholders for async content

