// Goal Planner JavaScript

class GoalPlanner {
    constructor() {
        this.goals = this.loadGoals();
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.editingGoalId = null;
        this.init();
    }

    init() {
        this.initializeElements();
        this.bindEvents();
        this.applyTheme();
        this.renderGoals();
        this.updateStats();
    }

    initializeElements() {
        // Form elements
        this.goalForm = document.getElementById('goalForm');
        this.goalTitle = document.getElementById('goalTitle');
        this.goalDescription = document.getElementById('goalDescription');
        this.goalCategory = document.getElementById('goalCategory');
        this.goalDeadline = document.getElementById('goalDeadline');
        this.addGoalBtn = document.getElementById('addGoalBtn');

        // Display elements
        this.goalsList = document.getElementById('goalsList');
        this.totalGoals = document.getElementById('totalGoals');
        this.completedGoals = document.getElementById('completedGoals');
        this.cancelEditBtn = document.getElementById('cancelEditBtn');

        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');

        // FAQ elements
        this.faqQuestions = document.querySelectorAll('.faq-question');

        // Set minimum date to today
        if (this.goalDeadline) {
            const today = new Date().toISOString().split('T')[0];
            this.goalDeadline.setAttribute('min', today);
        }
    }

    bindEvents() {
        // Form submission
        if (this.goalForm) {
            this.goalForm.addEventListener('submit', (e) => this.handleAddGoal(e));
        }

        // Theme toggle with mobile support
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
            
            // Add touch support for mobile
            this.themeToggle.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Cancel edit button
        if (this.cancelEditBtn) {
            this.cancelEditBtn.addEventListener('click', () => this.cancelEdit());
        }

        // FAQ toggles
        this.faqQuestions.forEach(question => {
            question.addEventListener('click', () => this.toggleFAQ(question));
        });

        // Form validation
        [this.goalTitle, this.goalDescription, this.goalCategory, this.goalDeadline].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.validateForm());
                input.addEventListener('blur', () => this.validateField(input));
            }
        });
    }

    handleAddGoal(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        // Check if we're editing an existing goal
        if (this.editingGoalId) {
            this.updateGoal();
            return;
        }

        const goal = {
            id: Date.now().toString(),
            title: this.goalTitle.value.trim(),
            description: this.goalDescription.value.trim(),
            category: this.goalCategory.value,
            deadline: this.goalDeadline.value,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            updatedAt: null
        };

        this.goals.push(goal);
        this.saveGoals();
        this.renderGoals();
        this.updateStats();
        this.resetForm();
        this.showNotification('Goal added successfully! 🎯', 'success');
    }

    validateForm() {
        let isValid = true;
        const fields = [
            { element: this.goalTitle, name: 'goalTitle', message: 'Please enter a goal title.' },
            { element: this.goalDescription, name: 'goalDescription', message: 'Please enter a goal description.' },
            { element: this.goalCategory, name: 'goalCategory', message: 'Please select a category.' },
            { element: this.goalDeadline, name: 'goalDeadline', message: 'Please select a deadline.' }
        ];

        fields.forEach(field => {
            if (!field.element || !field.element.value.trim()) {
                this.showFieldError(field.name, field.message);
                isValid = false;
            } else {
                this.hideFieldError(field.name);
            }
        });

        // Enable/disable submit button
        if (this.addGoalBtn) {
            this.addGoalBtn.disabled = !isValid;
        }

        return isValid;
    }

    validateField(field) {
        const fieldName = field.getAttribute('name');
        const errorMessages = {
            goalTitle: 'Please enter a goal title.',
            goalDescription: 'Please enter a goal description.',
            goalCategory: 'Please select a category.',
            goalDeadline: 'Please select a deadline.'
        };

        if (!field.value.trim()) {
            this.showFieldError(fieldName, errorMessages[fieldName]);
        } else {
            this.hideFieldError(fieldName);
        }
    }

    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    hideFieldError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    renderGoals() {
        if (!this.goalsList) return;

        if (this.goals.length === 0) {
            this.goalsList.innerHTML = `
                <div class="empty-goals">
                    <i class="fas fa-bullseye"></i>
                    <h4>No goals yet!</h4>
                    <p>Start by adding your first goal above.</p>
                </div>
            `;
            return;
        }

        const goalsHTML = this.goals.map(goal => this.createGoalCard(goal)).join('');
        this.goalsList.innerHTML = goalsHTML;

        // Bind goal actions
        this.bindGoalActions();
    }

    createGoalCard(goal) {
        const categoryIcons = {
            personal: 'fa-user',
            professional: 'fa-briefcase',
            health: 'fa-heart',
            financial: 'fa-dollar-sign',
            education: 'fa-graduation-cap',
            relationships: 'fa-users',
            other: 'fa-star'
        };

        const categoryColors = {
            personal: '#3b82f6',
            professional: '#8b5cf6',
            health: '#10b981',
            financial: '#f59e0b',
            education: '#ef4444',
            relationships: '#ec4899',
            other: '#6b7280'
        };

        const deadlineDate = new Date(goal.deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        const isOverdue = daysLeft < 0;
        const isUrgent = daysLeft <= 7 && daysLeft >= 0;

        return `
            <div class="goal-card ${goal.completed ? 'completed' : ''}" data-goal-id="${goal.id}">
                <div class="goal-header">
                    <div class="goal-category" style="background-color: ${categoryColors[goal.category]}">
                        <i class="fas ${categoryIcons[goal.category]}"></i>
                        <span>${goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</span>
                    </div>
                    <div class="goal-actions">
                        <button class="goal-action-btn edit-goal" title="Edit Goal">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="goal-action-btn delete-goal" title="Delete Goal">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="goal-content">
                    <h4 class="goal-title">${goal.title}</h4>
                    <p class="goal-description">${goal.description}</p>
                    <div class="goal-meta">
                        <div class="goal-deadline ${isOverdue ? 'overdue' : isUrgent ? 'urgent' : ''}">
                            <i class="fas fa-calendar"></i>
                            <span>${deadlineDate.toLocaleDateString()}</span>
                            ${isOverdue ? '<span class="status-text">Overdue</span>' : 
                              isUrgent ? '<span class="status-text">Due Soon</span>' : 
                              `<span class="status-text">${daysLeft} days left</span>`}
                        </div>
                    </div>
                </div>
                <div class="goal-footer">
                    <button class="toggle-complete-btn ${goal.completed ? 'completed' : ''}" data-goal-id="${goal.id}">
                        <i class="fas ${goal.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                        ${goal.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>
        `;
    }

    bindGoalActions() {
        // Toggle completion
        document.querySelectorAll('.toggle-complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.closest('.toggle-complete-btn').dataset.goalId;
                this.toggleGoalCompletion(goalId);
            });
        });

        // Delete goal
        document.querySelectorAll('.delete-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.closest('.goal-card').dataset.goalId;
                this.deleteGoal(goalId);
            });
        });

        // Edit goal functionality
        document.querySelectorAll('.edit-goal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalId = e.target.closest('.goal-card').dataset.goalId;
                this.editGoal(goalId);
            });
        });
    }

    toggleGoalCompletion(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = !goal.completed;
            goal.completedAt = goal.completed ? new Date().toISOString() : null;
            this.saveGoals();
            this.renderGoals();
            this.updateStats();
            this.showNotification(
                goal.completed ? 'Goal completed! 🎉' : 'Goal marked as incomplete',
                goal.completed ? 'success' : 'info'
            );
        }
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(g => g.id !== goalId);
            this.saveGoals();
            this.renderGoals();
            this.updateStats();
            this.showNotification('Goal deleted successfully', 'info');
        }
    }

    updateStats() {
        const total = this.goals.length;
        const completed = this.goals.filter(g => g.completed).length;

        if (this.totalGoals) this.totalGoals.textContent = total;
        if (this.completedGoals) this.completedGoals.textContent = completed;
    }

    resetForm() {
        if (this.goalForm) {
            this.goalForm.reset();
        }
        
        // Reset editing state
        if (this.editingGoalId) {
            this.editingGoalId = null;
            this.addGoalBtn.textContent = 'Add Goal';
            this.addGoalBtn.innerHTML = '<i class="fas fa-plus"></i> Add Goal';
            
            // Hide cancel button
            if (this.cancelEditBtn) {
                this.cancelEditBtn.classList.add('hidden');
            }
        }

        // Hide all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
        
        // Disable submit button
        if (this.addGoalBtn) {
            this.addGoalBtn.disabled = true;
        }
    }

    cancelEdit() {
        if (this.editingGoalId) {
            this.resetForm();
            this.showNotification('Edit cancelled', 'info');
        }
    }

    editGoal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        // Store editing state
        this.editingGoalId = goalId;

        // Populate form with existing data
        this.goalTitle.value = goal.title;
        this.goalDescription.value = goal.description;
        this.goalCategory.value = goal.category;
        this.goalDeadline.value = goal.deadline;

        // Change button text and functionality
        this.addGoalBtn.textContent = 'Update Goal';
        this.addGoalBtn.innerHTML = '<i class="fas fa-save"></i> Update Goal';

        // Show cancel button
        if (this.cancelEditBtn) {
            this.cancelEditBtn.classList.remove('hidden');
        }

        // Scroll to form
        this.goalForm.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Show edit notification
        this.showNotification('Editing mode: Make changes and click Update Goal', 'info');
    }

    updateGoal() {
        const goalIndex = this.goals.findIndex(g => g.id === this.editingGoalId);
        if (goalIndex === -1) return;

        // Update the goal
        this.goals[goalIndex] = {
            ...this.goals[goalIndex],
            title: this.goalTitle.value.trim(),
            description: this.goalDescription.value.trim(),
            category: this.goalCategory.value,
            deadline: this.goalDeadline.value,
            updatedAt: new Date().toISOString()
        };

        // Reset editing state
        this.editingGoalId = null;
        this.addGoalBtn.textContent = 'Add Goal';
        this.addGoalBtn.innerHTML = '<i class="fas fa-plus"></i> Add Goal';
        
        // Hide cancel button
        if (this.cancelEditBtn) {
            this.cancelEditBtn.classList.add('hidden');
        }

        // Save and refresh
        this.saveGoals();
        this.renderGoals();
        this.updateStats();
        this.resetForm();
        this.showNotification('Goal updated successfully! 📝', 'success');
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        if (this.themeIcon) {
            this.themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleFAQ(questionElement) {
        const isExpanded = questionElement.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs
        this.faqQuestions.forEach(q => {
            q.setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current FAQ
        questionElement.setAttribute('aria-expanded', !isExpanded);
    }

    loadGoals() {
        try {
            const goalsData = localStorage.getItem('goals');
            const lastSaved = localStorage.getItem('goalsLastSaved');
            
            if (!goalsData || !lastSaved) {
                return [];
            }

            // Check if data is still valid (within 30 days for long-term storage)
            const savedDate = new Date(lastSaved);
            const now = new Date();
            const daysSinceLastSave = (now - savedDate) / (1000 * 60 * 60 * 24);

            // Data expires after 30 days of inactivity to keep storage clean
            if (daysSinceLastSave > 30) {
                console.log('Goals data expired after 30 days of inactivity');
                localStorage.removeItem('goals');
                localStorage.removeItem('goalsLastSaved');
                return [];
            }

            const goals = JSON.parse(goalsData);
            
            // Validate data structure
            if (Array.isArray(goals)) {
                return goals.filter(goal => goal && goal.id && goal.title);
            }

            return [];
        } catch (error) {
            console.error('Error loading goals:', error);
            return [];
        }
    }

    saveGoals() {
        try {
            // Save goals data
            localStorage.setItem('goals', JSON.stringify(this.goals));
            
            // Update last saved timestamp for persistence tracking
            localStorage.setItem('goalsLastSaved', new Date().toISOString());
            
            // Create backup in sessionStorage as additional safety
            sessionStorage.setItem('goalsBackup', JSON.stringify({
                goals: this.goals,
                timestamp: new Date().toISOString()
            }));

            console.log(`Saved ${this.goals.length} goals to storage`);
        } catch (error) {
            console.error('Error saving goals:', error);
            this.showNotification('Error saving goals. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize Goal Planner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GoalPlanner();
});