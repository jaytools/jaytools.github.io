# 🧪 Image Testing & Performance Validation

## Pre-Implementation Checklist

Before adding images to live site:

### 1. File Validation
```bash
# Check file sizes (PowerShell)
Get-ChildItem -Path ".\personal\img\", ".\utility\img\", ".\health\img\", ".\converter\img\" -Recurse | Select-Object Name, @{Name="SizeKB";Expression={[math]::Round($_.Length/1KB,2)}}
```

Expected results:
- [ ] age-calculator.webp < 15KB
- [ ] dpi-checker.webp < 16KB
- [ ] marriage-age.webp < 16KB
- [ ] walking-calories.webp < 15KB
- [ ] steps-km.webp < 18KB
- [ ] body-frame.webp < 17KB

### 2. Image Format Check
- [ ] All files are .webp format
- [ ] PNG fallbacks exist (optional but recommended)
- [ ] No JPEG/JPG files (not ideal for illustrations)

### 3. Visual Quality Check
- [ ] Open each .webp in browser (Chrome/Edge)
- [ ] No visible compression artifacts
- [ ] Colors match design specs
- [ ] Elements are crisp and clear at 100% zoom

---

## Post-Implementation Testing

### Browser Compatibility Test

#### Chrome/Edge (WebP Native Support)
1. Open tool page
2. Right-click image → Inspect
3. Check Network tab → image should be .webp
4. Verify image displays correctly

#### Firefox (WebP Support)
1. Same steps as Chrome
2. Verify no console errors
3. Check image sharpness

#### Safari (WebP Support - newer versions)
1. Test on Safari 14+ (macOS) or Safari iOS 14+
2. If older Safari: should fallback to PNG
3. Check `<picture>` element fallback works

#### Test Matrix:
```
✅ Chrome 90+ (Desktop)
✅ Chrome 90+ (Mobile - Android)
✅ Firefox 85+
✅ Safari 14+ (macOS/iOS)
✅ Edge 90+
⚠️ Internet Explorer (not supported, use PNG fallback)
```

---

## Performance Testing

### Google PageSpeed Insights

**Before adding images (baseline):**
1. Go to https://pagespeed.web.dev/
2. Test each tool URL:
   - `https://www.taskproper.com/personal/age-difference-inline.html`
   - `https://www.taskproper.com/utility/dpi-checker.html`
   - `https://www.taskproper.com/personal/marriage-age-inline.html`
   - `https://www.taskproper.com/health/calories-walking.html`
   - `https://www.taskproper.com/converter/steps-to-km-inline.html`
   - `https://www.taskproper.com/health/body-frame-inline.html`
3. Record baseline scores:
   - Mobile Performance: ___
   - Desktop Performance: ___
   - LCP: ___
   - CLS: ___

**After adding images:**
1. Re-test same URLs
2. Compare scores:
   - Mobile should be ≥ baseline or ≥ 80
   - LCP should be < 2.5s
   - CLS should be < 0.1 (no layout shift from images)

### Target Metrics:
```
✅ Mobile Performance: ≥ 80
✅ Desktop Performance: ≥ 90
✅ LCP (Largest Contentful Paint): < 2.5s
✅ CLS (Cumulative Layout Shift): < 0.1
✅ FID (First Input Delay): < 100ms
```

---

## Core Web Vitals Validation

### LCP (Largest Contentful Paint) Test

**Check if image is LCP element:**
1. Open DevTools (F12)
2. Performance tab → Record page load
3. Look for "LCP" marker
4. Verify LCP element is not the hero image (ideally, heading or form should be LCP)

**If image is LCP:**
- Add `fetchpriority="high"` to `<img>` tag
- Ensure image is above-the-fold
- Add preload tag: `<link rel="preload" as="image" href="img/tool.webp">`

**Target:** LCP < 2.5s (green) ✅

---

### CLS (Cumulative Layout Shift) Test

**Prevent layout shift:**
1. Open DevTools → Performance
2. Record page load
3. Look for "Layout Shift" events
4. Check if image loading causes shift

**Prevention:**
```html
<!-- Always include width/height attributes -->
<img src="img/tool.webp" 
     width="200" 
     height="150"
     style="height: auto; max-width: 100%;">
```

**Target:** CLS < 0.1 (green) ✅

---

### FID (First Input Delay) Test

**Check interactivity:**
1. Open page on mobile device
2. Try clicking calculator buttons immediately
3. Measure delay between click and response

**Optimization:**
- Defer non-critical JavaScript
- Use `defer` or `async` on script tags
- Minimize main thread work

**Target:** FID < 100ms (green) ✅

---

## Mobile Testing Checklist

### Responsive Design Test

**Devices to test:**
- iPhone 12/13/14 (390x844)
- Samsung Galaxy S21 (360x800)
- iPad (768x1024)
- Desktop (1920x1080)

**Check for each:**
- [ ] Image displays correctly (not stretched/squished)
- [ ] Image doesn't overflow container
- [ ] Text remains readable
- [ ] Touch targets around image are ≥ 44px
- [ ] Page loads within 3 seconds on 3G

### Chrome DevTools Mobile Test
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Reload page
5. Check image rendering
6. Test with "Slow 3G" throttling

---

## SEO & Image Search Testing

### Google Image Search Visibility

**Immediate checks:**
- [ ] Alt text is present and descriptive
- [ ] Alt text includes main keyword (e.g., "calculator", "converter")
- [ ] Image filename is descriptive (e.g., `age-calculator.webp`, not `img1.webp`)
- [ ] Image is visible without JavaScript

**After 1-2 weeks (indexing time):**
1. Google Search: `site:taskproper.com age difference calculator`
2. Switch to "Images" tab
3. Check if your image appears
4. Click image → verify it links to correct tool

### Structured Data Test

**If using Schema.org markup:**
1. Go to https://search.google.com/test/rich-results
2. Enter tool URL
3. Verify "WebApplication" schema includes image
4. Check for errors/warnings

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Age Difference Calculator",
  "image": "https://www.taskproper.com/personal/img/age-calculator.webp",
  ...
}
```

---

## Accessibility Testing

### Screen Reader Test

**Windows (Narrator):**
1. Press Win+Ctrl+Enter (start Narrator)
2. Navigate to image
3. Verify alt text is read aloud correctly
4. Alt text should be: "Age difference calculator showing years between two dates"

**macOS (VoiceOver):**
1. Press Cmd+F5 (start VoiceOver)
2. Navigate to image with VO+arrows
3. Verify alt text is clear and descriptive

### Color Contrast Test

**For images with text:**
1. Use https://webaim.org/resources/contrastchecker/
2. Test text color vs. background color
3. Ensure ratio ≥ 4.5:1 (WCAG AA standard)

### Keyboard Navigation Test
- [ ] Tab key skips non-interactive images (correct)
- [ ] If image is clickable, Tab key reaches it
- [ ] Focus indicator is visible

---

## Load Time Analysis

### Network Waterfall Test

**Chrome DevTools:**
1. Open Network tab (F12)
2. Refresh page (Ctrl+R)
3. Check image load timing:
   - Should load after critical CSS/JS
   - Should NOT block page rendering
   - Should use HTTP/2 (single connection)

**Ideal waterfall:**
```
HTML → Critical CSS (inline) → Hero Image (webp) → Other resources
```

**Red flags:**
- ❌ Image loads before critical CSS
- ❌ Image takes > 1 second to load
- ❌ Multiple redirects for image
- ❌ No caching headers

### File Size Optimization

**If image > target size:**
1. Re-compress in Squoosh
2. Lower quality to 75-80%
3. Try AVIF format (even smaller than WebP)
4. Consider removing non-essential elements

---

## A/B Testing (Optional)

### CTR (Click-Through Rate) Comparison

**Test setup:**
1. Deploy images to 3 tools
2. Leave 3 tools without images (control group)
3. Track clicks for 2 weeks using Google Analytics

**Metrics to compare:**
- Average time on page (should increase)
- Bounce rate (should decrease)
- Click-through to related tools (should increase)
- Mobile vs. desktop engagement

**Tools:**
- Google Analytics 4 (event tracking)
- Hotjar (heatmaps to see image engagement)
- Google Search Console (CTR from search results)

---

## Final Validation Script

Run this after all images are deployed:

```powershell
# PowerShell script to validate image implementation
$tools = @(
    @{Name="Age Calculator"; Path="personal/age-difference-inline.html"; Image="personal/img/age-calculator.webp"},
    @{Name="DPI Checker"; Path="utility/dpi-checker.html"; Image="utility/img/dpi-checker.webp"},
    @{Name="Marriage Age"; Path="personal/marriage-age-inline.html"; Image="personal/img/marriage-age.webp"},
    @{Name="Walking Calories"; Path="health/calories-walking.html"; Image="health/img/walking-calories.webp"},
    @{Name="Steps to KM"; Path="converter/steps-to-km-inline.html"; Image="converter/img/steps-km.webp"},
    @{Name="Body Frame"; Path="health/body-frame-inline.html"; Image="health/img/body-frame.webp"}
)

foreach ($tool in $tools) {
    Write-Host "`nValidating: $($tool.Name)" -ForegroundColor Cyan
    
    # Check if HTML file exists
    if (Test-Path $tool.Path) {
        Write-Host "✅ HTML file exists" -ForegroundColor Green
        
        # Check if image reference exists in HTML
        $content = Get-Content $tool.Path -Raw
        if ($content -match $tool.Image) {
            Write-Host "✅ Image reference found in HTML" -ForegroundColor Green
        } else {
            Write-Host "❌ Image reference NOT found in HTML" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ HTML file not found" -ForegroundColor Red
    }
    
    # Check if image file exists
    if (Test-Path $tool.Image) {
        $size = (Get-Item $tool.Image).Length / 1KB
        Write-Host "✅ Image file exists ($([math]::Round($size,2)) KB)" -ForegroundColor Green
        
        if ($size -le 25) {
            Write-Host "✅ File size within target (<25KB)" -ForegroundColor Green
        } else {
            Write-Host "⚠️ File size exceeds target (>25KB)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Image file not found" -ForegroundColor Red
    }
}

Write-Host "`n=== Validation Complete ===" -ForegroundColor Cyan
```

---

## Success Criteria Summary

### ✅ All checks passed if:
1. **File Size:** All images < 20KB (WebP)
2. **Performance:** Mobile PageSpeed ≥ 80
3. **LCP:** < 2.5 seconds (green)
4. **CLS:** < 0.1 (no layout shift)
5. **Browser:** Works in Chrome, Firefox, Safari, Edge
6. **Mobile:** Displays correctly on 360px and 768px widths
7. **Accessibility:** Alt text present and descriptive
8. **SEO:** Images indexed in Google Image Search (after 2 weeks)

### 🎯 Performance Improvement Target:
- PageSpeed score: +5 to +15 points
- User engagement: +10-20% time on page
- CTR from search: +5-10% (with better thumbnails)
- Bounce rate: -5-10%

---

## 📊 Tracking Spreadsheet Template

| Tool Name | Image Added | File Size | Mobile Score | LCP | CLS | Image Indexed |
|-----------|-------------|-----------|--------------|-----|-----|---------------|
| Age Diff Calculator | ✅ 2025-10-17 | 14.2 KB | 85 | 2.1s | 0.08 | Pending |
| DPI Checker | ✅ 2025-10-17 | 15.8 KB | 82 | 2.3s | 0.05 | Pending |
| Marriage Age | ✅ 2025-10-17 | 15.1 KB | 87 | 1.9s | 0.06 | Pending |
| Walking Calories | ✅ 2025-10-17 | 14.5 KB | 84 | 2.2s | 0.07 | Pending |
| Steps to KM | ✅ 2025-10-17 | 17.3 KB | 81 | 2.4s | 0.09 | Pending |
| Body Frame | ✅ 2025-10-17 | 16.8 KB | 83 | 2.0s | 0.05 | Pending |

**Update this after each implementation phase!**

---

**Ready to test?** After you create and implement the first image, use this guide to validate it before moving to the next tool! 🧪
