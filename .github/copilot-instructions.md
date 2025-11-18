# Task Proper - Copilot Instructions

## Project Overview
Task Proper is a high-performance, fully static website offering a growing suite of 25+ free tools (calculators, converters, planners, utilities, health tools, study aids, finance tools, mini-games, etc.).
The platform uses pure HTML, CSS, and JavaScript to maximize performance, SEO, privacy, and reliability.
No frameworks or backend dependencies are required.

## Architecture Patterns

### File Structure Convention
```
category.html                    # Category landing page
category/
├── tool-name-inline.html       # Self-contained tools with "-inline" suffix
├── tool-name.html              # Complex tools without inline suffix
├── css/tool-name.css           # Tool-specific styles
└── js/tool-name.js             # Tool-specific JavaScript
```

### Tool Development Standards
## Inline Tool Structure
Every tool follows a “self-contained inline architecture”:
1. **HTML Structure**: Complete HTML documents with comprehensive SEO meta tags, Schema.org JSON-LD, and inline styles for critical - rendering path
- Full document (<!DOCTYPE html>)
- Rich meta tags
- Schema.org JSON-LD
- Canonical URL pattern
- Inline <style> for critical path CSS

2. **CSS Variables**: Use CSS custom properties in `:root` for consistent theming (see `health/css/calorie-deficit.css` pattern)
- Use :root variables for theme consistency
- Follow BEM-like naming structure
- Keep animations minimal for performance

3. **JavaScript**: DOM-first approach with initialization functions and constants at top (see `health/js/calorie-deficit.js`)
- DOM-first coding style
- Constants and selectors at the top
- Use pure functions and event bindings at bottom
- No dependencies (vanilla JS only)

### Core JavaScript Architecture
## Tools Array
All tools are defined as objects:
{
  name: "Age Difference Calculator",
  url: "calculator/age-difference-inline.html",
  tags: ["calculator", "age"]
}

## Favorites System
- Stored in localStorage (favorites key)
- Sorted to appear first in tool grids
- Toggle function: toggleFavorite(url)

## Search System
Two separate UX flows:
| Device      | Behavior                                 |
| ----------- | ---------------------------------------- |
| **Desktop** | Inline results (`renderSearchResults()`) |
| **Mobile**  | Full-screen search overlay               |

Both rely on:
tools.filter(tool => tool.name.toLowerCase().includes(query))

## Pagination
- Constant: ITEMS_PER_PAGE = 6
- Re-renders on search, tag filter, or page change

### CSS Architecture

## Global Styles (custom.css)
- Mobile-first responsive design
- Fluid layout from 360px → 1440px
- Unified spacing system
- Reusable utility classes
- Optimized for Lighthouse 100/100 SEO + performance

## Tool-Level CSS
- Uses CSS variables from :root
- Local overrides allowed
- Structured as:
  Layout
  Form styling
  Result styling 
  Media queries

## SVG Icons
- SVG sprite sheet replacement system
- Zero external icon loads needed

## Development Workflows

### Adding New Tools
1. Create tool file in appropriate category folder with `-inline.html` suffix for simple tools
2. Add entry to tools array in `js/script.js` with appropriate tags
3. Create category-specific CSS/JS files if needed
4. Update category landing page (e.g., `health.html`)
or
1. Create HTML file in correct category (-inline.html if simple)
2. Add CSS / JS file if needed
3. Register tool in js/script.js
4. Update category page with new card
5. Test on:
  Mobile (≤480px)
  Tablet (768px)
  Desktop (1024px+)
6. Validate SEO with Lighthouse

### SEO Requirements (Mandatory)
Each tool must include:

## Meta Tags
- Unique meta description
- Title with main keyword
- Canonical URL
- Open Graph (og:title, og:description, og:url)
- Twitter Card tags

## Schema.org
Always use:
{
  "@type": "WebApplication",
  "applicationCategory": "Utility",
  "operatingSystem": "Web Browser",
  "url": "https://www.taskproper.com/category/tool.html"
}

## Performance
- Inline critical CSS
- Load Font Awesome using preconnect
- Avoid Google Fonts blocking (use system fonts if possible)

### Performance Optimization
- Critical CSS inlined in `<style>` blocks for above-the-fold content
- Font Awesome loaded via CDN with preconnect
- Images use appropriate formats with defined dimensions
- Local storage used for favorites to reduce server requests

### Mobile UX Guidelines
- Touch-friendly elements (44px minimum height)
- Sticky header on tools
- Mobile-first search toggle
- Horizontal scrolling tag bar
- No hover-only interactions

## Critical Integration Points

### Search Functionality
Two search implementations:
- Desktop: Inline results via `renderSearchResults()`
- Mobile: Full-screen overlay in `mobile-search-container`
- Both filter tools array client-side and highlight matching terms

### Favorites System
- Stored as JSON array in localStorage with key "favorites"
- Star icons toggle via `toggleFavorite()` function
- Favorites rendered first in tool grids via array sorting

### Category Navigation
- Tags system with horizontal scrolling on mobile
- Active state management for tag buttons
- Filter tools by category using `tags.includes()` pattern

## Project-Specific Conventions

### Naming Patterns
- File names use kebab-case with `-inline` suffix for simple tools
- CSS classes follow BEM-like methodology 
- JavaScript uses camelCase with DOM prefix for element collections

### Content Strategy
- Tools designed for students, professionals, fitness, finance & utilities
- Fully client-side → zero data tracking
- Short explanations included in every tool
- No login required ever
- Ultra-fast load (<1s on 4G)

### Error Handling & UX Rules
- Real-time form validation
- Prevent blank inputs
- Show user-friendly messages, not alerts
- All tools must work with JS disabled (basic fallback)
- No external API calls (privacy-first)

### ding Conventions

1. HTML
- Kebab-case filenames
- Full document per tool
- Use semantic tags (main, section, label)

2. CSS
- BEM-like naming
- Prefer CSS variables
- Avoid unnecessary transitions

3. JavaScript
- camelCase
- No global variable pollution
- Use const/let
- Keep functions pure and reusable

When implementing new features, maintain the inline tool pattern, follow the established CSS custom property system, and ensure mobile-first responsive design principles are applied.