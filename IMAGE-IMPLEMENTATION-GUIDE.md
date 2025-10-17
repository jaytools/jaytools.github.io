# 🖼️ Image Implementation Guide - Top 6 Tools

## Quick Reference: File Names & Locations

```
personal/img/age-calculator.webp         (190x140px, <15KB)
utility/img/dpi-checker.webp             (200x150px, <16KB)
personal/img/marriage-age.webp           (200x150px, <16KB)
health/img/walking-calories.webp         (200x160px, <15KB)
converter/img/steps-km.webp              (230x150px, <18KB)
health/img/body-frame.webp               (180x200px, <17KB)
```

---

## 📝 HTML Code Snippets (Copy-Paste Ready)

### 1. Age Difference Calculator
**File:** `personal/age-difference-inline.html`

**Insert after opening `<main>` or before calculator form:**

```html
<!-- Hero Image -->
<div class="tool-hero-image" style="text-align: center; margin: 20px auto 30px;">
  <picture>
    <source srcset="img/age-calculator.webp" type="image/webp">
    <img src="img/age-calculator.png" 
         alt="Age difference calculator showing years between two dates"
         width="190" 
         height="140"
         loading="eager"
         fetchpriority="high"
         style="max-width: 100%; height: auto; border-radius: 8px;">
  </picture>
  <p style="font-size: 14px; color: #666; margin-top: 10px;">Calculate Age Difference Instantly</p>
</div>
```

**CSS to add in `<style>` section:**
```css
.tool-hero-image {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.tool-hero-image img {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.tool-hero-image img:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .tool-hero-image {
    padding: 15px;
    margin-bottom: 20px;
  }
}
```

---

### 2. DPI Checker
**File:** `utility/dpi-checker.html`

**Insert at top of main content area:**

```html
<!-- Tool Visual -->
<div class="dpi-tool-header" style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;">
  <picture>
    <source srcset="img/dpi-checker.webp" type="image/webp">
    <img src="img/dpi-checker.png" 
         alt="DPI checker tool for screen resolution testing"
         width="200" 
         height="150"
         loading="eager"
         fetchpriority="high"
         style="border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.15);">
  </picture>
  <div style="max-width: 400px;">
    <h1 style="margin: 0 0 10px 0;">Check Your Screen DPI</h1>
    <p style="color: #555; margin: 0;">Instantly detect your screen's pixel density</p>
  </div>
</div>
```

**CSS:**
```css
.dpi-tool-header img {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dpi-tool-header img:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .dpi-tool-header {
    flex-direction: column;
    text-align: center;
  }
}
```

---

### 3. Marriage Age Calculator
**File:** `personal/marriage-age-inline.html`

**Insert as banner before calculator:**

```html
<!-- Full-width Banner -->
<div class="marriage-banner" style="background: linear-gradient(120deg, #ffd89b 0%, #19547b 100%); padding: 30px 20px; text-align: center; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 6px 18px rgba(0,0,0,0.12);">
  <picture>
    <source srcset="img/marriage-age.webp" type="image/webp">
    <img src="img/marriage-age.png" 
         alt="Marriage age calculator for planning wedding timeline"
         width="200" 
         height="150"
         loading="eager"
         fetchpriority="high"
         style="margin-bottom: 15px; border-radius: 8px; background: white; padding: 10px;">
  </picture>
  <h2 style="color: white; margin: 10px 0; font-size: 24px; text-shadow: 1px 1px 3px rgba(0,0,0,0.3);">Plan Your Wedding Timeline</h2>
  <p style="color: rgba(255,255,255,0.95); font-size: 16px;">Calculate ideal marriage age based on your birthdate</p>
</div>
```

---

### 4. Calories Burned Walking
**File:** `health/calories-walking.html`

**Insert centered above calculator inputs:**

```html
<!-- Fitness Visual -->
<div style="text-align: center; margin: 25px auto 35px; max-width: 600px;">
  <picture>
    <source srcset="img/walking-calories.webp" type="image/webp">
    <img src="img/walking-calories.png" 
         alt="Calories burned walking calculator for fitness tracking"
         width="200" 
         height="160"
         loading="eager"
         fetchpriority="high"
         class="fitness-illustration"
         style="border-radius: 10px; box-shadow: 0 4px 14px rgba(255,152,0,0.3);">
  </picture>
  <div style="margin-top: 15px; padding: 15px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">
    <p style="margin: 0; color: #e65100; font-weight: 500;">🔥 Track your walking workout calories!</p>
  </div>
</div>
```

**CSS:**
```css
.fitness-illustration {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 480px) {
  .fitness-illustration {
    max-width: 180px;
    height: auto;
  }
}
```

---

### 5. Steps to KM Converter
**File:** `converter/steps-to-km-inline.html`

**Insert as side-by-side layout:**

```html
<!-- Converter Visual Layout -->
<div class="converter-layout" style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; align-items: center; margin-bottom: 30px;">
  <picture>
    <source srcset="img/steps-km.webp" type="image/webp">
    <img src="img/steps-km.png" 
         alt="Steps to kilometers converter for walking distance calculation"
         width="230" 
         height="150"
         loading="eager"
         fetchpriority="high"
         style="width: 100%; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,188,212,0.25);">
  </picture>
  <div>
    <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #00796b;">Steps to KM Converter</h1>
    <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">Convert your daily steps into kilometers and track your walking distance accurately.</p>
  </div>
</div>
```

**Responsive CSS:**
```css
@media (max-width: 768px) {
  .converter-layout {
    grid-template-columns: 1fr !important;
    text-align: center;
  }
}
```

---

### 6. Body Frame Size Calculator
**File:** `health/body-frame-inline.html`

**Insert as sidebar layout (desktop) / top banner (mobile):**

```html
<!-- Body Frame Visual -->
<div class="body-frame-layout" style="display: flex; gap: 25px; margin-bottom: 30px;">
  <div style="flex: 2;">
    <h1 style="margin: 0 0 15px 0;">Body Frame Size Calculator</h1>
    <p style="color: #555; line-height: 1.7; margin-bottom: 20px;">
      Measure your wrist to determine your body frame category (small, medium, or large) 
      for accurate health metrics.
    </p>
    <!-- Calculator form starts here -->
  </div>
  <div style="flex: 1; text-align: center;">
    <picture>
      <source srcset="img/body-frame.webp" type="image/webp">
      <img src="img/body-frame.png" 
           alt="Body frame size calculator measuring wrist circumference"
           width="180" 
           height="200"
           loading="eager"
           fetchpriority="high"
           style="border-radius: 10px; box-shadow: 0 4px 12px rgba(156,39,176,0.2); position: sticky; top: 20px;">
    </picture>
  </div>
</div>
```

**Responsive CSS:**
```css
.body-frame-layout {
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .body-frame-layout {
    flex-direction: column-reverse;
  }
  
  .body-frame-layout > div:last-child {
    margin-bottom: 20px;
  }
  
  .body-frame-layout img {
    position: static !important;
    max-width: 200px;
  }
}
```

---

## 🔧 WebP Conversion Using Squoosh

1. Go to **https://squoosh.app/**
2. Upload your PNG image
3. **Settings:**
   - Format: WebP
   - Quality: 80-85%
   - Effort: 6 (high quality)
4. **Check size:** Should be < target KB from specs
5. Download and save to appropriate `img/` folder
6. Keep original PNG as fallback

---

## ⚡ Performance Optimization Checklist

After adding images:

### Critical CSS (Add to each tool's `<style>` section):
```css
/* Preload hero image */
.tool-hero-image img,
.converter-layout img,
.body-frame-layout img {
  content-visibility: auto;
}

/* Reduce layout shift */
img[width][height] {
  height: auto;
}

/* Lazy load optimization */
img[loading="lazy"] {
  min-height: 150px; /* Reserve space */
}
```

### HTML Head Tags (Add to each tool):
```html
<!-- Preload critical image -->
<link rel="preload" as="image" href="img/tool-name.webp" type="image/webp">

<!-- Preconnect to external resources -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

---

## 📊 Testing Checklist

- [ ] Image displays correctly on desktop (Chrome, Firefox, Safari)
- [ ] Image displays correctly on mobile (responsive)
- [ ] WebP format loads (check DevTools Network tab)
- [ ] PNG fallback works (test in old browsers)
- [ ] File size under target (check actual file size)
- [ ] Alt text descriptive and keyword-rich
- [ ] No layout shift (CLS) when image loads
- [ ] Image appears in Google Image Search (after indexing)
- [ ] PageSpeed score improved after adding image
- [ ] Hover effects work smoothly (CSS transitions)

---

## 🎯 Next Steps

1. **Create images using Canva/Figma** (follow design specs above)
2. **Convert to WebP** using Squoosh
3. **Save files** to appropriate folders:
   - `personal/img/age-calculator.webp`
   - `utility/img/dpi-checker.webp`
   - `personal/img/marriage-age.webp`
   - `health/img/walking-calories.webp`
   - `converter/img/steps-km.webp`
   - `health/img/body-frame.webp`
4. **Copy-paste HTML snippets** into respective tool files
5. **Test locally** in browser
6. **Commit to GitHub** and deploy
7. **Run PageSpeed Insights** to measure improvement

---

## 🆘 Need Help?

If you need assistance with:
- Creating specific images → Share the tool name
- Implementation issues → Share the HTML file
- Performance testing → Share PageSpeed results

Let me know which tool you want to implement first! 🚀
