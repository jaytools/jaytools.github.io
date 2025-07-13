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
        activityLevelInput: document.getElementById('activityLevel')
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
        formData.deficitType = document.querySelector('input[name="deficitType"]:checked').value;
        console.log('Form data gathered:', formData);
    }

    /**
     * Validates the form inputs.
     * @param {object} data - The form data to validate.
     * @returns {boolean} - True if all inputs are valid, false otherwise.
     */
    function validateForm(data) {
        let isValid = true;
        
        // Age validation (MIN_AGE-MAX_AGE)
        if (isNaN(data.age) || data.age < MIN_AGE || data.age > MAX_AGE) {
            DOM.ageError.style.display = 'block';
            DOM.ageInput.classList.add('error');
            isValid = false;
        } else {
            DOM.ageError.style.display = 'none';
            DOM.ageInput.classList.remove('error');
        }
        
        // Gender validation
        if (gender === '') {
            genderError.style.display = 'block';
            document.getElementById('gender').classList.add('error');
            isValid = false;
        } else {
            genderError.style.display = 'none';
            document.getElementById('gender').classList.remove('error');
        }
        
        // Height validation (130-250 cm)
        if (isNaN(height) || height < 130 || height > 250) {
            heightError.style.display = 'block';
            document.getElementById('height').classList.add('error');
            isValid = false;
        } else {
            heightError.style.display = 'none';
            document.getElementById('height').classList.remove('error');
        }
        
        // Weight validation (30-300 kg)
        if (isNaN(weight) || weight < 30 || weight > 300) {
            weightError.style.display = 'block';
            document.getElementById('weight').classList.add('error');
            isValid = false;
        } else {
            weightError.style.display = 'none';
            document.getElementById('weight').classList.remove('error');
        }
        
        // Activity level validation
        if (isNaN(activityLevel) || activityLevel === 0) {
            activityLevelError.style.display = 'block';
            document.getElementById('activityLevel').classList.add('error');
            isValid = false;
        } else {
            activityLevelError.style.display = 'none';
            document.getElementById('activityLevel').classList.remove('error');
        }
        
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
    }
    
    // Display calculation results
    function displayResults() {
        // Round values for display
        const roundedBmr = Math.round(bmr);
        const roundedTdee = Math.round(tdee);
        const roundedCalorieGoal = Math.round(calorieGoal);
        
        // Update DOM with values
        bmrValue.textContent = roundedBmr;
        tdeeValue.textContent = roundedTdee;
        calorieGoalValue.textContent = roundedCalorieGoal;
        weeklyLossValue.textContent = `${weeklyLoss} kg`;
        
        // Update macronutrient values and progress bars
        proteinValue.textContent = `${protein}g (30%)`;
        carbsValue.textContent = `${carbs}g (45%)`;
        fatValue.textContent = `${fat}g (25%)`;
        
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
        resultTip.textContent = tip;
        
        // Show result section
        resultSection.style.display = 'block';
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