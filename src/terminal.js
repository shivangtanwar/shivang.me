/**
 * Terminal Module - Interactive CLI Interface
 * Handles command parsing, execution, and easter eggs
 */

import { playTypingSound } from './loader.js';

// Command definitions
const commands = {
    help: {
        description: 'Show available commands',
        action: showHelp
    },
    clear: {
        description: 'Clear terminal',
        action: clearTerminal
    },
    whoami: {
        description: 'Show profile info',
        action: () => 'Shivang Tanwar - DevOps Engineer\n🐳 Container enthusiast | ☸️ K8s explorer | 🔧 Automation lover'
    },
    pwd: {
        description: 'Show current section',
        action: getCurrentSection
    },
    ls: {
        description: 'List sections',
        action: () => 'about/  skills/  projects/  experience/  education/  contact/'
    },

    // Navigation commands
    'cd ~': { description: 'Go to home', action: () => navigateTo('hero') },
    'cd /home': { description: 'Go to home', action: () => navigateTo('hero') },
    'cd /about': { description: 'Go to about', action: () => navigateTo('about') },
    'cd /skills': { description: 'Go to skills', action: () => navigateTo('skills') },
    'cd /projects': { description: 'Go to projects', action: () => navigateTo('projects') },
    'cd /experience': { description: 'Go to experience', action: () => navigateTo('experience') },
    'cd /education': { description: 'Go to education', action: () => navigateTo('education') },
    'cd /contact': { description: 'Go to contact', action: () => navigateTo('contact') },

    // Alternative navigation
    'cat about.md': { description: 'View about', action: () => navigateTo('about') },
    'ls skills/': { description: 'View skills', action: () => navigateTo('skills') },
    'docker ps': { description: 'View projects', action: showDockerPs },
    'kubectl get pods': { description: 'View skills as pods', action: showKubectlPods },
    'git log': { description: 'View experience', action: () => navigateTo('experience') },
    'ssh contact@shivang': { description: 'Open contact', action: () => navigateTo('contact') },

    // Resume commands
    'cat resume.txt': {
        description: 'View resume inline',
        action: viewResume
    },
    'cp resume.txt ~/Downloads/': {
        description: 'Download resume',
        action: downloadResume
    },

    // Easter eggs
    neofetch: { description: 'Show system info', action: showNeofetch },
    cmatrix: { description: 'Matrix rain', action: showMatrix },
    'cowsay': { description: 'Make a cow say something', action: (args) => cowsay(args) },
    'sudo hire shivang': { description: '🎉', action: hireMe },
    'sudo rm -rf /': { description: '😏', action: () => 'Nice try! 😏 System protected by DevOps magic.' },
    'hack nasa': { description: '🛸', action: () => 'Access denied! 🛸 But nice try, hacker!' },
    history: { description: 'Show command history', action: showHistory },
    'docker run welcome': {
        description: 'Replay welcome', action: () => {
            location.reload();
            return 'Restarting container...';
        }
    }
};

// Command history
let commandHistory = [];
let historyIndex = -1;

// Terminal elements
let terminalPanel, terminalInput, terminalHistory, terminalToggle, terminalClose;

/**
 * Initialize terminal
 */
export function initTerminal() {
    terminalPanel = document.getElementById('terminal-panel');
    terminalInput = document.getElementById('terminal-input');
    terminalHistory = document.getElementById('terminal-history');
    terminalToggle = document.getElementById('terminal-toggle');
    terminalClose = document.getElementById('terminal-close');

    if (!terminalPanel) return;

    // Toggle terminal
    terminalToggle?.addEventListener('click', () => {
        terminalPanel.classList.toggle('hidden');
        if (!terminalPanel.classList.contains('hidden')) {
            terminalInput?.focus();
        }
    });

    // Close terminal
    terminalClose?.addEventListener('click', () => {
        terminalPanel.classList.add('hidden');
    });

    // Handle input
    terminalInput?.addEventListener('keydown', handleTerminalInput);

    // Focus input when clicking terminal body
    document.getElementById('terminal-body')?.addEventListener('click', () => {
        terminalInput?.focus();
    });

    // Keyboard shortcut to toggle terminal (backtick key)
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' && !e.ctrlKey && !e.altKey) {
            const activeEl = document.activeElement;
            if (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA') {
                e.preventDefault();
                terminalPanel.classList.toggle('hidden');
                if (!terminalPanel.classList.contains('hidden')) {
                    terminalInput?.focus();
                }
            }
        }

        // Escape to close
        if (e.key === 'Escape') {
            terminalPanel?.classList.add('hidden');
        }
    });

    // Show welcome message
    addToHistory('', 'Welcome to Shivang\'s Portfolio Terminal! Type "help" for available commands.');
}

/**
 * Handle terminal input
 */
function handleTerminalInput(e) {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();

        if (command) {
            executeCommand(command);
            commandHistory.unshift(command);
            historyIndex = -1;
        }

        terminalInput.value = '';
    }

    // History navigation
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        }
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;
            terminalInput.value = '';
        }
    }

    // Tab completion
    if (e.key === 'Tab') {
        e.preventDefault();
        const partial = terminalInput.value.toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));

        if (matches.length === 1) {
            terminalInput.value = matches[0];
        } else if (matches.length > 1) {
            addToHistory(partial, 'Possible commands: ' + matches.join(', '));
        }
    }
}

/**
 * Execute a command
 */
function executeCommand(input) {
    const trimmedInput = input.trim().toLowerCase();

    // Find matching command
    let command = commands[trimmedInput];

    // Check for cowsay with arguments
    if (!command && trimmedInput.startsWith('cowsay ')) {
        const args = input.slice(7).trim();
        command = { action: () => cowsay(args) };
    }

    // Check for cd commands
    if (!command && trimmedInput.startsWith('cd ')) {
        const path = trimmedInput.slice(3).trim();
        const section = path.replace(/^\//, '').replace(/\/$/, '');

        if (['home', '~', ''].includes(section)) {
            command = { action: () => navigateTo('hero') };
        } else if (['about', 'skills', 'projects', 'experience', 'education', 'contact'].includes(section)) {
            command = { action: () => navigateTo(section) };
        }
    }

    if (command) {
        try {
            const result = command.action();
            addToHistory(input, result);
        } catch (error) {
            addToHistory(input, `Error: ${error.message}`, true);
        }
    } else {
        addToHistory(input, `Command not found: ${input}. Type "help" for available commands.`, true);
    }
}

/**
 * Add entry to terminal history
 */
function addToHistory(command, output, isError = false) {
    const entry = document.createElement('div');
    entry.className = 'history-line';

    let html = '';
    if (command) {
        html += `<span class="prompt">shivang@portfolio:~$</span><span class="command">${escapeHtml(command)}</span>`;
    }
    if (output) {
        html += `<div class="${isError ? 'error' : 'output'}">${escapeHtml(output)}</div>`;
    }

    entry.innerHTML = html;
    terminalHistory.appendChild(entry);

    // Scroll to bottom
    const terminalBody = document.getElementById('terminal-body');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============ Command Implementations ============

function showHelp() {
    const helpText = Object.entries(commands)
        .filter(([key]) => !key.includes('sudo') && key !== 'hack nasa')
        .map(([cmd, info]) => `  ${cmd.padEnd(25)} ${info.description}`)
        .join('\n');

    return `Available commands:\n\n${helpText}\n\nTip: Use Tab for autocompletion, Arrow Up/Down for history`;
}

function clearTerminal() {
    terminalHistory.innerHTML = '';
    return '';
}

function getCurrentSection() {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
    const scrollPos = window.scrollY + window.innerHeight / 2;

    for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPos) {
            return `/${section === 'hero' ? 'home' : section}`;
        }
    }
    return '/home';
}

function navigateTo(section) {
    const el = document.getElementById(section);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return `Navigating to /${section}...`;
    }
    return `Section not found: ${section}`;
}

function showDockerPs() {
    navigateTo('projects');
    return `CONTAINER ID   IMAGE                        STATUS          PORTS
a1b2c3d4e5f6   shivang/devops-dashboard     Up 45 days      0.0.0.0:3000->3000/tcp
f6e5d4c3b2a1   shivang/cicd-generator       Up 30 days      0.0.0.0:8080->8080/tcp
1a2b3c4d5e6f   shivang/k8s-manager          Up 15 days      0.0.0.0:9000->9000/tcp`;
}

function showKubectlPods() {
    navigateTo('skills');
    return `NAME          LEVEL   STATUS    EXPERIENCE
docker        5/5     Running   3 years
kubernetes    4/5     Running   1 year
linux         5/5     Running   4 years
terraform     2/5     Scaling   Learning
cicd          3/5     Running   1 year`;
}

function viewResume() {
    return `
╔═══════════════════════════════════════════════════════════╗
║                    SHIVANG TANWAR                         ║
║                DevOps Engineer | B.Tech CSE               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  SKILLS                                                   ║
║  ───────                                                  ║
║  • Docker, Kubernetes, Linux, Bash                        ║
║  • CI/CD, Git, Nginx, Monitoring                         ║
║  • Cloud (AWS/GCP), Terraform (learning)                 ║
║                                                           ║
║  Use "cp resume.txt ~/Downloads/" to download full PDF   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝`;
}

function downloadResume() {
    const link = document.createElement('a');
    link.href = '/assets/documents/SHIVANG_CV.pdf';
    link.download = 'Shivang_Tanwar_Resume.pdf';
    link.click();
    return 'Downloading resume... ✓\nFile saved to ~/Downloads/Shivang_Tanwar_Resume.pdf';
}

function showNeofetch() {
    return `
       .---.        shivang@portfolio
      /     \\       ─────────────────
      \\.@-@./       OS: Linux (DevOps Mode)
      /\`\\_/\`\\       Host: shivangtanwar.me
     //  _  \\\\      Kernel: Node.js v20
    | \\     )|_     Uptime: Since 2022
   /\`\\_\`>  <_/ \\    Shell: bash/zsh
   \\__/'\`---'\\__/   Theme: Dark Terminal
                    Editor: Vim + VS Code
                    Status: Available for hire 🟢
                    
                    🐳 Docker | ☸️ K8s | 🔧 Git`;
}

function showMatrix() {
    // Create matrix effect
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-rain';
    matrixContainer.id = 'matrix-rain';
    document.body.appendChild(matrixContainer);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

    for (let i = 0; i < 50; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = `${Math.random() * 100}%`;
        column.style.animationDuration = `${3 + Math.random() * 5}s`;
        column.style.animationDelay = `${Math.random() * 2}s`;

        let text = '';
        for (let j = 0; j < 30; j++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '\n';
        }
        column.textContent = text;

        matrixContainer.appendChild(column);
    }

    // Remove after 5 seconds
    setTimeout(() => {
        matrixContainer.remove();
    }, 5000);

    return 'Entering the Matrix... (press any key to exit)';
}

function cowsay(message) {
    const msg = message || 'Moo! Hire Shivang!';
    const border = '_'.repeat(msg.length + 2);

    return `
 ${border}
< ${msg} >
 ${'-'.repeat(msg.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
}

function hireMe() {
    // Create confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = ['#00d4ff', '#00ff88', '#ff9500', '#a855f7', '#ff5555'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }

    return `
🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉

You've made an excellent decision!

📧 Email: shivang@example.com
💼 LinkedIn: linkedin.com/in/shivang
🐙 GitHub: github.com/shivang

Let's build something amazing together! 🚀`;
}

function showHistory() {
    if (commandHistory.length === 0) {
        return 'No commands in history';
    }
    return commandHistory.slice(0, 10).map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
}

// Export terminal functions
export { executeCommand, addToHistory };
