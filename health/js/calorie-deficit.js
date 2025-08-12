// DOM Elements
const DOM = {};

// Function to initialize DOM elements
function initializeDOMElements() {
    console.log('Initializing DOM elements');
    const elements = {
        toolForm: 'toolForm',
        age: 'age',
        gender: 'gender',
        height: 'height',
        weight: 'weight',
        activityLevel: 'activityLevel',
        deficitType: 'deficitType',
        calculateBtn: 'calculateBtn',
        resultSection: '.result-section',
        bmrValue: 'bmrValue',
        tdeeValue: 'tdeeValue',
        calorieGoalValue: 'calorieGoalValue',
        weeklyLossValue: 'weeklyLossValue',
        proteinBar: 'proteinBar',
        carbsBar: 'carbsBar',
        fatBar: 'fatBar',
        proteinValue: 'proteinValue',
        carbsValue: 'carbsValue',
        fatValue: 'fatValue',
        resetBtn: 'resetBtn',
        shareBtn: 'shareBtn'
    };

    for (const [key, value] of Object.entries(elements)) {
        if (value.startsWith('.')) {
            DOM[key] = document.querySelector(value);
        } else {
            DOM[key] = document.getElementById(value);
        }
        console.log(`${key}: ${DOM[key] ? 'found' : 'not found'}`);
    }
}

// Constants for calculations
const CALORIES_PER_KG = 7700;
const PROTEIN_CALORIES = 4;
const CARBS_CALORIES = 4;
const FAT_CALORIES = 9;

// Initialize
function init() {
    console.log('Starting initialization');
    try {
        initializeDOMElements();
        
        // Ensure result section exists and is properly hidden
        if (DOM.resultSection) {
            console.log('Result section found, hiding it');
            DOM.resultSection.style.display = 'none';
            DOM.resultSection.classList.remove('visible');
        } else {
            console.error('Result section not found during initialization');
        }
        
        resetForm();
        addEventListeners();
        console.log('Calculator initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Hide result section
function hideResultSection() {
    console.log('Hiding result section');
    if (DOM.resultSection) {
        DOM.resultSection.classList.remove('visible');
        console.log('Result section hidden');
    } else {
        console.error('Result section element not found');
    }
}

// Reset form
function resetForm(e) {
    if (e) e.preventDefault();
    console.log('Resetting form');
    try {
        if (DOM.toolForm) {
            DOM.toolForm.reset();
            console.log('Form reset');
        }

        if (DOM.resultSection) {
            // First remove the visible class to trigger fade out
            DOM.resultSection.classList.remove('visible');
            
            // Wait for the transition to complete before hiding
            setTimeout(() => {
                DOM.resultSection.style.display = 'none';
                console.log('Result section hidden');
            }, 300); // Match the transition duration from CSS
        } else {
            console.error('Result section not found during reset');
        }

        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

// Add event listeners
function addEventListeners() {
    console.log('Setting up event listeners');
    
    if (DOM.toolForm) {
        DOM.toolForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            handleCalculate(e);
        });
        console.log('Form submit listener added');
    } else {
        console.error('Tool form not found');
    }
    
    if (DOM.calculateBtn) {
        DOM.calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Calculate button clicked');
            handleCalculate(e);
        });
        console.log('Calculate button listener added');
    } else {
        console.error('Calculate button not found');
    }
    
    if (DOM.resetBtn) {
        DOM.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Reset button clicked');
            resetForm();
        });
        console.log('Reset button listener added');
    } else {
        console.error('Reset button not found');
    }
    
    if (DOM.shareBtn) {
        DOM.shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Share button clicked');
            shareResult();
        });
        console.log('Share button listener added');
    } else {
        console.error('Share button not found');
    }
}

// Handle form submission and calculation
function handleCalculate(e) {
    e.preventDefault();
    console.log('Handle calculate called');
    
    try {
        const formData = getFormData();
        console.log('Form data:', formData);
        
        if (validateForm(formData)) {
            console.log('Form validation passed');
            const results = calculateResults(formData);
            console.log('Calculation results:', results);
            displayResults(results);
        } else {
            console.error('Form validation failed');
        }
    } catch (error) {
        console.error('Error in handleCalculate:', error);
    }
}

// Get form data
function getFormData() {
    console.log('Getting form data');
    try {
        const formData = {
            age: parseInt(DOM.age?.value),
            gender: DOM.gender?.value,
            height: parseFloat(DOM.height?.value),
            weight: parseFloat(DOM.weight?.value),
            activityLevel: parseFloat(DOM.activityLevel?.value),
            deficitType: DOM.deficitType?.value
        };
        
        console.log('Form data collected:', formData);
        return formData;
    } catch (error) {
        console.error('Error getting form data:', error);
        return {};
    }
}

// Validate form data
function validateForm(data) {
    console.log('Validating form data:', data);
    let isValid = true;
    
    try {
        // Age validation
        if (!data.age || isNaN(data.age) || data.age < 15 || data.age > 80) {
            document.getElementById('ageError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('ageError').style.display = 'none';
        }

        // Gender validation
        if (!data.gender) {
            document.getElementById('genderError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('genderError').style.display = 'none';
        }

        // Height validation
        if (!data.height || isNaN(data.height) || data.height < 130 || data.height > 230) {
            document.getElementById('heightError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('heightError').style.display = 'none';
        }

        // Weight validation
        if (!data.weight || isNaN(data.weight) || data.weight < 40 || data.weight > 160) {
            document.getElementById('weightError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('weightError').style.display = 'none';
        }

        // Activity level validation
        if (!data.activityLevel) {
            document.getElementById('activityLevelError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('activityLevelError').style.display = 'none';
        }

        // Deficit type validation
        if (!data.deficitType) {
            document.getElementById('deficitTypeError').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('deficitTypeError').style.display = 'none';
        }

        console.log('Form validation result:', isValid);
        return isValid;
    } catch (error) {
        console.error('Error in form validation:', error);
        return false;
    }
}

// Calculate results
function calculateResults(data) {
    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = data.gender === 'male'
        ? (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5
        : (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
    
    // Calculate TDEE
    const tdee = bmr * data.activityLevel;
    
    // Calculate deficit based on type
    let weeklyLoss;
    switch(data.deficitType) {
        case 'mild':
            weeklyLoss = 0.25;
            break;
        case 'moderate':
            weeklyLoss = 0.5;
            break;
        case 'aggressive':
            weeklyLoss = 1.0;
            break;
        default:
            weeklyLoss = 0.5;
    }
    
    const dailyDeficit = (weeklyLoss * CALORIES_PER_KG) / 7;
    const calorieGoal = tdee - dailyDeficit;
    
    // Calculate macronutrients
    const protein = (calorieGoal * 0.3) / PROTEIN_CALORIES;
    const carbs = (calorieGoal * 0.45) / CARBS_CALORIES;
    const fat = (calorieGoal * 0.25) / FAT_CALORIES;
    
    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calorieGoal: Math.round(calorieGoal),
        weeklyLoss,
        macros: {
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat)
        }
    };
}

// Display results
function displayResults(results) {
    console.log('Displaying results:', results);
    
    try {
        // Update result values
        DOM.bmrValue.textContent = results.bmr;
        DOM.tdeeValue.textContent = results.tdee;
        DOM.calorieGoalValue.textContent = results.calorieGoal;
        DOM.weeklyLossValue.textContent = `${results.weeklyLoss} kg`;
        
        // Update macronutrient bars and values
        DOM.proteinValue.textContent = `${results.macros.protein}g (30%)`;
        DOM.carbsValue.textContent = `${results.macros.carbs}g (45%)`;
        DOM.fatValue.textContent = `${results.macros.fat}g (25%)`;
        
        DOM.proteinBar.style.width = '30%';
        DOM.carbsBar.style.width = '45%';
        DOM.fatBar.style.width = '25%';
        
        // Show result section with animation
        if (DOM.resultSection) {
            console.log('Showing result section');
            // First set display to block
            DOM.resultSection.style.display = 'block';
            // Force a reflow
            void DOM.resultSection.offsetWidth;
            // Then add the visible class for the animation
            requestAnimationFrame(() => {
                DOM.resultSection.classList.add('visible');
            });
            console.log('Result section should now be visible');
        } else {
            console.error('Result section element not found');
        }
    } catch (error) {
        console.error('Error displaying results:', error);
    }
}

// Share result
function shareResult(e) {
    if (e) e.preventDefault();
    
    // Create share text
    const shareText = `Calorie Deficit Calculator Results:\n\n` +
        `BMR: ${DOM.bmrValue.textContent} calories/day\n` +
        `TDEE: ${DOM.tdeeValue.textContent} calories/day\n` +
        `Daily Calorie Goal: ${DOM.calorieGoalValue.textContent} calories\n` +
        `Weekly Weight Loss: ${DOM.weeklyLossValue.textContent}\n\n` +
        `Macronutrient Breakdown:\n` +
        `Protein: ${DOM.proteinValue.textContent}\n` +
        `Carbs: ${DOM.carbsValue.textContent}\n` +
        `Fat: ${DOM.fatValue.textContent}\n\n` +
        `Calculate your calorie deficit: [Your Website URL]`;

    // Try to use the Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'My Calorie Deficit Plan',
            text: shareText
        }).catch(console.error);
    } else {
        // Fallback to clipboard copy
        navigator.clipboard.writeText(shareText)
            .then(() => {
                const feedback = document.getElementById('shareFeedback');
                feedback.textContent = 'Results copied to clipboard!';
                feedback.style.display = 'block';
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 3000);
            })
            .catch(console.error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    init();
    setupFAQToggle();
});

// FAQ Toggle Functionality
function setupFAQToggle() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            if (faqItem) {
                faqItem.classList.toggle('active');
            }
        });
    });
}