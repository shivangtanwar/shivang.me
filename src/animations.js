/**
 * Animations Module - GSAP scroll-triggered animations
 */

import gsap from 'gsap';

/**
 * Initialize all animations
 */
export function initAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not available, using CSS animations only');
        initCSSAnimations();
        return;
    }

    // Initialize scroll-triggered animations
    initScrollAnimations();

    // Initialize hover effects
    initHoverEffects();
}

/**
 * CSS-only animations fallback
 */
function initCSSAnimations() {
    // Use Intersection Observer for reveal animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.section-header, .skill-card, .project-card, .timeline-item, .education-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // Add reveal styles
    const style = document.createElement('style');
    style.textContent = `
    .reveal-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .reveal-on-scroll.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
    document.head.appendChild(style);
}

/**
 * GSAP scroll animations
 */
function initScrollAnimations() {
    // Register ScrollTrigger if available
    // Note: ScrollTrigger is a separate GSAP plugin

    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // Skill card animation disabled - pipeline filter handles visibility
    // Cards load instantly, filter controls which are shown

    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%'
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    });

    // Animate education cards
    gsap.from('.education-card', {
        scrollTrigger: {
            trigger: '.education-grid',
            start: 'top 70%'
        },
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Parallax effect on hero background
    gsap.to('.hero-background', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        ease: 'none'
    });
}

/**
 * Initialize hover effects
 */
function initHoverEffects() {
    // Magnetic effect on buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Tilt effect on cards (subtle)
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Reduced tilt effect - divide by 30 instead of 10, clamp to max 4 degrees
            let rotateX = (y - centerY) / 30;
            let rotateY = (centerX - x) / 30;

            // Clamp rotation to max ±4 degrees
            rotateX = Math.max(-4, Math.min(4, rotateX));
            rotateY = Math.max(-4, Math.min(4, rotateY));

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Simple animation utilities without GSAP dependency
export const animate = {
    fadeIn: (element, duration = 500) => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    },

    slideUp: (element, duration = 500) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
};
