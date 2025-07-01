// Tool Data for search
const tools = [
    { name: 'CGPA to Percentage Calculator', url: '../cgpa-percentage-inline.html', tags: ['calculator', 'study'] },
    { name: 'IVF Due Date Calculator', url: 'ivf-calculator.html', tags: ['calculator', 'health'] },
    { name: 'Pregnancy Weight Gain Calculator', url: 'pregnancy-weight.html', tags: ['calculator', 'health'] },
    { name: 'Steps to KM Converter', url: '../steps-to-km-inline.html', tags: ['converter', 'health'] },
    { name: 'Typing Speed Test Paragraph', url: 'typing-speed.html', tags: ['utility', 'study'] },
    { name: 'Calories Burned Walking', url: 'calories-walking.html', tags: ['calculator', 'health'] },
    { name: 'Height Conversion Tool', url: '../height-converter-inline.html', tags: ['converter', 'health'] },
    { name: 'Calorie Deficit Finder', url: 'calorie-deficit.html', tags: ['calculator', 'health'] },
    { name: 'Marriage Biodata', url: '../marriage-biodata-inline.html', tags: ['utility', 'personal'] },
    { name: 'Invite Generator', url: '../invite-generator-inline.html', tags: ['utility', 'personal'] }
];

// Mobile search elements
const searchToggle = document.querySelector('.search-toggle');
const mobileSearchContainer = document.querySelector('.mobile-search-container');
const mobileSearchInput = document.querySelector('.mobile-search-input');
const mobileSearchClose = document.querySelector('.mobile-search-close');
const searchResults = document.querySelector('.search-results');

// Mobile search functions
function openMobileSearch() {
    mobileSearchContainer?.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => mobileSearchInput?.focus(), 100);
}

function closeMobileSearch() {
    mobileSearchContainer?.classList.remove('active');
    searchResults?.classList.remove('show');
    document.body.style.overflow = '';
    if (mobileSearchInput) mobileSearchInput.value = '';
}

function handleMobileSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (query.length === 0) {
        searchResults?.classList.remove('show');
        return;
    }
    const matchedTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
    );
    renderSearchResults(matchedTools, query);
}

function renderSearchResults(matchedTools, query) {
    if (!searchResults) return;
    if (matchedTools.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No results found</h3>
                <p>Try searching with different keywords</p>
            </div>`;
    } else {
        const resultsHTML = `
            <div class="search-results-header">
                <h3>Found ${matchedTools.length} tool${matchedTools.length !== 1 ? 's' : ''}</h3>
            </div>
            <ul class="search-results-list">
                ${matchedTools.map(tool => `
                    <li class="search-result-item">
                        <a href="${tool.url}" class="search-result-link">
                            <h4 class="search-result-title">${highlightSearchTerm(tool.name, query)}</h4>
                            <p class="search-result-tags">
                                ${tool.tags.map(tag => `<span class="search-result-tag">${tag}</span>`).join('')}
                            </p>
                        </a>
                    </li>
                `).join('')}
            </ul>`;
        searchResults.innerHTML = resultsHTML;
    }
    searchResults.classList.add('show');
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Event listeners for mobile search
searchToggle?.addEventListener('click', openMobileSearch);
mobileSearchClose?.addEventListener('click', closeMobileSearch);
mobileSearchInput?.addEventListener('input', handleMobileSearch);
mobileSearchContainer?.addEventListener('click', (e) => {
    if (e.target === mobileSearchContainer) closeMobileSearch();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSearchContainer?.classList.contains('active')) {
        closeMobileSearch();
    }
});

// Tool Functionality
const toolForm = document.getElementById('toolForm');
const resultSection = document.getElementById('resultSection');
const resultValue = document.getElementById('resultValue');
const resultDescription = document.getElementById('resultDescription');

// Form validation
function validateInput(input, errorElement, message) {
    const value = input.value.trim();
    if (!value || isNaN(value)) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        return false;
    } else {
        input.classList.remove('error');
        errorElement.style.display = 'none';
        return true;
    }
}

function validateSelect(select, errorElement, message) {
    if (!select.value) {
        select.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        return false;
    } else {
        select.classList.remove('error');
        errorElement.style.display = 'none';
        return true;
    }
}

// Calculate function
function calculate() {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const operation = document.getElementById('operation');

    // Validation
    let isValid = true;
    isValid &= validateInput(input1, document.getElementById('input1Error'), 'Please enter a valid first number.');
    isValid &= validateInput(input2, document.getElementById('input2Error'), 'Please enter a valid second number.');
    isValid &= validateSelect(operation, document.getElementById('operationError'), 'Please select an operation.');

    if (!isValid) return;

    const num1 = parseFloat(input1.value);
    const num2 = parseFloat(input2.value);
    const op = operation.value;

    let result;
    let description;

    switch (op) {
        case 'add':
            result = num1 + num2;
            description = `${num1} + ${num2} = ${result}`;
            break;
        case 'subtract':
            result = num1 - num2;
            description = `${num1} - ${num2} = ${result}`;
            break;
        case 'multiply':
            result = num1 * num2;
            description = `${num1} × ${num2} = ${result}`;
            break;
        case 'divide':
            if (num2 === 0) {
                alert('Cannot divide by zero!');
                return;
            }
            result = num1 / num2;
            description = `${num1} ÷ ${num2} = ${result}`;
            break;
        default:
            return;
    }

    // Display result
    resultValue.textContent = result.toFixed(2);
    resultDescription.textContent = description;
    resultSection.classList.add('show');

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset function
function resetCalculator() {
    toolForm.reset();
    resultSection.classList.remove('show');
    
    // Clear error states
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    
    // Scroll back to top of tool
    document.querySelector('.tool-header').scrollIntoView({ behavior: 'smooth' });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    toolForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        calculate();
    });

    // Real-time validation
    document.getElementById('input1')?.addEventListener('blur', function() {
        validateInput(this, document.getElementById('input1Error'), 'Please enter a valid first number.');
    });

    document.getElementById('input2')?.addEventListener('blur', function() {
        validateInput(this, document.getElementById('input2Error'), 'Please enter a valid second number.');
    });

    document.getElementById('operation')?.addEventListener('change', function() {
        validateSelect(this, document.getElementById('operationError'), 'Please select an operation.');
    });

    // Clear error on focus
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) errorElement.style.display = 'none';
        });
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
