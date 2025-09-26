// Walking Calories Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Walking Calories Calculator loaded');
    
    // Dom elements
    const toolForm = document.getElementById('toolForm');
    const calculateBtn = document.querySelector('.btn-calculate');
    const resultsSection = document.getElementById('resultsSection');
    
    // Error elements
    const weightError = document.getElementById('weightError');
    const durationError = document.getElementById('durationError'); 
    const walkingSpeedError = document.getElementById('walkingSpeedError');
    
    // Input elements
    const weightInput = document.getElementById('weight');
    const durationInput = document.getElementById('duration');
    const walkingSpeedInput = document.getElementById('walkingSpeed');
    const unitsSelect = document.getElementById('units'); // May be null if no units selector exists
    
    // Calculation button event listener
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            calculateCalories();
        });
    }
    
    // History button event listener
    const showHistoryBtn = document.getElementById('showHistoryBtn');
    const historyPanel = document.getElementById('historyPanel');
    
    if (showHistoryBtn && historyPanel) {
        showHistoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleHistoryPanel();
        });
    }
    
    // Reset button event listener
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetCalculator();
        });
    }
    
    function toggleHistoryPanel() {
        const historyPanel = document.getElementById('historyPanel');
        const showHistoryBtn = document.getElementById('showHistoryBtn');
        
        if (historyPanel.classList.contains('visible')) {
            historyPanel.classList.remove('visible');
            showHistoryBtn.innerHTML = '<i class="fas fa-history"></i> View History';
        } else {
            historyPanel.classList.add('visible');
            showHistoryBtn.innerHTML = '<i class="fas fa-times"></i> Hide History';
            loadCalculationHistory();
        }
    }
    
    function resetCalculator() {
        // Reset form inputs
        if (weightInput) weightInput.value = '';
        if (durationInput) durationInput.value = '';
        if (walkingSpeedInput) walkingSpeedInput.value = '';
        
        // Hide results section
        resultsSection.classList.remove('visible');
        
        // Reset error states
        weightError.classList.remove('visible');
        durationError.classList.remove('visible');
        walkingSpeedError.classList.remove('visible');
        
        // Scroll to top of form
        const toolForm = document.getElementById('toolForm');
        if (toolForm) {
            toolForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function loadCalculationHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        try {
            const history = JSON.parse(localStorage.getItem('walkingCalculatorHistory') || '[]');
            
            if (history.length === 0) {
                historyList.innerHTML = '<li class="history-item empty-history">No calculations yet. Try making a calculation first!</li>';
                return;
            }
            
            historyList.innerHTML = history.map((item, index) => `
                <li class="history-item">
                    <div class="history-content">
                        <div class="history-main">
                            <span class="history-calories">${item.totalCalories} calories</span>
                            <span class="history-details">${item.weight}kg • ${item.duration}min • ${item.speed.toFixed(1)}km/h</span>
                        </div>
                        <div class="history-date">${new Date(item.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div class="history-actions">
                        <button class="history-reuse" onclick="reuseCalculation(${index})">
                            <i class="fas fa-redo"></i> Reuse
                        </button>
                    </div>
                </li>
            `).join('');
        } catch (error) {
            console.error('Error loading history:', error);
            historyList.innerHTML = '<li class="history-item empty-history">Error loading history</li>';
        }
    }
    
    function calculateCalories() {
        if (validateInputs()) {
            showCalculationProgress();
            setTimeout(() => {
                performCalculation();
            }, 1500);
        }
    }
    
    function validateInputs() {
        let isValid = true;
        
        // Reset error states
        weightError.classList.remove('visible');
        durationError.classList.remove('visible');
        walkingSpeedError.classList.remove('visible');
        
        // Validate weight
        const weight = parseFloat(weightInput.value);
        if (!weight || weight <= 0 || weight > 1000) {
            weightError.classList.add('visible');
            isValid = false;
        }
        
        // Validate duration
        const duration = parseFloat(durationInput.value);
        if (!duration || duration <= 0 || duration > 1440) {
            durationError.classList.add('visible');
            isValid = false;
        }
        
        // Validate walking speed
        const walkingSpeed = parseFloat(walkingSpeedInput.value);
        if (!walkingSpeed || walkingSpeed <= 0 || walkingSpeed > 20) {
            walkingSpeedError.classList.add('visible');
            isValid = false;
        }
        
        return isValid;
    }
    
    function performCalculation() {
        const weight = parseFloat(weightInput.value);
        const duration = parseFloat(durationInput.value);
        const walkingSpeed = parseFloat(walkingSpeedInput.value);
        // Default to metric if no units selector exists
        const isMetric = unitsSelect ? unitsSelect.value === 'metric' : true;
        
        // Convert to metric if needed
        let weightKg = isMetric ? weight : weight * 0.453592;
        let speedKph = isMetric ? walkingSpeed : walkingSpeed * 1.60934;
        
        // Calculate MET based on walking speed
        let met;
        if (speedKph < 4.0) {
            met = 3.5;
        } else if (speedKph < 4.8) {
            met = 4.0;
        } else if (speedKph < 5.6) {
            met = 4.3;
        } else if (speedKph < 6.4) {
            met = 5.0;
        } else if (speedKph < 7.2) {
            met = 7.0;
        } else if (speedKph < 8.0) {
            met = 8.3;
        } else {
            met = 9.8;
        }
        
        // Calculate calories burned
        const caloriesPerMinute = (met * weightKg * 3.5) / 200;
        const totalCalories = Math.round(caloriesPerMinute * duration);
        const caloriesPerHour = Math.round(caloriesPerMinute * 60);
        const distance = Math.round((speedKph * (duration / 60)) * 10) / 10;
        
        // Display results
        displayResults(totalCalories, caloriesPerHour, distance, met, speedKph, weightKg, duration);
    }
    
    function displayResults(totalCalories, caloriesPerHour, distance, met, speed, weight, duration) {
        // Show results section first
        resultsSection.classList.add('visible');
        
        // Animate the numbers with counting effect
        animateValue('totalCalories', 0, totalCalories, 1000);
        animateValue('caloriesPerHour', 0, caloriesPerHour, 1200);
        animateValue('totalDistance', 0, distance, 1400);
        
        // Calculate and display calories per km with animation
        const caloriesPerKm = distance > 0 ? Math.round(totalCalories / distance) : 0;
        const caloriesPerKmElement = document.getElementById('caloriesPerKm');
        if (caloriesPerKmElement) {
            animateValue('caloriesPerKm', 0, caloriesPerKm, 1600);
        }
        
        // Animate progress circle
        setTimeout(() => {
            animateProgressCircle(totalCalories);
        }, 500);
        
        // Add enhanced results with interpretation
        setTimeout(() => {
            addResultsInterpretation(totalCalories, caloriesPerHour, distance, met, speed, weight, duration);
        }, 800);
        
        // Check achievements
        setTimeout(() => {
            checkAchievements(totalCalories, distance, duration);
        }, 1000);
        
        // Scroll to results with smooth animation
        setTimeout(() => {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 200);
        
        // Save to history
        const calculationData = {
            weight: weight,
            duration: duration,
            speed: speed,
            totalCalories: totalCalories,
            timestamp: new Date().toISOString()
        };
        saveCalculationToHistory(calculationData);
    }
    
    // Animation helper functions
    function animateValue(elementId, start, end, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (elementId === 'totalDistance') {
                element.textContent = (current / 1).toFixed(1);
            } else {
                element.textContent = Math.round(current);
            }
            
            if (current === end) {
                clearInterval(timer);
                // Add a brief highlight effect
                element.parentElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    element.parentElement.style.transform = 'scale(1)';
                }, 200);
            }
        }, stepTime);
    }
    
    function animateProgressCircle(calories) {
        const progressCircle = document.getElementById('calorieProgress');
        if (!progressCircle) return;
        
        // Calculate progress percentage (assume 500 calories is 100%)
        const maxCalories = Math.max(500, calories);
        const percentage = (calories / maxCalories) * 100;
        
        // Animate the circular progress with better contrast
        progressCircle.style.background = `conic-gradient(
            #e2e8f0 0deg,
            #e2e8f0 ${percentage * 3.6}deg,
            rgba(255,255,255,0.9) ${percentage * 3.6}deg,
            rgba(255,255,255,0.9) 360deg
        )`;
        
        // Add pulse effect
        progressCircle.classList.add('pulse-animation');
        setTimeout(() => {
            progressCircle.classList.remove('pulse-animation');
        }, 1000);
    }
    
    function saveCalculationToHistory(data) {
        try {
            let history = JSON.parse(localStorage.getItem('walkingCalculatorHistory') || '[]');
            history.unshift(data);
            
            // Keep only last 10 calculations
            if (history.length > 10) {
                history = history.slice(0, 10);
            }
            
            localStorage.setItem('walkingCalculatorHistory', JSON.stringify(history));
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    }
    
    // Function to reuse calculation from history
    function reuseCalculation(index) {
        try {
            const history = JSON.parse(localStorage.getItem('walkingCalculatorHistory') || '[]');
            const calc = history[index];
            
            if (calc) {
                weightInput.value = calc.weight;
                durationInput.value = calc.duration;
                walkingSpeedInput.value = calc.speed.toFixed(1);
                
                // Hide history panel
                const historyPanel = document.getElementById('historyPanel');
                if (historyPanel) {
                    historyPanel.classList.remove('visible');
                    const showHistoryBtn = document.getElementById('showHistoryBtn');
                    if (showHistoryBtn) {
                        showHistoryBtn.innerHTML = '<i class="fas fa-history"></i> View History';
                    }
                }
                
                // Scroll to form
                const toolForm = document.getElementById('toolForm');
                if (toolForm) {
                    toolForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (error) {
            console.error('Error reusing calculation:', error);
        }
    }
    
    // Make reuseCalculation available globally
    window.reuseCalculation = reuseCalculation;
    
    function updateCalculationHistory() {
        const historyContainer = document.getElementById('calculation-history');
        if (!historyContainer) return;
        
        try {
            const history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
            
            if (history.length === 0) {
                historyContainer.innerHTML = '<p class="no-history">No calculation history available.</p>';
                return;
            }
            
            let historyHTML = '<h4>Recent Calculations</h4><div class="history-list">';
            
            history.forEach((calc, index) => {
                const date = new Date(calc.timestamp).toLocaleDateString();
                const isFavorite = calc.favorite || false;
                const favoriteIcon = isFavorite ? 'fas fa-star' : 'far fa-star';
                const favoriteColor = isFavorite ? '#ffd700' : '#ccc';
                
                historyHTML += `
                    <div class="history-item ${isFavorite ? 'favorite-item' : ''}">
                        <div class="history-details">
                            <strong>${calc.totalCalories} calories</strong>
                            <small>${calc.weight}kg, ${calc.duration}min, ${calc.speed.toFixed(1)}km/h</small>
                            <small class="history-date">${date}</small>
                        </div>
                        <div class="history-actions">
                            <button onclick="toggleFavorite(${index})" class="btn-favorite" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                                <i class="${favoriteIcon}" style="color: ${favoriteColor}"></i>
                            </button>
                            <button onclick="reuseCalculation(${index})" class="btn-reuse" title="Reuse these values">
                                <i class="fas fa-redo"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            historyHTML += '</div>';
            historyHTML += '<button onclick="clearCalculationHistory()" class="btn-clear-history">Clear History</button>';
            
            historyContainer.innerHTML = historyHTML;
        } catch (error) {
            console.error('Error updating history:', error);
            historyContainer.innerHTML = '<p class="no-history">Error loading history.</p>';
        }
    }
    
    function reuseCalculation(index) {
        try {
            const history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
            const calc = history[index];
            
            if (calc) {
                weightInput.value = calc.weight;
                durationInput.value = calc.duration;
                walkingSpeedInput.value = calc.speed.toFixed(1);
                if (unitsSelect) {
                    unitsSelect.value = 'metric';
                }
                
                // Scroll to form
                toolForm.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error reusing calculation:', error);
        }
    }
    
    function clearCalculationHistory() {
        if (confirm('Are you sure you want to clear all calculation history?')) {
            localStorage.removeItem('walkingCaloriesHistory');
            updateCalculationHistory();
        }
    }
    
    function toggleFavorite(index) {
        try {
            const history = JSON.parse(localStorage.getItem('walkingCaloriesHistory') || '[]');
            if (history[index]) {
                history[index].favorite = !history[index].favorite;
                localStorage.setItem('walkingCaloriesHistory', JSON.stringify(history));
                updateCalculationHistory();
                
                const message = history[index].favorite ? 
                    '⭐ Added to favorites!' : 
                    '💫 Removed from favorites';
                showToast(message);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }
    
    // Progress indicator for calculation
    function showCalculationProgress() {
        const calculateBtn = document.querySelector('.btn-calculate');
        if (!calculateBtn) return;
        
        const originalText = calculateBtn.innerHTML;
        
        calculateBtn.disabled = true;
        calculateBtn.innerHTML = `
            <div class="calculation-progress">
                <div class="spinner"></div>
                <span>Calculating your results...</span>
            </div>
        `;
        
        // Add visual feedback to the form
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.opacity = '0.7';
            section.style.pointerEvents = 'none';
        });
        
        // Add CSS animation if not already present
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .calculation-progress {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    justify-content: center;
                }
                .spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid #ffffff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .form-section {
                    transition: opacity 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Reset button after calculation
        setTimeout(() => {
            calculateBtn.disabled = false;
            calculateBtn.innerHTML = originalText;
            
            // Restore form sections
            formSections.forEach(section => {
                section.style.opacity = '1';
                section.style.pointerEvents = 'auto';
            });
        }, 1500);
    }
    
    // Enhanced Results Interpretation
    function addResultsInterpretation(totalCalories, caloriesPerHour, distance, met, speed, weight, duration) {
        const interpretationContainer = document.getElementById('resultsDetails');
        if (!interpretationContainer) return;
        
        let interpretation = '';
        let recommendations = [];
        let healthInsights = [];
        
        // Calorie burn analysis
        if (totalCalories < 150) {
            interpretation = `🚶‍♀️ Light Activity: You burned ${totalCalories} calories in ${duration} minutes of walking. This is a great start for building healthy habits!`;
            recommendations.push('💡 Try increasing your walking speed or duration for more calorie burn');
            recommendations.push('🎯 Aim for at least 150 minutes of moderate activity per week');
        } else if (totalCalories < 300) {
            interpretation = `🚶‍♂️ Moderate Activity: Excellent! You burned ${totalCalories} calories. This contributes significantly to your daily fitness goals.`;
            recommendations.push('🔥 You\'re in the optimal zone for steady calorie burn');
            recommendations.push('⭐ Consider adding hills or inclines to increase intensity');
        } else if (totalCalories < 500) {
            interpretation = `🏃‍♀️ High Activity: Outstanding! You burned ${totalCalories} calories. This is excellent exercise intensity.`;
            recommendations.push('🎉 You\'re achieving significant calorie burn - keep it up!');
            recommendations.push('💪 This level burns fat effectively and improves cardiovascular health');
        } else {
            interpretation = `🏃‍♂️ Very High Activity: Incredible! You burned ${totalCalories} calories. This is athlete-level performance!`;
            recommendations.push('🏆 Exceptional calorie burn - you\'re crushing your fitness goals!');
            recommendations.push('⚡ Make sure to stay hydrated and recover properly');
        }
        
        // Distance achievements
        if (distance >= 10) {
            healthInsights.push('🎖️ Long Distance Champion: Walking over 10km is excellent for endurance!');
        } else if (distance >= 5) {
            healthInsights.push('🏃‍♀️ 5K Achiever: Great distance for cardiovascular health!');
        } else if (distance >= 2) {
            healthInsights.push('🚶‍♂️ Solid Walk: Perfect distance for daily exercise routine!');
        }
        
        // Health benefits based on calories burned
        if (totalCalories >= 300) {
            healthInsights.push('❤️ Heart Health: This burn level significantly improves cardiovascular fitness');
            healthInsights.push('🔥 Fat Burning: You\'re in the optimal fat-burning zone');
        } else if (totalCalories >= 150) {
            healthInsights.push('💚 Health Boost: Great for maintaining healthy weight and mood');
            healthInsights.push('🧠 Mental Health: Walking reduces stress and improves mental clarity');
        }
        
        // Speed insights
        if (speed >= 6.5) {
            healthInsights.push('⚡ Power Walker: Your pace is excellent for fitness improvement!');
        } else if (speed < 4.8) {
            recommendations.push('🎯 Speed Tip: Gradually increase pace to boost calorie burn');
        }
        
        // Create HTML content
        let htmlContent = `
            <div class="interpretation-section">
                <h4>📊 Your Walking Analysis</h4>
                <p class="main-interpretation">${interpretation}</p>
            </div>
        `;
        
        if (recommendations.length > 0) {
            htmlContent += `
                <div class="recommendations-section">
                    <h5>💡 Recommendations</h5>
                    <ul class="recommendation-list">
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (healthInsights.length > 0) {
            htmlContent += `
                <div class="health-insights-section">
                    <h5>🏥 Health Insights</h5>
                    <ul class="insights-list">
                        ${healthInsights.map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        interpretationContainer.innerHTML = htmlContent;
    }
    
    // Achievement System
    function checkAchievements(totalCalories, distance, duration) {
        const achievements = [];
        
        // Calorie milestones
        if (totalCalories >= 500) {
            achievements.push({
                title: '🔥 Calorie Crusher',
                description: 'Burned 500+ calories in one session!',
                type: 'gold'
            });
        } else if (totalCalories >= 300) {
            achievements.push({
                title: '💪 Calorie Burner',
                description: 'Burned 300+ calories!',
                type: 'silver'
            });
        } else if (totalCalories >= 150) {
            achievements.push({
                title: '🎯 Calorie Target',
                description: 'Hit 150+ calories burned!',
                type: 'bronze'
            });
        }
        
        // Distance achievements
        if (distance >= 10) {
            achievements.push({
                title: '🏃‍♂️ Marathon Mindset',
                description: 'Walked 10+ kilometers!',
                type: 'gold'
            });
        } else if (distance >= 5) {
            achievements.push({
                title: '🚶‍♀️ 5K Walker',
                description: 'Completed 5+ kilometers!',
                type: 'silver'
            });
        }
        
        // Duration achievements
        if (duration >= 60) {
            achievements.push({
                title: '⏱️ Endurance Explorer',
                description: 'Walked for 60+ minutes!',
                type: 'gold'
            });
        } else if (duration >= 30) {
            achievements.push({
                title: '🕰️ Steady Stepper',
                description: 'Maintained 30+ minutes of walking!',
                type: 'silver'
            });
        }
        
        // Special combinations
        if (totalCalories >= 400 && distance >= 5) {
            achievements.push({
                title: '⭐ Fitness Star',
                description: 'High calories + great distance!',
                type: 'special'
            });
        }
        
        // Display achievements
        if (achievements.length > 0) {
            showAchievements(achievements);
        }
        
        // Save achievements to local storage
        saveAchievements(achievements);
    }
    
    function showAchievements(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                showAchievementToast(achievement);
            }, (index + 1) * 1000);
        });
    }
    
    function showAchievementToast(achievement) {
        const toast = document.createElement('div');
        toast.className = `achievement-toast achievement-${achievement.type}`;
        
        const icons = {
            gold: '🏆',
            silver: '🥈', 
            bronze: '🥉',
            special: '⭐'
        };
        
        const colors = {
            gold: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)',
            silver: 'linear-gradient(135deg, #c0c0c0 0%, #e2e8f0 100%)',
            bronze: 'linear-gradient(135deg, #cd7f32 0%, #d69e2e 100%)',
            special: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
        };
        
        toast.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${icons[achievement.type] || '🏆'}</div>
                <div class="achievement-text">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.title}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[achievement.type]};
            color: #1a202c;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 1001;
            transform: translateX(100%);
            transition: all 0.4s ease;
            max-width: 320px;
            border: 2px solid rgba(255,255,255,0.3);
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0) scale(1.05)';
            setTimeout(() => {
                toast.style.transform = 'translateX(0) scale(1)';
            }, 200);
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }, 4000);
    }
    
    function saveAchievements(newAchievements) {
        try {
            const existingAchievements = JSON.parse(localStorage.getItem('walkingAchievements') || '[]');
            const allAchievements = [...existingAchievements];
            
            newAchievements.forEach(achievement => {
                const exists = existingAchievements.some(existing => 
                    existing.title === achievement.title && 
                    existing.description === achievement.description
                );
                
                if (!exists) {
                    allAchievements.push({
                        ...achievement,
                        timestamp: new Date().toISOString(),
                        id: Date.now() + Math.random()
                    });
                }
            });
            
            localStorage.setItem('walkingAchievements', JSON.stringify(allAchievements));
        } catch (error) {
            console.error('Error saving achievements:', error);
        }
    }
    
    // Table Auto-fill Functionality
    function initializeTableAutoFill() {
        const tableRows = document.querySelectorAll('.calorie-reference-table tbody tr');
        
        tableRows.forEach((row, index) => {
            row.style.cursor = 'pointer';
            row.title = 'Click to auto-fill calculator with these values';
            row.classList.add('clickable-row');
            
            row.addEventListener('click', function() {
                // Extract data from table cells (distance-based table)
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const distanceText = cells[0].textContent.trim();
                    
                    // Extract distance and convert to estimated duration and speed
                    let distance = 0;
                    let estimatedDuration = 30; // Default 30 minutes
                    let estimatedSpeed = 4.5; // Default moderate walking speed
                    
                    // Parse distance from text
                    if (distanceText.includes('1 km')) {
                        distance = 1;
                        estimatedDuration = 15; // 15 minutes for 1km
                        estimatedSpeed = 4.0; // Casual pace
                    } else if (distanceText.includes('3 km')) {
                        distance = 3;
                        estimatedDuration = 40; // 40 minutes for 3km
                        estimatedSpeed = 4.5; // Moderate pace
                    } else if (distanceText.includes('5 km')) {
                        distance = 5;
                        estimatedDuration = 60; // 60 minutes for 5km
                        estimatedSpeed = 5.0; // Brisk pace
                    } else if (distanceText.includes('10 km')) {
                        distance = 10;
                        estimatedDuration = 120; // 120 minutes for 10km
                        estimatedSpeed = 5.0; // Brisk pace
                    }
                    
                    // Auto-fill form inputs with estimated values
                    if (walkingSpeedInput) {
                        walkingSpeedInput.value = estimatedSpeed.toFixed(1);
                    }
                    
                    if (durationInput) {
                        durationInput.value = estimatedDuration;
                    }
                    
                    // Set default weight if empty (using average from table - 68kg)
                    if (weightInput && !weightInput.value) {
                        weightInput.value = '68'; // Average weight from table
                    }
                    
                    // Set units to metric
                    if (unitsSelect) {
                        unitsSelect.value = 'metric';
                    }
                    
                    // Clear any existing error messages
                    if (weightError) weightError.classList.remove('visible');
                    if (durationError) durationError.classList.remove('visible');
                    if (walkingSpeedError) walkingSpeedError.classList.remove('visible');
                    
                    // Add visual feedback
                    row.classList.add('row-selected');
                    setTimeout(() => {
                        row.classList.remove('row-selected');
                    }, 1000);
                    
                    // Show success message with distance info
                    showToast(`Auto-filled for ${distance}km walk! Duration: ${estimatedDuration}min, Speed: ${estimatedSpeed}km/h`);
                    
                    // Smooth scroll to calculator
                    if (toolForm) {
                        toolForm.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start' 
                        });
                        
                        // Focus on calculate button after scroll
                        setTimeout(() => {
                            if (calculateBtn) {
                                calculateBtn.focus();
                            }
                        }, 800);
                    }
                }
            });
            
            // Add hover effects
            row.addEventListener('mouseenter', function() {
                row.style.backgroundColor = '#f0f9ff';
                row.style.transform = 'scale(1.01)';
                row.style.transition = 'all 0.2s ease';
            });
            
            row.addEventListener('mouseleave', function() {
                row.style.backgroundColor = '';
                row.style.transform = '';
            });
        });
    }
    
    // Toast notification system
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        // Style the toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // Make functions globally available
    window.reuseCalculation = reuseCalculation;
    window.clearCalculationHistory = clearCalculationHistory;
    window.toggleFavorite = toggleFavorite;
    
    // Initialize features
    updateCalculationHistory();
    initializeTableAutoFill();
    initializeFAQFunctionality();
    initializeMobileOptimizations();
    initializeScrollAnimations();
    
    // FAQ functionality
    function initializeFAQFunctionality() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (!question || !answer) return;
            
            // Add ARIA attributes for accessibility
            const questionId = `faq-question-${index}`;
            const answerId = `faq-answer-${index}`;
            
            question.setAttribute('id', questionId);
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', answerId);
            
            answer.setAttribute('id', answerId);
            answer.setAttribute('role', 'region');
            answer.setAttribute('aria-labelledby', questionId);
            
            // Set initial heights for animations
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
            
            // Enhanced click handler
            question.addEventListener('click', () => {
                toggleFAQ(item, question, answer, faqItems);
            });
            
            // Keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(item, question, answer, faqItems);
                }
                // Arrow key navigation
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const currentIndex = Array.from(faqItems).indexOf(item);
                    const nextIndex = e.key === 'ArrowDown' 
                        ? (currentIndex + 1) % faqItems.length
                        : (currentIndex - 1 + faqItems.length) % faqItems.length;
                    faqItems[nextIndex].querySelector('.faq-question').focus();
                }
            });
        });
        
        // Adjust FAQ answer heights on resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                faqItems.forEach(item => {
                    if (item.classList.contains('active')) {
                        const answer = item.querySelector('.faq-answer');
                        answer.style.maxHeight = 'none';
                        const height = answer.scrollHeight;
                        answer.style.maxHeight = height + 'px';
                    }
                });
            }, 150);
        });
    }
    
    // Toggle FAQ function
    function toggleFAQ(item, question, answer, faqItems) {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQs (accordion behavior)
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherQuestion = otherItem.querySelector('.faq-question');
                otherAnswer.style.maxHeight = '0';
                otherQuestion.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Toggle current FAQ
        if (isActive) {
            item.classList.remove('active');
            answer.style.maxHeight = '0';
            question.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            question.setAttribute('aria-expanded', 'true');
            
            // Smooth scroll on mobile with proper timing
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    const offset = window.innerHeight * 0.1;
                    const elementPosition = question.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 350);
            }
        }
    }
    
    // Mobile performance optimizations
    function initializeMobileOptimizations() {
        // Optimize for mobile performance
        if (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 4) {
            document.body.style.setProperty('--animation-duration', '0.1s');
            document.body.classList.add('reduced-motion');
        }
        
        // Current year for copyright
        const currentYearElement = document.getElementById('currentYear');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
    }
    
    // Scroll animations with Intersection Observer
    function initializeScrollAnimations() {
        const sections = document.querySelectorAll('.info-section');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            sections.forEach(section => {
                observer.observe(section);
                // Add initial styles for animation
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            });
        }
    }
    
}); // End of DOMContentLoaded