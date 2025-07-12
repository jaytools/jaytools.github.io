document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const toolForm = document.getElementById('toolForm');
    const resultsSection = document.getElementById('resultsSection');
    const weightInput = document.getElementById('weight');
    const durationInput = document.getElementById('duration');
    const walkingSpeedInput = document.getElementById('walkingSpeed');
    const totalCaloriesElement = document.getElementById('totalCalories');
    const caloriesPerHourElement = document.getElementById('caloriesPerHour');
    const caloriesPerKmElement = document.getElementById('caloriesPerKm');
    const totalDistanceElement = document.getElementById('totalDistance');
    const resultsDetails = document.getElementById('resultsDetails');
    
    // Error messages
    const weightError = document.getElementById('weightError');
    const durationError = document.getElementById('durationError');
    const walkingSpeedError = document.getElementById('walkingSpeedError');
    
    // Add submit event listener to the form
    toolForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate form inputs
        let isValid = validateInputs();
        
        if (isValid) {
            calculateCalories();
        }
    });
    
    // Add input event listeners to clear error messages when user types
    weightInput.addEventListener('input', function() {
        weightError.classList.remove('visible');
    });
    
    durationInput.addEventListener('input', function() {
        durationError.classList.remove('visible');
    });
    
    walkingSpeedInput.addEventListener('input', function() {
        walkingSpeedError.classList.remove('visible');
    });
    
    // Validation function
    function validateInputs() {
        let isValid = true;
        
        // Validate weight
        const weight = parseFloat(weightInput.value);
        if (isNaN(weight) || weight < 30 || weight > 300) {
            weightError.classList.add('visible');
            isValid = false;
        } else {
            weightError.classList.remove('visible');
        }
        
        // Validate duration
        const duration = parseFloat(durationInput.value);
        if (isNaN(duration) || duration <= 0 || duration > 600) {
            durationError.classList.add('visible');
            isValid = false;
        } else {
            durationError.classList.remove('visible');
        }
        
        // Validate walking speed
        const walkingSpeed = parseFloat(walkingSpeedInput.value);
        if (isNaN(walkingSpeed) || walkingSpeed < 1 || walkingSpeed > 10) {
            walkingSpeedError.classList.add('visible');
            isValid = false;
        } else {
            walkingSpeedError.classList.remove('visible');
        }
        
        return isValid;
    }
    
    // Calculation function
    function calculateCalories() {
        // Get input values
        const weight = parseFloat(weightInput.value);
        const duration = parseFloat(durationInput.value);
        const walkingSpeed = parseFloat(walkingSpeedInput.value);
        
        // Calculate MET value based on walking speed
        // MET values from the Compendium of Physical Activities
        let met;
        if (walkingSpeed < 3.2) {
            met = 2.0; // slow walking (< 2 mph)
        } else if (walkingSpeed < 4.0) {
            met = 2.8; // moderate walking (2-2.5 mph)
        } else if (walkingSpeed < 4.8) {
            met = 3.0; // average walking (2.5-3 mph)
        } else if (walkingSpeed < 5.6) {
            met = 3.5; // brisk walking (3-3.5 mph)
        } else if (walkingSpeed < 6.4) {
            met = 4.3; // very brisk walking (3.5-4 mph)
        } else if (walkingSpeed < 7.2) {
            met = 5.0; // fast walking (4-4.5 mph)
        } else {
            met = 6.0; // very fast walking (> 4.5 mph)
        }
        
        // Calculate calories burned
        // Formula: Calories = MET × weight in kg × duration in hours
        const durationHours = duration / 60;
        const totalCalories = met * weight * durationHours;
        
        // Calculate distance covered
        const distanceKm = walkingSpeed * durationHours;
        
        // Calculate calories per hour
        const caloriesPerHour = met * weight;
        
        // Calculate calories per km
        const caloriesPerKm = totalCalories / distanceKm;
        
        // Display results
        totalCaloriesElement.textContent = totalCalories.toFixed(0);
        caloriesPerHourElement.textContent = caloriesPerHour.toFixed(0);
        caloriesPerKmElement.textContent = caloriesPerKm.toFixed(0);
        totalDistanceElement.textContent = distanceKm.toFixed(2);
        
        // Show results section
        resultsSection.classList.add('visible');
        
        // Add detailed interpretation
        generateResultsDetails(totalCalories, distanceKm, duration);
        
        // Blur any active inputs (especially important on mobile to hide keyboard)
        document.activeElement.blur();
        
        // Scroll to results with a slight delay for smoother experience
        setTimeout(() => {
            // On mobile devices, add extra padding to account for virtual keyboards
            const isMobile = window.innerWidth <= 768;
            const scrollOptions = {
                behavior: 'smooth',
                block: isMobile ? 'start' : 'nearest'
            };
            
            resultsSection.scrollIntoView(scrollOptions);
        }, 100);
        
        // Save calculation to history
        saveToHistory(weight, duration, walkingSpeed, totalCalories, distanceKm);
    }
    
    function generateResultsDetails(totalCalories, distanceKm, duration) {
        // Create a detailed interpretation of the results
        let details = '';
        
        // Calorie interpretation with black and white styling
        details += '<div class="result-interpretation">';
        
        // Calorie interpretation
        if (totalCalories < 100) {
            details += '<p>You\'ve burned <strong>less than 100 calories</strong>, which is equivalent to a small apple (about 80 calories).</p>';
        } else if (totalCalories < 200) {
            details += '<p>You\'ve burned <strong>approximately 100-200 calories</strong>, similar to a medium banana (about 105 calories) or a cup of low-fat yogurt (about 150 calories).</p>';
        } else if (totalCalories < 300) {
            details += '<p>You\'ve burned <strong>approximately 200-300 calories</strong>, equivalent to a slice of bread with peanut butter (about 250 calories).</p>';
        } else if (totalCalories < 500) {
            details += '<p>You\'ve burned <strong>approximately 300-500 calories</strong>, similar to a small fast-food hamburger (about 400 calories).</p>';
        } else {
            details += '<p>You\'ve burned <strong>over 500 calories</strong>, which is equivalent to a typical meal or a small fast-food meal deal.</p>';
        }
        
        details += '</div>';
        
        // Distance interpretation with visually appealing styling
        details += '<div class="distance-interpretation">';
        details += `<p>You covered <strong>${distanceKm.toFixed(2)} kilometers</strong> during your ${duration}-minute walk. `;
        
        if (distanceKm < 1) {
            details += 'This is a short distance, good for a brief stroll.</p>';
        } else if (distanceKm < 3) {
            details += 'This is a moderate distance, perfect for a casual walk.</p>';
        } else if (distanceKm < 5) {
            details += 'This is a good distance for a standard workout walk.</p>';
        } else {
            details += 'This is an excellent distance for a fitness walk or light hike.</p>';
        }
        
        details += '</div>';
        
        // Daily goal progress indication
        const percentOfRecommended = Math.min(Math.round((duration / 30) * 100), 100);
        details += '<div class="goal-progress">';
        details += `<p><strong>Daily Activity Goal:</strong> This walk represents approximately ${percentOfRecommended}% of the recommended 30 minutes of daily moderate activity.</p>`;
        details += '</div>';
        
        // Health benefits with clean styling
        details += '<div class="health-benefits">';
        details += '<h4>Health Benefits</h4>';
        details += '<ul>';
        details += '<li>Improved cardiovascular health</li>';
        details += '<li>Enhanced muscle tone and endurance</li>';
        details += '<li>Reduced stress and improved mood</li>';
        details += '<li>Better joint mobility</li>';
        details += '<li>Increased energy levels</li>';
        details += '</ul>';
        details += '</div>';
        
        // Weight loss context with helpful information
        details += '<div class="weight-loss-context">';
        details += '<h4>Weight Loss Context</h4>';
        details += '<p>To lose one pound (0.45 kg) of body fat, you need to burn approximately 3,500 calories more than you consume.</p>';
        
        const daysToLosePound = Math.round(3500 / totalCalories);
        
        if (daysToLosePound < 30) {
            details += `<p>If you maintained this walking routine daily and kept your diet consistent, you could lose approximately one pound every ${daysToLosePound} days just from this activity.</p>`;
        } else {
            details += '<p>While this walking routine contributes to your overall calorie deficit, combining it with other forms of exercise and dietary adjustments would be more effective for weight loss goals.</p>';
        }
        
        details += '</div>';
        
        resultsDetails.innerHTML = details;
    }
    
    // History functionality
    const showHistoryBtn = document.getElementById('showHistoryBtn');
    const historyPanel = document.getElementById('historyPanel');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // Show/hide history panel
    if (showHistoryBtn && historyPanel) {
        showHistoryBtn.addEventListener('click', function() {
            historyPanel.classList.toggle('visible');
            
            if (historyPanel.classList.contains('visible')) {
                historyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    // Clear history
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all calculation history?')) {
                localStorage.removeItem('caloriesWalkingHistory');
                displayHistory();
            }
        });
    }
    
    // Save calculation to history using localStorage
    function saveToHistory(weight, duration, walkingSpeed, totalCalories, distanceKm) {
        const timestamp = new Date().getTime();
        
        const historyItem = {
            id: timestamp,
            weight: weight,
            duration: duration,
            walkingSpeed: walkingSpeed,
            totalCalories: totalCalories,
            distance: distanceKm,
            date: new Date().toLocaleString()
        };
        
        // Get existing history or create new array
        let history = JSON.parse(localStorage.getItem('caloriesWalkingHistory')) || [];
        
        // Add new item to history
        history.unshift(historyItem); // Add to beginning of array
        
        // Limit history to 10 items
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Save updated history
        localStorage.setItem('caloriesWalkingHistory', JSON.stringify(history));
        
        // Update history display
        displayHistory();
    }
    
    // Display history from localStorage
    function displayHistory() {
        if (!historyList) return;
        
        const history = JSON.parse(localStorage.getItem('caloriesWalkingHistory')) || [];
        
        if (history.length === 0) {
            historyList.innerHTML = '<li class="history-item empty-history">No calculations yet. Try making a calculation first!</li>';
            return;
        }
        
        historyList.innerHTML = '';
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            li.innerHTML = `
                <div class="history-item-header">
                    <span class="history-date">${item.date}</span>
                    <div class="history-actions">
                        <button class="history-reuse" data-id="${item.id}">
                            <i class="fas fa-redo"></i> Reuse
                        </button>
                        <button class="history-favorite" data-id="${item.id}">
                            <i class="far fa-star"></i>
                        </button>
                    </div>
                </div>
                <div class="history-details">
                    <span><strong>Weight:</strong> ${item.weight} kg</span>
                    <span><strong>Duration:</strong> ${item.duration} min</span>
                    <span><strong>Speed:</strong> ${item.walkingSpeed} km/h</span>
                    <span><strong>Calories:</strong> ${Math.round(item.totalCalories)}</span>
                    <span><strong>Distance:</strong> ${item.distance.toFixed(2)} km</span>
                </div>
            `;
            
            historyList.appendChild(li);
            
            // Add event listener to reuse button
            const reuseBtn = li.querySelector('.history-reuse');
            reuseBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                reuseCalculation(id);
            });
        });
    }
    
    // Reuse a calculation from history
    function reuseCalculation(id) {
        const history = JSON.parse(localStorage.getItem('caloriesWalkingHistory')) || [];
        const item = history.find(item => item.id == id);
        
        if (item) {
            // Fill form with values from history
            weightInput.value = item.weight;
            durationInput.value = item.duration;
            walkingSpeedInput.value = item.walkingSpeed;
            
            // Calculate again
            calculateCalories();
            
            // Hide history panel
            historyPanel.classList.remove('visible');
        }
    }
    
    // Reset functionality for the Calculate Again button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Clear form inputs
            toolForm.reset();
            
            // Clear error messages
            weightError.classList.remove('visible');
            durationError.classList.remove('visible');
            walkingSpeedError.classList.remove('visible');
            
            // Hide results section
            resultsSection.classList.remove('visible');
            
            // Scroll back to the form with appropriate positioning for mobile
            const isMobile = window.innerWidth <= 768;
            const scrollOptions = {
                behavior: 'smooth',
                block: isMobile ? 'start' : 'nearest'
            };
            
            // Slight delay for smoother experience
            setTimeout(() => {
                toolForm.scrollIntoView(scrollOptions);
                
                // Focus on the first input after a short delay (better UX)
                setTimeout(() => {
                    weightInput.focus();
                }, 500);
            }, 100);
        });
    }
    
    // Display history on page load
    displayHistory();
    
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            
            // Update toggle icon
            if (isDarkMode) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        });
        
        // Check user preference on page load
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    }
});
