/**
 * Security Module for TaskProper.com
 * Provides input validation, XSS protection, and security utilities
 */

class SecurityManager {
    constructor() {
        this.initializeSecurityFeatures();
    }

    /**
     * Initialize security features on page load
     */
    initializeSecurityFeatures() {
        this.setupCSRFProtection();
        this.setupInputValidation();
        this.setupXSSProtection();
        this.setupRateLimiting();
        this.monitorSuspiciousActivity();
    }

    /**
     * Sanitize user input to prevent XSS attacks
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Validate numeric input
     */
    validateNumericInput(value, min = null, max = null) {
        const num = parseFloat(value);
        
        if (isNaN(num)) {
            throw new Error('Invalid numeric input');
        }
        
        if (min !== null && num < min) {
            throw new Error(`Value must be at least ${min}`);
        }
        
        if (max !== null && num > max) {
            throw new Error(`Value must not exceed ${max}`);
        }
        
        return num;
    }

    /**
     * Validate email format
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
        return email.toLowerCase().trim();
    }

    /**
     * Setup CSRF protection for forms
     */
    setupCSRFProtection() {
        // Generate CSRF token
        const csrfToken = this.generateCSRFToken();
        sessionStorage.setItem('csrf_token', csrfToken);
        
        // Add CSRF token to all forms
        document.querySelectorAll('form').forEach(form => {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        });
    }

    /**
     * Generate CSRF token
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Setup input validation for all forms
     */
    setupInputValidation() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                try {
                    e.target.value = this.sanitizeInput(e.target.value);
                } catch (error) {
                    console.warn('Input validation error:', error.message);
                }
            });
        });
    }

    /**
     * Setup XSS protection
     */
    setupXSSProtection() {
        // Monitor for potential XSS attempts
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.scanForXSS(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Scan for potential XSS content
     */
    scanForXSS(element) {
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i
        ];

        const content = element.innerHTML || element.textContent || '';
        
        dangerousPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                console.warn('Potential XSS attempt detected and blocked');
                element.remove();
            }
        });
    }

    /**
     * Setup rate limiting for user actions
     */
    setupRateLimiting() {
        this.actionCounts = new Map();
        this.rateLimits = {
            calculation: { limit: 100, window: 60000 }, // 100 calculations per minute
            search: { limit: 50, window: 60000 },       // 50 searches per minute
            form_submit: { limit: 5, window: 300000 }   // 5 form submissions per 5 minutes
        };
    }

    /**
     * Check if action is rate limited
     */
    isRateLimited(action) {
        const now = Date.now();
        const config = this.rateLimits[action];
        
        if (!config) return false;
        
        if (!this.actionCounts.has(action)) {
            this.actionCounts.set(action, []);
        }
        
        const actions = this.actionCounts.get(action);
        
        // Remove old actions outside the window
        const validActions = actions.filter(time => now - time < config.window);
        
        if (validActions.length >= config.limit) {
            return true;
        }
        
        // Add current action
        validActions.push(now);
        this.actionCounts.set(action, validActions);
        
        return false;
    }

    /**
     * Monitor for suspicious activity
     */
    monitorSuspiciousActivity() {
        let rapidClicks = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', () => {
            const now = Date.now();
            
            if (now - lastClickTime < 100) { // Clicks faster than 100ms
                rapidClicks++;
                
                if (rapidClicks > 10) {
                    console.warn('Suspicious rapid clicking detected');
                    this.logSecurityEvent('rapid_clicking', { count: rapidClicks });
                }
            } else {
                rapidClicks = 0;
            }
            
            lastClickTime = now;
        });

        // Monitor for console access (potential developer tools usage)
        let devtools = { open: false, orientation: null };
        
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > 200 || 
                window.outerWidth - window.innerWidth > 200) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.logSecurityEvent('devtools_opened');
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    /**
     * Log security events
     */
    logSecurityEvent(event, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store locally (in production, send to server)
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 entries
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
    }

    /**
     * Secure form submission
     */
    secureFormSubmit(form, callback) {
        if (this.isRateLimited('form_submit')) {
            throw new Error('Too many form submissions. Please wait before trying again.');
        }

        // Validate CSRF token
        const csrfToken = form.querySelector('input[name="csrf_token"]')?.value;
        const sessionToken = sessionStorage.getItem('csrf_token');
        
        if (!csrfToken || csrfToken !== sessionToken) {
            throw new Error('Invalid security token. Please refresh the page.');
        }

        // Sanitize all form inputs
        const formData = new FormData(form);
        const sanitizedData = {};
        
        for (let [key, value] of formData.entries()) {
            sanitizedData[key] = this.sanitizeInput(value);
        }

        if (callback) {
            callback(sanitizedData);
        }
        
        return sanitizedData;
    }

    /**
     * Secure calculation wrapper
     */
    secureCalculation(calculationFunction, inputs) {
        if (this.isRateLimited('calculation')) {
            throw new Error('Too many calculations. Please wait a moment.');
        }

        // Validate and sanitize inputs
        const sanitizedInputs = {};
        
        for (let [key, value] of Object.entries(inputs)) {
            if (typeof value === 'string') {
                sanitizedInputs[key] = this.sanitizeInput(value);
            } else if (typeof value === 'number') {
                sanitizedInputs[key] = this.validateNumericInput(value, -1e10, 1e10);
            } else {
                sanitizedInputs[key] = value;
            }
        }

        try {
            return calculationFunction(sanitizedInputs);
        } catch (error) {
            this.logSecurityEvent('calculation_error', { 
                error: error.message,
                inputs: Object.keys(inputs)
            });
            throw error;
        }
    }
}

// Initialize security manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.securityManager = new SecurityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}
