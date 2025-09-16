// Study Planner JavaScript

class StudyPlanner {
    constructor() {
        this.subjects = [];
        this.dailyHours = 6;
        this.examDate = null;
        this.breakType = '60-10';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateExamInfo();
        this.initializeFAQ();
    }

    bindEvents() {
        // Add subject button
        document.getElementById('generatePlan')?.addEventListener('click', () => this.generateStudyPlan());
        document.getElementById('resetForm')?.addEventListener('click', () => this.resetForm());
        document.querySelector('.add-subject-btn')?.addEventListener('click', () => this.addSubject());
        
        // Exam date change
        document.getElementById('examDate')?.addEventListener('change', () => this.updateExamInfo());
        
        // Daily hours change
        document.getElementById('dailyHours')?.addEventListener('input', (e) => {
            this.dailyHours = parseInt(e.target.value) || 6;
        });

        // Break type change
        document.querySelectorAll('input[name="breakType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.breakType = e.target.value;
            });
        });

        // Enter key for subject input
        document.querySelector('.subject-name')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSubject();
            }
        });

        // Download and copy buttons
        document.getElementById('downloadPdf')?.addEventListener('click', () => this.downloadPDF());
        document.getElementById('copyPlan')?.addEventListener('click', () => this.copyPlan());
    }

    addSubject() {
        const nameInput = document.querySelector('.subject-name');
        const prioritySelect = document.querySelector('.subject-priority');
        
        const name = nameInput.value.trim();
        const priority = prioritySelect.value;

        if (!name) {
            this.showNotification('Please enter a subject name', 'error');
            return;
        }

        // Check for duplicates
        if (this.subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            this.showNotification('Subject already exists', 'error');
            return;
        }

        const subject = {
            id: Date.now(),
            name: name,
            priority: priority
        };

        this.subjects.push(subject);
        this.renderSubjects();
        
        // Clear inputs
        nameInput.value = '';
        prioritySelect.value = 'medium';
        nameInput.focus();

        this.showNotification('Subject added successfully', 'success');
    }

    removeSubject(id) {
        this.subjects = this.subjects.filter(s => s.id !== id);
        this.renderSubjects();
        this.showNotification('Subject removed', 'success');
    }

    renderSubjects() {
        const container = document.querySelector('.subjects-list');
        if (!container) return;

        if (this.subjects.length === 0) {
            container.innerHTML = '<p style="color: #718096; font-style: italic;">No subjects added yet. Add your first subject above.</p>';
            return;
        }

        container.innerHTML = this.subjects.map(subject => `
            <div class="subject-item">
                <div class="subject-info">
                    <span class="subject-name-display">${subject.name}</span>
                    <span class="priority-badge priority-${subject.priority}">
                        ${subject.priority.charAt(0).toUpperCase() + subject.priority.slice(1)} Priority
                    </span>
                </div>
                <button class="remove-subject-btn" onclick="studyPlanner.removeSubject(${subject.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    updateExamInfo() {
        const examDateInput = document.getElementById('examDate');
        const daysRemainingSpan = document.getElementById('daysRemaining');
        
        if (!examDateInput || !daysRemainingSpan) return;

        const examDate = examDateInput.value;
        if (!examDate) {
            daysRemainingSpan.textContent = '';
            this.examDate = null;
            return;
        }

        const today = new Date();
        const exam = new Date(examDate);
        const diffTime = exam - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        this.examDate = exam;

        if (diffDays < 0) {
            daysRemainingSpan.innerHTML = '<span style="color: #e53e3e;">⚠️ Exam date has passed</span>';
        } else if (diffDays === 0) {
            daysRemainingSpan.innerHTML = '<span style="color: #ed8936;">📅 Exam is today!</span>';
        } else if (diffDays <= 7) {
            daysRemainingSpan.innerHTML = `<span style="color: #ed8936;">⏰ ${diffDays} days remaining</span>`;
        } else {
            daysRemainingSpan.innerHTML = `<span style="color: #38a169;">📚 ${diffDays} days to prepare</span>`;
        }
    }

    generateStudyPlan() {
        if (this.subjects.length === 0) {
            this.showNotification('Please add at least one subject', 'error');
            return;
        }

        if (this.dailyHours < 1 || this.dailyHours > 24) {
            this.showNotification('Please enter valid daily study hours (1-24)', 'error');
            return;
        }

        // Calculate study plan
        const plan = this.calculateStudyPlan();
        this.displayResults(plan);
        
        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        this.showNotification('Study plan generated successfully!', 'success');
    }

    calculateStudyPlan() {
        // Priority weights
        const priorityWeights = { high: 3, medium: 2, low: 1 };
        
        // Calculate total weight
        const totalWeight = this.subjects.reduce((sum, subject) => {
            return sum + priorityWeights[subject.priority];
        }, 0);

        // Break time calculation
        const [studyMinutes, breakMinutes] = this.breakType.split('-').map(Number);
        const breakRatio = breakMinutes / studyMinutes;
        const effectiveStudyHours = this.dailyHours / (1 + breakRatio);
        const totalBreakTime = this.dailyHours - effectiveStudyHours;

        // Allocate time to subjects
        const subjectAllocations = this.subjects.map(subject => {
            const weight = priorityWeights[subject.priority];
            const hoursPerDay = (weight / totalWeight) * effectiveStudyHours;
            const hoursPerWeek = hoursPerDay * 7;
            
            return {
                ...subject,
                hoursPerDay: Math.round(hoursPerDay * 100) / 100,
                hoursPerWeek: Math.round(hoursPerWeek * 100) / 100,
                sessionsPerDay: Math.ceil(hoursPerDay / (studyMinutes / 60))
            };
        });

        // Generate weekly schedule
        const weeklySchedule = this.generateWeeklySchedule(subjectAllocations);

        // Generate AI suggestions
        const aiSuggestions = this.generateAISuggestions(subjectAllocations);

        return {
            subjectAllocations,
            weeklySchedule,
            aiSuggestions,
            summary: {
                totalStudyHours: effectiveStudyHours,
                totalBreakTime: Math.round(totalBreakTime * 100) / 100,
                subjectsCount: this.subjects.length,
                examDays: this.examDate ? Math.ceil((this.examDate - new Date()) / (1000 * 60 * 60 * 24)) : null
            }
        };
    }

    generateWeeklySchedule(allocations) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const timeSlots = ['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Evening (7-9 PM)'];
        
        const schedule = [];
        
        // Distribute subjects across the week
        let subjectIndex = 0;
        const sortedSubjects = [...allocations].sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        days.forEach((day, dayIndex) => {
            const daySchedule = { day };
            
            timeSlots.forEach((slot, slotIndex) => {
                if (dayIndex === 6 && slotIndex === 2) {
                    // Sunday evening - rest time
                    daySchedule[slot] = 'Rest & Recreation';
                } else if (dayIndex === 6 && slotIndex === 0) {
                    // Sunday morning - planning
                    daySchedule[slot] = 'Weekly Planning';
                } else if (dayIndex === 5 && slotIndex === 0) {
                    // Saturday morning - practice tests
                    daySchedule[slot] = 'Practice Tests';
                } else if (dayIndex === 5 && slotIndex === 1) {
                    // Saturday afternoon - weak areas
                    daySchedule[slot] = 'Weak Areas Focus';
                } else {
                    // Regular study sessions
                    const subject = sortedSubjects[subjectIndex % sortedSubjects.length];
                    daySchedule[slot] = `${subject.name} (${subject.priority.charAt(0).toUpperCase() + subject.priority.slice(1)})`;
                    subjectIndex++;
                }
            });
            
            // Add break info
            const [studyMin, breakMin] = this.breakType.split('-').map(Number);
            daySchedule.breaks = `${breakMin} min every ${studyMin} min`;
            
            schedule.push(daySchedule);
        });

        return schedule;
    }

    generateAISuggestions(allocations) {
        const suggestions = [];
        
        // Priority-based suggestions
        const highPriorityCount = allocations.filter(s => s.priority === 'high').length;
        if (highPriorityCount > 3) {
            suggestions.push('Consider focusing on 2-3 high-priority subjects at a time for better concentration.');
        }

        // Time-based suggestions
        if (this.dailyHours > 8) {
            suggestions.push('Long study sessions detected. Consider breaking them into smaller chunks with longer breaks.');
        } else if (this.dailyHours < 4) {
            suggestions.push('Consider increasing daily study time if possible for better coverage of all subjects.');
        }

        // Exam-based suggestions
        if (this.examDate) {
            const daysRemaining = Math.ceil((this.examDate - new Date()) / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 7) {
                suggestions.push('Exam is approaching! Focus on revision and practice tests rather than new topics.');
            } else if (daysRemaining <= 30) {
                suggestions.push('Start intensive revision phase. Allocate more time to high-priority subjects.');
            }
        }

        // Break suggestions
        const [studyMin] = this.breakType.split('-').map(Number);
        if (studyMin >= 120) {
            suggestions.push('Consider shorter study blocks (60-90 minutes) for better retention and focus.');
        }

        // General suggestions
        suggestions.push('Review your progress weekly and adjust time allocation based on your performance.');
        suggestions.push('Use active learning techniques like flashcards, practice problems, and teaching others.');

        return suggestions;
    }

    displayResults(plan) {
        this.displaySummary(plan.summary);
        this.displayAISuggestions(plan.aiSuggestions);
        this.displaySchedule(plan.weeklySchedule);
    }

    displaySummary(summary) {
        const container = document.getElementById('studySummary');
        if (!container) return;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #667eea;">${summary.totalStudyHours.toFixed(1)}h</div>
                    <div style="font-size: 0.9rem; color: #718096;">Daily Study Time</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #38a169;">${summary.totalBreakTime.toFixed(1)}h</div>
                    <div style="font-size: 0.9rem; color: #718096;">Daily Break Time</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #ed8936;">${summary.subjectsCount}</div>
                    <div style="font-size: 0.9rem; color: #718096;">Subjects</div>
                </div>
                ${summary.examDays ? `
                <div style="text-align: center; padding: 1rem; background: #f7fafc; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: 700; color: #e53e3e;">${summary.examDays}</div>
                    <div style="font-size: 0.9rem; color: #718096;">Days to Exam</div>
                </div>
                ` : ''}
            </div>
        `;
    }

    displayAISuggestions(suggestions) {
        const container = document.getElementById('aiSuggestion');
        if (!container) return;

        container.innerHTML = `
            <ul style="margin: 0; padding-left: 1.5rem; color: #4a5568;">
                ${suggestions.map(suggestion => `<li style="margin-bottom: 0.5rem;">${suggestion}</li>`).join('')}
            </ul>
        `;
    }

    displaySchedule(schedule) {
        const container = document.getElementById('scheduleTable');
        if (!container) return;

        const timeSlots = ['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Evening (7-9 PM)'];
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        ${timeSlots.map(slot => `<th>${slot}</th>`).join('')}
                        <th>Breaks</th>
                    </tr>
                </thead>
                <tbody>
                    ${schedule.map(day => `
                        <tr>
                            <td><strong>${day.day}</strong></td>
                            ${timeSlots.map(slot => `<td>${day[slot] || '-'}</td>`).join('')}
                            <td>${day.breaks}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    resetForm() {
        // Reset all form fields
        document.getElementById('dailyHours').value = 6;
        document.getElementById('examDate').value = '';
        document.querySelector('.subject-name').value = '';
        document.querySelector('.subject-priority').value = 'medium';
        document.querySelector('input[name="breakType"][value="60-10"]').checked = true;
        
        // Reset data
        this.subjects = [];
        this.dailyHours = 6;
        this.examDate = null;
        this.breakType = '60-10';
        
        // Update UI
        this.renderSubjects();
        this.updateExamInfo();
        
        // Hide results
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
        }

        this.showNotification('Form reset successfully', 'success');
    }

    downloadPDF() {
        // Create a simple text version for download
        const plan = this.calculateStudyPlan();
        let content = `STUDY PLANNER - Generated on ${new Date().toLocaleDateString()}\n\n`;
        
        content += `SUMMARY:\n`;
        content += `Daily Study Time: ${plan.summary.totalStudyHours.toFixed(1)} hours\n`;
        content += `Daily Break Time: ${plan.summary.totalBreakTime.toFixed(1)} hours\n`;
        content += `Number of Subjects: ${plan.summary.subjectsCount}\n`;
        if (plan.summary.examDays) {
            content += `Days to Exam: ${plan.summary.examDays}\n`;
        }
        content += `\n`;

        content += `WEEKLY SCHEDULE:\n`;
        plan.weeklySchedule.forEach(day => {
            content += `${day.day}:\n`;
            content += `  Morning: ${day['Morning (9-11 AM)']}\n`;
            content += `  Afternoon: ${day['Afternoon (2-4 PM)']}\n`;
            content += `  Evening: ${day['Evening (7-9 PM)']}\n`;
            content += `  Breaks: ${day.breaks}\n\n`;
        });

        content += `AI SUGGESTIONS:\n`;
        plan.aiSuggestions.forEach((suggestion, index) => {
            content += `${index + 1}. ${suggestion}\n`;
        });

        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-plan-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showNotification('Study plan downloaded!', 'success');
    }

    copyPlan() {
        const plan = this.calculateStudyPlan();
        let content = `📚 STUDY PLANNER\n\n`;
        
        content += `📊 SUMMARY:\n`;
        content += `• Daily Study Time: ${plan.summary.totalStudyHours.toFixed(1)} hours\n`;
        content += `• Daily Break Time: ${plan.summary.totalBreakTime.toFixed(1)} hours\n`;
        content += `• Subjects: ${plan.summary.subjectsCount}\n`;
        if (plan.summary.examDays) {
            content += `• Days to Exam: ${plan.summary.examDays}\n`;
        }
        content += `\n`;

        content += `📅 WEEKLY SCHEDULE:\n`;
        plan.weeklySchedule.forEach(day => {
            content += `${day.day}:\n`;
            content += `  🌅 Morning: ${day['Morning (9-11 AM)']}\n`;
            content += `  🌞 Afternoon: ${day['Afternoon (2-4 PM)']}\n`;
            content += `  🌙 Evening: ${day['Evening (7-9 PM)']}\n`;
            content += `  ☕ Breaks: ${day.breaks}\n\n`;
        });

        content += `🤖 AI SUGGESTIONS:\n`;
        plan.aiSuggestions.forEach((suggestion, index) => {
            content += `${index + 1}. ${suggestion}\n`;
        });

        // Copy to clipboard
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('Study plan copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy. Please try again.', 'error');
        });
    }

    initializeFAQ() {
        // FAQ toggle functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQs
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current FAQ
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        // Set background color based on type
        const colors = {
            success: '#38a169',
            error: '#e53e3e',
            info: '#667eea'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the study planner when the page loads
let studyPlanner;
document.addEventListener('DOMContentLoaded', function() {
    studyPlanner = new StudyPlanner();
});