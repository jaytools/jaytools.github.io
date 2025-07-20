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

    // Store 50 common food items with their calorie values (per 100g or per piece)
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
        { name: "Wine", caloriesPer100g: 85, unit: "100ml" }
    ];

    let selectedFood = null;

    // Function to calculate calories
    function calculateCalories() {
        const foodWeight = parseFloat(foodWeightInput.value);
        let servings = parseFloat(servingsInput.value);

        if (!selectedFood) {
            errorMessageDiv.textContent = 'Please select a food item from the suggestions.';
            totalCaloriesSpan.textContent = '0';
            resultBox.style.display = 'none';
            return;
        }

        // Input validation for food weight
        if (isNaN(foodWeight) || foodWeight <= 0) {
            errorMessageDiv.textContent = 'Please enter a valid food weight (e.g., 100).';
            totalCaloriesSpan.textContent = '0';
            resultBox.style.display = 'none';
            return;
        }

        // Default servings to 1 if empty or invalid
        if (isNaN(servings) || servings <= 0) {
            servings = 1;
            servingsInput.value = 1; // Update input field to show default
        }

        errorMessageDiv.textContent = ''; // Clear any previous error messages

        // Core Calculation Logic:
        // Total Calories = (Grams × Calories per 100g × Servings) / 100
        // If unit is 'piece' or 'slice', foodWeight is treated as number of pieces/slices
        let totalCalories;
        if (selectedFood.unit === "piece" || selectedFood.unit === "slice") {
            totalCalories = foodWeight * selectedFood.caloriesPer100g * servings;
        } else {
            totalCalories = (foodWeight * selectedFood.caloriesPer100g * servings) / 100;
        }

        totalCaloriesSpan.textContent = totalCalories.toFixed(2); // Display with 2 decimal places
        caloriesPer100gDisplay.textContent = `${selectedFood.caloriesPer100g} kcal per ${selectedFood.unit}`;
        resultMessage.textContent = `Based on your input, consuming ${foodWeight}${selectedFood.unit === "piece" || selectedFood.unit === "slice" ? " piece(s)" : "g"} of ${selectedFood.name} for ${servings} serving(s) results in approximately ${totalCalories.toFixed(2)} kcal.`;
        resultBox.style.display = 'block'; // Show the result box

        // Animate or fade-in result box for good UX
        resultBox.style.opacity = 0;
        let opacity = 0;
        const fadeInInterval = setInterval(() => {
            if (opacity < 1) {
                opacity += 0.1;
                resultBox.style.opacity = opacity;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 50);
    }

    // Function to reset calculator
    function resetCalculator() {
        foodNameInput.value = '';
        foodWeightInput.value = '';
        servingsInput.value = '';
        totalCaloriesSpan.textContent = '0';
        caloriesPer100gDisplay.textContent = '';
        errorMessageDiv.textContent = '';
        resultBox.style.display = 'none'; // Hide the result box
        resultBox.style.opacity = 1; // Reset opacity for next calculation
        suggestionsBox.innerHTML = ''; // Clear suggestions
        selectedFood = null;
    }

    // Auto-suggest functionality
    foodNameInput.addEventListener('input', function() {
        const query = foodNameInput.value.toLowerCase();
        suggestionsBox.innerHTML = '';
        selectedFood = null; // Reset selected food when typing

        if (query.length > 0) {
            clearFoodNameBtn.style.display = 'block';
        } else {
            clearFoodNameBtn.style.display = 'none';
        }

        if (query.length === 0) {
            return;
        }

        const filteredFoods = foodData.filter(food =>
            food.name.toLowerCase().includes(query)
        ).slice(0, 5); // Limit to 5 suggestions

        if (filteredFoods.length > 0) {
            filteredFoods.forEach(food => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = food.name;
                suggestionItem.addEventListener('click', () => {
                    foodNameInput.value = food.name;
                    selectedFood = food;
                    caloriesPer100gDisplay.textContent = `${food.caloriesPer100g} kcal per ${food.unit}`;
                    suggestionsBox.innerHTML = ''; // Clear suggestions after selection
                    errorMessageDiv.textContent = ''; // Clear error message
                });
                suggestionsBox.appendChild(suggestionItem);
            });
        } else {
            errorMessageDiv.textContent = 'Sorry, data not found for this food.';
            caloriesPer100gDisplay.textContent = '';
        }
    });

    // Clear suggestions when clicking outside the input/suggestions box
    document.addEventListener('click', function(event) {
        if (!foodNameInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.innerHTML = '';
        }
    });

    // Event Listeners
    calculateBtn.addEventListener('click', calculateCalories);
    resetBtn.addEventListener('click', resetCalculator);

    clearFoodNameBtn.addEventListener('click', () => {
        foodNameInput.value = '';
        suggestionsBox.innerHTML = '';
        selectedFood = null;
        clearFoodNameBtn.style.display = 'none';
        errorMessageDiv.textContent = '';
    });
});