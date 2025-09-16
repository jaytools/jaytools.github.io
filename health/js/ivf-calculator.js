/**
 * IVF Due Date Calculator JavaScript
 * Handles all calculations and UI interactions for the IVF calculator
 */

class IVFCalculator {
    constructor() {
        this.form = document.getElementById('ivf-calculator-form');
        this.resultsSection = document.getElementById('results-section');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.initializeEventListeners();
        this.initializeFAQ();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateDueDate();
        });

        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.resetCalculator();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.validateInput(input);
            });
        });
    }

    initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    validateInput(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        
        // Remove existing error styling
        input.classList.remove('error');
        if (errorElement) {
            errorElement.remove();
        }

        let isValid = true;
        let errorMessage = '';

        switch (input.type) {
            case 'date':
                if (!input.value) {
                    isValid = false;
                    errorMessage = 'Please select a transfer date';
                } else {
                    const selectedDate = new Date(input.value);
                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setFullYear(today.getFullYear() + 1);
                    
                    if (selectedDate > today) {
                        isValid = false;
                        errorMessage = 'Transfer date cannot be in the future';
                    } else if (selectedDate < new Date('2000-01-01')) {
                        isValid = false;
                        errorMessage = 'Please enter a valid transfer date';
                    }
                }
                break;
            
            case 'select-one':
                if (!input.value) {
                    isValid = false;
                    errorMessage = 'Please select a transfer type';
                }
                break;
        }

        if (!isValid) {
            input.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
            input.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    calculateDueDate() {
        // Get form values
        const transferType = document.getElementById('transferType').value;
        const transferDate = document.getElementById('transferDate').value;
        const multipleEmbryos = document.getElementById('multipleEmbryos').checked;

        // Validate inputs
        const transferTypeInput = document.getElementById('transferType');
        const transferDateInput = document.getElementById('transferDate');

        const isTransferTypeValid = this.validateInput(transferTypeInput);
        const isTransferDateValid = this.validateInput(transferDateInput);

        if (!isTransferTypeValid || !isTransferDateValid) {
            return;
        }

        // Show loading state
        this.calculateBtn.classList.add('loading');
        this.calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';

        // Simulate calculation delay for better UX
        setTimeout(() => {
            try {
                const result = this.performCalculation(transferType, transferDate, multipleEmbryos);
                this.displayResults(result);
            } catch (error) {
                this.showError('An error occurred during calculation. Please try again.');
            } finally {
                // Reset button state
                this.calculateBtn.classList.remove('loading');
                this.calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Due Date';
            }
        }, 800);
    }

    performCalculation(transferType, transferDate, multipleEmbryos) {
        const transfer = new Date(transferDate);
        let dueDate = new Date(transfer);
        let gestationalAge = 0;

        // Calculate due date based on transfer type
        switch (transferType) {
            case 'fresh-day3':
            case 'fet-day3':
                // Day 3 embryo: add 266 days (38 weeks)
                dueDate.setDate(transfer.getDate() + 266);
                gestationalAge = 3;
                break;
            
            case 'fresh-day5':
            case 'fet-day5':
                // Day 5 blastocyst: add 264 days (37 weeks 5 days)
                dueDate.setDate(transfer.getDate() + 264);
                gestationalAge = 5;
                break;
            
            case 'fresh-day6':
            case 'fet-day6':
                // Day 6 blastocyst: add 263 days (37 weeks 4 days)
                dueDate.setDate(transfer.getDate() + 263);
                gestationalAge = 6;
                break;
            
            default:
                throw new Error('Invalid transfer type');
        }

        // Calculate current pregnancy week
        const today = new Date();
        const daysSinceTransfer = Math.floor((today - transfer) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor((daysSinceTransfer + gestationalAge + 14) / 7);
        const currentDay = (daysSinceTransfer + gestationalAge + 14) % 7;

        // Calculate days remaining
        const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        return {
            dueDate,
            currentWeek,
            currentDay,
            daysRemaining,
            transferType,
            multipleEmbryos,
            gestationalAge
        };
    }

    displayResults(result) {
        // Format due date
        const dueDateFormatted = result.dueDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update result elements
        document.getElementById('dueDate').textContent = dueDateFormatted;
        
        // Current week display
        const currentWeekText = result.currentWeek > 0 
            ? `${result.currentWeek} weeks ${result.currentDay} days`
            : 'Not yet pregnant (pre-transfer)';
        document.getElementById('currentWeek').textContent = currentWeekText;
        
        // Days remaining
        const daysRemainingText = result.daysRemaining > 0 
            ? `${result.daysRemaining} days`
            : 'Due date has passed';
        document.getElementById('daysRemaining').textContent = daysRemainingText;
        
        // Transfer type
        const transferTypeText = this.getTransferTypeDisplayName(result.transferType);
        document.getElementById('transferTypeResult').textContent = transferTypeText;

        // Show/hide multiple embryo note
        const multipleNote = document.getElementById('multipleNote');
        if (result.multipleEmbryos) {
            multipleNote.classList.add('show');
        } else {
            multipleNote.classList.remove('show');
        }

        // Show results section with animation
        this.resultsSection.classList.add('show');
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

        // Show success message
        this.showSuccess('Due date calculated successfully!');
    }

    getTransferTypeDisplayName(transferType) {
        const typeMap = {
            'fresh-day3': 'Fresh Transfer - Day 3 Embryo',
            'fresh-day5': 'Fresh Transfer - Day 5 Blastocyst',
            'fresh-day6': 'Fresh Transfer - Day 6 Blastocyst',
            'fet-day3': 'FET - Day 3 Embryo',
            'fet-day5': 'FET - Day 5 Blastocyst',
            'fet-day6': 'FET - Day 6 Blastocyst'
        };
        return typeMap[transferType] || transferType;
    }

    resetCalculator() {
        // Reset form
        this.form.reset();
        
        // Hide results
        this.resultsSection.classList.remove('show');
        
        // Clear any error messages
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Remove error styling
        const errorInputs = this.form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
        
        // Hide multiple embryo note
        document.getElementById('multipleNote').classList.remove('show');
        
        // Clear success/error messages
        this.clearMessages();
        
        // Focus on first input
        document.getElementById('transferType').focus();
        
        // Show success message
        this.showSuccess('Calculator reset successfully!');
    }

    showError(message) {
        this.clearMessages();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.style.marginTop = '1rem';
        this.form.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        this.clearMessages();
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successDiv.style.marginTop = '1rem';
        this.form.appendChild(successDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    clearMessages() {
        const messages = this.form.querySelectorAll('.error-message, .success-message');
        messages.forEach(msg => {
            if (msg.style.marginTop) { // Only remove form-level messages
                msg.remove();
            }
        });
    }
}

// Additional utility functions
class DateUtils {
    static formatDate(date, format = 'long') {
        const options = {
            short: { month: 'short', day: 'numeric', year: 'numeric' },
            long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            numeric: { month: 'numeric', day: 'numeric', year: 'numeric' }
        };
        
        return date.toLocaleDateString('en-US', options[format]);
    }

    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1 - date2) / oneDay));
    }
}

// Pregnancy milestone calculator
class PregnancyMilestones {
    static getMilestones(transferDate, transferType) {
        const transfer = new Date(transferDate);
        const milestones = [];

        // Calculate key dates based on transfer
        const betaTest = DateUtils.addDays(transfer, 9); // 9-14 days after transfer
        const firstUltrasound = DateUtils.addDays(transfer, 42); // ~6 weeks
        const heartbeat = DateUtils.addDays(transfer, 49); // ~7 weeks
        const firstTrimesterEnd = DateUtils.addDays(transfer, 84); // ~12 weeks
        const anatomy = DateUtils.addDays(transfer, 140); // ~20 weeks

        milestones.push(
            { name: 'Beta hCG Test', date: betaTest, description: 'First pregnancy test' },
            { name: 'First Ultrasound', date: firstUltrasound, description: 'Confirm pregnancy and heartbeat' },
            { name: 'Heartbeat Detection', date: heartbeat, description: 'Fetal heartbeat typically visible' },
            { name: 'End of First Trimester', date: firstTrimesterEnd, description: 'Reduced miscarriage risk' },
            { name: 'Anatomy Scan', date: anatomy, description: 'Detailed ultrasound examination' }
        );

        return milestones;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the IVF calculator
    const calculator = new IVFCalculator();
    
    // Set max date for transfer date input (today)
    const transferDateInput = document.getElementById('transferDate');
    if (transferDateInput) {
        const today = new Date().toISOString().split('T')[0];
        transferDateInput.setAttribute('max', today);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculator.calculateDueDate();
        }
        
        // Escape to reset
        if (e.key === 'Escape') {
            calculator.resetCalculator();
        }
    });
    
    // Add print functionality
    const printBtn = document.createElement('button');
    printBtn.type = 'button';
    printBtn.className = 'reset-btn';
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print Results';
    printBtn.style.display = 'none';
    printBtn.addEventListener('click', () => window.print());
    
    // Show print button when results are displayed
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList.contains('show')) {
                printBtn.style.display = 'flex';
            } else {
                printBtn.style.display = 'none';
            }
        });
    });
    
    observer.observe(document.getElementById('results-section'), {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Add print button to form
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.parentNode.insertBefore(printBtn, resetBtn.nextSibling);
    
    console.log('IVF Calculator initialized successfully');
});