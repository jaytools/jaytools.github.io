// Simple Pomodoro Timer JavaScript

class PomodoroTimer {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.isPaused = false;
        this.remainingTime = 0;
        this.totalTime = 0;
        this.currentSession = 'work';
        this.completedCycles = 0;
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
            startBtn: document.getElementById('start-btn'),
            stopBtn: document.getElementById('stop-btn'),
            resetBtn: document.getElementById('reset-btn'),
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
        this.elements.stopBtn.addEventListener('click', () => this.stopTimer());
        this.elements.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Add calculate button listener
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateTotal());
        }
        
        // Add input change listeners
        const inputs = [this.elements.workDuration, this.elements.shortBreak, 
                       this.elements.longBreak, this.elements.cycleCount];
        inputs.forEach(input => {
            input.addEventListener('change', () => this.calculateTotal());
        });
        
        // Initialize display
        this.resetTimer();
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
        this.elements.completedCycles.textContent = `${this.completedPomodoros || 0}/${cycles} cycles`;
        
        // Update timer display if not running
        if (!this.isRunning) {
            this.remainingTime = workMin * 60;
            this.elements.timeDisplay.textContent = this.formatTimeDisplay(this.remainingTime);
        }
    }
    
    startTimer() {
        if (this.isRunning) return;
        
        // If not paused, start fresh with work duration
        if (!this.isPaused) {
            const workMin = parseInt(this.elements.workDuration.value) || 25;
            this.remainingTime = workMin * 60;
            this.totalTime = this.remainingTime;
            this.currentSession = 'work';
            this.elements.sessionType.textContent = 'Work Session';
            this.elements.sessionProgress.textContent = 'Focus time! Stay concentrated';
        }
        
        this.isRunning = true;
        this.isPaused = false;
        this.updateButtonStates();
        
        // Start countdown
        this.timer = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            
            if (this.remainingTime <= 0) {
                this.stopTimer();
                this.playNotificationSound();
                alert('Time\'s up! Take a break.');
            }
        }, 1000);
        
        // Add visual feedback
        document.querySelector('.timer-section')?.classList.add('timer-active');
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isRunning = false;
        this.isPaused = true;
        this.updateButtonStates();
        document.querySelector('.timer-section')?.classList.remove('timer-active');
    }
    
    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'work';
        this.completedCycles = 0;
        
        // Reset to work duration
        const workMin = parseInt(this.elements.workDuration.value) || 25;
        this.remainingTime = workMin * 60;
        this.totalTime = this.remainingTime;
        
        // Update display
        this.elements.sessionType.textContent = 'Ready to Start';
        this.elements.sessionProgress.textContent = 'Click Start to Begin';
        this.updateDisplay();
        this.updateButtonStates();
        
        // Remove visual feedback
        document.querySelector('.timer-section')?.classList.remove('timer-active');
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
        if (this.totalTime > 0) {
            const elapsed = this.totalTime - this.remainingTime;
            const progress = (elapsed / this.totalTime) * 100;
            this.elements.progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
            this.elements.progressText.textContent = `${Math.round(progress)}% Complete`;
        } else {
            this.elements.progressFill.style.width = '0%';
            this.elements.progressText.textContent = '0% Complete';
        }
    }
    
    updateButtonStates() {
        if (this.isRunning) {
            this.elements.startBtn.disabled = true;
            this.elements.stopBtn.disabled = false;
            this.elements.resetBtn.disabled = false;
        } else {
            this.elements.startBtn.disabled = false;
            this.elements.stopBtn.disabled = true;
            this.elements.resetBtn.disabled = false;
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

// Global timer instance
let pomodoroTimer;

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    pomodoroTimer = new PomodoroTimer();
});

// Global function for backward compatibility
function calculateTotal() {
    if (pomodoroTimer) {
        pomodoroTimer.calculateTotal();
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser shortcuts
    
    switch(event.key.toLowerCase()) {
        case ' ':
        case 'enter':
            event.preventDefault();
            if (pomodoroTimer) {
                if (!pomodoroTimer.isRunning) {
                    pomodoroTimer.startTimer();
                } else {
                    pomodoroTimer.stopTimer();
                }
            }
            break;
        case 'escape':
        case 'r':
            event.preventDefault();
            if (pomodoroTimer) {
                pomodoroTimer.resetTimer();
            }
            break;
    }
});
