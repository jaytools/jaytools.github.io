// IVF Due Date Calculator JavaScript

// IVF Calculator Class
class IVFCalculator {
    constructor() {
        this.form = document.getElementById('ivf-calculator-form');
        this.resultsSection = document.getElementById('results-section');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.validateForm();
        this.initFAQ();
    }

    bindEvents() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleCalculate(e));
        }

        // Reset button
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetForm());
        }

        // Form validation
        const inputs = this.form?.querySelectorAll('input, select');
        inputs?.forEach(input => {
            input.addEventListener('input', () => this.validateForm());
            input.addEventListener('change', () => this.validateForm());
        });
    }

    validateForm() {
        if (!this.form || !this.calculateBtn) return;

        const transferType = document.getElementById('transferType')?.value;
        const transferDate = document.getElementById('transferDate')?.value;

        const isValid = transferType && transferDate;
        
        this.calculateBtn.disabled = !isValid;
        this.calculateBtn.classList.toggle('disabled', !isValid);
    }

    handleCalculate(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const transferType = formData.get('transferType');
        const transferDate = formData.get('transferDate');
        const multipleEmbryos = formData.has('multipleEmbryos');

        if (!transferType || !transferDate) {
            this.showError('Please fill in all required fields.');
            return;
        }

        try {
            const result = this.calculateDueDate(transferType, transferDate, multipleEmbryos);
            this.displayResults(result);
            this.trackCalculation(transferType, transferDate, multipleEmbryos, result);
        } catch (error) {
            this.showError('Error calculating due date. Please check your inputs.');
            console.error('Calculation error:', error);
        }
    }

    calculateDueDate(transferType, transferDateStr, multipleEmbryos) {
        const transferDate = new Date(transferDateStr);
        if (isNaN(transferDate.getTime())) {
            throw new Error('Invalid transfer date');
        }

        // Days to add based on embryo development stage
        const daysToAdd = {
            'fresh-day3': 266,     // 38 weeks
            'fresh-day5': 264,     // 37 weeks 5 days
            'fresh-day6': 263,     // 37 weeks 4 days
            'fet-day3': 266,       // Same as fresh
            'fet-day5': 264,       // Same as fresh
            'fet-day6': 263        // Same as fresh
        };

        const addDays = daysToAdd[transferType];
        if (!addDays) {
            throw new Error('Invalid transfer type');
        }

        // Calculate due date
        const dueDate = new Date(transferDate);
        dueDate.setDate(dueDate.getDate() + addDays);

        // Calculate current pregnancy info
        const today = new Date();
        const daysSinceTransfer = Math.floor((today - transferDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
        
        // Calculate current week of pregnancy
        // For IVF, pregnancy starts from transfer date minus embryo age
        const embryoAge = this.getEmbryoAge(transferType);
        const pregnancyStartDate = new Date(transferDate);
        pregnancyStartDate.setDate(pregnancyStartDate.getDate() - embryoAge);
        
        const daysSinceConception = Math.floor((today - pregnancyStartDate) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor(daysSinceConception / 7);
        const currentDay = daysSinceConception % 7;

        return {
            dueDate,
            transferDate,
            transferType,
            multipleEmbryos,
            currentWeek,
            currentDay,
            daysRemaining,
            daysSinceTransfer,
            isPregnant: daysSinceTransfer >= 0,
            isPastDue: daysRemaining < 0
        };
    }

    getEmbryoAge(transferType) {
        const embryoAges = {
            'fresh-day3': 3,
            'fresh-day5': 5,
            'fresh-day6': 6,
            'fet-day3': 3,
            'fet-day5': 5,
            'fet-day6': 6
        };
        return embryoAges[transferType] || 5;
    }

    displayResults(result) {
        if (!this.resultsSection) return;

        // Format due date
        const dueDateFormatted = result.dueDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format transfer type for display
        const transferTypeDisplay = this.formatTransferType(result.transferType);

        // Update result elements
        const dueDateElement = document.getElementById('dueDate');
        const currentWeekElement = document.getElementById('currentWeek');
        const daysRemainingElement = document.getElementById('daysRemaining');
        const transferTypeResultElement = document.getElementById('transferTypeResult');
        const multipleNoteElement = document.getElementById('multipleNote');

        if (dueDateElement) {
            dueDateElement.textContent = dueDateFormatted;
        }

        if (currentWeekElement) {
            if (result.currentWeek >= 0) {
                currentWeekElement.textContent = `${result.currentWeek} weeks, ${result.currentDay} days`;
            } else {
                currentWeekElement.textContent = 'Not yet pregnant';
            }
        }

        if (daysRemainingElement) {
            if (result.daysRemaining > 0) {
                daysRemainingElement.textContent = `${result.daysRemaining} days`;
            } else if (result.daysRemaining === 0) {
                daysRemainingElement.textContent = 'Due today!';
            } else {
                daysRemainingElement.textContent = `${Math.abs(result.daysRemaining)} days overdue`;
            }
        }

        if (transferTypeResultElement) {
            transferTypeResultElement.textContent = transferTypeDisplay;
        }

        // Show/hide multiple embryo note
        if (multipleNoteElement) {
            if (result.multipleEmbryos) {
                multipleNoteElement.classList.add('show');
            } else {
                multipleNoteElement.classList.remove('show');
            }
        }

        // Show results section with animation
        this.resultsSection.classList.add('show');
        
        // Scroll to results
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }

    formatTransferType(transferType) {
        const types = {
            'fresh-day3': 'Fresh Transfer - Day 3 Embryo',
            'fresh-day5': 'Fresh Transfer - Day 5 Blastocyst',
            'fresh-day6': 'Fresh Transfer - Day 6 Blastocyst',
            'fet-day3': 'FET - Day 3 Embryo',
            'fet-day5': 'FET - Day 5 Blastocyst',
            'fet-day6': 'FET - Day 6 Blastocyst'
        };
        return types[transferType] || transferType;
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
        }
        
        if (this.resultsSection) {
            this.resultsSection.classList.remove('show');
        }

        this.validateForm();
        
        // Reset multiple embryo note
        const multipleNoteElement = document.getElementById('multipleNote');
        if (multipleNoteElement) {
            multipleNoteElement.classList.remove('show');
        }
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.error-message-global');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message-global';
            errorDiv.style.cssText = `
                background: #f44336;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
                text-align: center;
                font-weight: 600;
            `;
            this.form?.insertAdjacentElement('afterend', errorDiv);
        }
        
        errorDiv.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv?.remove();
        }, 5000);
    }

    trackCalculation(transferType, transferDate, multipleEmbryos, result) {
        // Track calculation for analytics or history
        const calculation = {
            timestamp: new Date().toISOString(),
            transferType,
            transferDate,
            multipleEmbryos,
            dueDate: result.dueDate.toISOString(),
            currentWeek: result.currentWeek
        };

        // Store in localStorage for history
        try {
            const history = JSON.parse(localStorage.getItem('ivf-calculator-history') || '[]');
            history.unshift(calculation);
            
            // Keep only last 10 calculations
            if (history.length > 10) {
                history.splice(10);
            }
            
            localStorage.setItem('ivf-calculator-history', JSON.stringify(history));
        } catch (error) {
            console.warn('Could not save calculation history:', error);
        }

        // Google Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ivf_calculation', {
                'transfer_type': transferType,
                'multiple_embryos': multipleEmbryos,
                'current_week': result.currentWeek
            });
        }
    }

    initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Close all other FAQs
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        const otherAnswer = otherQuestion.nextElementSibling;
                        if (otherAnswer) {
                            otherAnswer.classList.remove('show');
                        }
                    }
                });
                
                // Toggle current FAQ
                question.setAttribute('aria-expanded', !isExpanded);
                if (answer) {
                    answer.classList.toggle('show', !isExpanded);
                }
            });
        });
    }
}

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('IVF Calculator: Initializing...');
    
    // Check if we're on the IVF calculator page
    const calculatorForm = document.getElementById('ivf-calculator-form');
    if (calculatorForm) {
        console.log('IVF Calculator: Form found, creating calculator instance');
        window.ivfCalculator = new IVFCalculator();
    } else {
        console.log('IVF Calculator: Form not found on this page');
    }
});

// Export for testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        IVFCalculator, 
        formatDate, 
        addDays, 
        getDaysDifference 
    };
}
