// Helper for async delays
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Password Protection
async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const errorMsg = document.getElementById('passwordError');
    const signinContainer = document.querySelector('.signin-container');
    if (password === '0805') {
        const signinSection = document.getElementById('signin');
        const mainContent = document.getElementById('mainContent');

        // Attempt to play music immediately after the click to satisfy browser autoplay policies
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.volume = 0.3; // Set initial volume
        bgMusic.play().catch(error => {
            // This fallback prevents a console error if autoplay is blocked.
            // The user can still use the manual toggle button.
            console.log("Autoplay was prevented by the browser:", error);
        });

        signinSection.style.opacity = '0';
        await wait(500); // Wait for fade out transition

        signinSection.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        await wait(100); // Wait a moment before fading in

        mainContent.classList.add('visible');
        startBirthdayCelebration();
    } else {
        // Show error message and shake the form
        errorMsg.classList.remove('hidden');
        signinContainer.classList.add('shake-form');
        
        // Clear the input
        passwordInput.value = '';

        // Remove the shake animation class after it finishes
        signinContainer.addEventListener('animationend', () => {
            signinContainer.classList.remove('shake-form');
        }, { once: true }); // The listener removes itself after running once
    }
}

// Birthday Celebration Start
function startBirthdayCelebration() {
    // Start confetti
    startConfetti();
    
    // Animate elements
    animateElements();
}

// Typing Effect
async function startTyping() {
    const element = document.getElementById('typing-text');
    const text = "My girl, I know I’m far from perfect, but every day you make me want to be better. You’re graceful and brilliant in a way I’ve never seen before—an angel and a diva all at once. While the whole world may admire you, my heart already knows the truth: I’m the luckiest person alive because I have you.. This is a small gift from my side. I love you so much ❤️, i wish you the happiest 23rd birthday. May all your dreams come true. Muahhh 😘";
    const typingSpeed = 50; // Adjust typing speed here (in ms)

    element.innerHTML = ''; // Clear existing text


    for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
        await wait(typingSpeed);
    }
    

    // Stop blinking cursor after typing is done
    element.style.borderRight = 'none';
}

// Countdown Timer
function startCountdown() {
    // --- CONFIGURATION: Set the target birthday date here ---
    // new Date(year, monthIndex, day)
    // Note: Month is 0-indexed (0 = Jan, 9 = Oct, 11 = Dec)
    const targetDate = new Date(2025, 9, 8); // October 8, 2025
    // ----------------------------------------------------

    const formatTime = (time) => time < 10 ? `0${time}` : time;

    const countdown = () => {
        const now = new Date();
        const totalSeconds = (targetDate - now) / 1000;

        if (totalSeconds < 0) {
            // Stop the interval if the date has passed
            clearInterval(countdownInterval);
            const timeElements = ['days', 'hours', 'minutes', 'seconds'];
            timeElements.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerText = '00';
                }
            });
            return;
        }

        const days = Math.floor(totalSeconds / 3600 / 24);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds) % 60;

        const timeValues = { days, hours, minutes, seconds };
        Object.keys(timeValues).forEach(key => {
            const el = document.getElementById(key);
            if (el) {
                el.innerText = formatTime(timeValues[key]);
            }
        });
    };

    const countdownInterval = setInterval(countdown, 1000);
    countdown(); // Initial call to avoid 1-second delay
}

// Confetti Animation
function startConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 }
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }
    frame();
}

// Animate Elements on Scroll
function animateElements() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    let typingStarted = false; // Flag to ensure typing starts only once
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Special trigger for typing animation
                if (entry.target.classList.contains('typing-container') && !typingStarted) {
                    startTyping();
                    typingStarted = true;
                }

                // Stop observing the element after it has animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Fireworks Animation
function createFireworks() {
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(function() {
        if (Date.now() > end) {
            return clearInterval(interval);
        }

        confetti({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            particleCount: 150,
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2
            }
        });
    }, 500); // Launch a burst every 500ms
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Start the countdown timer on the landing page
    startCountdown();

    // Music Toggle
    document.getElementById('musicToggle').addEventListener('click', function() {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic.paused) {
            bgMusic.play();
            this.textContent = '🎵';
        } else {
            bgMusic.pause();
            this.textContent = '🔇';
        }
    });

    // Love Notes Animation
    document.querySelectorAll('.love-note').forEach(note => {
        note.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 500);
        });
    });

    // Surprise Button
    document.getElementById('surpriseBtn').addEventListener('click', async function() {
        // Trigger fireworks
        createFireworks();
        
        // Show final message
        const finalMessage = document.getElementById('finalMessage');
        finalMessage.classList.remove('hidden');

        await wait(100); // Wait for display property to apply before transition
        finalMessage.classList.add('visible');
        
        // Hide the button
        this.style.display = 'none';
    });

    // Enter key functionality for password
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    // Button click functionality for password
    document.getElementById('enterBtn').addEventListener('click', checkPassword);

    // Hide error message on input focus
    document.getElementById('passwordInput').addEventListener('focus', () => {
        document.getElementById('passwordError').classList.add('hidden');
    });
});
