# Task Proper - Copilot Instructions

## Project Overview
Task Proper is a static website offering 20+ free online calculators and utilities organized in categories (calculator, converter, health, personal, study, planner, finance, utility, game). Built with vanilla HTML/CSS/JS for maximum performance and SEO.

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

### Tool Development Pattern
Each tool follows a self-contained inline architecture:

1. **HTML Structure**: Complete HTML documents with comprehensive SEO meta tags, Schema.org JSON-LD, and inline styles for critical rendering path
2. **CSS Variables**: Use CSS custom properties in `:root` for consistent theming (see `health/css/calorie-deficit.css` pattern)
3. **JavaScript**: DOM-first approach with initialization functions and constants at top (see `health/js/calorie-deficit.js`)

### Core JavaScript Architecture
Main functionality in `js/script.js` uses a tools array pattern:
- Tools defined as objects with `name`, `url`, and `tags[]` 
- Favorites stored in localStorage as JSON array
- Search/filter implemented client-side using array methods
- Pagination with `ITEMS_PER_PAGE = 6` constant

### CSS Organization
- `css/custom.css` - Main stylesheet with mobile-first responsive design
- Category-specific CSS files use CSS custom properties for consistency
- Icon system via `css/icon-svg.css` for SVG replacements
- Favorites functionality in `css/favorite-star.css`

## Development Workflows

### Adding New Tools
1. Create tool file in appropriate category folder with `-inline.html` suffix for simple tools
2. Add entry to tools array in `js/script.js` with appropriate tags
3. Create category-specific CSS/JS files if needed
4. Update category landing page (e.g., `health.html`)

### SEO Requirements
All tool pages must include:
- Comprehensive meta descriptions with primary keywords
- Schema.org JSON-LD markup for `WebApplication` type
- Open Graph and Twitter Card meta tags
- Canonical URLs following `https://www.taskproper.com/category/tool-name.html` pattern

### Performance Optimization
- Critical CSS inlined in `<style>` blocks for above-the-fold content
- Font Awesome loaded via CDN with preconnect
- Images use appropriate formats with defined dimensions
- Local storage used for favorites to reduce server requests

### Mobile-First Responsive Design
- Breakpoints: 480px (mobile), 768px (tablet), 1024px+ (desktop)
- Sidebar navigation with overlay for mobile
- Touch-optimized button sizes (min 44px)
- Search toggle pattern for mobile vs desktop search bars

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
- Tools focus on student, professional, and everyday use cases
- Privacy-focused (client-side calculations, no data transmission)
- All tools are free without sign-ups or registrations

### Error Handling
- Form validation with real-time feedback
- Graceful degradation for JavaScript-disabled browsers
- Console logging for debugging in development

When implementing new features, maintain the inline tool pattern, follow the established CSS custom property system, and ensure mobile-first responsive design principles are applied.