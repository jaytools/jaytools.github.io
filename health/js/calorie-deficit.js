document.addEventListener('DOMContentLoaded', function() {
    console.log('Calorie Deficit Calculator initializing...');

    // Constants for calculations
    const CALORIES_PER_KG = 7700; // Approximately 7700 calories per kg of body weight
    const DEFICIT_VALUES = {
        'mild': 0.25,      // 0.25 kg per week (mild deficit)
        'moderate': 0.5,   // 0.5 kg per week (moderate deficit)
        'aggressive': 1.0  // 1.0 kg per week (aggressive deficit)
    };
    const MIN_AGE = 15;
    const MAX_AGE = 100;

    // Centralized DOM element selection
    const DOM = {
        toolForm: document.getElementById('toolForm'),
        resultSection: document.getElementById('resultSection'),
        resetBtn: document.getElementById('resetBtn'),
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.getElementById('themeIcon'),
        bmrValue: document.getElementById('bmrValue'),
        tdeeValue: document.getElementById('tdeeValue'),
        calorieGoalValue: document.getElementById('calorieGoalValue'),
        weeklyLossValue: document.getElementById('weeklyLossValue'),
        proteinValue: document.getElementById('proteinValue'),
        carbsValue: document.getElementById('carbsValue'),
        fatValue: document.getElementById('fatValue'),
        resultTip: document.getElementById('resultTip'),
        ageError: document.getElementById('ageError'),
        genderError: document.getElementById('genderError'),
        heightError: document.getElementById('heightError'),
        weightError: document.getElementById('weightError'),
        activityLevelError: document.getElementById('activityLevelError'),
        ageInput: document.getElementById('age'),
        genderInput: document.getElementById('gender'),
        heightInput: document.getElementById('height'),
        weightInput: document.getElementById('weight'),
        activityLevelInput: document.getElementById('activityLevel'),
        deficitType: document.getElementById('deficitType')
    };

    // Form data and calculation results (can be managed within functions or a state object)
    let formData = {};
    let calculationResults = {};

    /**
     * Initializes the result section to be hidden.
     */
    function initializeResultSection() {
        if (DOM.resultSection) {
            DOM.resultSection.style.display = 'none';
            console.log('Result section initialized and hidden.');
        } else {
            console.error('Result section not found in DOM!');
        }
    }

    /**
     * Resets all error messages and input error classes.
     */
    function resetErrors() {
        Object.values(DOM).forEach(element => {
            if (element && element.id && element.id.endsWith('Error')) {
                element.style.display = 'none';
            }
            if (element && element.classList && element.tagName === 'INPUT') {
                element.classList.remove('error');
            }
        });
    }

    console.log('Tool initialization complete. Ready for user input.');

    // Initialize result section visibility
    initializeResultSection();

    // Form submission handler
    if (DOM.toolForm) {
        DOM.toolForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted, processing data...');
            
            // Reset error state
            resetErrors();
            
            // Get form values
            getFormData();
            
            // Validate form values
            if (!validateForm(formData)) {
                console.log('Form validation failed.');
                return;
            }
            
            // Calculate values
            calculateResults();
            
            // Display results
            displayResults();
            
            // Scroll to results
            DOM.resultSection.scrollIntoView({ behavior: 'smooth' });
            
            console.log('Form processed successfully, results displayed.');
        });
    } else {
        console.error('Form not found in DOM!');
    }
    
    // Reset button handler
    if (DOM.resetBtn) {
        DOM.resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked.');
            clearForm();
        });
    }
    
    // Theme toggle handler
    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Update icon
            if (document.body.classList.contains('dark-theme')) {
                DOM.themeIcon.classList.remove('fa-moon');
                DOM.themeIcon.classList.add('fa-sun');
            } else {
                DOM.themeIcon.classList.remove('fa-sun');
                DOM.themeIcon.classList.add('fa-moon');
            }
            
            // Save theme preference
            localStorage.setItem('calorieDeficitTheme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            
            console.log('Theme toggled:', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
        
        // Set initial theme from localStorage
        const savedTheme = localStorage.getItem('calorieDeficitTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            DOM.themeIcon.classList.remove('fa-moon');
            DOM.themeIcon.classList.add('fa-sun');
        }
        
        console.log('Theme initialized to:', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }
    
    // Enhance Related Tools Section

// Initialize UI elements after page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page fully loaded, performing final checks");
    
    // Check that key elements exist and are properly displayed
    const toolContainer = document.querySelector('.tool-container');
    const cardHeader = document.querySelector('.card-header');
    const card = document.querySelector('.card');
    const calculatorInterface = document.querySelector('.calculator-interface');
    const resultSection = document.getElementById('resultSection');
    
    // Add theme toggle button if not already present
    if (!document.querySelector('.theme-toggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        
        // Insert at the top of the first card
        if (card) {
            card.style.position = 'relative';
            card.appendChild(themeToggle);
        }
        
        // Set up theme toggle functionality
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update toggle icon
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Check saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
    }
    
    // Force layout recalculation if needed
    if (toolContainer) toolContainer.style.display = 'flex';
    if (card) card.style.display = 'block';
    if (calculatorInterface) calculatorInterface.style.display = 'block';
    
    // Mobile optimizations
    function adjustForMobile() {
        const isMobile = window.innerWidth <= 480;
        
        // Increase tap targets for mobile
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.style.fontSize = isMobile ? '16px' : ''; // Prevent zoom on iOS
        });
        
        // Add fastclick for eliminating the 300ms delay on mobile
        if (isMobile) {
            document.body.addEventListener('touchstart', function(){}, {passive: true});
            
            // Ensure proper spacing on mobile forms
            const formRows = document.querySelectorAll('.form-row');
            formRows.forEach(row => {
                row.style.display = 'block';
            });
            
            // Increase touch area for radio options
            const radioOptions = document.querySelectorAll('.radio-option');
            radioOptions.forEach(option => {
                option.style.padding = '1.2rem 1rem';
                option.style.marginBottom = '0.8rem';
            });
            
            // Better text size for form elements on mobile
            const formLabels = document.querySelectorAll('.form-label');
            formLabels.forEach(label => {
                label.style.fontSize = '0.95rem';
                label.style.marginBottom = '0.5rem';
            });
            
            // Ensure weight loss section has proper spacing
            const weightLossSection = document.querySelector('.form-section-dark:nth-of-type(3)');
            if (weightLossSection) {
                weightLossSection.style.marginBottom = '1rem';
            }
        }
    }
    
    // Run mobile adjustments
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
    
    // Enhance radio buttons for touch devices
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        // Make entire radio option clickable
        option.addEventListener('click', function(e) {
            const input = this.querySelector('input[type="radio"]');
            if (input) input.checked = true;
            
            // Add visual feedback on mobile
            if (window.innerWidth <= 480) {
                const currentActive = document.querySelector('.radio-option.active-touch');
                if (currentActive) currentActive.classList.remove('active-touch');
                this.classList.add('active-touch');
            }
        });
        
        // Handle touch events better
        option.addEventListener('touchend', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="radio"]');
            if (input) input.checked = true;
            
            // Add visual feedback
            const currentActive = document.querySelector('.radio-option.active-touch');
            if (currentActive) currentActive.classList.remove('active-touch');
            this.classList.add('active-touch');
        });
    });
    
    // Initialize FAQ functionality
    initFAQAccordion();
    
    // Add smooth scrolling to section links
    addSmoothScrolling();
    
    // Desktop enhancements
    enhanceDesktopExperience();
});

// FAQ Accordion functionality
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
    
    // Open first FAQ by default on desktop
    if (window.innerWidth > 768 && faqQuestions.length > 0) {
        faqQuestions[0].parentElement.classList.add('active');
    }
}

// Add smooth scrolling to section links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Desktop-specific enhancements
function enhanceDesktopExperience() {
    if (window.innerWidth >= 1024) {
        // Add hover effects to step cards
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });
            
            step.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = 'var(--shadow-sm)';
            });
        });
        
        // Better form spacing on desktop
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.marginBottom = '2rem';
        });
        
        // Enhance tool card for desktop
        const toolCard = document.querySelector('.card');
        if (toolCard) {
            toolCard.style.maxWidth = '900px';
            toolCard.style.margin = '0 auto 2.5rem';
        }
        
        // Add visual cue to calculate button
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
            });
            
            calculateBtn.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        }
    }
}

        // Enhance Related Tools Section
    function enhanceRelatedToolsSection() {
        const relatedToolCards = document.querySelectorAll('.related-tool-card');
        
        // Add animation delay for staggered appearance
        relatedToolCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            
            // Add hover effect for icons
            const icon = card.querySelector('i');
            if (icon) {
                card.addEventListener('mouseenter', () => {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.transition = 'transform 0.3s ease';
                });
                
                card.addEventListener('mouseleave', () => {
                    icon.style.transform = 'scale(1)';
                });
            }
            
            // Make entire card clickable
            card.addEventListener('click', (event) => {
                if (event.target.tagName !== 'A') {
                    card.querySelector('a')?.click();
                }
            });
        });
        
        // Add intersection observer for animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe related tools section
        const relatedToolsSection = document.getElementById('related-tools');
        if (relatedToolsSection) {
            observer.observe(relatedToolsSection);
        }
    }

    /**
     * Gathers form data from the DOM and stores it in the formData object.
     */
    function getFormData() {
        formData.age = parseInt(DOM.ageInput.value);
        formData.gender = DOM.genderInput.value;
        formData.height = parseFloat(DOM.heightInput.value);
        formData.weight = parseFloat(DOM.weightInput.value);
        formData.activityLevel = parseFloat(DOM.activityLevelInput.value);
         const deficitType = DOM.deficitType.value;
    }

    /**
     * Validates the form inputs.
     * @param {object} data - The form data to validate.
     * @returns {boolean} - True if all inputs are valid, false otherwise.
     */
    function validateForm(data) {
        let isValid = true;
        console.log('Validating form data:', data);
        
        // Age validation (MIN_AGE-MAX_AGE)
        if (isNaN(data.age) || data.age < MIN_AGE || data.age > MAX_AGE) {
            DOM.ageError.style.display = 'block';
            DOM.ageInput.classList.add('error');
            isValid = false;
            console.log(`Validation failed for deficitType: ${data.deficitType}`);
            console.log(`Validation failed for activityLevel: ${data.activityLevel}`);
            console.log(`Validation failed for weight: ${data.weight}`);
            console.log(`Validation failed for height: ${data.height}`);
            console.log(`Validation failed for gender: ${data.gender}`);
            console.log(`Validation failed for age: ${data.age}`);
        } else {
            DOM.ageError.style.display = 'none';
            DOM.ageInput.classList.remove('error');
        }
        
        // Gender validation
        if (data.gender === '') {
            DOM.genderError.style.display = 'block';
            DOM.genderInput.classList.add('error');
            isValid = false;
        } else {
            DOM.genderError.style.display = 'none';
            DOM.genderInput.classList.remove('error');
        }
        
        // Height validation (130-250 cm)
        if (isNaN(data.height) || data.height < 130 || data.height > 250) {
            DOM.heightError.style.display = 'block';
            DOM.heightInput.classList.add('error');
            isValid = false;
        } else {
            DOM.heightError.style.display = 'none';
            DOM.heightInput.classList.remove('error');
        }
        
        // Weight validation (30-300 kg)
        if (isNaN(data.weight) || data.weight < 30 || data.weight > 300) {
            DOM.weightError.style.display = 'block';
            DOM.weightInput.classList.add('error');
            isValid = false;
        } else {
            DOM.weightError.style.display = 'none';
            DOM.weightInput.classList.remove('error');
        }
        
        // Activity level validation
        if (isNaN(data.activityLevel) || data.activityLevel === 0) {
            DOM.activityLevelError.style.display = 'block';
            DOM.activityLevelInput.classList.add('error');
            isValid = false;
        } else {
            DOM.activityLevelError.style.display = 'none';
            DOM.activityLevelInput.classList.remove('error');
        }
        
        // Deficit type validation (for new dropdown)
        if (!data.deficitType) {
            DOM.deficitTypeError.style.display = 'block';
            isValid = false;
        }
        
        console.log('Form validation result:', isValid);
        return isValid;
    }
    
    // Reset error states
    function resetErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const inputFields = document.querySelectorAll('input, select');
        
        errorMessages.forEach(error => error.style.display = 'none');
        inputFields.forEach(field => field.classList.remove('error'));
    }
    
    // Calculate BMR, TDEE, and deficit
    function calculateResults() {
        const { age, gender, height, weight, activityLevel, deficitType } = formData;
        let bmr, tdee, calorieGoal, weeklyLoss, protein, carbs, fat;

        // Calculate BMR using Mifflin-St Jeor Equation
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Calculate TDEE
        tdee = bmr * activityLevel;
        
        // Calculate daily calorie deficit based on deficit type
        const weeklyDeficitKg = DEFICIT_VALUES[deficitType];
        const weeklyDeficitCalories = weeklyDeficitKg * CALORIES_PER_KG;
        const dailyDeficitCalories = weeklyDeficitCalories / 7;
        
        // Calculate target daily calorie intake
        calorieGoal = Math.round(tdee - dailyDeficitCalories);
        
        // Set weekly weight loss
        weeklyLoss = weeklyDeficitKg;
        
        // Calculate macronutrient breakdown (typical values)
        // Protein: 30%, Carbs: 45%, Fat: 25%
        protein = Math.round((calorieGoal * 0.3) / 4); // 4 calories per gram of protein
        carbs = Math.round((calorieGoal * 0.45) / 4);  // 4 calories per gram of carbs
        fat = Math.round((calorieGoal * 0.25) / 9);    // 9 calories per gram of fat

        // Store results
        calculationResults = {
            bmr,
            tdee,
            calorieGoal,
            weeklyLoss,
            protein,
            carbs,
            fat,
            deficitType
        };
        console.log('Calculation results:', calculationResults);
    }
    
    // Display calculation results
    function displayResults() {
        const { bmr, tdee, calorieGoal, weeklyLoss, protein, carbs, fat, deficitType } = calculationResults;

        // Round values for display
        const roundedBmr = Math.round(bmr);
        const roundedTdee = Math.round(tdee);
        const roundedCalorieGoal = Math.round(calorieGoal);
        
        // Update DOM with values
        DOM.bmrValue.textContent = roundedBmr;
        DOM.tdeeValue.textContent = roundedTdee;
        DOM.calorieGoalValue.textContent = roundedCalorieGoal;
        DOM.weeklyLossValue.textContent = `${weeklyLoss} kg`;
        
        // Update macronutrient values and progress bars
        DOM.proteinValue.textContent = `${protein}g (30%)`;
        DOM.carbsValue.textContent = `${carbs}g (45%)`;
        DOM.fatValue.textContent = `${fat}g (25%)`;
        
        document.getElementById('proteinBar').style.width = '30%';
        document.getElementById('carbsBar').style.width = '45%';
        document.getElementById('fatBar').style.width = '25%';
        
        // Set tips based on deficit type
        let tip;
        if (deficitType === 'mild') {
            tip = "This mild deficit is sustainable and good for long-term weight loss. You should be able to follow this plan comfortably.";
        } else if (deficitType === 'moderate') {
            tip = "This moderate deficit offers a balanced approach to weight loss. Ensure you're getting enough nutrients to support your activity level.";
        } else {
            tip = "This is an aggressive deficit. Make sure to consume plenty of protein and nutrient-dense foods to stay satisfied and healthy.";
        }
        DOM.resultTip.textContent = tip;
        
        // Show result section
        DOM.resultSection.style.display = 'block';
    }
    
    // Layout validation
    console.log('Validating page layout...');
    // Check that key UI elements exist
    console.log('Layout structure check:');
    const toolContainer = document.querySelector('.tool-container');
    console.log('- Tool container found with children:', toolContainer ? toolContainer.children.length : 0);
    if (toolContainer && toolContainer.children.length >= 2) {
        console.log('- First child is tool-header:', toolContainer.children[0].classList.contains('tool-header'));
        console.log('- Second child is tool-card:', toolContainer.children[1].classList.contains('tool-card'));
    }
    
    // Check that calculate button exists
    const calculateBtn = document.getElementById('calculateBtn');
    console.log('- Calculate button exists:', !!calculateBtn);
    
    // Initialize related tools section enhancements
    enhanceRelatedToolsSection();
});