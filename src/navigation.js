/**
 * Navigation Module - Smooth scrolling and section tracking
 */

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
    initSmoothScroll();
    initNavbarScroll();
    initActiveSection();
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Handle navbar appearance on scroll
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add scrolled class when not at top
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Track active section and update nav links
 */
function initActiveSection() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * Navigate to a section programmatically
 * @param {string} sectionId - The ID of the section to navigate to
 */
export function navigateToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);

    if (targetElement) {
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        return true;
    }

    return false;
}

// Export navigation functions
export { navigateToSection as goTo };
