// Tool Functionality - Elements will be initialized in the DOM ready function
let toolForm;
let resultSection;
let resultValue;
let resultDescription;
let historyPanel;
let historyList;

// Global variables
let calculationHistory = [];
let favorites = [];

// Load saved data from localStorage
function loadSavedData() {
    try {
        const savedHistory = localStorage.getItem('sampleToolHistory');
        if (savedHistory) {
            calculationHistory = JSON.parse(savedHistory);
        }
        
        const savedFavorites = localStorage.getItem('sampleToolFavorites');
        if (savedFavorites) {
            favorites = JSON.parse(savedFavorites);
        }
        
        // Apply theme setting
        const savedTheme = localStorage.getItem('sampleToolTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const themeIcon = document.getElementById('themeIcon');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                console.log("Applied dark theme from localStorage");
            } else {
                console.error("Theme icon element not found");
            }
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('sampleToolHistory', JSON.stringify(calculationHistory));
        localStorage.setItem('sampleToolFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

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

// Format number for display
function formatNumber(num) {
    // Format number to show decimals only when needed
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
}

// Calculate function
function calculate() {
    console.log("Calculate function called");
    
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const operation = document.getElementById('operation');
    
    if (!input1 || !input2 || !operation) {
        console.error("Required form elements not found:", { 
            input1: !!input1, 
            input2: !!input2, 
            operation: !!operation 
        });
        return;
    }

    // Validation
    let isValid = true;
    const input1Error = document.getElementById('input1Error');
    const input2Error = document.getElementById('input2Error');
    const operationError = document.getElementById('operationError');
    
    isValid &= validateInput(input1, input1Error, 'Please enter a valid first number.');
    isValid &= validateInput(input2, input2Error, 'Please enter a valid second number.');
    isValid &= validateSelect(operation, operationError, 'Please select an operation.');

    if (!isValid) {
        console.log("Form validation failed");
        return;
    }
    
    console.log("Form validation passed, calculating...");

    const num1 = parseFloat(input1.value);
    const num2 = parseFloat(input2.value);
    const op = operation.value;

    let result;
    let description;
    let opSymbol;

    switch (op) {
        case 'add':
            result = num1 + num2;
            opSymbol = '+';
            description = `${formatNumber(num1)} + ${formatNumber(num2)} = ${formatNumber(result)}`;
            break;
        case 'subtract':
            result = num1 - num2;
            opSymbol = '-';
            description = `${formatNumber(num1)} - ${formatNumber(num2)} = ${formatNumber(result)}`;
            break;
        case 'multiply':
            result = num1 * num2;
            opSymbol = '×';
            description = `${formatNumber(num1)} × ${formatNumber(num2)} = ${formatNumber(result)}`;
            break;
        case 'divide':
            if (num2 === 0) {
                alert('Cannot divide by zero! Please enter a non-zero second value.');
                input2.classList.add('error');
                document.getElementById('input2Error').textContent = 'Cannot divide by zero.';
                document.getElementById('input2Error').style.display = 'block';
                return;
            }
            result = num1 / num2;
            opSymbol = '÷';
            description = `${formatNumber(num1)} ÷ ${formatNumber(num2)} = ${formatNumber(result)}`;
            break;
        default:
            return;
    }

    // Add to history
    const calculationEntry = {
        id: Date.now(),
        num1: num1,
        num2: num2,
        operation: op,
        opSymbol: opSymbol,
        result: result,
        description: description,
        timestamp: new Date().toISOString(),
        isFavorite: false
    };
    
    calculationHistory.unshift(calculationEntry); // Add to beginning
    
    // Limit history size to 50 entries
    if (calculationHistory.length > 50) {
        calculationHistory.pop();
    }
    
    // Save to localStorage
    saveData();
    
    // Update history display if visible
    if (historyPanel.classList.contains('show')) {
        updateHistoryDisplay();
    }

    // Display result
    resultValue.textContent = formatNumber(result);
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

// Update history display
function updateHistoryDisplay() {
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (calculationHistory.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = 'No calculations yet. Try making a calculation first!';
        emptyItem.classList.add('history-item', 'empty-history');
        historyList.appendChild(emptyItem);
        return;
    }
    
    calculationHistory.forEach(entry => {
        const item = document.createElement('li');
        item.classList.add('history-item');
        
        const textSpan = document.createElement('span');
        textSpan.classList.add('history-item-text');
        textSpan.textContent = entry.description;
        
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('history-item-action');
        
        const reuseBtn = document.createElement('button');
        reuseBtn.classList.add('history-reuse');
        reuseBtn.textContent = 'Reuse';
        reuseBtn.addEventListener('click', () => reuseCalculation(entry));
        
        const starBtn = document.createElement('button');
        starBtn.classList.add('history-star');
        starBtn.innerHTML = '<i class="' + (entry.isFavorite ? 'fas' : 'far') + ' fa-star"></i>';
        starBtn.addEventListener('click', () => toggleFavorite(entry.id));
        
        actionDiv.appendChild(reuseBtn);
        actionDiv.appendChild(starBtn);
        
        item.appendChild(textSpan);
        item.appendChild(actionDiv);
        
        historyList.appendChild(item);
    });
}

// Toggle history panel visibility
function toggleHistory() {
    historyPanel.classList.toggle('show');
    updateHistoryDisplay();
}

// Reuse a calculation from history
function reuseCalculation(entry) {
    document.getElementById('input1').value = entry.num1;
    document.getElementById('input2').value = entry.num2;
    document.getElementById('operation').value = entry.operation;
    
    // Calculate immediately
    calculate();
    
    // Hide history panel
    historyPanel.classList.remove('show');
}

// Toggle favorite status for a calculation
function toggleFavorite(id) {
    const index = calculationHistory.findIndex(entry => entry.id === id);
    if (index !== -1) {
        calculationHistory[index].isFavorite = !calculationHistory[index].isFavorite;
        
        // Update favorites list
        if (calculationHistory[index].isFavorite) {
            favorites.push(calculationHistory[index].id);
        } else {
            const favIndex = favorites.indexOf(calculationHistory[index].id);
            if (favIndex !== -1) {
                favorites.splice(favIndex, 1);
            }
        }
        
        // Save to localStorage
        saveData();
        
        // Update display
        updateHistoryDisplay();
    }
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear your calculation history?')) {
        calculationHistory = [];
        favorites = [];
        saveData();
        updateHistoryDisplay();
    }
}

// Toggle dark mode
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const themeIcon = document.getElementById('themeIcon');
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('sampleToolTheme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('sampleToolTheme', 'light');
    }
}

// Enable/disable calculate button based on form validity
function checkFormValidity() {
    const input1 = document.getElementById('input1')?.value.trim() || '';
    const input2 = document.getElementById('input2')?.value.trim() || '';
    const operation = document.getElementById('operation')?.value || '';
    
    const isValid = input1 !== '' && !isNaN(input1) && 
                   input2 !== '' && !isNaN(input2) && 
                   operation !== '';
    
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.disabled = !isValid;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all global element references
    toolForm = document.getElementById('toolForm');
    resultSection = document.getElementById('resultSection');
    resultValue = document.getElementById('resultValue');
    resultDescription = document.getElementById('resultDescription');
    historyPanel = document.getElementById('historyPanel');
    historyList = document.getElementById('historyList');
    
    console.log("DOM elements initialized:", {
        toolForm: !!toolForm,
        resultSection: !!resultSection,
        resultValue: !!resultValue,
        resultDescription: !!resultDescription,
        historyPanel: !!historyPanel,
        historyList: !!historyList
    });
    
    // Load saved data
    loadSavedData();
    
    // Form submission
    if (toolForm) {
        toolForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submitted");
            calculate();
        });
        console.log("Form submit event attached");
    } else {
        console.error("Tool form not found");
    }

    // Real-time validation
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const operation = document.getElementById('operation');
    
    if (input1) {
        input1.addEventListener('blur', function() {
            validateInput(this, document.getElementById('input1Error'), 'Please enter a valid first number.');
        });
    }
    
    if (input2) {
        input2.addEventListener('blur', function() {
            validateInput(this, document.getElementById('input2Error'), 'Please enter a valid second number.');
        });
    }
    
    if (operation) {
        operation.addEventListener('change', function() {
            validateSelect(this, document.getElementById('operationError'), 'Please select an operation.');
        });
    }

    // Clear error on focus
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.remove('error');
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) errorElement.style.display = 'none';
        });
    });
    
    // Add input event listeners for real-time validation
    document.querySelectorAll('input[type="number"]').forEach(element => {
        element.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                validateInput(this, document.getElementById(this.id + 'Error'), 
                    `Please enter a valid ${this.id === 'input1' ? 'first' : 'second'} number.`);
            }
        });
    });
    
    // Add form validity check events
    if (input1) input1.addEventListener('input', checkFormValidity);
    if (input2) input2.addEventListener('input', checkFormValidity);
    if (operation) operation.addEventListener('change', checkFormValidity);
    
    // Initialize form state
    try {
        checkFormValidity();
        console.log("Form validity checked");
    } catch (err) {
        console.error("Error checking form validity:", err);
    }

    // Theme toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            toggleTheme();
            console.log("Theme toggled");
        });
    } else {
        console.error("Theme toggle button not found in the DOM");
    }
    
    // History toggle
    document.getElementById('showHistoryBtn')?.addEventListener('click', toggleHistory);
    
    // Clear history
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearHistory);
    
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
