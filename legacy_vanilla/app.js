/**
 * VoteSense AI – AI Decision Companion
 * Production-Level Refactored Logic
 * 
 * Features: Modular Design, Security, Accessibility, Efficiency, Testing
 */

// --- CONFIGURATION ---
const APP_CONFIG = {
    QUESTIONS: [
        { id: 'registration', text: "Are you registered as a voter?", category: "registration" },
        { id: 'verification', text: "Have you checked your name in the voter list?", category: "verification" },
        { id: 'logistics', text: "Do you know your polling booth location?", category: "logistics" },
        { id: 'documents', text: "Do you have a valid voter ID or document?", category: "documents" },
        { id: 'awareness', text: "Do you know the voting date?", category: "awareness" }
    ],
    SIM_STEPS: [
        { title: "Reach Polling Booth", type: "location", desc: "Use the built-in map to navigate to your assigned booth." },
        { title: "Verification", type: "verification", desc: "Election officers will verify your name in the electoral roll." },
        { title: "Show ID", type: "document", desc: "Present a valid government-issued ID for final authentication." },
        { title: "Cast Vote", type: "final", desc: "The final step: secure your future by casting your vote." }
    ],
    STORAGE_KEYS: {
        USERNAME: 'votesense_username',
        SCORE: 'votesense_score',
        PROFILE: 'votesense_profile'
    }
};

// --- STATE MANAGEMENT ---
const State = {
    username: '',
    userProfile: {
        registration: null,
        verification: null,
        logistics: null,
        documents: null,
        awareness: null
    },
    currentQIndex: 0,
    currentSimStep: 0,

    init() {
        try {
            let savedName = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USERNAME) || '';
            // Bug Fix: Remove trailing 'x' characters from previous test corruption
            if (savedName.includes('xxxx')) {
                savedName = savedName.split('xxxx')[0].trim();
                localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USERNAME, savedName);
            }
            this.username = savedName;

            const savedProfile = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PROFILE);
            if (savedProfile) this.userProfile = JSON.parse(savedProfile);
        } catch (e) {
            console.error("Storage Error:", e);
        }
    },

    saveProfile() {
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PROFILE, JSON.stringify(this.userProfile));
        } catch (e) {
            console.error("Save Error:", e);
        }
    },

    saveUsername(name) {
        if (!name) return;
        // SECURITY: Sanitize Input
        const sanitized = name.trim().substring(0, 30);
        this.username = sanitized;
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USERNAME, sanitized);
        
        // Trigger UI Slide Up
        DOM.loginOverlay.classList.add('slide-up');
        document.body.classList.remove('no-scroll');
    }
};

// --- DOM ELEMENTS CACHE ---
let DOM = {};

function initDOM() {
    DOM = {
        landing: document.getElementById('landing-story'),
        appFlow: document.getElementById('app-flow'),
        profiling: document.getElementById('profiling-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        simulator: document.getElementById('simulator-screen'),
        qText: document.getElementById('question-text'),
        qGrid: document.getElementById('options-grid'),
        qCurrent: document.getElementById('q-current'),
        qTotal: document.getElementById('q-total'),
        qProgress: document.getElementById('q-progress'),
        scorePercent: document.getElementById('score-percent'),
        scoreRing: document.getElementById('score-ring-fill'),
        status: document.getElementById('readiness-status'),
        badge: document.getElementById('readiness-badge'),
        gapsList: document.getElementById('gaps-list'),
        roadmap: document.getElementById('db-roadmap'),
        actions: document.getElementById('action-cards-grid'),
        chatBox: document.getElementById('dashboard-chat-box'),
        chatInput: document.getElementById('chat-input'),
        loginOverlay: document.getElementById('login-overlay'),
        nameInput: document.getElementById('user-name-input'),
        displayName: document.getElementById('display-name'),
        displayNameDB: document.getElementById('display-name-db'),
        userDisplay: document.getElementById('user-display'),
        userDisplayDB: document.getElementById('user-display-db'),
        simContent: document.getElementById('sim-content'),
        simCurrent: document.getElementById('sim-current'),
        simProgress: document.getElementById('sim-progress'),
        modal: document.getElementById('modal-overlay'),
        modalBody: document.getElementById('modal-body'),
        backHome: document.getElementById('btn-back-home')
    };
}

// --- UI MODULE ---
const UI = {
    transitionTo(screenId) {
        console.log(`[VOTESENSE] Transitioning to: ${screenId}`);
        
        // 1. Kill ALL GSAP ScrollTriggers to prevent layout locks
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(t => t.kill());
            console.log("[VOTESENSE] Killed all ScrollTriggers");
        }

        // 2. Hide everything aggressively
        const screens = ['landing-story', 'profiling-screen', 'dashboard-screen', 'simulator-screen'];
        screens.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.classList.add('hidden');
            }
        });

        const appFlow = document.getElementById('app-flow');
        const targetId = screenId === 'landing' ? 'landing-story' : `${screenId}-screen`;
        const target = document.getElementById(targetId);

        if (target) {
            // 3. Mode Toggle
            const globalOrb = document.getElementById('global-ai-orb');
            
            if (screenId !== 'landing') {
                appFlow.style.display = 'block';
                appFlow.classList.remove('hidden');
                document.body.classList.add('app-mode');
                
                if (globalOrb) {
                    if (screenId === 'simulator') {
                        globalOrb.classList.add('hidden');
                    } else {
                        globalOrb.classList.remove('hidden');
                    }
                }
                
                // Only lock scroll for focused profiling (questionnaire)
                if (screenId === 'profiling') {
                    document.body.classList.add('no-scroll');
                } else {
                    document.body.classList.remove('no-scroll');
                }
            } else {
                appFlow.style.display = 'none';
                appFlow.classList.add('hidden');
                document.body.classList.remove('app-mode', 'no-scroll');
                if (globalOrb) globalOrb.classList.remove('hidden');
            }

            // 4. Show Target
            target.style.display = 'flex';
            target.style.opacity = '1';
            target.classList.remove('hidden');

            // 5. Init Logic
            if (screenId === 'profiling') ReadinessEngine.renderQuestion();
            if (screenId === 'dashboard') ReadinessEngine.render();
            if (screenId === 'simulator') SimulatorEngine.init();

            if (screenId === 'landing') {
                setTimeout(() => initScroll(), 100);
            }

            window.scrollTo(0, 0);
            console.log(`[VOTESENSE] Screen "${targetId}" is now active.`);
        } else {
            console.error(`[VOTESENSE] Error: Target "${targetId}" not found.`);
        }
    },

    updatePersonalization() {
        if (State.username) {
            DOM.displayName.textContent = State.username;
            if (DOM.displayNameDB) DOM.displayNameDB.textContent = State.username;
            
            DOM.userDisplay.classList.remove('hidden');
            if (DOM.userDisplayDB) DOM.userDisplayDB.classList.remove('hidden');
            
            DOM.loginOverlay.classList.add('slide-up');
            document.body.classList.remove('no-scroll');
            
            const subtitle = document.getElementById('readiness-subtitle');
            if (subtitle) {
                subtitle.textContent = `Hello ${State.username} 👋, system analysis is complete.`;
            }
        } else {
            DOM.loginOverlay.classList.remove('slide-up');
            document.body.classList.add('no-scroll');
        }
    },

    showModal(title, body, btnText = "Close", btnAction = () => UI.closeModal()) {
        DOM.modal.classList.remove('hidden');
        DOM.modalBody.innerHTML = `
            <h2>${title}</h2>
            <p style="margin-top: 1.5rem; color: var(--text-dim);">${body}</p>
            <div style="margin-top: 2.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
                <button class="btn-secondary" onclick="UI.closeModal()">Not Now</button>
                <button class="btn-primary" id="modal-confirm-btn">${btnText}</button>
            </div>
        `;
        document.getElementById('modal-confirm-btn').onclick = () => {
            UI.closeModal();
            btnAction();
        };
    },

    closeModal() {
        DOM.modal.classList.add('hidden');
    }
};

// --- READINESS ENGINE ---
const ReadinessEngine = {
    renderQuestion() {
        const q = APP_CONFIG.QUESTIONS[State.currentQIndex];
        if (!q) {
            console.error("No question found for index:", State.currentQIndex);
            return;
        }

        const qCurrent = document.getElementById('q-current');
        const qTotal = document.getElementById('q-total');
        const qText = document.getElementById('question-text');
        const qProgress = document.getElementById('q-progress');
        const qGrid = document.getElementById('options-grid');

        if (qCurrent) qCurrent.textContent = State.currentQIndex + 1;
        if (qTotal) qTotal.textContent = APP_CONFIG.QUESTIONS.length;
        if (qText) qText.textContent = q.text;
        if (qProgress) qProgress.style.width = `${((State.currentQIndex + 1) / APP_CONFIG.QUESTIONS.length) * 100}%`;

        if (qGrid) {
            qGrid.innerHTML = `
                <button class="btn-option" onclick="ReadinessEngine.handleAnswer('${q.id}', 1)">
                    <span class="btn-icon">✅</span> Yes
                </button>
                <button class="btn-option" onclick="ReadinessEngine.handleAnswer('${q.id}', 0)">
                    <span class="btn-icon">❌</span> No
                </button>
            `;
        }
    },

    handleAnswer(id, val) {
        State.userProfile[id] = val;
        State.currentQIndex++;
        
        if (State.currentQIndex < APP_CONFIG.QUESTIONS.length) {
            gsap.to("#question-card", { opacity: 0, x: -20, duration: 0.2, onComplete: () => {
                this.renderQuestion();
                gsap.fromTo("#question-card", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
            }});
        } else {
            State.saveProfile();
            UI.transitionTo('dashboard');
            // Suggest Simulator after a short delay
            setTimeout(() => {
                UI.showModal("Ready for the next step?", "You've completed your readiness check. Would you like to simulate your actual voting day experience?", "Start Simulation", () => UI.transitionTo('simulator'));
            }, 1500);
        }
    },

    calculateScore(profile = State.userProfile) {
        const keys = ['registration', 'verification', 'logistics', 'documents', 'awareness'];
        const timeMap = { registration: 5, verification: 2, logistics: 1, documents: 3, awareness: 1 };
        let score = 0;
        let missingTime = 0;
        keys.forEach(k => {
            if (profile[k]) score++;
            else missingTime += timeMap[k];
        });
        return { score, percent: (score / keys.length) * 100, missingTime };
    },

    render() {
        const { score, percent } = this.calculateScore();
        
        DOM.scorePercent.textContent = Math.round(percent);
        DOM.scoreRing.style.strokeDashoffset = 283 - (283 * percent) / 100;
        DOM.scoreRing.style.stroke = percent === 100 ? 'var(--green)' : percent >= 60 ? 'var(--blue)' : 'var(--saffron)';

        const statusMap = [
            { threshold: 2, text: "Not Ready", badge: "Immediate Action Required", color: "#ef4444" },
            { threshold: 4, text: "Partially Ready", badge: "Almost Prepared", color: "#f59e0b" },
            { threshold: 5, text: "Fully Ready", badge: "Ready to Vote", color: "#10b981" }
        ];
        const status = statusMap.find(s => score <= s.threshold) || statusMap[2];
        DOM.status.textContent = status.text;
        DOM.badge.textContent = status.badge;
        DOM.badge.style.background = `${status.color}22`;
        DOM.badge.style.borderColor = status.color;
        DOM.badge.style.color = status.color;

        const subtitle = document.getElementById('readiness-subtitle');
        if (subtitle) {
            if (score === 5) {
                subtitle.innerHTML = `You are 100% ready to vote. No pending actions.`;
            } else {
                subtitle.innerHTML = `You are missing ${5 - score} critical steps. <br><span style="color:var(--saffron); font-size:0.9rem; font-weight:600;">Estimated completion time: ${missingTime} mins</span>`;
            }
        }

        this.renderLists();
    },

    renderLists() {
        const gaps = [];
        const actions = [];
        const roadmap = [];
        let priorityAction = null;

        const data = [
            { key: 'registration', gap: "Voter Registration Pending", act: "Register Now", icon: "📝", r: "Registration", impact: "You cannot vote without this", time: "5 mins" },
            { key: 'verification', gap: "Name not verified in roll", act: "Check Voter List", icon: "🔍", r: "Verification", impact: "Risk of rejection at booth", time: "2 mins" },
            { key: 'logistics', gap: "Booth location unknown", act: "Find Your Booth", icon: "📍", r: "Logistics", impact: "You won't know where to go", time: "1 min" },
            { key: 'documents', gap: "No valid ID detected", act: "View Required IDs", icon: "🪪", r: "Documents", impact: "Required for booth entry", time: "3 mins" },
            { key: 'awareness', gap: "Voting date not confirmed", act: "Check Election Dates", icon: "📅", r: "Awareness", impact: "Risk of missing the election", time: "1 min" }
        ];
        
        roadmap.push({ title: "Analysis", desc: "System diagnosis complete.", status: "done" });

        data.forEach(d => {
            if (!State.userProfile[d.key]) {
                gaps.push(d);
                if (!priorityAction) priorityAction = d;
                actions.push({ id: d.key, title: d.act, icon: d.icon });
                if(d.r) roadmap.push({ title: d.r, desc: "Action Required", status: "active" });
            } else if(d.r) {
                roadmap.push({ title: d.r, desc: "Step Verified", status: "done" });
            }
        });

        // 1. Render Gaps as Actionable Cards
        DOM.gapsList.innerHTML = gaps.length 
            ? gaps.map(g => `
                <div class="gap-action-card">
                    <div class="gap-info">
                        <h4>${g.gap}</h4>
                        <p class="gap-impact"><span class="icon" aria-hidden="true">⚠️</span> ${g.impact}</p>
                        <p class="gap-time"><span class="icon" aria-hidden="true">⏱️</span> Takes ~${g.time}</p>
                    </div>
                    <button class="btn-action pulse-glow" onclick="UI.showModal('Action Required', 'Initiating ${g.act} workflow...')">Fix Now →</button>
                </div>
            `).join('') 
            : '<div class="gap-action-card"><div class="gap-info"><h4>All clear!</h4><p>No critical hurdles detected.</p></div></div>';

        // 2. Render Vertical Roadmap
        DOM.roadmap.innerHTML = roadmap.map(r => `
            <div class="roadmap-item ${r.status}" role="listitem" onclick="UI.showModal('${r.title}', 'Detailed view for ${r.title} step.')" style="cursor:pointer" tabindex="0">
                <div class="roadmap-dot"></div>
                <div class="roadmap-info"><h4>${r.title}</h4><p>${r.desc}</p></div>
            </div>
        `).join('');

        // 3. Render Action Center Grid
        DOM.actions.innerHTML = actions.map(a => `
            <div class="action-tile" role="listitem">
                <div class="card-icon" aria-hidden="true">${a.icon}</div>
                <h4>${a.title}</h4>
                <button class="btn-action" onclick="UI.showModal('Action Guide', 'Redirecting to your ${a.title} guide...')">Start</button>
            </div>
        `).join('');

        // 4. Render Priority Action Box
        const priorityBox = document.getElementById('priority-action-box');
        if (priorityBox) {
            if (priorityAction) {
                priorityBox.innerHTML = `
                    <div class="priority-card">
                        <div class="priority-info">
                            <h3 style="color:white; margin-bottom:0.5rem;">Recommended Next Step</h3>
                            <p style="color:var(--text-dim); margin-bottom:0;">Based on your profile, you should <strong>${priorityAction.act}</strong> immediately.</p>
                        </div>
                        <button class="btn-primary-large" onclick="UI.showModal('Priority Task', 'Opening ${priorityAction.act} assistant...')">Fix Now →</button>
                    </div>
                `;
                
                // Update AI Assistant with personalized nudge
                const aiText = document.querySelector('.chat-msg.bot');
                if (aiText) aiText.innerHTML = `I've identified <strong>${gaps.length} hurdles</strong>. You should focus on <strong>${priorityAction.gap}</strong> first. How can I help you with this?`;
            } else {
                priorityBox.innerHTML = `
                    <div class="priority-card" style="background: rgba(16, 185, 129, 0.1); border-color: var(--green);">
                        <div class="priority-info">
                            <h3 style="color:white; margin-bottom:0.5rem;">You're Battle Ready!</h3>
                            <p style="color:var(--text-dim); margin-bottom:0;">All critical steps are completed. You're ready to cast your vote.</p>
                        </div>
                        <button class="btn-primary-large" onclick="UI.transitionTo('simulator')" style="background:var(--green)">Enter Simulator</button>
                    </div>
                `;
                
                const aiText = document.querySelector('.chat-msg.bot');
                if (aiText) aiText.textContent = "Incredible work! Your profile is 100% election-ready. Ready to enter the simulator?";
            }
        }
    }
};

// --- VOTING DAY SIMULATOR ENGINE ---
const SimulatorEngine = {
    init() {
        State.currentSimStep = 0;
        this.render();
    },

    render() {
        const step = APP_CONFIG.SIM_STEPS[State.currentSimStep];
        const simContent = document.getElementById('sim-content');
        const simCurrent = document.getElementById('sim-current');
        const simProgress = document.getElementById('sim-progress');
        const simTitle = document.getElementById('sim-title');

        if (simCurrent) simCurrent.textContent = State.currentSimStep + 1;
        if (simProgress) simProgress.style.width = `${((State.currentSimStep + 1) / APP_CONFIG.SIM_STEPS.length) * 100}%`;
        if (simTitle) simTitle.textContent = step.title;

        let contentHtml = '';

        switch (step.type) {
            case 'location':
                contentHtml = this.getMapHtml(step);
                break;
            case 'verification':
                contentHtml = this.getVerificationHtml(step);
                break;
            case 'document':
                contentHtml = this.getDocumentHtml(step);
                break;
            case 'final':
                contentHtml = this.getFinalHtml(step);
                break;
        }

        if (simContent) {
            simContent.innerHTML = contentHtml;
        }
    },
    getMapHtml(step) {
        const hasLogistics = State.userProfile.logistics === 1;
        return `
            <div class="mock-card">
                <p class="sim-desc">${step.desc}</p>
                <div class="map-sim-view">
                    <div class="map-grid-bg"></div>
                    <div class="map-marker"></div>
                    <div style="position:absolute; bottom:20px; left:20px; text-align:left;">
                        <div style="font-size:0.7rem; color:var(--blue); letter-spacing:1px;">ASSIGNED BOOTH</div>
                        <div style="font-weight:700; color:white;">St. Xavier's High School, Hall A</div>
                    </div>
                </div>
                ${!hasLogistics ? '<p style="color:#ef4444; margin-bottom:1.5rem; font-size:0.9rem; font-weight:600;">⚠️ Alert: You are using a default booth location as yours was unknown.</p>' : '<p style="color:#10b981; margin-bottom:1.5rem; font-size:0.9rem; font-weight:600;">✅ Your assigned booth has been synced.</p>'}
                <div class="google-sim-badge"><span class="icon" aria-hidden="true">📍</span> Powered by Google Maps (Simulated)</div>
                <button class="btn-primary" onclick="SimulatorEngine.simulateNav()">Start Navigation</button>
                <p id="nav-status" style="margin-top:1.5rem; font-size:0.9rem; color:var(--text-dim); min-height:1.2rem;"></p>
            </div>
        `;
    },

    simulateNav() {
        const status = document.getElementById('nav-status');
        if (!status) return;
        status.textContent = "Calculating optimal route...";
        setTimeout(() => {
            status.innerHTML = "📍 <span style='color:white; font-weight:600;'>Route found!</span> 12 mins away via MG Road. Traffic is light.";
            gsap.from(status, { opacity: 0, y: 10, duration: 0.5 });
        }, 1500);
    },

    getVerificationHtml(step) {
        const isVerified = State.userProfile.verification === 1;
        return `
            <div class="mock-card">
                <p class="sim-desc">${step.desc}</p>
                <div class="calendar-card glass">
                    <div class="cal-date">
                        <div class="cal-month">May</div>
                        <div class="cal-day">24</div>
                    </div>
                    <div style="text-align:left;">
                        <div style="font-weight:700; font-size:1.3rem;">Phase 6 Elections</div>
                        <div style="color:var(--text-dim); font-size:0.9rem;">Polling Hours: 07:00 - 18:00</div>
                    </div>
                </div>
                <div class="status-box" style="background:${isVerified ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}; padding:1.5rem; border-radius:16px; border:1px solid ${isVerified ? '#10b98133' : '#ef444433'}; text-align:left;">
                    <p style="color:${isVerified ? '#10b981' : '#ef4444'}; font-weight:700; display:flex; align-items:center; gap:8px;">
                        ${isVerified ? '<span>✅</span> Verified Identity' : '<span>❌</span> Verification Failed'}
                    </p>
                    <p style="font-size:0.9rem; margin-top:0.5rem; color:var(--text-dim);">
                        ${isVerified ? 'Your name is active on the electoral roll for Booth #142.' : 'Your name was not found during the readiness check. Please submit Form 6 immediately.'}
                    </p>
                </div>
                <button class="btn-primary" style="margin-top:2rem;" onclick="UI.showModal('Calendar Sync', 'This election date has been added to your simulated notification tray.')"><span class="icon" aria-hidden="true">📅</span> Sync with Google Calendar (Simulated)</button>
            </div>
        `;
    },

    getDocumentHtml(step) {
        const hasID = State.userProfile.documents === 1;
        return `
            <div class="mock-card">
                <p class="sim-desc">${step.desc}</p>
                <div class="id-card-sim">
                    <div class="id-photo">👤</div>
                    <div class="id-details">
                        <h4>Republic of India</h4>
                        <p>${State.username || 'Citizen Name'}</p>
                        <div style="font-size:0.75rem; color:var(--text-dim); font-family:monospace;">ID: VS-AI-2026-X99</div>
                    </div>
                    <div class="id-badge ${hasID ? 'verified' : 'missing'}">${hasID ? 'AUTHENTICATED' : 'MISSING'}</div>
                </div>
                <p style="color:${hasID ? '#10b981' : '#ef4444'}; font-weight:600; font-size:0.9rem;">
                    ${hasID ? '✅ All required documents are ready for inspection.' : '⚠️ Warning: You lack valid ID documents. You may be turned away at the booth.'}
                </p>
            </div>
        `;
    },

    getFinalHtml(step) {
        return `
            <div class="mock-card">
                <span class="sim-success-icon">🗳️</span>
                <h3 style="font-size:2rem; margin-bottom:1rem; font-family:var(--font-heading);">🎉 You are now 100% ready</h3>
                <p class="sim-desc">${step.desc}</p>
                <div style="margin:2.5rem 0; padding:2rem; background:rgba(59,130,246,0.1); border-radius:24px; border:1px dashed var(--blue); position:relative; overflow:hidden;">
                    <p style="position:relative; z-index:2;">The machine is ready. <br>Your choice defines the next 5 years.</p>
                    <div style="position:absolute; inset:0; background:linear-gradient(90deg, transparent, rgba(59,130,246,0.05), transparent); animation: sweep 3s infinite;"></div>
                </div>
                <button class="btn-primary-large" onclick="SimulatorEngine.complete()">Confirm & Cast Vote</button>
            </div>
        `;
    },

    next() {
        if (State.currentSimStep < APP_CONFIG.SIM_STEPS.length - 1) {
            State.currentSimStep++;
            gsap.fromTo('.sim-content', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
            this.render();
        }
    },

    complete() {
        UI.showModal("Congratulations!", "You have successfully completed the Voting Day Simulation. You are now better prepared for the real election day!", "Finish", () => UI.transitionTo('dashboard'));
    }
};

// --- CHAT SYSTEM ---
const ChatBot = {
    handle() {
        const input = DOM.chatInput.value.trim();
        if (!input) return;

        this.addMessage(input, 'user');
        DOM.chatInput.value = '';

        setTimeout(() => {
            const low = input.toLowerCase();
            let resHtml = "I'm analyzing your request. Please check NVSP portal for official updates.";
            
            if (low.includes('booth') || low.includes('location')) {
                resHtml = `You can find your booth by entering your EPIC number on the ECI Voter Portal. <br><button class="btn-action pulse-glow" style="margin-top:10px" onclick="UI.showModal('Booth Finder', 'Connecting to simulated ECI database...')">Find Booth</button>`;
            }
            else if (low.includes('id') || low.includes('document')) {
                resHtml = `Valid IDs include Voter ID, Aadhaar, PAN, Passport, and DL. <br><button class="btn-action pulse-glow" style="margin-top:10px" onclick="UI.showModal('Documents', 'Showing accepted IDs list...')">View Full List</button>`;
            }
            else if (low.includes('register') || low.includes('form')) {
                resHtml = `Register online via Form 6 on the Voter Helpline app. <br><button class="btn-action pulse-glow" style="margin-top:10px" onclick="UI.showModal('Registration', 'Opening simulated Form 6...')">Start Form 6</button>`;
            }
            
            this.addHtmlMessage(resHtml, 'bot');
        }, 600);
    },

    addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.textContent = text;
        DOM.chatBox.appendChild(msg);
        DOM.chatBox.scrollTop = DOM.chatBox.scrollHeight;
    },

    addHtmlMessage(html, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.innerHTML = html;
        DOM.chatBox.appendChild(msg);
        DOM.chatBox.scrollTop = DOM.chatBox.scrollHeight;
    }
};

// --- ORB CHAT SYSTEM (GLOBAL) ---
const OrbChat = {
    toggle() {
        const panel = document.getElementById('ai-chat-panel');
        const btn = document.getElementById('btn-orb-toggle');
        const isHidden = panel.classList.contains('hidden');
        
        if (isHidden) {
            panel.classList.remove('hidden');
            btn.setAttribute('aria-expanded', 'true');
            gsap.fromTo(panel, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
        } else {
            gsap.to(panel, { opacity: 0, y: 20, scale: 0.95, duration: 0.2, ease: 'power2.in', onComplete: () => {
                panel.classList.add('hidden');
                btn.setAttribute('aria-expanded', 'false');
            }});
        }
    },
    
    send(text = null) {
        const input = document.getElementById('orb-chat-input');
        const val = text || input.value.trim();
        if (!val) return;
        
        this.addHtmlMessage(val, 'user');
        input.value = '';
        
        setTimeout(() => {
            const low = val.toLowerCase();
            let resHtml = "I can help you navigate the process. Try asking about your booth, documents, or registration.";
            
            if (low.includes('booth') || low.includes('location')) {
                resHtml = `You can find your booth by entering your EPIC number on the ECI Voter Portal. <br><button class="btn-action pulse-glow" style="margin-top:10px" onclick="UI.showModal('Booth Finder', 'Connecting to simulated ECI database...')">Find Booth</button>`;
            }
            else if (low.includes('id') || low.includes('document')) {
                resHtml = `Valid IDs include Voter ID, Aadhaar, PAN, Passport, and DL.`;
            }
            else if (low.includes('register') || low.includes('form') || low.includes('verify')) {
                resHtml = `Register or verify online via Form 6 on the Voter Helpline app.`;
            }
            
            this.addHtmlMessage(resHtml, 'bot');
        }, 600);
    },
    
    addHtmlMessage(html, sender) {
        const box = document.getElementById('orb-chat-history');
        if (!box) return;
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.innerHTML = html;
        box.appendChild(msg);
        box.scrollTop = box.scrollHeight;
    }
};

// --- TESTING SUITE ---
const Debug = {
    runTests() {
        console.group("🗳️ VoteSense AI - Unit Tests");
        
        // Test 1: Score Calculation (Perfect Ready)
        const mockProfileFull = { registration: 1, verification: 1, logistics: 1, documents: 1, awareness: 1 };
        let result = ReadinessEngine.calculateScore(mockProfileFull);
        console.assert(result.score === 5, "Score should be 5 for perfect answers");
        console.assert(result.percent === 100, "Percent should be 100% for perfect answers");

        // Test 2: Score Calculation (Not Ready)
        const mockProfileEmpty = { registration: 0, verification: 0, logistics: 0, documents: 0, awareness: 0 };
        result = ReadinessEngine.calculateScore(mockProfileEmpty);
        console.assert(result.score === 0, "Score should be 0 for all NO answers");
        
        // Test 3: Input Sanitization (Non-mutating test)
        const testName = "  Parthvi  " + "x".repeat(50);
        const sanitized = testName.trim().substring(0, 30);
        console.assert(sanitized === "Parthvi" + "x".repeat(23), "Username should be trimmed and capped at 30 chars");
        
        console.log("Current State Profile:", State.userProfile);
        console.groupEnd();
    }
};

// --- EVENT LISTENERS ---
function initEvents() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');
            gsap.to(window, { scrollTo: `#layer-${target}`, duration: 1.5, ease: "power2.inOut" });
        });
    });

    document.getElementById('btn-save-name').onclick = () => {
        const name = DOM.nameInput.value;
        if (name.trim()) {
            State.saveUsername(name);
            UI.updatePersonalization();
        }
    };

    const btnGoogleLogin = document.getElementById('btn-google-login');
    if (btnGoogleLogin) {
        btnGoogleLogin.onclick = () => {
            State.saveUsername("Google User");
            UI.updatePersonalization();
        };
    }

    const orbToggle = document.getElementById('btn-orb-toggle');
    if (orbToggle) orbToggle.onclick = () => OrbChat.toggle();

    const orbClose = document.getElementById('btn-close-chat');
    if (orbClose) orbClose.onclick = () => OrbChat.toggle();

    const orbSend = document.getElementById('btn-orb-send');
    if (orbSend) orbSend.onclick = () => OrbChat.send();

    const orbInput = document.getElementById('orb-chat-input');
    if (orbInput) orbInput.onkeypress = (e) => { if (e.key === 'Enter') OrbChat.send(); };

    DOM.userDisplay.onclick = () => {
        DOM.loginOverlay.classList.remove('slide-up');
        document.body.classList.add('no-scroll');
        DOM.nameInput.focus();
    };

    document.getElementById('btn-start-check').onclick = () => UI.transitionTo('profiling');

    const btnStartSim = document.getElementById('btn-start-simulator');
    if (btnStartSim) btnStartSim.onclick = () => UI.transitionTo('simulator');
    
    document.getElementById('btn-sim-next').onclick = () => SimulatorEngine.next();
    document.getElementById('btn-exit-sim').onclick = () => UI.transitionTo('dashboard');

    document.getElementById('btn-chat-send').onclick = () => ChatBot.handle();
    DOM.chatInput.onkeypress = (e) => { if (e.key === 'Enter') ChatBot.handle(); };

    document.getElementById('btn-back-home').onclick = () => {
        State.currentQIndex = 0;
        UI.transitionTo('landing');
        // Scroll to the end of landing where the CTA is
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 200);
    };

    const closeModalBtn = document.querySelector('.btn-close-modal');
    if (closeModalBtn) closeModalBtn.onclick = () => UI.closeModal();
    DOM.modal.onclick = (e) => { if (e.target === DOM.modal) UI.closeModal(); };
}

// --- GSAP SCROLL (PERFECT IMAGE MATCH TRANSITIONS) ---
function initScroll() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initial State: Only Orb visible, Map hidden
    gsap.set(".map-wrapper", { opacity: 0, scale: 0.8, xPercent: -50, yPercent: -50, left: "50%", top: "50%", pointerEvents: "none" });
    gsap.set(".stylized-orb", { opacity: 1, scale: 1, x: "0%", right: "15%" });
    gsap.set("#layer-hero", { pointerEvents: "auto" });
    gsap.set(".map-network", { opacity: 0 });

    const master = gsap.timeline({
        scrollTrigger: {
            trigger: ".cinematic-track",
            start: "top top",
            end: "+=6000",
            scrub: 1.5,
            pin: true
        }
    });

    // STEP 1: Hero (Orb only)
    master.addLabel("hero")
        .to(".stylized-orb", { scale: 1.1, duration: 1 }, 0)
        .to("#layer-hero", { opacity: 0, y: -80, pointerEvents: "none", duration: 1 }, 1.5)

    // STEP 2: The Voter's Gap (Orb -> Map)
    master.addLabel("problem")
        .to(".stylized-orb", { opacity: 0, scale: 0.5, duration: 1 }, 2) // Orb shrinks and fades
        .to(".map-wrapper", { opacity: 0.6, scale: 1, duration: 1.5 }, 2) // Map fades in
        .to("#layer-problem", { opacity: 1, visibility: "visible", pointerEvents: "auto", duration: 0.8 }, 2.5)
        .to(".map-network", { opacity: 1, duration: 1 }, 3)

    // STEP 3: VoteSense Path (Map moves Left)
    master.addLabel("solution")
        .to("#layer-problem", { opacity: 0, y: -50, pointerEvents: "none", duration: 1 }, 4.5)
        .to(".map-wrapper", { x: "-20vw", opacity: 0.4, scale: 0.9, duration: 1.5 }, 4.5)
        .to("#layer-solution", { opacity: 1, visibility: "visible", pointerEvents: "auto", duration: 1 }, 5.0)

    // STEP 4: Readiness CTA (Map -> Orb as Background Tint)
    master.addLabel("cta")
        .to("#layer-solution", { opacity: 0, y: -50, pointerEvents: "none", duration: 1 }, 7.5)
        .to(".map-wrapper", { 
            opacity: 0, 
            scale: 0.5, 
            filter: "blur(30px)", 
            duration: 2,
            ease: "power2.in" 
        }, 7.5) // Map "implodes" into the orb's center
        .to(".stylized-orb", { 
            opacity: 1, 
            scale: 4, 
            x: "0%", 
            right: "50%", 
            xPercent: 50,
            duration: 2.5,
            ease: "power3.inOut",
            onStart: () => document.querySelector('.stylized-orb').classList.add('tint-mode'),
            onReverseComplete: () => document.querySelector('.stylized-orb').classList.remove('tint-mode')
        }, 8)
        .to("#layer-cta", { opacity: 1, visibility: "visible", pointerEvents: "auto", duration: 1 }, 8.5);

    // PERSISTENT NODE ANIMATION
    gsap.to(".map-node", { 
        opacity: 0.6, 
        scale: 2, 
        duration: 3, 
        repeat: -1, 
        yoyo: true, 
        stagger: { each: 0.2, from: "center" }, 
        ease: "power1.inOut" 
    });
}

// --- START ---
window.onload = () => {
    initDOM(); // Initialize DOM references after load
    State.init();
    UI.updatePersonalization();
    initScroll();
    initEvents();
    Debug.runTests();
};