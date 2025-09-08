// Debt to Income Ratio Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const dtiForm = document.getElementById('dtiForm');
    const monthlyIncomeInput = document.getElementById('monthlyIncome');
    const monthlyDebtInput = document.getElementById('monthlyDebt');
    const calculateBtn = document.querySelector('.btn-primary');
    const resultsSection = document.getElementById('resultsSection');
    const dtiPercentageElement = document.getElementById('dtiPercentage');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusMessage = document.getElementById('statusMessage');
    const resultDetails = document.getElementById('resultDetails');
    const recalculateBtn = document.getElementById('recalculateBtn');
    const shareBtn = document.getElementById('shareBtn');

    // Storage for DTI entries
    let dtiEntries = JSON.parse(localStorage.getItem('dtiEntries') || '[]');

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Format date with smart labels (Today/Yesterday)
    function formatDate(date) {
        const today = new Date();
        const targetDate = new Date(date);
        
        // Reset time to compare dates only
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - targetDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else {
            return targetDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    // Get DTI result message based on ratio
    function getDTIMessage(dtiRatio) {
        if (dtiRatio < 36) {
            return {
                status: 'Good DTI',
                color: 'good',
                icon: 'fas fa-thumbs-up',
                description: 'Your debt-to-income ratio is in the acceptable range. Most lenders will consider you a low-risk borrower.'
            };
        } else if (dtiRatio <= 43) {
            return {
                status: 'Manageable but watch your debt',
                color: 'fair',
                icon: 'fas fa-exclamation-triangle',
                description: 'Your DTI is getting high. Consider reducing debt before taking on additional financial obligations.'
            };
        } else {
            return {
                status: 'High DTI – risk for loans',
                color: 'poor',
                icon: 'fas fa-times-circle',
                description: 'Your debt burden is high and may limit borrowing options. Focus on debt reduction strategies immediately.'
            };
        }
    }

    // Save DTI entry to localStorage
    function saveDTIEntry(income, debt, dtiRatio) {
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            income: parseFloat(income),
            debt: parseFloat(debt),
            dtiRatio: parseFloat(dtiRatio.toFixed(2))
        };
        
        dtiEntries.unshift(entry); // Add to beginning of array
        
        // Keep only last 50 entries to prevent excessive storage
        if (dtiEntries.length > 50) {
            dtiEntries = dtiEntries.slice(0, 50);
        }
        
        localStorage.setItem('dtiEntries', JSON.stringify(dtiEntries));
        return entry;
    }

    // Calculate DTI and display results
    function calculateDTI(monthlyIncome, monthlyDebt) {
        // Calculate DTI ratio (rounded to 2 decimal places)
        const dtiRatio = Math.round((monthlyDebt / monthlyIncome) * 100 * 100) / 100;
        const result = getDTIMessage(dtiRatio);
        const availableIncome = monthlyIncome - monthlyDebt;

        // Save entry to localStorage
        saveDTIEntry(monthlyIncome, monthlyDebt, dtiRatio);

        // Update percentage display
        dtiPercentageElement.textContent = `${dtiRatio.toFixed(2)}%`;

        // Update status indicator
        statusIndicator.className = `status-indicator ${result.color}`;
        statusMessage.textContent = result.status;

        // Update detailed message
        resultDetails.innerHTML = `
            <div class="result-message">
                <p><strong>${result.description}</strong></p>
                <p>Available income after debt payments: ${formatCurrency(availableIncome)}</p>
            </div>
            <div class="calculation-breakdown">
                <h4>Calculation Details:</h4>
                <ul>
                    <li>Monthly Gross Income: ${formatCurrency(monthlyIncome)}</li>
                    <li>Total Monthly Debt: ${formatCurrency(monthlyDebt)}</li>
                    <li>Available Income: ${formatCurrency(availableIncome)}</li>
                    <li><strong>DTI Ratio: ${formatCurrency(monthlyDebt)} ÷ ${formatCurrency(monthlyIncome)} × 100 = ${dtiRatio.toFixed(2)}%</strong></li>
                </ul>
            </div>
            <div class="entry-history">
                <div class="history-header">
                    <h4>Recent Calculations</h4>
                    <button class="btn btn-secondary export-csv-btn" id="exportCsvBtn">
                        <i class="fas fa-download"></i>
                        Export CSV
                    </button>
                </div>
                <div class="history-table-container">
                    ${renderHistoryTable()}
                </div>
            </div>
        `;

        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Add event listener for CSV export button
        const exportBtn = document.getElementById('exportCsvBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportToCSV);
        }
        
        // Smooth scroll to results
        resultsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

        // Add swipe-to-delete functionality for mobile
        addSwipeToDelete();
    }

    // Render history table
    function renderHistoryTable() {
        if (dtiEntries.length === 0) {
            return '<p class="no-history">No previous calculations found.</p>';
        }

        const tableRows = dtiEntries.slice(0, 10).map(entry => `
            <tr data-id="${entry.id}" class="history-row">
                <td class="date-cell">${formatDate(entry.date)}</td>
                <td class="income-cell">${formatCurrency(entry.income)}</td>
                <td class="debt-cell">${formatCurrency(entry.debt)}</td>
                <td class="dti-cell">
                    <span class="dti-value ${getDTIMessage(entry.dtiRatio).color}">
                        ${entry.dtiRatio.toFixed(2)}%
                    </span>
                </td>
                <td class="action-cell">
                    <button class="delete-btn" data-id="${entry.id}" aria-label="Delete entry">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        return `
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Income</th>
                        <th>Debt</th>
                        <th>DTI %</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
    }

    // Add swipe-to-delete functionality for mobile
    function addSwipeToDelete() {
        const historyRows = document.querySelectorAll('.history-row');
        
        historyRows.forEach(row => {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;

            // Touch events for mobile swipe-to-delete
            row.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                row.style.transition = 'none';
            });

            row.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                currentX = e.touches[0].clientX;
                const deltaX = currentX - startX;
                
                if (deltaX < 0) { // Swiping left
                    row.style.transform = `translateX(${Math.max(deltaX, -100)}px)`;
                    row.style.backgroundColor = '#ffebee';
                }
            });

            row.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const deltaX = currentX - startX;
                
                if (deltaX < -50) { // Swipe threshold
                    // Delete the entry
                    const entryId = parseInt(row.dataset.id);
                    deleteEntry(entryId);
                } else {
                    // Reset position
                    row.style.transform = 'translateX(0)';
                    row.style.backgroundColor = '';
                }
                
                row.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
                isDragging = false;
            });
        });

        // Add delete button listeners for desktop
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const entryId = parseInt(btn.dataset.id);
                deleteEntry(entryId);
            });
        });
    }

    // Delete entry from history
    function deleteEntry(entryId) {
        dtiEntries = dtiEntries.filter(entry => entry.id !== entryId);
        localStorage.setItem('dtiEntries', JSON.stringify(dtiEntries));
        
        // Update the history table
        const historyContainer = document.querySelector('.history-table-container');
        if (historyContainer) {
            historyContainer.innerHTML = renderHistoryTable();
            addSwipeToDelete(); // Re-add event listeners
        }
        
        showNotification('Entry deleted successfully');
    }

    // Export to CSV functionality
    function exportToCSV() {
        if (dtiEntries.length === 0) {
            showNotification('No data to export');
            return;
        }

        // Prepare CSV content
        const headers = ['Date', 'Income', 'Debt', 'DTI Percentage'];
        const csvContent = [
            headers.join(','),
            ...dtiEntries.map(entry => [
                new Date(entry.date).toLocaleDateString('en-US'),
                entry.income.toFixed(2),
                entry.debt.toFixed(2),
                entry.dtiRatio.toFixed(2)
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'debt-to-income-log.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('CSV file downloaded successfully!');
        } else {
            showNotification('CSV export not supported in this browser');
        }
    }

    // Form submission handler
    dtiForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const monthlyIncome = parseFloat(monthlyIncomeInput.value);
        const monthlyDebt = parseFloat(monthlyDebtInput.value);

        // Validate inputs
        if (!monthlyIncome || monthlyIncome <= 0) {
            showNotification('Please enter a valid monthly income amount');
            monthlyIncomeInput.focus();
            return;
        }

        if (!monthlyDebt || monthlyDebt < 0) {
            showNotification('Please enter a valid monthly debt payment amount');
            monthlyDebtInput.focus();
            return;
        }

        if (monthlyDebt >= monthlyIncome) {
            showNotification('Monthly debt payments cannot be equal to or greater than monthly income');
            monthlyDebtInput.focus();
            return;
        }

        // Add loading state
        calculateBtn.classList.add('loading');
        calculateBtn.innerHTML = '<i class="fas fa-spinner"></i> Calculating...';

        // Simulate calculation delay for better UX
        setTimeout(() => {
            calculateDTI(monthlyIncome, monthlyDebt);
            
            // Remove loading state
            calculateBtn.classList.remove('loading');
            calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate DTI Ratio';
        }, 500);
    });

    // Recalculate button handler
    recalculateBtn.addEventListener('click', function() {
        // Hide results section
        resultsSection.classList.add('hidden');
        
        // Reset form
        dtiForm.reset();
        
        // Focus on first input
        monthlyIncomeInput.focus();
        
        // Smooth scroll to form
        dtiForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    });

    // Share button handler
    shareBtn.addEventListener('click', function() {
        const monthlyIncome = parseFloat(monthlyIncomeInput.value);
        const monthlyDebt = parseFloat(monthlyDebtInput.value);
        
        if (!monthlyIncome || !monthlyDebt) {
            showNotification('Please calculate your DTI first');
            return;
        }
        
        const dtiRatio = Math.round((monthlyDebt / monthlyIncome) * 100 * 100) / 100;
        const result = getDTIMessage(dtiRatio);

        const shareText = `I calculated my Debt-to-Income ratio: ${dtiRatio.toFixed(2)}% (${result.status}) using Task Proper's DTI Calculator!`;
        const shareUrl = window.location.href;

        // Check if Web Share API is supported
        if (navigator.share) {
            navigator.share({
                title: 'My DTI Ratio Result',
                text: shareText,
                url: shareUrl
            }).catch(err => {
                console.log('Error sharing:', err);
                fallbackShare(shareText, shareUrl);
            });
        } else {
            fallbackShare(shareText, shareUrl);
        }
    });

    // Fallback share function
    function fallbackShare(text, url) {
        const shareContent = `${text}\n\nCalculate yours at: ${url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareContent).then(() => {
                showNotification('Result copied to clipboard!');
            }).catch(() => {
                promptManualCopy(shareContent);
            });
        } else {
            promptManualCopy(shareContent);
        }
    }

    // Manual copy prompt
    function promptManualCopy(content) {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Result copied to clipboard!');
        } catch (err) {
            showNotification('Please manually copy: ' + content);
        }
        
        document.body.removeChild(textArea);
    }

    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Input formatting and validation
    function formatNumberInput(input) {
        input.addEventListener('input', function() {
            // Remove any non-numeric characters except decimal point
            let value = this.value.replace(/[^0-9.]/g, '');
            
            // Ensure only one decimal point
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            
            // Limit decimal places to 2
            if (parts.length === 2 && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].slice(0, 2);
            }
            
            this.value = value;
        });

        // Add blur formatting for better UX
        input.addEventListener('blur', function() {
            if (this.value && !isNaN(this.value)) {
                const numValue = parseFloat(this.value);
                this.value = numValue.toFixed(2);
            }
        });
    }

    // Apply input formatting
    formatNumberInput(monthlyIncomeInput);
    formatNumberInput(monthlyDebtInput);

    // Auto-focus first input on page load
    monthlyIncomeInput.focus();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key to calculate (when form is focused)
        if (e.key === 'Enter' && document.activeElement === monthlyDebtInput) {
            e.preventDefault();
            dtiForm.dispatchEvent(new Event('submit'));
        }
        
        // Escape key to reset/recalculate
        if (e.key === 'Escape' && !resultsSection.classList.contains('hidden')) {
            recalculateBtn.click();
        }
    });

    // Add helpful behavior for mobile users
    if ('ontouchstart' in window) {
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                // Scroll input into view on mobile
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }, 300);
            });
        });
    }
});

// Additional CSS for history table and mobile features
const additionalCSS = `
    .entry-history {
        margin-top: var(--space-xl);
        padding: var(--space-lg);
        background: var(--color-gray-50);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-gray-200);
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-lg);
    }

    .history-header h4 {
        margin: 0;
        color: var(--color-gray-800);
        font-size: 1.1rem;
        font-weight: 600;
    }

    .export-csv-btn {
        padding: var(--space-sm) var(--space-md);
        font-size: 0.9rem;
        min-height: auto;
    }

    .history-table-container {
        overflow-x: auto;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-gray-200);
        background: var(--color-white);
    }

    .history-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
    }

    .history-table th,
    .history-table td {
        padding: var(--space-md);
        text-align: left;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .history-table th {
        background: var(--color-gray-50);
        font-weight: 600;
        color: var(--color-gray-700);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }

    .history-row {
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .history-row:hover {
        background: var(--color-gray-50);
    }

    .dti-value {
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.85rem;
    }

    .dti-value.good {
        background: rgba(46, 125, 50, 0.1);
        color: var(--color-success);
    }

    .dti-value.fair {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
    }

    .dti-value.poor {
        background: rgba(198, 40, 40, 0.1);
        color: var(--color-error);
    }

    .delete-btn {
        background: var(--color-error);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 8px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
    }

    .delete-btn:hover {
        background: var(--color-error-dark);
        transform: scale(1.05);
    }

    .no-history {
        text-align: center;
        color: var(--color-gray-500);
        font-style: italic;
        padding: var(--space-xl);
    }

    /* Mobile optimizations */
    @media (max-width: 768px) {
        .history-header {
            flex-direction: column;
            gap: var(--space-md);
            align-items: stretch;
        }

        .history-table {
            font-size: 0.8rem;
        }

        .history-table th,
        .history-table td {
            padding: var(--space-sm);
        }

        .history-row {
            position: relative;
        }

        .action-cell {
            display: none;
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);
