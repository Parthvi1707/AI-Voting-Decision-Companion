// --- State Management ---
const userProfile = {
    firstTime: null,
    hasID: null,
    knowsBooth: null,
    helpNeeded: null
};

const questions = [
    {
        id: 'firstTime',
        text: 'Are you a first-time voter?',
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
        ]
    },
    {
        id: 'hasID',
        text: 'Do you have a valid ID?',
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
            { label: 'Not sure', value: 'notsure' }
        ]
    },
    {
        id: 'knowsBooth',
        text: 'Do you know your polling booth?',
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
        ]
    },
    {
        id: 'helpNeeded',
        text: 'What do you need help with?',
        options: [
            { label: 'Registration', value: 'registration' },
            { label: 'Voting Day Process', value: 'voting_day' },
            { label: 'Full Process', value: 'full' }
        ]
    }
];

let currentQuestionIndex = 0;

// --- DOM Elements ---
const screens = {
    landing: document.getElementById('landing-screen'),
    profiling: document.getElementById('profiling-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    ai: document.getElementById('ai-screen'),
    simulator: document.getElementById('simulator-screen')
};

const btnStart = document.getElementById('btn-start');
const btnSimulator = document.getElementById('btn-simulator');
const btnAiCompanion = document.getElementById('btn-ai-companion');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const progressBar = document.getElementById('progress-bar');

// Dashboard Elements
const scoreText = document.getElementById('score-text');
const scoreCircle = document.getElementById('score-circle');
const checklistEl = document.getElementById('checklist');
const missingItemsEl = document.getElementById('missing-items');
const actionToday = document.getElementById('action-today');
const actionBefore = document.getElementById('action-before');
const actionDay = document.getElementById('action-day');


// --- Navigation & Core Logic ---
function navigateTo(screenId) {
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
            screen.style.display = 'none';
        }
    });

    const targetScreen = screens[screenId];
    if (targetScreen) {
        targetScreen.style.display = 'flex';
        setTimeout(() => targetScreen.classList.add('active'), 10);
    }
}

// Start Journey
if (btnStart) {
    btnStart.addEventListener('click', () => {
        currentQuestionIndex = 0;
        renderQuestion();
        navigateTo('profiling');
    });
}

if (btnSimulator) {
    btnSimulator.addEventListener('click', () => navigateTo('simulator'));
}

if (btnAiCompanion) {
    btnAiCompanion.addEventListener('click', () => navigateTo('ai'));
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.text;
    optionsGrid.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => handleOptionSelect(q.id, opt.value));
        optionsGrid.appendChild(btn);
    });

    // Update Progress
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function handleOptionSelect(questionId, value) {
    userProfile[questionId] = value;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        // Animate out/in
        optionsGrid.style.opacity = '0';
        questionText.style.opacity = '0';
        setTimeout(() => {
            renderQuestion();
            optionsGrid.style.opacity = '1';
            questionText.style.opacity = '1';
            optionsGrid.style.transition = 'opacity 0.3s ease';
            questionText.style.transition = 'opacity 0.3s ease';
        }, 300);
    } else {
        progressBar.style.width = '100%';
        setTimeout(() => generateDashboard(), 500);
    }
}

// --- Dashboard Logic ---
function generateDashboard() {
    let score = 20; // Base score
    const missing = [];
    const checklist = [];

    // Evaluate First Time
    if (userProfile.firstTime === 'yes') {
        checklist.push('Needs Registration Check');
    } else {
        score += 20;
        checklist.push('Registered Voter');
    }

    // Evaluate ID
    if (userProfile.hasID === 'yes') {
        score += 30;
        checklist.push('Has Valid ID');
    } else if (userProfile.hasID === 'notsure') {
        score += 10;
        missing.push('Verify Accepted ID Types');
    } else {
        missing.push('Obtain Valid Voter ID');
    }

    // Evaluate Booth
    if (userProfile.knowsBooth === 'yes') {
        score += 30;
        checklist.push('Knows Polling Location');
    } else {
        missing.push('Find Polling Booth Location');
    }

    // Populate UI
    scoreText.textContent = `${score}%`;
    scoreCircle.style.background = `conic-gradient(var(--accent-neon-cyan) ${score}%, transparent 0%)`;

    // Populate Checklist
    checklistEl.innerHTML = '';
    checklist.forEach(item => {
        checklistEl.innerHTML += `<li><span style="color:#00f3ff">✔</span> ${item}</li>`;
    });
    if(checklist.length === 0) checklistEl.innerHTML = `<li>No completed steps yet</li>`;

    // Populate Missing
    missingItemsEl.innerHTML = '';
    missing.forEach(item => {
        missingItemsEl.innerHTML += `<li>${item}</li>`;
    });
    if(missing.length === 0) missingItemsEl.innerHTML = `<li style="border-left-color: #00f3ff; background: rgba(0, 243, 255, 0.1);">All requirements met!</li>`;

    // Populate Timeline based on missing/needs
    if (userProfile.firstTime === 'yes' || userProfile.helpNeeded === 'registration' || userProfile.helpNeeded === 'full') {
        actionToday.textContent = "Check voter registration deadlines and register online.";
    } else {
        actionToday.textContent = "Review candidates and ballot measures.";
    }

    if (userProfile.hasID === 'no' || userProfile.hasID === 'notsure') {
        actionBefore.textContent = "Acquire an accepted form of ID for your state.";
    } else if (userProfile.knowsBooth === 'no') {
        actionBefore.textContent = "Use the booth finder tool to locate your polling station.";
    } else {
        actionBefore.textContent = "Plan your transportation to the polling booth.";
    }

    actionDay.textContent = "Bring your ID, go to your designated booth, and cast your vote!";

    navigateTo('dashboard');
}

// --- Phase 3: AI Companion & Simulator ---

// AI Companion Logic
const aiChatBox = document.getElementById('ai-chat-box');

function askAI(promptText) {
    // 1. Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.textContent = promptText;
    aiChatBox.appendChild(userMsg);

    // 2. Generate AI response (Simulated delay)
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message';
        
        let responseHTML = '';
        if (promptText.includes('next')) {
            let nextStep = userProfile.hasID !== 'yes' ? 'Get a valid ID.' : 'Check your polling booth.';
            responseHTML = `
                <strong>Steps:</strong><br>
                1. ${nextStep}<br>
                2. Mark the election date on your calendar.<br><br>
                <strong>⚠️ Warning:</strong> Don't wait until the last minute. Deadlines are strict.<br><br>
                <strong>✅ Actionable advice:</strong> Use the "Add Reminder" tool on your dashboard.
            `;
        } else if (promptText.includes('ID')) {
            responseHTML = `
                <strong>Steps:</strong><br>
                1. Check your state's official voter ID requirements online.<br>
                2. Gather alternative documents (e.g., utility bill, bank statement) if allowed.<br><br>
                <strong>⚠️ Warning:</strong> Without an ID, you may be forced to cast a provisional ballot, which might not be counted.<br><br>
                <strong>✅ Actionable advice:</strong> If you lost your ID, apply for a replacement immediately. Some states offer free voter IDs.
            `;
        } else {
            responseHTML = "I am ready to help. Please select one of the suggested prompts.";
        }

        aiMsg.innerHTML = responseHTML;
        aiChatBox.appendChild(aiMsg);
        aiChatBox.scrollTop = aiChatBox.scrollHeight;
    }, 800);
}

// Decision Simulator Logic
const simulationResult = document.getElementById('simulation-result');

function runSimulation(scenario) {
    simulationResult.classList.remove('hidden');
    let consequence = '';
    let solution = '';

    switch(scenario) {
        case 'no_id':
            consequence = "❌ You may be turned away at the polls or asked to cast a provisional ballot, which requires later verification.";
            solution = "✅ Carry alternative documents if your state allows (utility bills, bank statements). Verify requirements now.";
            break;
        case 'late':
            consequence = "❌ If you arrive after the polls close, you will not be allowed to join the line to vote.";
            solution = "✅ Plan to arrive at least 1 hour early. If you are IN LINE before polls close, stay in line! You have the right to vote.";
            break;
        case 'wrong_booth':
            consequence = "❌ You will not be on the voter roll at that location and cannot cast a regular ballot there.";
            solution = "✅ Use the 'Find Booth' tool on your dashboard. You must vote at your designated precinct.";
            break;
    }

    simulationResult.innerHTML = `
        <div class="sim-consequence">${consequence}</div>
        <div class="sim-solution">${solution}</div>
    `;
}
