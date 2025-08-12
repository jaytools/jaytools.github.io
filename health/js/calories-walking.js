document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const toolForm = document.getElementById('toolForm');
    const resultsSection = document.getElementById('resultsSection');
    const weightInput = document.getElementById('weight');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const durationInput = document.getElementById('duration');
    const walkingSpeedInput = document.getElementById('walkingSpeed');
    const totalCaloriesElement = document.getElementById('totalCalories');
    const caloriesPerHourElement = document.getElementById('caloriesPerHour');
    const caloriesPerKmElement = document.getElementById('caloriesPerKm');
    const totalDistanceElement = document.getElementById('totalDistance');
    const resultsDetails = document.getElementById('resultsDetails');
    const historyPanel = document.getElementById('historyPanel');
    const showHistoryBtn = document.getElementById('showHistoryBtn');
    
    // Error messages
    const weightError = document.getElementById('weightError');
    const ageError = document.getElementById('ageError');
    const genderError = document.getElementById('genderError');
    const durationError = document.getElementById('durationError');
    const walkingSpeedError = document.getElementById('walkingSpeedError');
    
    // Initialize gender select options
    if (genderSelect) {
        genderSelect.innerHTML = `
            <option value="">Select gender (optional)</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        `;
    }
    
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
    
    if (ageInput) {
        ageInput.addEventListener('input', function() {
            ageError.classList.remove('visible');
        });
    }
    
    if (genderSelect) {
        genderSelect.addEventListener('change', function() {
            genderError.classList.remove('visible');
        });
    }
    
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
        
        // Validate age (optional)
        if (ageInput && ageInput.value) {
            const age = parseFloat(ageInput.value);
            if (isNaN(age) || age < 10 || age > 120) {
                ageError.classList.add('visible');
                isValid = false;
            } else {
                ageError.classList.remove('visible');
            }
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
        if (isNaN(walkingSpeed) || walkingSpeed < 1 || walkingSpeed > 15) {
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
        const age = ageInput ? parseFloat(ageInput.value) || null : null;
        const gender = genderSelect ? genderSelect.value || null : null;
        
        // Calculate MET value based on walking speed (km/h)
        let met;
        if (walkingSpeed < 3.2) {
            met = 2.0; // Very slow walking
        } else if (walkingSpeed < 4.0) {
            met = 2.8; // Slow walking
        } else if (walkingSpeed < 4.8) {
            met = 3.0; // Moderate walking
        } else if (walkingSpeed < 5.6) {
            met = 3.5; // Brisk walking
        } else if (walkingSpeed < 6.4) {
            met = 4.3; // Very brisk walking
        } else if (walkingSpeed < 7.2) {
            met = 5.0; // Fast walking
        } else if (walkingSpeed < 8.0) {
            met = 6.0; // Very fast walking
        } else {
            met = 7.0; // Jogging/running pace
        }
        
        // Apply gender correction if available
        if (gender) {
            if (gender === 'female') {
                met *= 0.95; // Females typically burn slightly fewer calories
            }
        }
        
        // Apply age correction if available
        if (age) {
            if (age > 40) {
                const ageReduction = (age - 40) * 0.005; // 0.5% reduction per year after 40
                met *= (1 - ageReduction);
            }
        }
        
        // Calculate calories burned using the MET formula
        // Calories = MET * weight (kg) * time (hours)
        const timeInHours = duration / 60;
        const totalCalories = met * weight * timeInHours;
        
        // Calculate additional metrics
        const caloriesPerHour = totalCalories / timeInHours;
        const distanceKm = walkingSpeed * timeInHours;
        const caloriesPerKm = totalCalories / distanceKm;
        
        // Display results
        totalCaloriesElement.textContent = Math.round(totalCalories);
        caloriesPerHourElement.textContent = Math.round(caloriesPerHour);
        caloriesPerKmElement.textContent = Math.round(caloriesPerKm);
        totalDistanceElement.textContent = distanceKm.toFixed(2);
        
        // Generate detailed interpretation
        generateResultsInterpretation(totalCalories, caloriesPerHour, distanceKm, met, walkingSpeed, weight, duration);
        
        // Save to history
        saveCalculationToHistory({
            weight,
            age,
            gender,
            duration,
            speed: walkingSpeed,
            speedUnit: 'km/h',
            weightUnit: 'kg',
            result: Math.round(totalCalories),
            distance: distanceKm,
            caloriesPerHour: Math.round(caloriesPerHour),
            caloriesPerKm: Math.round(caloriesPerKm),
            met,
            timestamp: Date.now()
        });
        
        // Show results section with animation
        resultsSection.classList.add('visible');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Generate detailed results interpretation
    function generateResultsInterpretation(totalCalories, caloriesPerHour, distance, met, speed, weight, duration) {
        let interpretation = '<div class="results-interpretation">';
        
        // Calorie burn analysis
        interpretation += '<div class="interpretation-section">';
        interpretation += '<h4><i class="fas fa-fire"></i> Calorie Burn Analysis</h4>';
        
        if (totalCalories < 100) {
            interpretation += '<p class="interpretation-light">This is a light caloric burn, great for gentle activity and recovery.</p>';
        } else if (totalCalories < 300) {
            interpretation += '<p class="interpretation-moderate">This represents a moderate caloric burn, perfect for daily fitness maintenance.</p>';
        } else if (totalCalories < 500) {
            interpretation += '<p class="interpretation-high">Excellent caloric burn! This level supports weight management and fitness goals.</p>';
        } else {
            interpretation += '<p class="interpretation-intense">Outstanding caloric burn! This intensive activity significantly contributes to fitness and weight loss.</p>';
        }
        
        // Speed analysis
        interpretation += '</div><div class="interpretation-section">';
        interpretation += '<h4><i class="fas fa-tachometer-alt"></i> Walking Pace Analysis</h4>';
        
        if (speed < 3.2) {
            interpretation += '<p>Leisurely pace - Perfect for gentle exercise, recovery, or enjoying scenery.</p>';
        } else if (speed < 4.8) {
            interpretation += '<p>Moderate pace - Ideal for daily walks and general health maintenance.</p>';
        } else if (speed < 6.4) {
            interpretation += '<p>Brisk pace - Excellent for cardiovascular fitness and weight management.</p>';
        } else {
            interpretation += '<p>Fast pace - Great for high-intensity training and athletic conditioning.</p>';
        }
        
        // Distance achievement
        interpretation += '</div><div class="interpretation-section">';
        interpretation += '<h4><i class="fas fa-route"></i> Distance Achievement</h4>';
        interpretation += `<p>You covered <strong>${distance.toFixed(2)} km</strong> in ${duration} minutes. `;
        
        if (distance < 1) {
            interpretation += 'Every step counts toward your health goals!</p>';
        } else if (distance < 3) {
            interpretation += 'A solid distance that contributes well to daily activity recommendations.</p>';
        } else if (distance < 5) {
            interpretation += 'Impressive distance! This represents significant physical activity.</p>';
        } else {
            interpretation += 'Exceptional distance! This is a substantial workout achievement.</p>';
        }
        
        // Recommendations
        interpretation += '</div><div class="interpretation-section">';
        interpretation += '<h4><i class="fas fa-lightbulb"></i> Recommendations</h4>';
        interpretation += '<ul>';
        
        if (caloriesPerHour < 250) {
            interpretation += '<li>Consider increasing pace slightly for enhanced cardiovascular benefits</li>';
        }
        
        if (duration < 30) {
            interpretation += '<li>Try extending your walk to 30+ minutes for optimal health benefits</li>';
        }
        
        interpretation += '<li>Stay hydrated during and after your walk</li>';
        interpretation += '<li>Track your progress to see improvements over time</li>';
        interpretation += '<li>Consider varying your route to maintain interest and challenge</li>';
        interpretation += '</ul>';
        
        interpretation += '</div></div>';
        
        resultsDetails.innerHTML = interpretation;
    }
    
    // History functionality
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // Show/hide history panel
    if (showHistoryBtn && historyPanel) {
        showHistoryBtn.addEventListener('click', function() {
            historyPanel.classList.toggle('visible');
            updateCalculationHistory();
            
            if (historyPanel.classList.contains('visible')) {
                historyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    // Clear history (legacy button support)
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            clearCalculationHistory();
        });
    }
    
    // Save calculation to history
    function saveCalculationToHistory(data) {
        let history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
        
        // Add timestamp and unique ID
        data.id = Date.now();
        data.date = new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Add to beginning of array
        history.unshift(data);
        
        // Keep only last 20 calculations
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        localStorage.setItem('walkingCaloriesHistory', JSON.stringify(history));
    }
    
    // Update calculation history display
    function updateCalculationHistory() {
        const history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
        const historyContainer = document.getElementById('historyList');
        
        if (!historyContainer) return;
        
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <li class="history-item empty-history">No calculations yet. Try making a calculation first!</li>
            `;
            return;
        }
        
        // Generate history items only (header already exists in HTML)
        historyContainer.innerHTML = history.map((entry, index) => `
            <li class="history-item" data-index="${index}">
                <div class="history-item-header">
                    <span class="history-date">${entry.date}</span>
                    <div class="history-actions">
                        <button type="button" class="history-reuse" onclick="reuseCalculation(${index})" title="Reuse these values">
                            <i class="fas fa-redo"></i>
                            <span class="reuse-text">Reuse</span>
                        </button>
                        <button type="button" class="history-favorite ${entry.favorite ? 'favorited' : ''}" onclick="toggleFavorite(${index})" title="${entry.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                            <i class="fas fa-star"></i>
                        </button>
                    </div>
                </div>
                <div class="history-details">
                    <span><i class="fas fa-weight"></i> Weight: ${entry.weight} ${entry.weightUnit}</span>
                    <span><i class="fas fa-clock"></i> Duration: ${entry.duration} min</span>
                    <span><i class="fas fa-tachometer-alt"></i> Speed: ${entry.speed} ${entry.speedUnit}</span>
                    <span class="calories-result"><i class="fas fa-fire"></i> <strong>${entry.result} calories</strong></span>
                </div>
            </li>
        `).join('');
    }
    
    // Toggle favorite status
    function toggleFavorite(index) {
        let history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
        if (history[index]) {
            history[index].favorite = !history[index].favorite;
            localStorage.setItem('walkingCaloriesHistory', JSON.stringify(history));
            updateCalculationHistory();
            
            // Visual feedback
            const button = document.querySelector(`[data-index="${index}"] .history-favorite`);
            if (button) {
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 200);
            }
        }
    }
    
    // Reuse calculation
    function reuseCalculation(index) {
        const history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
        const entry = history[index];
        
        if (entry) {
            // Fill form with historical values
            weightInput.value = entry.weight;
            if (ageInput && entry.age) ageInput.value = entry.age;
            if (genderSelect && entry.gender) genderSelect.value = entry.gender;
            durationInput.value = entry.duration;
            walkingSpeedInput.value = entry.speed;
            
            // Scroll to form for better UX
            toolForm.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Visual feedback
            const button = document.querySelector(`[data-index="${index}"] .history-reuse`);
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> <span class="reuse-text">Applied!</span>';
                button.style.background = '#28a745';
                button.style.color = 'white';
                button.style.borderColor = '#28a745';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.style.color = '';
                    button.style.borderColor = '';
                }, 2000);
            }
            
            // Hide history panel if visible
            if (historyPanel) {
                historyPanel.classList.remove('visible');
            }
        }
    }
    
    // Clear calculation history
    function clearCalculationHistory() {
        if (confirm('Are you sure you want to clear all calculation history? This action cannot be undone.')) {
            localStorage.removeItem('walkingCaloriesHistory');
            updateCalculationHistory();
            
            // Show success message
            const tempMessage = document.createElement('div');
            tempMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #28a745;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-weight: 500;
            `;
            tempMessage.innerHTML = '<i class="fas fa-check"></i> History cleared successfully!';
            document.body.appendChild(tempMessage);
            
            setTimeout(() => {
                document.body.removeChild(tempMessage);
            }, 2000);
        }
    }
    
    // Make functions globally available
    window.toggleFavorite = toggleFavorite;
    window.reuseCalculation = reuseCalculation;
    window.clearCalculationHistory = clearCalculationHistory;
    
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
    updateCalculationHistory();
    
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
    
    // Initialize history panel on page load
    updateCalculationHistory();
});
