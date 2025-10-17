# 🚀 Performance Optimization Plan - 6 Tools

**Generated:** October 17, 2025  
**Target:** Achieve Mobile Performance 90+, LCP < 2.5s, CLS < 0.1

---

## 📊 Current Performance Analysis

| Tool | Mobile Perf | FCP | LCP | CLS | Critical Issue |
|------|-------------|-----|-----|-----|----------------|
| Age Difference | 68 | 4.4s ❌ | 5.3s ❌ | 0 ✅ | **Render-blocking resources** |
| DPI Checker | 84 | 3.5s ❌ | 3.5s ❌ | 0.02 ✅ | **External CSS blocking** |
| Marriage Age | 91 | 2.6s ❌ | 2.6s ⚠️ | 0 ✅ | **Image preloading needed** |
| Calories Walking | 70 | 1.8s ❌ | 2.9s ❌ | **0.905 ❌** | **CRITICAL: CLS layout shift** |
| Steps to KM | 93 | 2.6s ❌ | 2.6s ⚠️ | 0.011 ✅ | **Font loading delay** |
| Body Frame | 92 | 2.6s ❌ | 2.6s ⚠️ | 0.072 ✅ | **CSS combination needed** |

---

## 🔴 CRITICAL FIXES (High Priority)

### 1. **Age Difference Calculator** (Performance: 68 → Target: 90+)
**Bottleneck:** FCP 4.4s, LCP 5.3s (Worst performer)

**Action Checklist:**
```html
✅ Add preload for hero image (age-cal.webp)
   <link rel="preload" as="image" href="img/age-cal.webp">

✅ Defer Font Awesome loading (non-critical)
   <link rel="preload" href="https://cdnjs.cloudflare.com/.../all.min.css" 
         as="style" onload="this.onload=null;this.rel='stylesheet'">

✅ Move Google Analytics to bottom (after </body>)
   - Remove async gtag.js from <head>
   - Load at end of <body> or use defer

✅ Inline critical CSS (first 300px viewport)
   - Extract above-fold styles from custom.css
   - Embed in <style> tag in <head>

✅ Add width/height to hero image (already has, verify)
   <img src="img/age-cal.webp" width="200" height="150" loading="eager">
```

**Expected Improvement:** 68 → 88 (Mobile Performance)

---

### 2. **Calories Burned Walking** (CLS: 0.905 → Target: < 0.1)
**Bottleneck:** 🚨 **MASSIVE layout shift** (CLS 0.905 - CRITICAL)

**Action Checklist:**
```html
🚨 Fix floating animation causing shift
   .walking-hero-container img {
     animation: float 3s ease-in-out infinite;
     /* Add: */ will-change: transform;
     /* Or remove animation for LCP image */
   }

🚨 Reserve space for CTA box below image
   .walking-cta-box {
     min-height: 60px; /* Prevent layout shift */
   }

✅ Add explicit dimensions to ALL images
   - Verify width/height attributes exist
   - Add CSS container constraints

✅ Defer preload CSS (causing render blocking)
   - Remove preload from Font Awesome
   - Load normally or defer non-critical CSS

✅ Fix async manifest loading issue
   - Remove dynamic manifest script
   - Add static <link rel="manifest">
```

**Expected Improvement:** CLS 0.905 → 0.05, Performance 70 → 85

---

### 3. **DPI Checker** (Performance: 84 → Target: 92+)
**Bottleneck:** FCP/LCP 3.5s (External resources blocking)

**Action Checklist:**
```html
✅ Preload hero image
   <link rel="preload" as="image" href="img/DPI.webp">

✅ Defer Google Fonts loading
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">

✅ Combine CSS files (custom.css + dpi-checker.css)
   - Inline critical styles in <head>
   - Load combined file with defer

✅ Minify external CSS/JS
   - Use minified version of custom.css
   - Compress dpi-checker.css

✅ Add resource hints for CDN
   <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
```

**Expected Improvement:** 84 → 93 (Mobile Performance)

---

## 🟡 MEDIUM PRIORITY FIXES

### 4. **Marriage Age Calculator** (Performance: 91 → Target: 95+)
**Bottleneck:** LCP 2.6s (Borderline, needs slight improvement)

**Action Checklist:**
```html
✅ Preload marriage-cal.webp
   <link rel="preload" as="image" href="img/marriage-cal.webp">

✅ Optimize gradient background (CPU-intensive)
   .marriage-banner {
     background: linear-gradient(120deg, #ffd89b 0%, #19547b 100%);
     /* Add: */ will-change: auto;
     /* Consider: Static gradient image fallback */
   }

✅ Defer JavaScript loading
   <script src="../js/script.js" defer></script>

✅ Compress hero image further
   - Current: 31KB (good)
   - Target: < 25KB if possible
```

**Expected Improvement:** 91 → 95 (Mobile Performance)

---

### 5. **Steps to KM Converter** (Performance: 93 → Target: 96+)
**Bottleneck:** FCP/LCP 2.6s (Font loading delay)

**Action Checklist:**
```html
✅ Preload hero image
   <link rel="preload" as="image" href="img/step-km.webp">

✅ Optimize font loading
   - Add font-display: swap to all fonts
   - Subset fonts to only required characters

✅ Inline gradient CSS
   .steps-hero-container {
     background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
     /* Add: */ contain: paint;
   }

✅ Remove unused CSS selectors
   - Audit custom.css for unused rules
```

**Expected Improvement:** 93 → 96 (Mobile Performance)

---

### 6. **Body Frame Size Calculator** (Performance: 92 → Target: 96+)
**Bottleneck:** LCP 2.6s (Resource optimization needed)

**Action Checklist:**
```html
✅ Preload portrait image
   <link rel="preload" as="image" href="img/body-frame.webp">

✅ Optimize sticky positioning
   .body-frame-hero-image img {
     position: sticky;
     top: 20px;
     /* Add: */ contain: layout style;
   }

✅ Defer non-critical scripts
   <script src="../js/script.js" defer></script>

✅ Reduce CSS specificity
   - Flatten nested selectors for faster parsing
```

**Expected Improvement:** 92 → 96 (Mobile Performance)

---

## 🌍 GLOBAL FIXES (Apply to ALL 6 Tools)

### A. **Image Optimization** (All Tools)
```html
<!-- 1. Add preload for hero images (in <head>) -->
<link rel="preload" as="image" href="img/[tool-image].webp">

<!-- 2. Verify all images have dimensions -->
<img src="img/example.webp" 
     width="200" 
     height="150" 
     loading="eager"  <!-- For LCP images -->
     alt="Descriptive text">

<!-- 3. Lazy load below-fold images -->
<img src="img/below-fold.webp" loading="lazy" alt="...">

<!-- 4. Image compression targets -->
- Hero images: < 20KB (already achieved ✅)
- Total page images: < 100KB
```

---

### B. **CSS Optimization** (All Tools)
```html
<!-- 1. Inline critical CSS (above-fold) -->
<head>
  <style>
    /* Critical CSS - First 300-400px of viewport */
    body { margin: 0; font-family: system-ui; }
    .site-header { background: #fff; padding: 1rem; }
    .tool-container { max-width: 1200px; margin: 0 auto; }
    /* ... add tool-specific critical styles ... */
  </style>
</head>

<!-- 2. Defer non-critical CSS -->
<link rel="preload" href="../css/custom.css" as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="../css/custom.css"></noscript>

<!-- 3. Optimize Font Awesome loading -->
<link rel="preload" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="..."></noscript>
```

---

### C. **JavaScript Optimization** (All Tools)
```html
<!-- 1. Defer main scripts -->
<script src="../js/script.js" defer></script>

<!-- 2. Move analytics to end of <body> -->
<!-- BEFORE: In <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=..."></script>

<!-- AFTER: Before </body> -->
<script defer src="https://www.googletagmanager.com/gtag/js?id=..."></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-CGPGZR9Y07');
</script>

<!-- 3. Defer Google Tag Manager -->
<script defer>(function(w,d,s,l,i){...GTM code...})(window,document,'script','dataLayer','GTM-5SJZF69M');</script>
```

---

### D. **Font Optimization** (All Tools)
```html
<!-- 1. Add preconnect hints -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 2. Add font-display: swap -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap" rel="stylesheet">

<!-- 3. Defer font loading (non-critical) -->
<link rel="preload" 
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
```

---

### E. **Resource Hints** (All Tools)
```html
<head>
  <!-- DNS Prefetch -->
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  
  <!-- Preconnect (for critical resources) -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload (for LCP images) -->
  <link rel="preload" as="image" href="img/hero-image.webp">
</head>
```

---

### F. **HTML Structure** (All Tools)
```html
<!-- 1. Add Cache-Control meta (optional) -->
<meta http-equiv="Cache-Control" content="public, max-age=31536000">

<!-- 2. Optimize meta tags order -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>...</title>
  <meta name="description" content="...">
  
  <!-- Critical Resources First -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preload" as="image" href="img/hero.webp">
  
  <!-- Then Meta Tags -->
  <meta property="og:title" content="...">
  <!-- ... rest of meta tags ... -->
  
  <!-- Defer Analytics to Bottom -->
</head>
```

---

## 📋 Implementation Priority Order

### **Phase 1: Critical Fixes (Week 1)**
1. ✅ **Calories Walking** - Fix CLS 0.905 (Remove/optimize float animation)
2. ✅ **Age Difference** - Add image preload + defer analytics
3. ✅ **DPI Checker** - Defer fonts + combine CSS

### **Phase 2: Performance Boosts (Week 2)**
4. ✅ **Marriage Age** - Preload image + compress further
5. ✅ **Steps to KM** - Font optimization + inline gradient CSS
6. ✅ **Body Frame** - Preload image + optimize sticky positioning

### **Phase 3: Global Optimizations (Week 3)**
7. ✅ Extract critical CSS for all tools (inline in <head>)
8. ✅ Defer all JavaScript (add defer attribute)
9. ✅ Move analytics to bottom of all pages
10. ✅ Add resource hints (dns-prefetch, preconnect)

---

## 🎯 Expected Final Scores

| Tool | Current Mobile | Target Mobile | Current LCP | Target LCP |
|------|----------------|---------------|-------------|------------|
| Age Difference | 68 | **88-92** | 5.3s | **2.5s** |
| DPI Checker | 84 | **92-95** | 3.5s | **2.2s** |
| Marriage Age | 91 | **95-97** | 2.6s | **2.0s** |
| Calories Walking | 70 | **85-90** | 2.9s | **2.3s** |
| Steps to KM | 93 | **96-98** | 2.6s | **2.0s** |
| Body Frame | 92 | **96-98** | 2.6s | **2.0s** |

---

## 🔧 Quick Commands (For Implementation)

### 1. Extract Critical CSS
```bash
# Install critical CSS tool
npm install -g critical

# Generate critical CSS for each tool
critical personal/age-difference-inline.html --base c:\projects\task-proper --inline > critical-age.css
```

### 2. Minify CSS/JS
```bash
# Minify CSS
npx clean-css-cli -o css/custom.min.css css/custom.css

# Minify JS
npx terser js/script.js -o js/script.min.js -c -m
```

### 3. Test Performance After Changes
```bash
# Use Lighthouse CLI
npx lighthouse https://taskproper.com/personal/age-difference-inline.html --view
```

---

## 📝 Notes

- **WebP images are already optimized** (all < 50KB) ✅
- **Width/height attributes exist on images** ✅
- **Main issue:** Render-blocking external resources (CSS/JS/Fonts)
- **Priority fix:** CLS layout shift in Calories Walking (0.905)
- **Low-hanging fruit:** Add defer to all scripts, preload LCP images

---

**Next Steps:**
1. Start with **Calories Walking CLS fix** (biggest impact)
2. Add **image preloads** to all 6 tools (quick win)
3. **Defer analytics** scripts (move to bottom)
4. Extract and **inline critical CSS**
5. Retest and iterate

