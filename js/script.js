// Error handling
window.onerror = function(msg, url, line) {
    console.error(`JavaScript Error: ${msg} at line ${line}`);
    return false;
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeWebsite();
    } catch (error) {
        console.error('Error initializing website:', error);
    }
});

function initializeWebsite() {
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize scroll to top
    initScrollToTop();

    // Initialize preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'flex';
        preloader.style.opacity = '1';
    }

    // Initialize tools display
    const toolsContainer = document.getElementById('toolsContainer');
    if (toolsContainer) {
            // Store all tool items initially
        allToolItems = Array.from(document.querySelectorAll('.tool-item'));
        // Initialize filteredTools with all tools
        filteredTools = [...allToolItems]; // Copy all tools to filteredTools
        // Display initial page
        displayTools();
        updatePaginationControls();
    }

    // Initialize search functionality
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterTools(searchTerm);
        });
    }

    // Hide preloader when everything is loaded
    window.addEventListener('load', function() {
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    });

    // Fallback to hide preloader
    setTimeout(() => {
        if (preloader && preloader.style.opacity !== '0') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 5000);
}

// Filter tools based on search
// Initialize mobile navigation
function initMobileNavigation() {
    const navbarToggler = document.querySelector('.navbar-toggle');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {

    }
}

// Initialize scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Global variables for pagination
let currentPage = 1;
const itemsPerPage = 6;
let allToolItems = []; // Store all tool items initially
let filteredTools = []; // This will be a subset of allToolItems

function filterTools(searchTerm) {
    const noResults = document.getElementById('noResults');

    // Filter from allToolItems, not from the current DOM
    filteredTools = allToolItems.filter(item => {
        const toolData = item.dataset.tool.toLowerCase();
        return toolData.includes(searchTerm);
    });

    if (noResults) {
        noResults.style.display = filteredTools.length > 0 ? 'none' : 'block';
    }

    // Reset to first page when searching
    currentPage = 1;
    displayTools();
    updatePaginationControls();
}

function displayTools() {
    const toolItems = document.querySelectorAll('.tool-item');
    
    // Clear existing tools from the container
    const toolsContainer = document.getElementById('toolsContainer');
    if (!toolsContainer) return;

    toolsContainer.innerHTML = ''; // Clear existing content

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const toolsToDisplay = filteredTools.slice(startIndex, endIndex);

    let currentRow;
    toolsToDisplay.forEach((item, index) => {
        if (index % 3 === 0) {
            currentRow = document.createElement('div');
            currentRow.classList.add('row');
            toolsContainer.appendChild(currentRow);
        }
        currentRow.appendChild(item); // Append the actual DOM element
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
    const paginationControls = document.getElementById('pagination-controls');
    
    if (!paginationControls) return;

    // Clear existing pagination controls
    paginationControls.innerHTML = '';

    // Add Prev button
    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.classList.add('prev');
    prevButton.innerHTML = '&lt;&lt; Prev';
    if (currentPage === 1) prevButton.classList.add('disabled');
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            displayTools();
            updatePaginationControls();
        }
    });
    paginationControls.appendChild(prevButton);

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.classList.add('page');
        if (i === currentPage) pageLink.classList.add('active');
        pageLink.textContent = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayTools();
            updatePaginationControls();
        });
        paginationControls.appendChild(pageLink);
    }

    // Add Next button
    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.classList.add('next');
    nextButton.innerHTML = 'Next &gt;&gt;';
    if (currentPage === totalPages) nextButton.classList.add('disabled');
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            displayTools();
            updatePaginationControls();
        }
    });
    paginationControls.appendChild(nextButton);
}