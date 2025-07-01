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
