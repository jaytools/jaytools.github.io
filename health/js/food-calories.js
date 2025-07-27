document.addEventListener('DOMContentLoaded', function() {
    const foodNameInput = document.getElementById('foodName');
    const clearFoodNameBtn = document.getElementById('clearFoodName');
    const foodWeightInput = document.getElementById('foodWeight');
    const servingsInput = document.getElementById('servings');
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const totalCaloriesSpan = document.getElementById('totalCalories');
    const caloriesPer100gDisplay = document.getElementById('caloriesPer100gDisplay');
    const errorMessageDiv = document.getElementById('errorMessage');
    const resultBox = document.getElementById('resultBox');
    const resultMessage = document.getElementById('resultMessage');
    const suggestionsBox = document.getElementById('suggestionsBox');
    const darkModeToggle = document.getElementById('darkModeToggle');

    const foodData = [
        { name: "Apple", caloriesPer100g: 52, unit: "100g" },
        { name: "Banana", caloriesPer100g: 89, unit: "100g" },
        { name: "Orange", caloriesPer100g: 47, unit: "100g" },
        { name: "Broccoli", caloriesPer100g: 34, unit: "100g" },
        { name: "Chicken Breast", caloriesPer100g: 165, unit: "100g" },
        { name: "White Rice", caloriesPer100g: 130, unit: "100g" },
        { name: "Brown Rice", caloriesPer100g: 111, unit: "100g" },
        { name: "Lentils (cooked)", caloriesPer100g: 116, unit: "100g" },
        { name: "Chapati (whole wheat)", caloriesPer100g: 297, unit: "100g" },
        { name: "Dal (cooked)", caloriesPer100g: 113, unit: "100g" },
        { name: "Paneer", caloriesPer100g: 296, unit: "100g" },
        { name: "Samosa (1 piece)", caloriesPer100g: 262, unit: "piece" },
        { name: "Biryani (chicken)", caloriesPer100g: 170, unit: "100g" },
        { name: "Pizza (cheese, 1 slice)", caloriesPer100g: 285, unit: "slice" },
        { name: "Burger (beef, plain)", caloriesPer100g: 295, unit: "100g" },
        { name: "French Fries (small)", caloriesPer100g: 312, unit: "100g" },
        { name: "Doughnut (glazed)", caloriesPer100g: 452, unit: "100g" },
        { name: "Chocolate Bar", caloriesPer100g: 535, unit: "100g" },
        { name: "Ice Cream (vanilla)", caloriesPer100g: 207, unit: "100g" },
        { name: "Gulab Jamun (1 piece)", caloriesPer100g: 150, unit: "piece" },
        { name: "Jalebi (1 piece)", caloriesPer100g: 150, unit: "piece" },
        { name: "Milk (full fat)", caloriesPer100g: 61, unit: "100ml" },
        { name: "Yogurt (plain)", caloriesPer100g: 59, unit: "100g" },
        { name: "Egg (boiled, 1 large)", caloriesPer100g: 155, unit: "piece" },
        { name: "Salmon", caloriesPer100g: 208, unit: "100g" },
        { name: "Potato (boiled)", caloriesPer100g: 87, unit: "100g" },
        { name: "Carrot", caloriesPer100g: 41, unit: "100g" },
        { name: "Spinach", caloriesPer100g: 23, unit: "100g" },
        { name: "Tomato", caloriesPer100g: 18, unit: "100g" },
        { name: "Cucumber", caloriesPer100g: 15, unit: "100g" },
        { name: "Onion", caloriesPer100g: 40, unit: "100g" },
        { name: "Garlic", caloriesPer100g: 149, unit: "100g" },
        { name: "Ginger", caloriesPer100g: 80, unit: "100g" },
        { name: "Green Chili", caloriesPer100g: 40, unit: "100g" },
        { name: "Coconut (fresh)", caloriesPer100g: 354, unit: "100g" },
        { name: "Almonds", caloriesPer100g: 579, unit: "100g" },
        { name: "Walnuts", caloriesPer100g: 654, unit: "100g" },
        { name: "Cashews", caloriesPer100g: 553, unit: "100g" },
        { name: "Peanuts", caloriesPer100g: 567, unit: "100g" },
        { name: "Butter", caloriesPer100g: 717, unit: "100g" },
        { name: "Ghee", caloriesPer100g: 900, unit: "100g" },
        { name: "Olive Oil", caloriesPer100g: 884, unit: "100g" },
        { name: "Sugar", caloriesPer100g: 387, unit: "100g" },
        { name: "Honey", caloriesPer100g: 304, unit: "100g" },
        { name: "Bread (white)", caloriesPer100g: 265, unit: "100g" },
        { name: "Coffee (black)", caloriesPer100g: 1, unit: "100ml" },
        { name: "Tea (black)", caloriesPer100g: 1, unit: "100ml" },
        { name: "Coca-Cola", caloriesPer100g: 42, unit: "100ml" },
        { name: "Beer", caloriesPer100g: 43, unit: "100ml" },
        { name: "Wine", caloriesPer100g: 85, unit: "100ml" },
        { name: "Avocado", caloriesPer100g: 160, unit: "100g" },
        { name: "Mango", caloriesPer100g: 60, unit: "100g" },
        { name: "Grapes", caloriesPer100g: 62, unit: "100g" },
        { name: "Strawberries", caloriesPer100g: 32, unit: "100g" },
        { name: "Blueberries", caloriesPer100g: 57, unit: "100g" },
        { name: "Pineapple", caloriesPer100g: 50, unit: "100g" },
        { name: "Watermelon", caloriesPer100g: 30, unit: "100g" },
        { name: "Pasta (cooked)", caloriesPer100g: 131, unit: "100g" },
        { name: "Quinoa (cooked)", caloriesPer100g: 120, unit: "100g" },
        { name: "Oats (cooked)", caloriesPer100g: 68, unit: "100g" },
        { name: "Greek Yogurt", caloriesPer100g: 97, unit: "100g" },
        { name: "Cheese (cheddar)", caloriesPer100g: 402, unit: "100g" },
        { name: "Tuna (canned)", caloriesPer100g: 116, unit: "100g" },
        { name: "Sweet Potato", caloriesPer100g: 86, unit: "100g" }
    ];

    let selectedFood = null;

    // Dark mode functionality
    function initializeDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }
    }

    function updateDarkModeIcon(isDark) {
        const icon = darkModeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateDarkModeIcon(isDarkMode);
    }

    // Clear error messages
    function clearErrors() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    }

    // Show error message
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    }

    // Validate inputs
    function validateInputs() {
        if (!selectedFood) {
            showError('Please select a food from the suggestions.');
            return false;
        }

        const foodWeight = parseFloat(foodWeightInput.value);
        const servings = parseInt(servingsInput.value, 10);

        if (isNaN(foodWeight) || foodWeight <= 0) {
            showError('Please enter a valid weight/quantity greater than 0.');
            foodWeightInput.focus();
            return false;
        }

        if (foodWeight > 5000) {
            showError('Weight/quantity seems too high. Please enter a reasonable amount.');
            foodWeightInput.focus();
            return false;
        }

        if (isNaN(servings) || servings <= 0) {
            showError('Please enter a valid number of servings (1 or more).');
            servingsInput.focus();
            return false;
        }

        if (servings > 20) {
            showError('Number of servings seems too high. Please enter a reasonable amount.');
            servingsInput.focus();
            return false;
        }

        return true;
    }

    // Calculate calories
    function calculateCalories() {
        clearErrors();

        if (!validateInputs()) {
            return;
        }

        const foodWeight = parseFloat(foodWeightInput.value);
        const servings = parseInt(servingsInput.value, 10);

        let totalCalories;
        let unitText = '';

        if (selectedFood.unit === "piece" || selectedFood.unit === "slice") {
            totalCalories = foodWeight * selectedFood.caloriesPer100g * servings;
            unitText = foodWeight === 1 ? 'piece' : 'pieces';
        } else {
            totalCalories = (foodWeight * selectedFood.caloriesPer100g * servings) / 100;
            unitText = selectedFood.unit === "100ml" ? 'ml' : 'g';
        }

        // Update results
        totalCaloriesSpan.textContent = Math.round(totalCalories);
        caloriesPer100gDisplay.textContent = `${selectedFood.caloriesPer100g} kcal per ${selectedFood.unit}`;
        
        // Create detailed result message
        const servingText = servings === 1 ? 'serving' : 'servings';
        const weightText = selectedFood.unit === "piece" || selectedFood.unit === "slice" 
            ? `${foodWeight} ${unitText}` 
            : `${foodWeight}${unitText}`;
        
        resultMessage.textContent = `Based on your input, consuming ${weightText} of ${selectedFood.name} for ${servings} ${servingText} contains approximately ${Math.round(totalCalories)} calories.`;
        
        // Show results with animation
        resultBox.style.display = 'block';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Add fade-in animation
        resultBox.style.opacity = '0';
        setTimeout(() => {
            resultBox.style.transition = 'opacity 0.5s ease-in-out';
            resultBox.style.opacity = '1';
        }, 100);
    }

    // Reset calculator
    function resetCalculator() {
        foodNameInput.value = '';
        foodWeightInput.value = '';
        servingsInput.value = '1';
        totalCaloriesSpan.textContent = '0';
        caloriesPer100gDisplay.textContent = '-';
        clearErrors();
        resultBox.style.display = 'none';
        resultBox.style.opacity = '1';
        resultBox.style.transition = '';
        suggestionsBox.innerHTML = '';
        selectedFood = null;
        clearFoodNameBtn.style.display = 'none';
        
        // Focus on food name input
        foodNameInput.focus();
    }

    // Handle food name input
    function handleFoodNameInput() {
        const query = foodNameInput.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';
        selectedFood = null;
        clearErrors();

        // Show/hide clear button
        if (query.length > 0) {
            clearFoodNameBtn.style.display = 'block';
        } else {
            clearFoodNameBtn.style.display = 'none';
            caloriesPer100gDisplay.textContent = '-';
            return;
        }

        if (query.length < 2) {
            return;
        }

        // Filter foods based on query
        const filteredFoods = foodData.filter(food =>
            food.name.toLowerCase().includes(query)
        ).slice(0, 8); // Show more suggestions

        if (filteredFoods.length > 0) {
            filteredFoods.forEach(food => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.innerHTML = `
                    <strong>${food.name}</strong>
                    <small style="color: #666; margin-left: 8px;">${food.caloriesPer100g} kcal per ${food.unit}</small>
                `;
                
                suggestionItem.addEventListener('click', () => {
                    selectFood(food);
                });
                
                suggestionsBox.appendChild(suggestionItem);
            });
        } else {
            const noResultsItem = document.createElement('div');
            noResultsItem.classList.add('suggestion-item');
            noResultsItem.style.color = '#999';
            noResultsItem.style.fontStyle = 'italic';
            noResultsItem.textContent = 'No matching foods found. Try a different search term.';
            suggestionsBox.appendChild(noResultsItem);
        }
    }

    // Select a food item
    function selectFood(food) {
        foodNameInput.value = food.name;
        selectedFood = food;
        caloriesPer100gDisplay.textContent = `${food.caloriesPer100g} kcal per ${food.unit}`;
        suggestionsBox.innerHTML = '';
        clearErrors();
        
        // Focus on weight input
        foodWeightInput.focus();
        
        // Update placeholder text based on unit
        if (food.unit === "piece" || food.unit === "slice") {
            foodWeightInput.placeholder = "quantity";
        } else {
            foodWeightInput.placeholder = "grams";
        }
    }

    // Clear food name input
    function clearFoodName() {
        foodNameInput.value = '';
        suggestionsBox.innerHTML = '';
        selectedFood = null;
        clearFoodNameBtn.style.display = 'none';
        caloriesPer100gDisplay.textContent = '-';
        clearErrors();
        foodWeightInput.placeholder = "grams";
        foodNameInput.focus();
    }

    // Handle clicks outside suggestions
    function handleDocumentClick(event) {
        if (!foodNameInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.innerHTML = '';
        }
    }

    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        const suggestions = suggestionsBox.querySelectorAll('.suggestion-item');
        if (suggestions.length === 0) return;

        let currentIndex = -1;
        suggestions.forEach((item, index) => {
            if (item.classList.contains('highlighted')) {
                currentIndex = index;
            }
        });

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % suggestions.length;
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            currentIndex = currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1;
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (currentIndex >= 0 && suggestions[currentIndex]) {
                suggestions[currentIndex].click();
            }
            return;
        } else if (event.key === 'Escape') {
            suggestionsBox.innerHTML = '';
            return;
        } else {
            return;
        }

        // Update highlighting
        suggestions.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('highlighted');
                item.style.backgroundColor = '#f0f0f0';
            } else {
                item.classList.remove('highlighted');
                item.style.backgroundColor = '';
            }
        });
    }

    // Initialize the application
    function init() {
        initializeDarkMode();
        
        // Set default values
        servingsInput.value = '1';
        caloriesPer100gDisplay.textContent = '-';
        
        // Focus on food name input
        setTimeout(() => {
            foodNameInput.focus();
        }, 100);
    }

    // Event listeners
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    if (foodNameInput) {
        foodNameInput.addEventListener('input', handleFoodNameInput);
        foodNameInput.addEventListener('keydown', handleKeyboardNavigation);
    }

    if (clearFoodNameBtn) {
        clearFoodNameBtn.addEventListener('click', clearFoodName);
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCalories);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetCalculator);
    }

    // Handle Enter key on form inputs
    if (foodWeightInput) {
        foodWeightInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                servingsInput.focus();
            }
        });
    }

    if (servingsInput) {
        servingsInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                calculateCalories();
            }
        });
    }

    // Handle clicks outside suggestions
    document.addEventListener('click', handleDocumentClick);

    // Initialize the app
    init();

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', function(e) {
                // Let the browser handle the details toggle
                setTimeout(() => {
                    if (item.hasAttribute('open')) {
                        // Scroll into view if on mobile
                        if (window.innerWidth < 768) {
                            summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }, 100);
            });
        }
    });
});