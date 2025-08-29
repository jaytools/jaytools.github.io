// Combined JavaScript for TaskProper.com - Optimized single file
// Combines icon-replacement.js, favorite-star.js, and script.js

// Icon Replacement Functionality
const svgIcons = {
    times: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 352 512\" width=\"1em\" height=\"1em\"><path d=\"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z\"/></svg>",
    star: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\" width=\"1em\" height=\"1em\"><path d=\"M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12.1 3.4 24.6 13.9 30.4s23.5 5.7 33.8-2.3L288.1 439.5l123.3 74.1c10.3 8 23.5 8.6 33.8 2.3s15.9-18.3 13.9-30.4L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z\"/></svg>",
    home: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\" width=\"1em\" height=\"1em\"><path d=\"M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z\"/></svg>",
    "chevron-left": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\" width=\"1em\" height=\"1em\"><path d=\"M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z\"/></svg>",
    "chevron-right": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 320 512\" width=\"1em\" height=\"1em\"><path d=\"M285.48 272.97L91.13 467.31c-9.37 9.37-24.57 9.37-33.94 0l-22.67-22.67c-9.36-9.36-9.37-24.52-.04-33.9L188.51 256 34.49 101.25c-9.34-9.38-9.32-24.54.04-33.9l22.67-22.67c9.37-9.37 24.57-9.37 33.94 0L285.48 239.03c9.37 9.37 9.37 24.57 0 33.94z\"/></svg>"
};

// Add icon styles
const style = document.createElement('style');
style.textContent = `
  .svg-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 1em;
    width: 1em;
  }
  
  .svg-icon svg {
    height: 1em;
    width: 1em;
    fill: currentColor;
  }
`;
document.head.appendChild(style);

// Tools data and main functionality
const ITEMS_PER_PAGE = 6;
const tools = [
    {name: "CGPA to Percentage Calculator", url: "calculator/cgpa-percentage-inline.html", tags: ["calculator", "study"]},
    {name: "IVF Due Date Calculator", url: "health/ivf-calculator.html", tags: ["health", "personal"]},
    {name: "Pregnancy Weight Gain Calculator", url: "health/pregnancy-weight.html", tags: ["calculator", "health"]},
    {name: "Steps to KM Converter", url: "converter/steps-to-km-inline.html", tags: ["converter", "health"]},
    {name: "Typing Speed Test Paragraph", url: "study/typing-speed.html", tags: ["study", "utility"]},
    {name: "Calories Burned Walking", url: "health/calories-walking.html", tags: ["calculator", "health"]},
    {name: "Height Conversion Tool", url: "converter/height-converter-inline.html", tags: ["converter", "health"]},
    {name: "Calorie Deficit Finder", url: "health/calorie-deficit.html", tags: ["health", "calculator"]},
    {name: "Body Frame Size Calculator", url: "health/body-frame-inline.html", tags: ["calculator", "health"]},
    {name: "Exam Marks Percentage Calculator", url: "calculator/exam-percentage-inline.html", tags: ["calculator", "study"]},
    {name: "Debt to Income Ratio Tool", url: "finance/debt-ratio.html", tags: ["calculator", "finance"]},
    {name: "Age Difference Calculator", url: "personal/age-difference-inline.html", tags: ["calculator", "personal"]},
    {name: "DPI Checker", url: "utility/dpi-checker.html", tags: ["utility", "design"]},
    {name: "Study Planner", url: "study/study-planner.html", tags: ["planner", "study"]},
    {name: "Marriage Age Calculator", url: "personal/marriage-age-inline.html", tags: ["calculator", "personal"]},
    {name: "Calories in Food Checker", url: "health/food-calories.html", tags: ["health", "calculator"]},
    {name: "Pomodoro Calculator", url: "planner/pomodoro.html", tags: ["utility", "study"]},
    {name: "Daily Expense Tracker", url: "finance/expense-tracker.html", tags: ["finance", "personal"]},
    {name: "GPA to Percentage Calculator", url: "calculator/gpa-percentage-inline.html", tags: ["calculator", "study"]},
    {name: "Marriage Biodata", url: "personal/marriage-biodata-inline.html", tags: ["utility", "personal"]},
    {name: "Invitation Generator", url: "personal/invite-generator-inline.html", tags: ["utility", "personal"]},
    {name: "Goal Planner", url: "planner/goal-planner.html", tags: ["planner", "personal"]},
    {name: "Memory Card Game", url: "game/memory-game.html", tags: ["game", "utility"]}
];

// Global variables
let currentPage = 1;
let currentTag = 'all';
let filteredTools = [...tools];
let favorites = JSON.parse(localStorage.getItem('taskproper-favorites') || '[]');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupSearch();
    setupFavorites();
    displayTools();
    updateFavoritesDisplay();
}

// Event listeners setup
function setupEventListeners() {
    // Tag filtering
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tag = this.dataset.tag;
            filterByTag(tag);
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay?.classList.toggle('active');
        });
    }

    // Close sidebar
    document.querySelector('.sidebar-close')?.addEventListener('click', () => {
        sidebar?.classList.remove('active');
        overlay?.classList.remove('active');
    });

    // Overlay click to close
    overlay?.addEventListener('click', () => {
        sidebar?.classList.remove('active');
        overlay?.classList.remove('active');
    });
}

// Search functionality
function setupSearch() {
    const searchInputs = document.querySelectorAll('#search-input, #mobile-search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            searchTools(query);
        });
    });
}

function searchTools(query) {
    if (!query) {
        filteredTools = currentTag === 'all' ? [...tools] : tools.filter(tool => tool.tags.includes(currentTag));
    } else {
        const baseTools = currentTag === 'all' ? tools : tools.filter(tool => tool.tags.includes(currentTag));
        filteredTools = baseTools.filter(tool => 
            tool.name.toLowerCase().includes(query) ||
            tool.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    currentPage = 1;
    displayTools();
}

// Tag filtering
function filterByTag(tag) {
    currentTag = tag;
    
    // Update active tag buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
    
    // Filter tools
    if (tag === 'all') {
        filteredTools = [...tools];
    } else {
        filteredTools = tools.filter(tool => tool.tags.includes(tag));
    }
    
    currentPage = 1;
    displayTools();
}

// Display tools
function displayTools() {
    const toolsGrid = document.querySelector('.tools-grid');
    if (!toolsGrid) return;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const toolsToShow = filteredTools.slice(startIndex, endIndex);

    if (toolsToShow.length === 0) {
        toolsGrid.innerHTML = '<div class="no-results">No tools found matching your criteria.</div>';
        updatePagination();
        return;
    }

    toolsGrid.innerHTML = toolsToShow.map(tool => createToolCard(tool)).join('');
    updatePagination();
    setupFavoriteButtons();
}

// Create tool card HTML
function createToolCard(tool) {
    const isFavorite = favorites.includes(tool.name);
    return `
        <a href="${tool.url}" class="tool-link">
            <div class="tool-card">
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="event.preventDefault(); toggleFavorite('${tool.name}')"
                        aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    <span class="icon icon-star"></span>
                </button>
                <h3 class="tool-title">${tool.name}</h3>
            </div>
        </a>
    `;
}

// Favorites functionality
function setupFavorites() {
    window.toggleFavorite = function(toolName) {
        const index = favorites.indexOf(toolName);
        
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(toolName);
        }
        
        localStorage.setItem('taskproper-favorites', JSON.stringify(favorites));
        updateFavoriteButton(toolName);
        updateFavoritesDisplay();
    };
}

function updateFavoriteButton(toolName) {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        const title = card.querySelector('.tool-title');
        if (title && title.textContent === toolName) {
            const btn = card.querySelector('.favorite-btn');
            if (btn) {
                const isFavorite = favorites.includes(toolName);
                btn.classList.toggle('active', isFavorite);
                btn.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
            }
        }
    });
}

function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        if (!btn.querySelector('svg.star-icon')) {
            btn.innerHTML = '';
            btn.appendChild(createStarIcon());
        }
    });
}

function createStarIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 576 512');
    svg.setAttribute('class', 'star-icon');
    svg.setAttribute('aria-hidden', 'true');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'star-outline');
    path.setAttribute('d', 'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12.1 3.4 24.6 13.9 30.4s23.5 5.7 33.8-2.3L288.1 439.5l123.3 74.1c10.3 8 23.5 8.6 33.8 2.3s15.9-18.3 13.9-30.4L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z');
    
    svg.appendChild(path);
    return svg;
}

function updateFavoritesDisplay() {
    const favoritesContainer = document.querySelector('.favorites-container');
    if (!favoritesContainer) return;

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="no-favorites">No favorite tools yet.</p>';
        return;
    }

    const favoriteTools = tools.filter(tool => favorites.includes(tool.name));
    favoritesContainer.innerHTML = favoriteTools.map(tool => 
        `<a href="${tool.url}" class="favorite-tool-link">${tool.name}</a>`
    ).join('');
}

// Pagination
function updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">Next</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

window.changePage = function(page) {
    currentPage = page;
    displayTools();
    
    // Scroll to top of tools section
    document.querySelector('.tools-section')?.scrollIntoView({ behavior: 'smooth' });
};

// Icon replacement functionality
function replaceIcons() {
    document.querySelectorAll('.icon').forEach(element => {
        const iconName = Array.from(element.classList)
            .find(cls => cls.startsWith('icon-'))
            ?.replace('icon-', '');
            
        if (iconName && svgIcons[iconName]) {
            element.innerHTML = svgIcons[iconName];
            element.classList.add('svg-icon');
        }
    });
}

// Initialize icon replacement
document.addEventListener('DOMContentLoaded', replaceIcons);

// Replace icons when new content is added
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    const icons = node.querySelectorAll ? node.querySelectorAll('.icon') : [];
                    icons.forEach(icon => {
                        const iconName = Array.from(icon.classList)
                            .find(cls => cls.startsWith('icon-'))
                            ?.replace('icon-', '');
                            
                        if (iconName && svgIcons[iconName]) {
                            icon.innerHTML = svgIcons[iconName];
                            icon.classList.add('svg-icon');
                        }
                    });
                }
            });
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
