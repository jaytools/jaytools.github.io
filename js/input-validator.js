/**
 * Input Validation Library for TaskProper.com
 * Provides comprehensive input validation and sanitization
 */

class InputValidator {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            phone: /^[\+]?[1-9][\d]{0,15}$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
            alphanumeric: /^[a-zA-Z0-9\s]+$/,
            numeric: /^-?\d*\.?\d+$/,
            integer: /^-?\d+$/,
            positiveNumber: /^\d*\.?\d+$/,
            percentage: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/
        };

        this.limits = {
            maxStringLength: 1000,
            maxNumberValue: 1e15,
            minNumberValue: -1e15,
            maxArrayLength: 1000
        };
    }

    /**
     * Sanitize string input to prevent XSS
     */
    sanitizeString(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .trim()
            .slice(0, this.limits.maxStringLength)
            .replace(/[<>'"&]/g, (char) => {
                const entities = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return entities[char] || char;
            });
    }

    /**
     * Validate and sanitize numeric input
     */
    validateNumber(input, options = {}) {
        const {
            min = this.limits.minNumberValue,
            max = this.limits.maxNumberValue,
            allowNegative = true,
            allowDecimals = true,
            required = false
        } = options;

        if (input === '' || input === null || input === undefined) {
            if (required) {
                throw new Error('This field is required');
            }
            return null;
        }

        const sanitized = this.sanitizeString(String(input));
        
        if (!this.patterns.numeric.test(sanitized)) {
            throw new Error('Please enter a valid number');
        }

        const num = parseFloat(sanitized);

        if (isNaN(num) || !isFinite(num)) {
            throw new Error('Please enter a valid number');
        }

        if (!allowNegative && num < 0) {
            throw new Error('Negative numbers are not allowed');
        }

        if (!allowDecimals && num % 1 !== 0) {
            throw new Error('Decimal numbers are not allowed');
        }

        if (num < min) {
            throw new Error(`Value must be at least ${min}`);
        }

        if (num > max) {
            throw new Error(`Value must not exceed ${max}`);
        }

        return num;
    }

    /**
     * Validate email address
     */
    validateEmail(input, required = false) {
        if (!input) {
            if (required) {
                throw new Error('Email is required');
            }
            return null;
        }

        const sanitized = this.sanitizeString(input).toLowerCase();
        
        if (!this.patterns.email.test(sanitized)) {
            throw new Error('Please enter a valid email address');
        }

        return sanitized;
    }

    /**
     * Validate percentage (0-100)
     */
    validatePercentage(input, required = false) {
        if (!input && input !== 0) {
            if (required) {
                throw new Error('Percentage is required');
            }
            return null;
        }

        const num = this.validateNumber(input, {
            min: 0,
            max: 100,
            allowNegative: false,
            required
        });

        return num;
    }

    /**
     * Validate CGPA (typically 0-10 or 0-4)
     */
    validateCGPA(input, scale = 10, required = false) {
        if (!input && input !== 0) {
            if (required) {
                throw new Error('CGPA is required');
            }
            return null;
        }

        const num = this.validateNumber(input, {
            min: 0,
            max: scale,
            allowNegative: false,
            required
        });

        return num;
    }

    /**
     * Validate age
     */
    validateAge(input, required = false) {
        if (!input && input !== 0) {
            if (required) {
                throw new Error('Age is required');
            }
            return null;
        }

        const num = this.validateNumber(input, {
            min: 0,
            max: 150,
            allowNegative: false,
            allowDecimals: false,
            required
        });

        return num;
    }

    /**
     * Validate weight (in kg)
     */
    validateWeight(input, required = false) {
        if (!input && input !== 0) {
            if (required) {
                throw new Error('Weight is required');
            }
            return null;
        }

        const num = this.validateNumber(input, {
            min: 0.1,
            max: 1000,
            allowNegative: false,
            required
        });

        return num;
    }

    /**
     * Validate height (in cm)
     */
    validateHeight(input, required = false) {
        if (!input && input !== 0) {
            if (required) {
                throw new Error('Height is required');
            }
            return null;
        }

        const num = this.validateNumber(input, {
            min: 30,
            max: 300,
            allowNegative: false,
            required
        });

        return num;
    }

    /**
     * Validate date
     */
    validateDate(input, required = false) {
        if (!input) {
            if (required) {
                throw new Error('Date is required');
            }
            return null;
        }

        const date = new Date(input);
        
        if (isNaN(date.getTime())) {
            throw new Error('Please enter a valid date');
        }

        return date;
    }

    /**
     * Validate text input with length limits
     */
    validateText(input, options = {}) {
        const {
            minLength = 0,
            maxLength = this.limits.maxStringLength,
            pattern = null,
            required = false,
            allowSpecialChars = true
        } = options;

        if (!input) {
            if (required) {
                throw new Error('This field is required');
            }
            return '';
        }

        const sanitized = this.sanitizeString(input);

        if (sanitized.length < minLength) {
            throw new Error(`Must be at least ${minLength} characters long`);
        }

        if (sanitized.length > maxLength) {
            throw new Error(`Must not exceed ${maxLength} characters`);
        }

        if (!allowSpecialChars && !this.patterns.alphanumeric.test(sanitized)) {
            throw new Error('Only letters, numbers, and spaces are allowed');
        }

        if (pattern && !pattern.test(sanitized)) {
            throw new Error('Invalid format');
        }

        return sanitized;
    }

    /**
     * Validate form data
     */
    validateForm(formData, validationRules) {
        const errors = {};
        const validatedData = {};

        for (const [field, rules] of Object.entries(validationRules)) {
            try {
                const value = formData[field];
                
                switch (rules.type) {
                    case 'number':
                        validatedData[field] = this.validateNumber(value, rules);
                        break;
                    case 'email':
                        validatedData[field] = this.validateEmail(value, rules.required);
                        break;
                    case 'percentage':
                        validatedData[field] = this.validatePercentage(value, rules.required);
                        break;
                    case 'cgpa':
                        validatedData[field] = this.validateCGPA(value, rules.scale, rules.required);
                        break;
                    case 'age':
                        validatedData[field] = this.validateAge(value, rules.required);
                        break;
                    case 'weight':
                        validatedData[field] = this.validateWeight(value, rules.required);
                        break;
                    case 'height':
                        validatedData[field] = this.validateHeight(value, rules.required);
                        break;
                    case 'date':
                        validatedData[field] = this.validateDate(value, rules.required);
                        break;
                    case 'text':
                        validatedData[field] = this.validateText(value, rules);
                        break;
                    default:
                        validatedData[field] = this.sanitizeString(value);
                }
            } catch (error) {
                errors[field] = error.message;
            }
        }

        if (Object.keys(errors).length > 0) {
            throw new ValidationError('Validation failed', errors);
        }

        return validatedData;
    }

    /**
     * Real-time input validation for form fields
     */
    setupRealTimeValidation(form, validationRules) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const fieldName = input.name || input.id;
            const rules = validationRules[fieldName];
            
            if (!rules) return;

            // Create error display element
            let errorElement = form.querySelector(`#${fieldName}-error`);
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.id = `${fieldName}-error`;
                errorElement.className = 'validation-error';
                errorElement.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem; display: none;';
                input.parentNode.appendChild(errorElement);
            }

            // Validation function
            const validateField = () => {
                try {
                    const formData = { [fieldName]: input.value };
                    this.validateForm(formData, { [fieldName]: rules });
                    
                    // Clear error
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                    errorElement.style.display = 'none';
                    
                } catch (error) {
                    // Show error
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                    errorElement.textContent = error.errors[fieldName];
                    errorElement.style.display = 'block';
                }
            };

            // Add event listeners
            input.addEventListener('blur', validateField);
            input.addEventListener('input', debounce(validateField, 500));
        });
    }
}

/**
 * Custom validation error class
 */
class ValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.inputValidator = new InputValidator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InputValidator, ValidationError };
}
