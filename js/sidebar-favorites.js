/**
 * Sidebar and Favorites Management
 * Lightweight script for individual tool pages
 */

// Sidebar Toggle Functionality
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Favorites Management
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function updateFavorites() {
    const favoritesList = document.querySelector('.favorites-container');
    if (favoritesList) {
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p class="no-favorites">No favorite tools yet.</p>';
        } else {
            let html = '<ul class="favorites-list">';
            favorites.forEach(toolName => {
                const toolUrl = getToolUrl(toolName);
                html += `<li><a href="${toolUrl}">${toolName}</a></li>`;
            });
            html += '</ul>';
            favoritesList.innerHTML = html;
        }
    }
}

function addToFavorites(toolName) {
    if (!favorites.includes(toolName)) {
        favorites.push(toolName);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavorites();
        return true;
    }
    return false;
}

function removeFromFavorites(toolName) {
    const index = favorites.indexOf(toolName);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        updateFavorites();
        return true;
    }
    return false;
}

function toggleFavorite(toolName) {
    if (favorites.includes(toolName)) {
        removeFromFavorites(toolName);
    } else {
        addToFavorites(toolName);
    }
}

// Tool URL Mapping
function getToolUrl(toolName) {
    const toolMap = {
        // Planner Tools
        'Pomodoro Calculator': '../planner/pomodoro.html',
        'Goal Planner': '../planner/goal-planner.html',
        
        // Health Tools
        'IVF Calculator': '../health/ivf-calculator.html',
        'IVF Due Date Calculator': '../health/ivf-calculator.html',
        'Pregnancy Weight Calculator': '../health/pregnancy-weight.html',
        'Calorie Deficit Calculator': '../health/calorie-deficit.html',
        'Calories Walking Calculator': '../health/calories-walking.html',
        'Food Calories Calculator': '../health/food-calories.html',
        'Protein Intake Calculator': '../health/protein-intake.html',
        
        // Study Tools
        'Study Planner': '../study/study-planner.html',
        'Typing Speed Test': '../study/typing-speed.html',
        
        // Calculator Tools
        'CGPA to Percentage Calculator': '../calculator/cgpa-percentage-inline.html',
        'GPA to Percentage Calculator': '../calculator/gpa-percentage-inline.html',
        'Exam Percentage Calculator': '../calculator/exam-percentage-inline.html',
        
        // Converter Tools
        'Height Converter': '../converter/height-converter-inline.html',
        'Steps to KM Converter': '../converter/steps-to-km-inline.html',
        
        // Personal Tools
        'Age Calculator': '../personal/age-difference-inline.html',
        'Age Difference Calculator': '../personal/age-difference-inline.html',
        'Marriage Age Calculator': '../personal/marriage-age-inline.html',
        'Marriage Biodata Generator': '../personal/marriage-biodata-inline.html',
        'Invite Generator': '../personal/invite-generator-inline.html',
        
        // Finance Tools
        'Daily Expense Tracker': '../finance/expense-tracker.html',
        'Debt Ratio Calculator': '../finance/debt-ratio.html',
        
        // Utility Tools
        'DPI Checker': '../utility/dpi-checker.html',
        'Sample Tool': '../utility/sample-tool.html'
    };
    
    // Handle relative paths based on current location
    const currentPath = window.location.pathname;
    let baseUrl = toolMap[toolName];
    
    if (baseUrl) {
        // Adjust path based on current directory depth
        if (currentPath.includes('/planner/')) {
            baseUrl = baseUrl.replace('../', './');
        } else if (currentPath.includes('/health/')) {
            baseUrl = baseUrl.replace('../health/', './');
        } else if (currentPath.includes('/study/')) {
            baseUrl = baseUrl.replace('../study/', './');
        } else if (currentPath.includes('/calculator/')) {
            baseUrl = baseUrl.replace('../calculator/', './');
        } else if (currentPath.includes('/converter/')) {
            baseUrl = baseUrl.replace('../converter/', './');
        } else if (currentPath.includes('/personal/')) {
            baseUrl = baseUrl.replace('../personal/', './');
        } else if (currentPath.includes('/finance/')) {
            baseUrl = baseUrl.replace('../finance/', './');
        } else if (currentPath.includes('/utility/')) {
            baseUrl = baseUrl.replace('../utility/', './');
        }
    }
    
    return baseUrl || '#';
}

// Add favorite star to current page
function addFavoriteStarToPage(toolName) {
    const toolHeader = document.querySelector('.tool-header h1');
    if (toolHeader && !document.querySelector('.page-favorite-btn')) {
        const isFavorite = favorites.includes(toolName);
        const starBtn = document.createElement('button');
        starBtn.className = `page-favorite-btn ${isFavorite ? 'active' : ''}`;
        starBtn.innerHTML = '<i class="fas fa-star"></i>';
        starBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
        starBtn.addEventListener('click', function() {
            toggleFavorite(toolName);
            this.classList.toggle('active');
            this.title = this.classList.contains('active') ? 'Remove from favorites' : 'Add to favorites';
        });
        toolHeader.appendChild(starBtn);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar event listeners
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.sidebar-close');
    const overlay = document.querySelector('.overlay');

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (menuClose) menuClose.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    
    // Update favorites display
    updateFavorites();
    
    // Auto-detect current tool and add favorite star
    const pageTitle = document.title;
    if (pageTitle.includes('Pomodoro')) {
        addFavoriteStarToPage('Pomodoro Calculator');
    } else if (pageTitle.includes('Goal')) {
        addFavoriteStarToPage('Goal Planner');
    } else if (pageTitle.includes('IVF')) {
        addFavoriteStarToPage('IVF Calculator');
    } else if (pageTitle.includes('Study Planner')) {
        addFavoriteStarToPage('Study Planner');
    } else if (pageTitle.includes('Typing')) {
        addFavoriteStarToPage('Typing Speed Test');
    }
});

// Export functions for global use
window.SidebarFavorites = {
    toggleSidebar,
    closeSidebar,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    updateFavorites
};

 // Sidebar Toggle Functionality
 function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.sidebar-close');
    const overlay = document.querySelector('.overlay');

    if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
    if (menuClose) menuClose.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
});