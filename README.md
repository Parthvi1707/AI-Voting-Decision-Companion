# VoteSense AI - Intelligent Voter Decision Companion

VoteSense AI is a premium, cinematic web application designed to simplify the voting journey for Indian citizens. By using a rule-based intelligent decision engine, it helps voters navigate the complexities of registration, verification, and booth logistics.

## 🚀 Features

- **Personalized Onboarding**: A guided assessment to determine your current voting readiness.
- **AI Analysis System**: Dynamic calculation of readiness score based on critical blockers.
- **Prioritized Roadmap**: A step-by-step guide to resolving legal and logistical barriers.
- **Voting Simulator**: Practice the actual voting process in a risk-free, guided environment.
- **Premium Cinematic UI**: High-fidelity visuals using GSAP and Framer Motion.

## 🤖 AI Analysis System

VoteSense AI uses a rule-based intelligent decision engine to evaluate voter readiness.

### Key Capabilities:
- Calculates a readiness score based on user inputs
- Detects critical blockers such as registration, verification, and booth awareness
- Prioritizes actions for the user to complete
- Simulates real-world voting scenarios

### How it works:
The system analyzes user responses and assigns weighted scores:
- Registration → 40%
- Verification → 30%
- Booth Awareness → 30%

Based on this, it dynamically generates personalized recommendations.

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Styled-Components + Vanilla CSS
- **Animations**: GSAP (ScrollTrigger) + Framer Motion
- **State Management**: Zustand (Persisted)
- **Testing**: Vitest + React Testing Library
- **Optimization**: React Lazy + Suspense

## 📂 Folder Structure

```text
src/
├── components/   # Shared UI components and layout elements
├── pages/        # Page-level components (Dashboard, Onboarding, etc.)
├── store/        # Zustand state management and logic
├── utils/        # AI Engine and helper functions
├── tests/        # Comprehensive test suite
└── assets/       # Static assets and global styles
```

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

*This project is built for educational and awareness purposes to maximize voter participation in India.*
