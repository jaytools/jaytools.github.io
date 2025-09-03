// DOM Elements
const DOM = {};

// Function to initialize DOM elements
function initializeDOMElements() {
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
    }
}

// Constants for calculations
const CALORIES_PER_KG = 7700;
const PROTEIN_CALORIES = 4;
const CARBS_CALORIES = 4;
const FAT_CALORIES = 9;

// Initialize
function init() {
    try {
        initializeDOMElements();
        
        // Ensure result section exists and is properly hidden
        if (DOM.resultSection) {
            DOM.resultSection.style.display = 'none';
            DOM.resultSection.classList.remove('visible');
        }
        
        resetForm();
        addEventListeners();
    } catch (error) {
        // Silent error handling
    }
}

// Hide result section
function hideResultSection() {
    if (DOM.resultSection) {
        DOM.resultSection.classList.remove('visible');
    }
}

// Reset form
function resetForm(e) {
    if (e) e.preventDefault();
    try {
        if (DOM.toolForm) {
            DOM.toolForm.reset();
        }

        if (DOM.resultSection) {
            // First remove the visible class to trigger fade out
            DOM.resultSection.classList.remove('visible');
            
            // Wait for the transition to complete before hiding
            setTimeout(() => {
                DOM.resultSection.style.display = 'none';
            }, 300); // Match the transition duration from CSS
        }

        // Clear error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    } catch (error) {
        // Silent error handling
    }
}

// Add event listeners
function addEventListeners() {
    
    if (DOM.toolForm) {
        DOM.toolForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleCalculate(e);
        });
    }
    
    if (DOM.calculateBtn) {
        DOM.calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleCalculate(e);
        });
    }
    
    if (DOM.resetBtn) {
        DOM.resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm();
        });
    }
    
    if (DOM.shareBtn) {
        DOM.shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            shareResult();
        });
    }
}

// Handle form submission and calculation
function handleCalculate(e) {
    e.preventDefault();
    
    try {
        const formData = getFormData();
        
        if (validateForm(formData)) {
            const results = calculateResults(formData);
            displayResults(results);
        }
    } catch (error) {
        // Silent error handling
    }
}

// Get form data
function getFormData() {
    try {
        const formData = {
            age: parseInt(DOM.age?.value),
            gender: DOM.gender?.value,
            height: parseFloat(DOM.height?.value),
            weight: parseFloat(DOM.weight?.value),
            activityLevel: parseFloat(DOM.activityLevel?.value),
            deficitType: DOM.deficitType?.value
        };
        
            return formData;
    } catch (error) {
        return {};
    }
}

// Validate form data
function validateForm(data) {
    let isValid = true;
    
    try {
        // Age validation
        const ageError = document.getElementById('ageError');
        if (!data.age || isNaN(data.age) || data.age < 15 || data.age > 80) {
            if (ageError) ageError.style.display = 'block';
            isValid = false;
        } else {
            if (ageError) ageError.style.display = 'none';
        }

        // Gender validation
        const genderError = document.getElementById('genderError');
        if (!data.gender) {
            if (genderError) genderError.style.display = 'block';
            isValid = false;
        } else {
            if (genderError) genderError.style.display = 'none';
        }

        // Height validation
        const heightError = document.getElementById('heightError');
        if (!data.height || isNaN(data.height) || data.height < 130 || data.height > 230) {
            if (heightError) heightError.style.display = 'block';
            isValid = false;
        } else {
            if (heightError) heightError.style.display = 'none';
        }

        // Weight validation
        const weightError = document.getElementById('weightError');
        if (!data.weight || isNaN(data.weight) || data.weight < 30 || data.weight > 200) {
            if (weightError) weightError.style.display = 'block';
            isValid = false;
        } else {
            if (weightError) weightError.style.display = 'none';
        }

        // Activity level validation
        if (!data.activityLevel) {
            const activityError = document.getElementById('activity-error');
            if (activityError) activityError.style.display = 'block';
            isValid = false;
        } else {
            const activityError = document.getElementById('activity-error');
            if (activityError) activityError.style.display = 'none';
        }

        // Deficit type validation
        if (!data.deficitType) {
            const deficitError = document.getElementById('deficit-error');
            if (deficitError) deficitError.style.display = 'block';
            isValid = false;
        } else {
            const deficitError = document.getElementById('deficit-error');
            if (deficitError) deficitError.style.display = 'none';
        }

        return isValid;
    } catch (error) {
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
            // First set display to block
            DOM.resultSection.style.display = 'block';
            // Force a reflow
            void DOM.resultSection.offsetWidth;
            // Then add the visible class for the animation
            requestAnimationFrame(() => {
                DOM.resultSection.classList.add('visible');
            });
        }
    } catch (error) {
        // Silent error handling
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