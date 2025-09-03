// Pomodoro Calculator JavaScript

class PomodoroCalculator {
    constructor() {
        this.timer = null;
        this.currentSession = 'ready'; // ready, work, shortBreak, longBreak
        this.currentCycle = 0;
        this.remainingTime = 0;
        this.isPaused = false;
        this.isRunning = false;
        this.totalWorkTime = 0;
        this.totalBreakTime = 0;
        this.completedPomodoros = 0;
        
        // Get DOM elements
        this.elements = {
            workDuration: document.getElementById('workDuration'),
            shortBreak: document.getElementById('shortBreak'),
            longBreak: document.getElementById('longBreak'),
            cycleCount: document.getElementById('cycleCount'),
            sessionType: document.querySelector('.session-type'),
            sessionProgress: document.querySelector('.session-progress'),
            timeDisplay: document.querySelector('.time-display'),
            startBtn: document.querySelector('.start-btn'),
            pauseBtn: document.querySelector('.pause-btn'),
            resetBtn: document.querySelector('.reset-btn'),
            progressFill: document.querySelector('.progress-fill'),
            progressText: document.querySelector('.progress-text'),
            totalTime: document.getElementById('totalTime'),
            workTime: document.getElementById('workTime'),
            breakTime: document.getElementById('breakTime'),
            completedCycles: document.getElementById('completedCycles')
        };
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.elements.startBtn.addEventListener('click', () => this.startTimer());
        this.elements.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Add input change listeners
        const inputs = [this.elements.workDuration, this.elements.shortBreak, 
                       this.elements.longBreak, this.elements.cycleCount];
        inputs.forEach(input => {
            input.addEventListener('change', () => this.calculateTotal());
        });
        
        // Initialize display
        this.updateDisplay();
        this.calculateTotal();
    }
    
    calculateTotal() {
        const workMin = parseInt(this.elements.workDuration.value) || 25;
        const shortBreakMin = parseInt(this.elements.shortBreak.value) || 5;
        const longBreakMin = parseInt(this.elements.longBreak.value) || 15;
        const cycles = parseInt(this.elements.cycleCount.value) || 4;
        
        // Calculate total times
        const totalWorkMinutes = workMin * cycles;
        const totalShortBreaks = (cycles - 1) * shortBreakMin;
        const totalLongBreaks = longBreakMin;
        const totalBreakMinutes = totalShortBreaks + totalLongBreaks;
        const totalMinutes = totalWorkMinutes + totalBreakMinutes;
        
        // Update display
        this.elements.totalTime.textContent = this.formatTime(totalMinutes);
        this.elements.workTime.textContent = this.formatTime(totalWorkMinutes);
        this.elements.breakTime.textContent = this.formatTime(totalBreakMinutes);
        this.elements.completedCycles.textContent = `${this.completedPomodoros}/${cycles} cycles`;
        
        // Update timer display if not running
        if (!this.isRunning) {
            this.remainingTime = workMin * 60;
            this.elements.timeDisplay.textContent = this.formatTimeDisplay(this.remainingTime);
        }
    }
    
    startTimer() {
        if (this.isPaused) {
            this.resumeTimer();
            return;
        }
        
        if (this.currentSession === 'ready') {
            this.currentSession = 'work';
            this.currentCycle = 1;
            this.remainingTime = (parseInt(this.elements.workDuration.value) || 25) * 60;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.updateSessionDisplay();
        this.updateButtonStates();
        
        this.timer = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            
            if (this.remainingTime <= 0) {
                this.completeSession();
            }
        }, 1000);
        
        // Add timer active class for animations
        document.querySelector('.timer-section').classList.add('timer-active');
    }
    
    pauseTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isPaused = true;
        this.updateButtonStates();
        document.querySelector('.timer-section').classList.remove('timer-active');
    }
    
    resumeTimer() {
        this.startTimer();
    }
    
    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.currentSession = 'ready';
        this.currentCycle = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.completedPomodoros = 0;
        
        this.remainingTime = (parseInt(this.elements.workDuration.value) || 25) * 60;
        
        this.updateSessionDisplay();
        this.updateDisplay();
        this.updateButtonStates();
        this.calculateTotal();
        
        // Remove timer state classes
        const timerSection = document.querySelector('.timer-section');
        timerSection.classList.remove('timer-active', 'timer-work', 'timer-short-break', 'timer-long-break');
    }
    
    completeSession() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Play notification sound (if available)
        this.playNotificationSound();
        
        // Show notification
        this.showNotification();
        
        // Move to next session
        this.nextSession();
    }
    
    nextSession() {
        const cycles = parseInt(this.elements.cycleCount.value) || 4;
        
        if (this.currentSession === 'work') {
            this.completedPomodoros++;
            
            if (this.currentCycle >= cycles) {
                // Long break after completing all cycles
                this.currentSession = 'longBreak';
                this.remainingTime = (parseInt(this.elements.longBreak.value) || 15) * 60;
            } else {
                // Short break
                this.currentSession = 'shortBreak';
                this.remainingTime = (parseInt(this.elements.shortBreak.value) || 5) * 60;
            }
        } else if (this.currentSession === 'shortBreak') {
            // Next work session
            this.currentSession = 'work';
            this.currentCycle++;
            this.remainingTime = (parseInt(this.elements.workDuration.value) || 25) * 60;
        } else if (this.currentSession === 'longBreak') {
            // Reset to ready state
            this.currentSession = 'ready';
            this.currentCycle = 0;
            this.isRunning = false;
            this.remainingTime = (parseInt(this.elements.workDuration.value) || 25) * 60;
        }
        
        this.updateSessionDisplay();
        this.updateDisplay();
        this.updateButtonStates();
        this.calculateTotal();
        
        // Auto-start next session if still in cycle
        if (this.currentSession !== 'ready') {
            setTimeout(() => {
                this.startTimer();
            }, 1000);
        } else {
            document.querySelector('.timer-section').classList.remove('timer-active');
        }
    }
    
    updateSessionDisplay() {
        const timerSection = document.querySelector('.timer-section');
        
        // Remove existing timer state classes
        timerSection.classList.remove('timer-work', 'timer-short-break', 'timer-long-break');
        
        switch (this.currentSession) {
            case 'ready':
                this.elements.sessionType.textContent = 'Ready to Start';
                this.elements.sessionProgress.textContent = 'Click Start to Begin';
                break;
            case 'work':
                this.elements.sessionType.textContent = `Work Session ${this.currentCycle}`;
                this.elements.sessionProgress.textContent = 'Focus time! Stay concentrated';
                timerSection.classList.add('timer-work');
                break;
            case 'shortBreak':
                this.elements.sessionType.textContent = 'Short Break';
                this.elements.sessionProgress.textContent = 'Take a quick break';
                timerSection.classList.add('timer-short-break');
                break;
            case 'longBreak':
                this.elements.sessionType.textContent = 'Long Break';
                this.elements.sessionProgress.textContent = 'Well done! Take a longer break';
                timerSection.classList.add('timer-long-break');
                break;
        }
    }
    
    updateDisplay() {
        // Update timer display
        this.elements.timeDisplay.textContent = this.formatTimeDisplay(this.remainingTime);
        
        // Update progress bar
        const sessionDuration = this.getSessionDuration();
        const elapsed = sessionDuration - this.remainingTime;
        const progress = sessionDuration > 0 ? (elapsed / sessionDuration) * 100 : 0;
        
        this.elements.progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        this.elements.progressText.textContent = `${Math.round(progress)}% Complete`;
    }
    
    updateButtonStates() {
        if (this.currentSession === 'ready') {
            this.elements.startBtn.style.display = 'flex';
            this.elements.pauseBtn.style.display = 'none';
            this.elements.startBtn.disabled = false;
        } else if (this.isRunning && !this.isPaused) {
            this.elements.startBtn.style.display = 'none';
            this.elements.pauseBtn.style.display = 'flex';
        } else if (this.isPaused) {
            this.elements.startBtn.style.display = 'flex';
            this.elements.pauseBtn.style.display = 'none';
            this.elements.startBtn.disabled = false;
        }
    }
    
    getSessionDuration() {
        switch (this.currentSession) {
            case 'work':
                return (parseInt(this.elements.workDuration.value) || 25) * 60;
            case 'shortBreak':
                return (parseInt(this.elements.shortBreak.value) || 5) * 60;
            case 'longBreak':
                return (parseInt(this.elements.longBreak.value) || 15) * 60;
            default:
                return (parseInt(this.elements.workDuration.value) || 25) * 60;
        }
    }
    
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }
    
    formatTimeDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    playNotificationSound() {
        // Create a simple beep sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
    
    showNotification() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                const sessionName = this.currentSession === 'work' ? 'Work session' : 'Break time';
                const nextSession = this.getNextSessionName();
                
                new Notification('Pomodoro Timer', {
                    body: `${sessionName} completed! ${nextSession}`,
                    icon: '../img/Jay_img.jpeg'
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showNotification();
                    }
                });
            }
        }
        
        // Fallback: Browser alert
        if (!('Notification' in window) || Notification.permission === 'denied') {
            const sessionName = this.currentSession === 'work' ? 'Work session' : 'Break time';
            const nextSession = this.getNextSessionName();
            alert(`${sessionName} completed! ${nextSession}`);
        }
    }
    
    getNextSessionName() {
        const cycles = parseInt(this.elements.cycleCount.value) || 4;
        
        if (this.currentSession === 'work') {
            if (this.currentCycle >= cycles) {
                return 'Time for a long break!';
            } else {
                return 'Time for a short break!';
            }
        } else if (this.currentSession === 'shortBreak') {
            return `Ready for work session ${this.currentCycle + 1}?`;
        } else if (this.currentSession === 'longBreak') {
            return 'Great job! All cycles completed.';
        }
        return '';
    }
}

// Global functions for HTML onclick handlers
let pomodoroCalculator;

function startTimer() {
    if (pomodoroCalculator) {
        pomodoroCalculator.startTimer();
    }
}

function pauseTimer() {
    if (pomodoroCalculator) {
        pomodoroCalculator.pauseTimer();
    }
}

function resetTimer() {
    if (pomodoroCalculator) {
        pomodoroCalculator.resetTimer();
    }
}

function calculateTotal() {
    if (pomodoroCalculator) {
        pomodoroCalculator.calculateTotal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    pomodoroCalculator = new PomodoroCalculator();
    
    // Request notification permission on first interaction
    document.body.addEventListener('click', function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        document.body.removeEventListener('click', requestNotificationPermission);
    }, { once: true });
});

// Handle page visibility changes (pause when tab is hidden)
document.addEventListener('visibilitychange', function() {
    if (pomodoroCalculator && pomodoroCalculator.isRunning && !pomodoroCalculator.isPaused) {
        if (document.hidden) {
            // Page is hidden, keep timer running but note the time
            pomodoroCalculator.hiddenTime = Date.now();
        } else {
            // Page is visible again, check if we need to sync time
            if (pomodoroCalculator.hiddenTime) {
                const hiddenDuration = Math.floor((Date.now() - pomodoroCalculator.hiddenTime) / 1000);
                pomodoroCalculator.remainingTime = Math.max(0, pomodoroCalculator.remainingTime - hiddenDuration);
                pomodoroCalculator.hiddenTime = null;
                
                if (pomodoroCalculator.remainingTime <= 0) {
                    pomodoroCalculator.completeSession();
                } else {
                    pomodoroCalculator.updateDisplay();
                }
            }
        }
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser shortcuts
    
    switch(event.key.toLowerCase()) {
        case ' ':
        case 'enter':
            event.preventDefault();
            if (pomodoroCalculator) {
                if (pomodoroCalculator.isPaused || pomodoroCalculator.currentSession === 'ready') {
                    pomodoroCalculator.startTimer();
                } else if (pomodoroCalculator.isRunning) {
                    pomodoroCalculator.pauseTimer();
                }
            }
            break;
        case 'escape':
        case 'r':
            event.preventDefault();
            if (pomodoroCalculator) {
                pomodoroCalculator.resetTimer();
            }
            break;
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PomodoroCalculator;
}
