/**
 * Three.js Scene - 3D Background Visualizations
 * Creates floating containers and particles in the hero section
 */

import * as THREE from 'three';

let scene, camera, renderer;
let containers = [];
let animationId;
let isAnimating = false;
let sceneInitialized = false;

/**
 * Initialize Three.js scene
 */
export function initThreeScene() {
    // Prevent re-initialization
    if (sceneInitialized) return;

    const heroBackground = document.getElementById('hero-bg');

    if (!heroBackground) {
        console.warn('Hero background element not found');
        return;
    }

    // Check if WebGL is available
    if (!isWebGLAvailable()) {
        console.warn('WebGL not available, using CSS fallback');
        initCSSFallback(heroBackground);
        return;
    }

    try {
        sceneInitialized = true;
        setupScene(heroBackground);
        createFloatingContainers();
        createParticles();
        startAnimation();

        // Handle resize
        window.addEventListener('resize', onWindowResize);

        // Cleanup on page hide
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
    } catch (error) {
        console.error('Error initializing Three.js:', error);
        sceneInitialized = false;
        initCSSFallback(heroBackground);
    }
}

/**
 * Check if WebGL is available
 */
function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

/**
 * CSS fallback for non-WebGL browsers
 */
function initCSSFallback(container) {
    container.style.background = `
    radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)
  `;

    // Add floating dots with CSS
    for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot';
        dot.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: rgba(0, 212, 255, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 5 + 5}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
        container.appendChild(dot);
    }
}

/**
 * Setup Three.js scene
 */
function setupScene(container) {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 30;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);
}

/**
 * Create floating container objects
 */
function createFloatingContainers() {
    const containerGeometry = new THREE.BoxGeometry(2, 2, 2);

    // Docker blue material
    const dockerMaterial = new THREE.MeshBasicMaterial({
        color: 0x2496ed,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    // Kubernetes purple material
    const k8sMaterial = new THREE.MeshBasicMaterial({
        color: 0x326ce5,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    // Cyan accent material
    const cyanMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    const materials = [dockerMaterial, k8sMaterial, cyanMaterial];

    // Create multiple containers
    for (let i = 0; i < 15; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];
        const container = new THREE.Mesh(containerGeometry, material.clone());

        // Random position
        container.position.x = (Math.random() - 0.5) * 50;
        container.position.y = (Math.random() - 0.5) * 30;
        container.position.z = (Math.random() - 0.5) * 20 - 10;

        // Random rotation
        container.rotation.x = Math.random() * Math.PI;
        container.rotation.y = Math.random() * Math.PI;

        // Random scale
        const scale = Math.random() * 0.5 + 0.5;
        container.scale.set(scale, scale, scale);

        // Store animation parameters
        container.userData = {
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatAmplitude: Math.random() * 2 + 1,
            initialY: container.position.y
        };

        scene.add(container);
        containers.push(container);
    }
}

/**
 * Create particle system
 */
function createParticles() {
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 60;
        positions[i + 2] = (Math.random() - 0.5) * 50;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

/**
 * Start animation loop
 */
function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    animate();
}

/**
 * Stop animation loop
 */
function stopAnimation() {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

/**
 * Animation loop
 */
function animate() {
    if (!isAnimating) return;

    animationId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Animate containers
    containers.forEach(container => {
        const { rotationSpeed, floatSpeed, floatAmplitude, initialY } = container.userData;

        // Rotate
        container.rotation.x += rotationSpeed;
        container.rotation.y += rotationSpeed * 0.5;

        // Float up and down
        container.position.y = initialY + Math.sin(time * floatSpeed) * floatAmplitude;
    });

    // Slowly rotate camera based on mouse position (if stored)
    if (window.mouseX !== undefined && camera) {
        camera.position.x += (window.mouseX * 10 - camera.position.x) * 0.02;
        camera.position.y += (-window.mouseY * 10 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

/**
 * Handle window resize
 */
function onWindowResize() {
    const container = document.getElementById('hero-bg');
    if (!container || !camera || !renderer) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Track mouse position for parallax effect
document.addEventListener('mousemove', (event) => {
    window.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    window.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

/**
 * Cleanup
 */
export function destroyThreeScene() {
    cancelAnimationFrame(animationId);

    if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
    }

    containers.forEach(container => {
        container.geometry.dispose();
        container.material.dispose();
    });

    containers = [];
}
