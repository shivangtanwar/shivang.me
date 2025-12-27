/**
 * Shivang's DevOps Portfolio - Main Entry Point
 * Initializes all modules and handles app lifecycle
 */

import { initLoader } from './loader.js';
import { initTerminal } from './terminal.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initThreeScene } from './three-scene.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Shivang\'s Portfolio...');

    // Initialize loading screen
    initLoader(() => {
        // After loading completes, initialize the rest
        initMainApp();
    });
});

/**
 * Initialize main application components
 */
function initMainApp() {
    console.log('✨ Loading complete, initializing main app...');

    // Show main content
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('hidden');
    setTimeout(() => mainContent.classList.add('visible'), 50);

    // Initialize navigation
    initNavigation();

    // Initialize terminal
    initTerminal();

    // Initialize animations
    initAnimations();

    // Initialize 3D background (hero section)
    initThreeScene();

    // Initialize interactive elements
    initInteractiveElements();

    // Initialize contact form
    initContactForm();

    console.log('🎉 Portfolio ready!');
}

/**
 * Initialize interactive UI elements
 */
function initInteractiveElements() {
    // Hero typing animation
    initHeroTyping();

    // Skills view toggle
    initSkillsToggle();
    initPipelineFilter();

    // Experience view toggle
    initExperienceToggle();

    // Project slider
    initProjectSlider();

    // Mobile menu
    initMobileMenu();

    // Theme toggle
    initThemeToggle();
}

/**
 * Hero section typing animation - types full terminal output
 */
let heroTypingComplete = false;

function initHeroTyping() {
    // Prevent re-running
    if (heroTypingComplete) return;
    heroTypingComplete = true;

    const commandEl = document.getElementById('hero-command');
    const cursorEl = document.getElementById('hero-cursor');
    const outputEl = document.getElementById('hero-output');
    const nameEl = document.getElementById('hero-name');
    const titleEl = document.getElementById('hero-title');
    const taglineEl = document.getElementById('hero-tagline');

    if (!commandEl) return;

    // Text content to type
    const command = 'whoami';
    const name = 'SHIVANG TANWAR';
    const title = 'Cloud DevOps Engineer (AWS, GCP) | CI/CD, Kubernetes, Automation';
    const tagline = 'Automating cloud deployments & building reliable DevOps pipelines 🚀';

    // Typing speeds (ms per character)
    const commandSpeed = 150;  // Slow - human typing the command
    const outputSpeed = 15;    // Fast - computer response
    const lineDelay = 150;

    // Clear content
    commandEl.textContent = '';
    nameEl.textContent = '';
    titleEl.textContent = '';
    taglineEl.textContent = '';
    outputEl.style.opacity = '0';

    // Type a string character by character
    function typeText(element, text, speed, callback) {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text[i];
                // Update glitch data attribute for name
                if (element.id === 'hero-name') {
                    element.setAttribute('data-text', element.textContent);
                }
                i++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, speed);
    }

    // Sequence: command -> show output -> name -> title -> tagline
    typeText(commandEl, command, commandSpeed, () => {
        setTimeout(() => {
            // Show output container
            outputEl.style.opacity = '1';
            outputEl.style.transition = 'opacity 0.3s ease';

            // Start typing name (fast output)
            setTimeout(() => {
                typeText(nameEl, name, outputSpeed, () => {
                    // Type title
                    setTimeout(() => {
                        typeText(titleEl, title, outputSpeed, () => {
                            // Type tagline
                            setTimeout(() => {
                                typeText(taglineEl, tagline, outputSpeed, () => {
                                    // Animation complete - keep cursor blinking
                                    cursorEl.classList.add('blink');
                                });
                            }, lineDelay);
                        });
                    }, lineDelay);
                });
            }, 100);
        }, 400);
    });
}

/**
 * Pipeline stage filter - filters skills by DevOps stage
 */
function initPipelineFilter() {
    const pipelineStages = document.querySelectorAll('.pipeline-stage');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!pipelineStages.length || !skillCards.length) return;

    let activeStage = null;

    pipelineStages.forEach(stage => {
        stage.addEventListener('click', () => {
            const stageName = stage.dataset.stage;

            // Toggle: if clicking the same stage, show all
            if (activeStage === stageName) {
                activeStage = null;
                pipelineStages.forEach(s => s.classList.remove('active'));
                showAllSkills(skillCards);
            } else {
                activeStage = stageName;
                pipelineStages.forEach(s => s.classList.remove('active'));
                stage.classList.add('active');
                filterSkillsByStage(skillCards, stageName);
            }
        });
    });
}

function filterSkillsByStage(skillCards, stage) {
    skillCards.forEach(card => {
        const cardStages = card.dataset.stage || '';
        if (cardStages.includes(stage)) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (card.style.opacity === '0') {
                    card.style.display = 'none';
                }
            }, 200);
        }
    });
}

function showAllSkills(skillCards) {
    skillCards.forEach(card => {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
}

/**
 * Skills section toggle between cards and terminal
 */
function initSkillsToggle() {
    const toggleBtns = document.querySelectorAll('.skills-terminal-toggle .toggle-btn');
    const skillsGrid = document.querySelector('.skills-grid');
    const skillsTerminal = document.getElementById('skills-terminal');

    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle views
            if (view === 'cards') {
                skillsGrid.classList.remove('hidden');
                skillsTerminal.classList.add('hidden');
            } else {
                skillsGrid.classList.add('hidden');
                skillsTerminal.classList.remove('hidden');
            }
        });
    });
}

/**
 * Experience section toggle between timeline and git log
 */
function initExperienceToggle() {
    const toggleBtns = document.querySelectorAll('.view-toggle .toggle-btn');
    const timelineView = document.getElementById('timeline-view');
    const gitView = document.getElementById('git-view');

    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle views
            if (view === 'timeline') {
                timelineView.classList.remove('hidden');
                gitView.classList.add('hidden');
            } else {
                timelineView.classList.add('hidden');
                gitView.classList.remove('hidden');
            }
        });
    });
}

/**
 * Project slider - switches featured project display
 */
function initProjectSlider() {
    const projectCards = document.querySelectorAll('.project-showcase .project-card');
    const sliderItems = document.querySelectorAll('.slider-item');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('project-prev');
    const nextBtn = document.getElementById('project-next');

    if (!projectCards.length || !sliderItems.length) return;

    let currentIndex = 0;
    const totalProjects = projectCards.length;

    function showProject(index) {
        // Clamp index
        if (index < 0) index = totalProjects - 1;
        if (index >= totalProjects) index = 0;

        currentIndex = index;

        // Update project cards - just toggle class, CSS handles display
        projectCards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
                card.removeAttribute('style'); // Clear any inline styles
            } else {
                card.classList.remove('active');
            }
        });

        // Update slider items
        sliderItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Update dots
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Click on slider items
    sliderItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            showProject(index);
        });
    });

    // Click on dots
    sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showProject(index);
        });
    });

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showProject(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showProject(currentIndex + 1);
        });
    }

    // Keyboard navigation when focused
    document.addEventListener('keydown', (e) => {
        const projectSection = document.getElementById('projects');
        const rect = projectSection?.getBoundingClientRect();
        if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') showProject(currentIndex - 1);
            if (e.key === 'ArrowRight') showProject(currentIndex + 1);
        }
    });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

/**
 * Initialize theme toggle - Dark mode only with flashbang easter egg
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');

    if (!themeToggle) return;

    // Always stay in dark mode
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
    themeIcon.textContent = '☾';

    // DevOps-themed rejection messages
    const darkModeMessages = [
        { title: "⚠️ ACCESS DENIED", message: "Real DevOps engineers deploy in the dark.\nIt's not a bug, it's stealth mode." },
        { title: "🔒 403 FORBIDDEN", message: "Light mode is deprecated.\nDark mode is production-ready since 1970." },
        { title: "💀 FATAL ERROR", message: "Cannot switch to light mode:\nServers run 24/7. We live in the shadows." },
        { title: "🌙 PERMISSION DENIED", message: "sudo: light mode not in sudoers file.\nThis incident will be reported." },
        { title: "👁️ NICE TRY", message: "We debug at 3 AM.\nOur eyes have evolved beyond light." },
        { title: "🦇 DENIED", message: "I'm not afraid of the dark.\nThe dark is afraid of my deployment scripts." }
    ];

    themeToggle.addEventListener('click', (e) => {
        // Prevent multiple flashbangs
        if (document.querySelector('.flashbang-overlay')) return;

        // Create flashbang overlay
        const flashbang = document.createElement('div');
        flashbang.className = 'flashbang-overlay';

        // Pick random message
        const msg = darkModeMessages[Math.floor(Math.random() * darkModeMessages.length)];

        flashbang.innerHTML = `
            <div class="flashbang-content">
                <div class="flashbang-title">${msg.title}</div>
                <div class="flashbang-message">${msg.message}</div>
                <div class="flashbang-hint">Press any key or click to dismiss</div>
            </div>
        `;

        document.body.appendChild(flashbang);

        // Animate flash
        requestAnimationFrame(() => {
            flashbang.classList.add('flash');

            setTimeout(() => {
                flashbang.classList.add('show-message');
            }, 300);
        });

        // Remove on click or keypress
        const removeFlash = (event) => {
            // Stop event from bubbling to prevent triggering another flashbang
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            flashbang.classList.add('fade-out');
            setTimeout(() => flashbang.remove(), 300);
            document.removeEventListener('keydown', removeFlash);
            flashbang.removeEventListener('click', removeFlash);
        };

        flashbang.addEventListener('click', removeFlash);
        document.addEventListener('keydown', removeFlash);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(flashbang)) {
                removeFlash();
            }
        }, 10000);
    });
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Deploying...</span>';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success
        submitBtn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Deployed!</span>';
        formStatus.classList.remove('hidden');

        // Reset after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            formStatus.classList.add('hidden');
            form.reset();
        }, 3000);
    });
}

// Export for potential external use
export { initMainApp };
