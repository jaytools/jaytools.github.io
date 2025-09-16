// Typing Speed Test JavaScript
class TypingSpeedTest {
    constructor() {
        this.testTexts = {
            paragraph: [
                "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for typing practice. Regular practice with diverse texts helps improve both speed and accuracy in typing skills.",
                "Technology has revolutionized the way we communicate and work in the modern world. From smartphones to artificial intelligence, these innovations continue to shape our daily lives and create new opportunities for growth and development.",
                "Reading books is one of the most enriching activities a person can engage in. It expands vocabulary, improves comprehension skills, and opens doors to new worlds of imagination and knowledge that can last a lifetime.",
                "Climate change represents one of the most pressing challenges of our time. Scientists around the world are working together to develop sustainable solutions that can help protect our planet for future generations.",
                "The art of cooking combines creativity with science to produce delicious meals. Understanding ingredients, techniques, and flavors allows chefs to create memorable dining experiences that bring people together around the table.",
                "Exercise and physical fitness play crucial roles in maintaining good health and well-being. Regular activity strengthens muscles, improves cardiovascular health, and contributes to better mental health and overall quality of life.",
                "Music has the power to evoke emotions, create memories, and bring people together across cultural boundaries. Whether classical, jazz, rock, or electronic, different genres offer unique experiences and artistic expressions.",
                "Education is the foundation of personal and societal progress. It empowers individuals with knowledge and skills necessary to navigate complex challenges and contribute meaningfully to their communities and the world."
            ],
            numbers: [
                "1234567890 9876543210 1357924680 2468013579 1029384756 5647382910 7890123456 3456789012 6789012345 9012345678",
                "1111 2222 3333 4444 5555 6666 7777 8888 9999 0000 1234 5678 9012 3456 7890 1234 5678 9012 3456 7890",
                "192.168.1.1 255.255.255.0 127.0.0.1 10.0.0.1 172.16.0.1 8.8.8.8 4.4.4.4 1.1.1.1 208.67.222.222 9.9.9.9",
                "2024-01-15 2023-12-31 2022-06-30 2021-03-15 2020-09-22 2019-11-08 2018-07-04 2017-02-14 2016-10-31 2015-05-20",
                "Phone: 555-123-4567 Fax: 555-987-6543 Mobile: 555-246-8135 Office: 555-369-2580 Home: 555-147-2583 Emergency: 911",
                "Account: 1234567890123456 Routing: 987654321 PIN: 1234 CVV: 567 Zip: 12345 SSN: 123-45-6789 ID: 987654321",
                "Temperature: 98.6°F Pressure: 14.7 PSI Speed: 65 MPH Distance: 26.2 miles Weight: 150.5 lbs Height: 5.75 feet",
                "Coordinates: 40.7128° N, 74.0060° W Elevation: 33 feet Population: 8,336,817 Area: 302.6 square miles Founded: 1624"
            ],
            mixed: [
                "User123 logged in at 14:30:25 on 2024-01-15. Session ID: abc123def456. IP: 192.168.1.100. Status: Active. Expires: 18:30:25.",
                "Order #ORD-2024-0001 contains 5 items @ $29.99 each = $149.95. Tax: $12.00. Shipping: $7.50. Total: $169.45. Due: 2024-02-01.",
                "Flight AA1234 departs Gate B7 at 15:45 EST. Seat 12A. Confirmation: ABC123. Baggage: 2 pieces @ 23kg each. Arrival: 18:20 PST.",
                "Recipe serves 4-6 people. Ingredients: 2 cups flour, 1.5 tsp salt, 3/4 cup water, 2 tbsp oil. Bake @ 375°F for 25-30 minutes.",
                "Meeting ID: 123-456-789. Password: Secure2024! Starts: 10:00 AM EST. Duration: 1.5 hours. Attendees: 15 max. Room: Conference-A.",
                "Product SKU: ABC-123-XYZ. Price: $49.99. Discount: 15% off. Final: $42.49. Stock: 47 units. Category: Electronics. Rating: 4.5/5.",
                "License: MIT-2024. Version: v2.1.3. Build: #4567. Released: 2024-01-10. Size: 2.3 MB. Downloads: 10,547. Stars: 1,234.",
                "WiFi: Network_5G_2024. Password: SecurePass123!. Speed: 100 Mbps. Ping: 15ms. Connected: 12/20 devices. Uptime: 99.9%."
            ]
        };
        
        this.currentTest = {
            text: '',
            mode: 'paragraph',
            duration: 60,
            startTime: null,
            endTime: null,
            isActive: false,
            currentIndex: 0,
            correctChars: 0,
            totalChars: 0,
            errors: 0,
            timer: null,
            timeRemaining: 60
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadRandomText();
        this.updateTimer();
    }
    
    bindEvents() {
        // Configuration changes
        document.getElementById('testMode').addEventListener('change', () => {
            this.currentTest.mode = document.getElementById('testMode').value;
            this.loadRandomText();
        });
        
        document.getElementById('testDuration').addEventListener('change', () => {
            this.currentTest.duration = parseInt(document.getElementById('testDuration').value);
            this.currentTest.timeRemaining = this.currentTest.duration;
            this.updateTimer();
        });
        
        // Control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.startTest());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartTest());
        
        // Typing input
        const typingInput = document.getElementById('typingInput');
        typingInput.addEventListener('input', (e) => this.handleTyping(e));
        typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        typingInput.addEventListener('paste', (e) => e.preventDefault()); // Prevent pasting
    }
    
    loadRandomText() {
        const texts = this.testTexts[this.currentTest.mode];
        const randomIndex = Math.floor(Math.random() * texts.length);
        this.currentTest.text = texts[randomIndex];
        this.displayText();
    }
    
    displayText() {
        const testTextElement = document.getElementById('testText');
        const text = this.currentTest.text;
        
        // Create spans for each character with proper spacing
        const spans = text.split('').map((char, index) => {
            if (char === ' ') {
                return `<span class="char" data-index="${index}" style="display: inline-block; width: 0.5em;">&nbsp;</span>`;
            } else {
                return `<span class="char" data-index="${index}">${char}</span>`;
            }
        }).join('');
        
        testTextElement.innerHTML = spans;
        testTextElement.style.whiteSpace = 'pre-wrap';
        testTextElement.style.wordWrap = 'break-word';
        testTextElement.style.overflowWrap = 'break-word';
        
        // Highlight first character
        if (text.length > 0) {
            testTextElement.querySelector('.char[data-index="0"]').classList.add('current');
        }
    }
    
    startTest() {
        this.currentTest.isActive = true;
        this.currentTest.startTime = Date.now();
        this.currentTest.currentIndex = 0;
        this.currentTest.correctChars = 0;
        this.currentTest.totalChars = 0;
        this.currentTest.errors = 0;
        this.currentTest.timeRemaining = this.currentTest.duration;
        
        // Enable typing input and focus
        const typingInput = document.getElementById('typingInput');
        typingInput.disabled = false;
        typingInput.value = '';
        typingInput.focus();
        
        // Update UI
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'inline-flex';
        document.getElementById('resultsSection').style.display = 'none';
        document.querySelector('.tool-card').classList.add('test-active');
        
        // Start timer
        this.startTimer();
        
        // Reset text display
        this.displayText();
        this.updateLiveStats();
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.currentTest.timeRemaining--;
            this.updateTimer();
            this.updateProgress();
            
            if (this.currentTest.timeRemaining <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.currentTest.timeRemaining / 60);
        const seconds = this.currentTest.timeRemaining % 60;
        document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateProgress() {
        const totalTime = this.currentTest.duration;
        const elapsed = totalTime - this.currentTest.timeRemaining;
        const progressPercentage = (elapsed / totalTime) * 100;
        
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${Math.round(progressPercentage)}% Complete`;
    }
    
    handleTyping(e) {
        if (!this.currentTest.isActive) return;
        
        const typedText = e.target.value;
        const expectedText = this.currentTest.text;
        
        this.currentTest.totalChars = typedText.length;
        this.currentTest.correctChars = 0;
        this.currentTest.errors = 0;
        
        // Update character highlighting
        const chars = document.querySelectorAll('.char');
        
        // Reset all character classes
        chars.forEach(char => {
            char.classList.remove('correct', 'incorrect', 'current');
        });
        
        // Check each typed character
        for (let i = 0; i < typedText.length; i++) {
            if (i < expectedText.length) {
                const char = chars[i];
                if (typedText[i] === expectedText[i]) {
                    char.classList.add('correct');
                    this.currentTest.correctChars++;
                } else {
                    char.classList.add('incorrect');
                    this.currentTest.errors++;
                }
            }
        }
        
        // Highlight current character
        if (typedText.length < expectedText.length) {
            chars[typedText.length].classList.add('current');
        }
        
        // Check if test is complete
        if (typedText.length >= expectedText.length) {
            this.endTest();
        }
        
        this.updateLiveStats();
    }
    
    handleKeyDown(e) {
        // Prevent certain keys during test
        if (this.currentTest.isActive) {
            // Allow normal typing keys, backspace, delete, arrow keys
            const allowedKeys = [
                'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Home', 'End', 'Tab', 'Enter', 'Shift', 'Control', 'Alt', 'Meta'
            ];
            
            if (e.ctrlKey || e.metaKey) {
                // Allow Ctrl+A, Ctrl+C, but prevent Ctrl+V
                if (e.key === 'v' || e.key === 'V') {
                    e.preventDefault();
                }
            }
        }
    }
    
    updateLiveStats() {
        const timeElapsed = this.currentTest.startTime ? 
            (Date.now() - this.currentTest.startTime) / 1000 / 60 : 0; // in minutes
        
        // Calculate WPM (Words Per Minute)
        const wpm = timeElapsed > 0 ? Math.round((this.currentTest.correctChars / 5) / timeElapsed) : 0;
        
        // Calculate accuracy
        const accuracy = this.currentTest.totalChars > 0 ? 
            Math.round((this.currentTest.correctChars / this.currentTest.totalChars) * 100) : 100;
        
        // Update live stats
        document.getElementById('liveWPM').textContent = wpm;
        document.getElementById('liveAccuracy').textContent = `${accuracy}%`;
        document.getElementById('liveChars').textContent = 
            `${this.currentTest.correctChars}/${this.currentTest.totalChars}`;
    }
    
    endTest() {
        this.currentTest.isActive = false;
        this.currentTest.endTime = Date.now();
        
        // Stop timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Disable typing input
        document.getElementById('typingInput').disabled = true;
        
        // Calculate final stats
        this.calculateFinalStats();
        
        // Show results
        this.showResults();
    }
    
    calculateFinalStats() {
        const timeElapsed = (this.currentTest.endTime - this.currentTest.startTime) / 1000 / 60; // in minutes
        
        // Final WPM calculation
        this.currentTest.finalWPM = Math.round((this.currentTest.correctChars / 5) / timeElapsed);
        
        // Final accuracy
        this.currentTest.finalAccuracy = this.currentTest.totalChars > 0 ? 
            Math.round((this.currentTest.correctChars / this.currentTest.totalChars) * 100) : 100;
        
        // Character count
        this.currentTest.finalChars = this.currentTest.totalChars;
        
        // Error count
        this.currentTest.finalErrors = this.currentTest.errors;
    }
    
    showResults() {
        // Update result values
        document.getElementById('finalWPM').textContent = this.currentTest.finalWPM;
        document.getElementById('finalAccuracy').textContent = `${this.currentTest.finalAccuracy}%`;
        document.getElementById('finalChars').textContent = this.currentTest.finalChars;
        document.getElementById('finalErrors').textContent = this.currentTest.finalErrors;
        
        // Generate performance feedback
        this.generatePerformanceFeedback();
        
        // Show results section
        document.getElementById('resultsSection').style.display = 'block';
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }
    
    generatePerformanceFeedback() {
        const wpm = this.currentTest.finalWPM;
        const accuracy = this.currentTest.finalAccuracy;
        
        let level = '';
        let feedback = '';
        let tips = '';
        
        // Determine skill level based on WPM
        if (wpm >= 80) {
            level = 'Expert';
            feedback = 'Outstanding! You have expert-level typing skills.';
            tips = 'Maintain your excellent speed while focusing on consistency across different text types.';
        } else if (wpm >= 60) {
            level = 'Professional';
            feedback = 'Excellent! Your typing speed is at professional level.';
            tips = 'Try challenging yourself with more complex texts and aim for 80+ WPM.';
        } else if (wpm >= 40) {
            level = 'Good';
            feedback = 'Great job! Your typing speed is above average.';
            tips = 'Focus on accuracy while gradually increasing speed. Practice regularly to reach 60+ WPM.';
        } else if (wpm >= 25) {
            level = 'Intermediate';
            feedback = 'Good progress! You\'re developing solid typing skills.';
            tips = 'Practice proper finger placement and aim for 40+ WPM with consistent daily practice.';
        } else {
            level = 'Beginner';
            feedback = 'Keep practicing! Everyone starts somewhere.';
            tips = 'Focus on proper finger placement and accuracy over speed. Practice 15-20 minutes daily.';
        }
        
        // Adjust feedback based on accuracy
        if (accuracy < 85) {
            tips += ' Remember: accuracy is more important than speed. Slow down and focus on typing correctly.';
        } else if (accuracy >= 98) {
            tips += ' Your accuracy is excellent! You can now focus more on increasing your speed.';
        }
        
        const feedbackHtml = `
            <h4>${level} Level - ${wpm} WPM</h4>
            <p><strong>${feedback}</strong></p>
            <p><em>Tip:</em> ${tips}</p>
        `;
        
        document.getElementById('performanceFeedback').innerHTML = feedbackHtml;
    }
    
    restartTest() {
        // Reset test state
        this.currentTest.isActive = false;
        this.currentTest.startTime = null;
        this.currentTest.endTime = null;
        this.currentTest.currentIndex = 0;
        this.currentTest.correctChars = 0;
        this.currentTest.totalChars = 0;
        this.currentTest.errors = 0;
        this.currentTest.timeRemaining = this.currentTest.duration;
        
        // Stop timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Reset UI
        document.getElementById('startBtn').style.display = 'inline-flex';
        document.getElementById('restartBtn').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        document.querySelector('.tool-card').classList.remove('test-active');
        
        // Reset typing input
        const typingInput = document.getElementById('typingInput');
        typingInput.disabled = true;
        typingInput.value = '';
        
        // Load new text
        this.loadRandomText();
        
        // Reset stats
        document.getElementById('liveWPM').textContent = '0';
        document.getElementById('liveAccuracy').textContent = '100%';
        document.getElementById('liveChars').textContent = '0/0';
        
        // Reset progress
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0% Complete';
        
        // Update timer
        this.updateTimer();
    }
}

// Initialize the typing speed test when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new TypingSpeedTest();
});

// Utility functions for additional features
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Prevent common cheating methods
document.addEventListener('keydown', function(e) {
    // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

// Prevent right-click context menu during test
document.addEventListener('contextmenu', function(e) {
    const typingInput = document.getElementById('typingInput');
    if (typingInput && !typingInput.disabled) {
        e.preventDefault();
        return false;
    }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', function() {
    const typingTest = window.typingTest;
    if (document.hidden && typingTest && typingTest.currentTest.isActive) {
        // Optionally pause the test when user switches tabs
        console.log('Tab switched during test');
    }
});

// Export for global access if needed
window.TypingSpeedTest = TypingSpeedTest;