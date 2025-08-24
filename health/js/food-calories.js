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

    // Enhanced food database with more Indian and international foods
    const foodData = [
        // Fruits
        { name: "Apple", caloriesPer100g: 52, unit: "100g" },
        { name: "Banana", caloriesPer100g: 89, unit: "100g" },
        { name: "Orange", caloriesPer100g: 47, unit: "100g" },
        { name: "Mango", caloriesPer100g: 60, unit: "100g" },
        { name: "Grapes", caloriesPer100g: 62, unit: "100g" },
        { name: "Strawberries", caloriesPer100g: 32, unit: "100g" },
        { name: "Blueberries", caloriesPer100g: 57, unit: "100g" },
        { name: "Pineapple", caloriesPer100g: 50, unit: "100g" },
        { name: "Watermelon", caloriesPer100g: 30, unit: "100g" },
        { name: "Avocado", caloriesPer100g: 160, unit: "100g" },
        
        // Vegetables
        { name: "Broccoli", caloriesPer100g: 34, unit: "100g" },
        { name: "Potato (boiled)", caloriesPer100g: 87, unit: "100g" },
        { name: "Sweet Potato", caloriesPer100g: 86, unit: "100g" },
        { name: "Carrot", caloriesPer100g: 41, unit: "100g" },
        { name: "Spinach", caloriesPer100g: 23, unit: "100g" },
        { name: "Tomato", caloriesPer100g: 18, unit: "100g" },
        { name: "Cucumber", caloriesPer100g: 15, unit: "100g" },
        { name: "Onion", caloriesPer100g: 40, unit: "100g" },
        { name: "Garlic", caloriesPer100g: 149, unit: "100g" },
        { name: "Ginger", caloriesPer100g: 80, unit: "100g" },
        { name: "Green Chili", caloriesPer100g: 40, unit: "100g" },
        
        // Indian Staples
        { name: "White Rice (cooked)", caloriesPer100g: 130, unit: "100g" },
        { name: "Brown Rice (cooked)", caloriesPer100g: 111, unit: "100g" },
        { name: "Basmati Rice (cooked)", caloriesPer100g: 121, unit: "100g" },
        { name: "Chapati (whole wheat)", caloriesPer100g: 297, unit: "100g" },
        { name: "Roti (plain)", caloriesPer100g: 280, unit: "piece" },
        { name: "Naan (plain)", caloriesPer100g: 310, unit: "piece" },
        { name: "Paratha (plain)", caloriesPer100g: 320, unit: "piece" },
        { name: "Dal (cooked)", caloriesPer100g: 113, unit: "100g" },
        { name: "Dal Tadka", caloriesPer100g: 125, unit: "100g" },
        { name: "Rajma (kidney beans)", caloriesPer100g: 127, unit: "100g" },
        { name: "Chole (chickpeas)", caloriesPer100g: 164, unit: "100g" },
        { name: "Lentils (cooked)", caloriesPer100g: 116, unit: "100g" },
        
        // Indian Dishes
        { name: "Biryani (chicken)", caloriesPer100g: 170, unit: "100g" },
        { name: "Biryani (vegetable)", caloriesPer100g: 140, unit: "100g" },
        { name: "Pulao (vegetable)", caloriesPer100g: 130, unit: "100g" },
        { name: "Khichdi", caloriesPer100g: 120, unit: "100g" },
        { name: "Samosa (1 piece)", caloriesPer100g: 262, unit: "piece" },
        { name: "Pakora (100g)", caloriesPer100g: 315, unit: "100g" },
        { name: "Dosa (plain)", caloriesPer100g: 168, unit: "piece" },
        { name: "Idli (1 piece)", caloriesPer100g: 39, unit: "piece" },
        { name: "Vada (1 piece)", caloriesPer100g: 150, unit: "piece" },
        { name: "Upma", caloriesPer100g: 100, unit: "100g" },
        
        // Dairy & Proteins
        { name: "Paneer", caloriesPer100g: 296, unit: "100g" },
        { name: "Chicken Breast (cooked)", caloriesPer100g: 165, unit: "100g" },
        { name: "Chicken Curry", caloriesPer100g: 180, unit: "100g" },
        { name: "Mutton Curry", caloriesPer100g: 250, unit: "100g" },
        { name: "Fish Curry", caloriesPer100g: 120, unit: "100g" },
        { name: "Egg (boiled, 1 large)", caloriesPer100g: 155, unit: "piece" },
        { name: "Egg Curry", caloriesPer100g: 145, unit: "100g" },
        { name: "Milk (full fat)", caloriesPer100g: 61, unit: "100ml" },
        { name: "Yogurt (plain)", caloriesPer100g: 59, unit: "100g" },
        { name: "Lassi (sweet)", caloriesPer100g: 85, unit: "100ml" },
        
        // Sweets & Snacks
        { name: "Gulab Jamun (1 piece)", caloriesPer100g: 150, unit: "piece" },
        { name: "Jalebi (1 piece)", caloriesPer100g: 150, unit: "piece" },
        { name: "Rasgulla (1 piece)", caloriesPer100g: 106, unit: "piece" },
        { name: "Laddu (1 piece)", caloriesPer100g: 180, unit: "piece" },
        { name: "Kheer", caloriesPer100g: 97, unit: "100g" },
        { name: "Halwa", caloriesPer100g: 270, unit: "100g" },
        
        // International Foods
        { name: "Pizza (cheese, 1 slice)", caloriesPer100g: 285, unit: "slice" },
        { name: "Burger (beef, plain)", caloriesPer100g: 295, unit: "100g" },
        { name: "French Fries (small)", caloriesPer100g: 312, unit: "100g" },
        { name: "Pasta (cooked)", caloriesPer100g: 131, unit: "100g" },
        { name: "Bread (white)", caloriesPer100g: 265, unit: "100g" },
        { name: "Sandwich (veg)", caloriesPer100g: 250, unit: "piece" },
        
        // Nuts & Others
        { name: "Almonds", caloriesPer100g: 579, unit: "100g" },
        { name: "Walnuts", caloriesPer100g: 654, unit: "100g" },
        { name: "Cashews", caloriesPer100g: 553, unit: "100g" },
        { name: "Peanuts", caloriesPer100g: 567, unit: "100g" },
        { name: "Coconut (fresh)", caloriesPer100g: 354, unit: "100g" },
        { name: "Ghee", caloriesPer100g: 900, unit: "100g" },
        { name: "Butter", caloriesPer100g: 717, unit: "100g" },
        { name: "Olive Oil", caloriesPer100g: 884, unit: "100g" },
        { name: "Sugar", caloriesPer100g: 387, unit: "100g" },
        { name: "Honey", caloriesPer100g: 304, unit: "100g" },
        
        // Beverages
        { name: "Coffee (black)", caloriesPer100g: 1, unit: "100ml" },
        { name: "Tea (black)", caloriesPer100g: 1, unit: "100ml" },
        { name: "Chai (with milk & sugar)", caloriesPer100g: 45, unit: "100ml" },
        { name: "Coca-Cola", caloriesPer100g: 42, unit: "100ml" },
        { name: "Fruit Juice (mixed)", caloriesPer100g: 50, unit: "100ml" },
        { name: "Coconut Water", caloriesPer100g: 19, unit: "100ml" }
    ];

    let selectedFood = null;
    let recentSearches = JSON.parse(localStorage.getItem('recentFoodSearches')) || [];


    // Enhanced error handling
    function clearErrors() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.classList.add('hidden');
    }

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            clearErrors();
        }, 5000);
    }

    // Save recent searches for better UX
    function saveRecentSearch(foodName) {
        if (!recentSearches.includes(foodName)) {
            recentSearches.unshift(foodName);
            recentSearches = recentSearches.slice(0, 5); // Keep only 5 recent searches
            localStorage.setItem('recentFoodSearches', JSON.stringify(recentSearches));
        }
    }

    // Enhanced error handling with user-friendly messages
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
        
        // Add shake animation for better UX
        errorMessageDiv.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            errorMessageDiv.style.animation = '';
        }, 500);
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            clearErrors();
        }, 5000);
    }

    // Enhanced input validation with user-friendly messages
    function validateInputs() {
        if (!selectedFood) {
            showError('🍎 Please select a food from the suggestions to calculate calories.');
            foodNameInput.focus();
            return false;
        }

        const foodWeight = parseFloat(foodWeightInput.value);
        const servings = parseInt(servingsInput.value, 10);

        if (isNaN(foodWeight) || foodWeight <= 0) {
            showError('⚖️ Please enter a valid weight/quantity greater than 0.');
            foodWeightInput.focus();
            return false;
        }

        if (foodWeight > 5000) {
            showError('📏 That seems like a lot! Please enter a reasonable amount (under 5000g).');
            foodWeightInput.focus();
            return false;
        }

        if (isNaN(servings) || servings <= 0) {
            showError('🍽️ Please enter a valid number of servings (1 or more).');
            servingsInput.focus();
            return false;
        }

        if (servings > 20) {
            showError('🍽️ That\'s quite a feast! Please enter a reasonable number of servings (under 20).');
            servingsInput.focus();
            return false;
        }

        return true;
    }

    // Enhanced calorie calculation with detailed breakdown
    function calculateCalories() {
        clearErrors();

        if (!validateInputs()) {
            return;
        }

        const foodWeight = parseFloat(foodWeightInput.value);
        const servings = parseInt(servingsInput.value, 10);

        let totalCalories;
        let unitText = '';
        let caloriesPerServing;

        if (selectedFood.unit === "piece" || selectedFood.unit === "slice") {
            caloriesPerServing = foodWeight * selectedFood.caloriesPer100g;
            totalCalories = caloriesPerServing * servings;
            unitText = foodWeight === 1 ? 'piece' : 'pieces';
        } else {
            caloriesPerServing = (foodWeight * selectedFood.caloriesPer100g) / 100;
            totalCalories = caloriesPerServing * servings;
            unitText = selectedFood.unit === "100ml" ? 'ml' : 'g';
        }

        // Save recent search
        saveRecentSearch(selectedFood.name);

        // Update results with animation
        totalCaloriesSpan.textContent = Math.round(totalCalories);
        caloriesPer100gDisplay.textContent = `${selectedFood.caloriesPer100g} kcal per ${selectedFood.unit}`;
        
        // Create enhanced result message with nutritional context
        const servingText = servings === 1 ? 'serving' : 'servings';
        const weightText = selectedFood.unit === "piece" || selectedFood.unit === "slice" 
            ? `${foodWeight} ${unitText}` 
            : `${foodWeight}${unitText}`;
        
        let contextMessage = '';
        if (totalCalories < 50) {
            contextMessage = ' This is a low-calorie option! 🟢';
        } else if (totalCalories < 200) {
            contextMessage = ' A moderate calorie choice. 🟡';
        } else if (totalCalories < 500) {
            contextMessage = ' This has substantial calories. 🟠';
        } else {
            contextMessage = ' This is quite high in calories. 🔴';
        }
        
        resultMessage.innerHTML = `
            <strong>${selectedFood.name}</strong><br>
            ${weightText} × ${servings} ${servingText} = <strong>${Math.round(totalCalories)} calories</strong><br>
            <small>Per serving: ${Math.round(caloriesPerServing)} kcal${contextMessage}</small>
        `;
        
        // Show results with smooth animation
        resultBox.classList.remove('hidden');
        resultBox.style.opacity = '0';
        resultBox.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultBox.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            resultBox.style.opacity = '1';
            resultBox.style.transform = 'translateY(0)';
            
            // Scroll to results on mobile
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        }, 100);
    }

    // Enhanced reset calculator function
    function resetCalculator() {
        foodNameInput.value = '';
        foodWeightInput.value = '';
        servingsInput.value = '1';
        totalCaloriesSpan.textContent = '0';
        caloriesPer100gDisplay.textContent = '-';
        clearErrors();
        resultBox.classList.add('hidden');
        resultBox.style.opacity = '1';
        resultBox.style.transition = '';
        resultBox.style.transform = '';
        suggestionsBox.innerHTML = '';
        selectedFood = null;
        clearFoodNameBtn.classList.add('hidden');
        
        // Focus on food name input with smooth transition
        setTimeout(() => {
            foodNameInput.focus();
        }, 100);
    }

    // Enhanced food name input handler with recent searches
    function handleFoodNameInput() {
        const query = foodNameInput.value.toLowerCase().trim();
        suggestionsBox.innerHTML = '';
        selectedFood = null;
        clearErrors();

        // Show/hide clear button
        if (query.length > 0) {
            clearFoodNameBtn.classList.remove('hidden');
        } else {
            clearFoodNameBtn.classList.add('hidden');
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

        // Add recent searches if query is empty and we have recent searches
        let suggestionsToShow = filteredFoods;
        if (query.length === 0 && recentSearches.length > 0) {
            const recentFoods = recentSearches.map(name => 
                foodData.find(food => food.name === name)
            ).filter(Boolean);
            suggestionsToShow = recentFoods.slice(0, 5);
        }

        if (suggestionsToShow.length > 0) {
            if (query.length === 0 && recentSearches.length > 0) {
                const recentHeader = document.createElement('div');
                recentHeader.style.padding = '8px 12px';
                recentHeader.style.fontWeight = 'bold';
                recentHeader.style.fontSize = '0.9em';
                recentHeader.style.color = '#666';
                recentHeader.textContent = 'Recent Searches:';
                suggestionsBox.appendChild(recentHeader);
            }
            
            suggestionsToShow.forEach(food => {
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
            noResultsItem.textContent = '🔍 No matching foods found. Try a different search term.';
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
        clearFoodNameBtn.classList.add('hidden');
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
        
        // Set default values
        servingsInput.value = '1';
        caloriesPer100gDisplay.textContent = '-';
        
        // Focus on food name input
        setTimeout(() => {
            foodNameInput.focus();
        }, 100);
    }

    // Event listeners

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