/**
 * Loader Module - K8s Cluster Initialization Animation
 * Creates the loading screen with kubectl typing animation
 */

// Pod data for the kubectl output
const pods = [
    { name: 'hero-svc', ready: '1/1', status: 'Running', restarts: '0' },
    { name: 'about-svc', ready: '1/1', status: 'Running', restarts: '0' },
    { name: 'skills-svc', ready: '1/1', status: 'Running', restarts: '0' },
    { name: 'projects-svc', ready: '1/1', status: 'Running', restarts: '0' },
    { name: 'experience-svc', ready: '1/1', status: 'Running', restarts: '0' },
    { name: 'contact-svc', ready: '1/1', status: 'Running', restarts: '0' }
];

// Typing sound
let typingSound = null;
let soundEnabled = true;

/**
 * Initialize the loading screen
 * @param {Function} onComplete - Callback when loading is complete
 */
export function initLoader(onComplete) {
    const loader = document.getElementById('loader');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const kubectlCommand = document.getElementById('kubectl-command');
    const kubectlOutput = document.getElementById('kubectl-output');
    const skipBtn = document.getElementById('skip-loader');

    // Check if loader elements exist
    if (!loader) {
        onComplete?.();
        return;
    }

    // Initialize typing sound
    initTypingSound();

    // Skip button handler
    skipBtn?.addEventListener('click', () => {
        completeLoading(loader, onComplete);
    });

    // Start the loading sequence
    startLoadingSequence(progressFill, progressText, kubectlCommand, kubectlOutput, loader, onComplete);
}

/**
 * Initialize typing sound
 */
function initTypingSound() {
    typingSound = document.getElementById('typing-sound');

    // Create a simple click sound if audio element doesn't exist
    if (!typingSound) {
        // Use Web Audio API for click sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            typingSound = {
                play: () => {
                    if (!soundEnabled) return;

                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 800 + Math.random() * 200;
                    oscillator.type = 'square';

                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);

                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.05);
                }
            };
        } catch (e) {
            // Audio not supported
            typingSound = { play: () => { } };
        }
    }
}

/**
 * Play typing sound
 */
function playTypingSound() {
    if (typingSound && soundEnabled) {
        try {
            if (typingSound.currentTime !== undefined) {
                typingSound.currentTime = 0;
            }
            typingSound.play();
        } catch (e) {
            // Ignore audio errors
        }
    }
}

/**
 * Start the loading sequence
 */
async function startLoadingSequence(progressFill, progressText, kubectlCommand, kubectlOutput, loader, onComplete) {
    // Type the kubectl command
    const command = '$ kubectl get pods -n portfolio';
    await typeText(kubectlCommand, command, 50);

    // Small delay before output
    await delay(300);

    // Add header
    const header = createKubectlHeader();
    kubectlOutput.appendChild(header);
    await delay(200);

    // Add each pod with animation
    for (let i = 0; i < pods.length; i++) {
        const pod = pods[i];
        const podLine = createPodLine(pod, i);
        kubectlOutput.appendChild(podLine);

        // Update progress
        const progress = Math.round(((i + 1) / pods.length) * 100);
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        await delay(400);
    }

    // Complete loading after short delay
    await delay(800);
    completeLoading(loader, onComplete);
}

/**
 * Type text with animation
 */
async function typeText(element, text, speed = 50) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        playTypingSound();
        await delay(speed + Math.random() * 30);
    }
}

/**
 * Create kubectl output header
 */
function createKubectlHeader() {
    const header = document.createElement('div');
    header.className = 'kubectl-line header';
    header.innerHTML = `
    <span class="pod-name">NAME</span>
    <span class="pod-ready">READY</span>
    <span class="pod-status">STATUS</span>
    <span class="pod-restarts">RESTARTS</span>
  `;
    return header;
}

/**
 * Create pod line element
 */
function createPodLine(pod, index) {
    const line = document.createElement('div');
    line.className = 'kubectl-line';
    line.style.animationDelay = `${index * 0.1}s`;

    const statusClass = pod.status.toLowerCase().replace(/\s+/g, '-');

    line.innerHTML = `
    <span class="pod-name">${pod.name}</span>
    <span class="pod-ready">${pod.ready}</span>
    <span class="pod-status ${statusClass}">${pod.status}</span>
    <span class="pod-restarts">${pod.restarts}</span>
  `;

    return line;
}

/**
 * Complete loading and transition to main content
 */
function completeLoading(loader, onComplete) {
    loader.classList.add('fade-out');

    setTimeout(() => {
        loader.style.display = 'none';
        onComplete?.();
    }, 500);
}

/**
 * Delay helper
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for external use
export { playTypingSound };
