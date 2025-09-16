// Pregnancy Weight Gain Calculator JavaScript

class PregnancyWeightCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.weightGainGuidelines = this.getWeightGainGuidelines();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('pregnancyForm');
        this.preWeightInput = document.getElementById('preWeight');
        this.heightInput = document.getElementById('height');
        this.weightUnitSelect = document.getElementById('weightUnit');
        this.heightUnitSelect = document.getElementById('heightUnit');
        this.gestationalWeekInput = document.getElementById('gestationalWeek');
        this.pregnancyTypeSelect = document.getElementById('pregnancyType');
        this.currentWeightInput = document.getElementById('currentWeight');
        this.calculateBtn = document.getElementById('calculateBtn');

        // Display elements
        this.bmiDisplay = document.getElementById('bmiDisplay');
        this.bmiValue = document.getElementById('bmiValue');
        this.bmiCategory = document.getElementById('bmiCategory');
        this.resultsSection = document.getElementById('resultsSection');
        this.currentWeightUnit = document.getElementById('currentWeightUnit');

        // Result elements
        this.totalGain = document.getElementById('totalGain');
        this.totalGainKg = document.getElementById('totalGainKg');
        this.currentGain = document.getElementById('currentGain');
        this.progressIndicator = document.getElementById('progressIndicator');
        this.weeklyRate = document.getElementById('weeklyRate');
        this.weeklyRateKg = document.getElementById('weeklyRateKg');
        this.remainingGain = document.getElementById('remainingGain');
        this.recommendedWeeks = document.getElementById('recommendedWeeks');
        this.recommendationList = document.getElementById('recommendationList');
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Real-time BMI calculation
        this.preWeightInput.addEventListener('input', () => this.calculateBMI());
        this.heightInput.addEventListener('input', () => this.calculateBMI());
        this.weightUnitSelect.addEventListener('change', () => this.updateUnits());
        this.heightUnitSelect.addEventListener('change', () => this.updateUnits());

        // Form validation
        [this.preWeightInput, this.heightInput, this.gestationalWeekInput].forEach(input => {
            input.addEventListener('input', () => this.validateForm());
        });

        // FAQ functionality
        this.initializeFAQ();
    }

    updateUnits() {
        const weightUnit = this.weightUnitSelect.value;
        this.currentWeightUnit.textContent = weightUnit;
        this.calculateBMI();
    }

    calculateBMI() {
        const weight = parseFloat(this.preWeightInput.value);
        const height = parseFloat(this.heightInput.value);
        const weightUnit = this.weightUnitSelect.value;
        const heightUnit = this.heightUnitSelect.value;

        if (!weight || !height) {
            this.bmiDisplay.style.display = 'none';
            return;
        }

        // Convert to metric units for BMI calculation
        let weightKg = weight;
        let heightM = height;

        if (weightUnit === 'lbs') {
            weightKg = weight * 0.453592;
        }

        if (heightUnit === 'ft') {
            heightM = height * 30.48; // feet to cm
        }

        heightM = heightM / 100; // cm to meters

        const bmi = weightKg / (heightM * heightM);
        
        this.bmiValue.textContent = bmi.toFixed(1);
        this.bmiCategory.textContent = this.getBMICategory(bmi);
        this.bmiDisplay.style.display = 'block';

        return bmi;
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal Weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    getWeightGainGuidelines() {
        return {
            'Underweight': { single: [28, 40], twins: [50, 62] },
            'Normal Weight': { single: [25, 35], twins: [37, 54] },
            'Overweight': { single: [15, 25], twins: [31, 50] },
            'Obese': { single: [11, 20], twins: [25, 42] }
        };
    }

    validateForm() {
        const weight = parseFloat(this.preWeightInput.value);
        const height = parseFloat(this.heightInput.value);
        const gestationalWeek = parseInt(this.gestationalWeekInput.value);

        const isValid = weight && height && gestationalWeek && 
                       gestationalWeek >= 1 && gestationalWeek <= 42;

        this.calculateBtn.disabled = !isValid;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const bmi = this.calculateBMI();
        if (!bmi) return;

        const data = this.getFormData();
        const results = this.calculateWeightGain(data, bmi);
        this.displayResults(results);
        this.generateRecommendations(results);
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    getFormData() {
        return {
            preWeight: parseFloat(this.preWeightInput.value),
            height: parseFloat(this.heightInput.value),
            weightUnit: this.weightUnitSelect.value,
            heightUnit: this.heightUnitSelect.value,
            gestationalWeek: parseInt(this.gestationalWeekInput.value),
            pregnancyType: this.pregnancyTypeSelect.value,
            currentWeight: parseFloat(this.currentWeightInput.value) || null
        };
    }

    calculateWeightGain(data, bmi) {
        const bmiCategory = this.getBMICategory(bmi);
        const guidelines = this.weightGainGuidelines[bmiCategory];
        const targetRange = data.pregnancyType === 'twins' ? guidelines.twins : guidelines.single;
        
        // Convert weight to kg for calculations
        let preWeightKg = data.preWeight;
        let currentWeightKg = data.currentWeight;
        
        if (data.weightUnit === 'lbs') {
            preWeightKg *= 0.453592;
            if (currentWeightKg) currentWeightKg *= 0.453592;
        }

        // Calculate current weight gain
        let currentGainKg = 0;
        let currentGainLbs = 0;
        
        if (currentWeightKg) {
            currentGainKg = currentWeightKg - preWeightKg;
            currentGainLbs = currentGainKg / 0.453592;
        }

        // Calculate weekly rate recommendations
        const weeklyRateLbs = this.getWeeklyRate(bmiCategory, data.pregnancyType);
        const weeklyRateKg = weeklyRateLbs * 0.453592;

        // Calculate remaining weight gain
        const targetMinLbs = targetRange[0];
        const targetMaxLbs = targetRange[1];
        const remainingWeeks = Math.max(0, 40 - data.gestationalWeek);

        return {
            bmi,
            bmiCategory,
            targetRange,
            targetMinLbs,
            targetMaxLbs,
            currentGainKg,
            currentGainLbs,
            weeklyRateLbs,
            weeklyRateKg,
            gestationalWeek: data.gestationalWeek,
            remainingWeeks,
            pregnancyType: data.pregnancyType,
            hasCurrentWeight: !!data.currentWeight
        };
    }

    getWeeklyRate(bmiCategory, pregnancyType) {
        const rates = {
            'Underweight': { single: 1.0, twins: 1.5 },
            'Normal Weight': { single: 1.0, twins: 1.5 },
            'Overweight': { single: 0.6, twins: 1.25 },
            'Obese': { single: 0.5, twins: 1.1 }
        };
        
        return rates[bmiCategory][pregnancyType];
    }

    displayResults(results) {
        // Total recommended weight gain
        this.totalGain.textContent = `${results.targetMinLbs}-${results.targetMaxLbs} lbs`;
        this.totalGainKg.textContent = `(${(results.targetMinLbs * 0.453592).toFixed(1)}-${(results.targetMaxLbs * 0.453592).toFixed(1)} kg)`;

        // Current weight gain
        if (results.hasCurrentWeight) {
            this.currentGain.textContent = `${results.currentGainLbs >= 0 ? '+' : ''}${results.currentGainLbs.toFixed(1)} lbs`;
            this.updateProgressIndicator(results);
        } else {
            this.currentGain.textContent = 'Enter current weight';
            this.progressIndicator.style.display = 'none';
        }

        // Weekly rate
        this.weeklyRate.textContent = `${results.weeklyRateLbs.toFixed(1)} lb/week`;
        this.weeklyRateKg.textContent = `(${results.weeklyRateKg.toFixed(2)} kg/week)`;

        // Remaining weight gain
        if (results.hasCurrentWeight) {
            const targetAvg = (results.targetMinLbs + results.targetMaxLbs) / 2;
            const remaining = Math.max(0, targetAvg - results.currentGainLbs);
            this.remainingGain.textContent = `${remaining.toFixed(1)} lbs`;
            this.recommendedWeeks.textContent = `(${results.remainingWeeks} weeks remaining)`;
        } else {
            this.remainingGain.textContent = '--';
            this.recommendedWeeks.textContent = '';
        }
    }

    updateProgressIndicator(results) {
        const targetAvg = (results.targetMinLbs + results.targetMaxLbs) / 2;
        const progress = Math.min(100, (results.currentGainLbs / targetAvg) * 100);
        
        this.progressIndicator.style.display = 'block';
        this.progressIndicator.style.setProperty('--progress-width', `${Math.max(0, progress)}%`);
        
        // Determine status
        const isOnTrack = results.currentGainLbs >= results.targetMinLbs && 
                         results.currentGainLbs <= results.targetMaxLbs;
        const isAbove = results.currentGainLbs > results.targetMaxLbs;
        
        this.progressIndicator.className = 'progress-indicator';
        if (isOnTrack) {
            this.progressIndicator.classList.add('on-track');
        } else if (isAbove) {
            this.progressIndicator.classList.add('above-target');
        } else {
            this.progressIndicator.classList.add('below-target');
        }
    }

    generateRecommendations(results) {
        const recommendations = [];
        
        // BMI-specific recommendations
        if (results.bmiCategory === 'Underweight') {
            recommendations.push({
                icon: 'fas fa-utensils',
                title: 'Increase Caloric Intake',
                description: 'Focus on nutrient-dense, calorie-rich foods to support healthy weight gain.'
            });
        } else if (results.bmiCategory === 'Overweight' || results.bmiCategory === 'Obese') {
            recommendations.push({
                icon: 'fas fa-apple-alt',
                title: 'Focus on Nutrition Quality',
                description: 'Choose nutrient-dense foods while monitoring portion sizes to stay within recommended weight gain.'
            });
        }

        // Current weight gain recommendations
        if (results.hasCurrentWeight) {
            const isOnTrack = results.currentGainLbs >= results.targetMinLbs && 
                             results.currentGainLbs <= results.targetMaxLbs;
            const isAbove = results.currentGainLbs > results.targetMaxLbs;
            
            if (isOnTrack) {
                recommendations.push({
                    icon: 'fas fa-check-circle',
                    title: 'Great Progress!',
                    description: 'Your weight gain is within the recommended range. Continue your current healthy habits.'
                });
            } else if (isAbove) {
                recommendations.push({
                    icon: 'fas fa-exclamation-triangle',
                    title: 'Monitor Weight Gain',
                    description: 'Consider consulting your healthcare provider about slowing weight gain through healthy eating and safe exercise.'
                });
            } else {
                recommendations.push({
                    icon: 'fas fa-trending-up',
                    title: 'Consider Increasing Intake',
                    description: 'You may need to increase your caloric intake to meet recommended weight gain goals.'
                });
            }
        }

        // Gestational week recommendations
        if (results.gestationalWeek <= 12) {
            recommendations.push({
                icon: 'fas fa-seedling',
                title: 'First Trimester Focus',
                description: 'Focus on taking prenatal vitamins and eating regularly, even if experiencing morning sickness.'
            });
        } else if (results.gestationalWeek <= 28) {
            recommendations.push({
                icon: 'fas fa-chart-line',
                title: 'Second Trimester Growth',
                description: 'This is typically when steady weight gain begins. Aim for consistent weekly increases.'
            });
        } else {
            recommendations.push({
                icon: 'fas fa-baby',
                title: 'Third Trimester Preparation',
                description: 'Continue steady weight gain while preparing for delivery and breastfeeding.'
            });
        }

        // Twin pregnancy recommendations
        if (results.pregnancyType === 'twins') {
            recommendations.push({
                icon: 'fas fa-users',
                title: 'Twin Pregnancy Care',
                description: 'Twin pregnancies require more frequent monitoring and higher caloric intake. Consult your healthcare provider regularly.'
            });
        }

        // General recommendations
        recommendations.push({
            icon: 'fas fa-dumbbell',
            title: 'Stay Active',
            description: 'Engage in safe, moderate exercise as approved by your healthcare provider to support healthy weight gain.'
        });

        recommendations.push({
            icon: 'fas fa-tint',
            title: 'Stay Hydrated',
            description: 'Drink plenty of water throughout the day to support your increased blood volume and overall health.'
        });

        this.displayRecommendations(recommendations);
    }

    displayRecommendations(recommendations) {
        this.recommendationList.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <i class="${rec.icon}"></i>
                <div class="content">
                    <div class="title">${rec.title}</div>
                    <div class="description">${rec.description}</div>
                </div>
            </div>
        `).join('');
    }

    initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const icon = question.querySelector('i');
                
                // Toggle current item
                const isOpen = faqItem.classList.contains('active');
                
                // Close all items
                faqQuestions.forEach(q => {
                    const item = q.parentElement;
                    const ans = item.querySelector('.faq-answer');
                    const ico = q.querySelector('i');
                    
                    item.classList.remove('active');
                    ans.style.maxHeight = null;
                    ico.style.transform = 'rotate(0deg)';
                });
                
                // Open clicked item if it wasn't open
                if (!isOpen) {
                    faqItem.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PregnancyWeightCalculator();
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PregnancyWeightCalculator;
}
