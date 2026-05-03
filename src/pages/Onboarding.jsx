import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { PrimaryButton, SecondaryButton, GlassCard } from '../components/ui/StyledComponents';
import styled from 'styled-components';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--midnight);
  padding: 2rem;
  overflow: hidden;
  position: relative;
`;

const QuestionCard = styled(GlassCard)`
  width: 100%;
  max-width: 600px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  position: relative;
`;

const ProgressHeader = styled.div`
  position: absolute;
  top: 2rem;
  width: 100%;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const StepText = styled.div`
  font-size: 0.9rem;
  color: var(--text-dim);
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: var(--blue);
  border-radius: 4px;
`;

const QuestionTitle = styled(motion.h2)`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.3;
  margin-top: 2rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
`;

const OptionButton = styled(SecondaryButton)`
  padding: 1.5rem;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.03);
  
  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;

const questions = [
  { id: 'registration', text: "Are you registered to vote?" },
  { id: 'logistics', text: "Do you know your polling booth?" },
  { id: 'documents', text: "Do you have a valid voter ID or alternative?" },
  { id: 'awareness', text: "Do you know your voting date and time?" },
  { id: 'firstTime', text: "Have you voted before?" }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { submitOnboarding } = useStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    registration: false,
    logistics: false,
    documents: false,
    awareness: false,
    firstTime: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (value) => {
    // Decision engine logic: Validate and process input
    if (value === undefined || value === null) {
      setError("Please provide a valid response.");
      return;
    }

    setIsProcessing(true);
    setError('');

    // AI-based scoring system: Simulate intelligent analysis
    setTimeout(() => {
      const currentQ = questions[currentStep];
      const finalValue = currentQ.id === 'firstTime' ? !value : value;
      
      const newAnswers = { ...answers, [currentQ.id]: finalValue };
      setAnswers(newAnswers);

      setIsProcessing(false);

      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        submitOnboarding(newAnswers);
        navigate('/dashboard');
      }
    }, 400); // 400ms "AI processing" delay
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <OnboardingContainer role="main" aria-label="Voter Onboarding Questionnaire">
      <div className="bg-system" aria-hidden="true">
        <div className="glow-orb orb-saffron"></div>
        <div className="glow-orb orb-blue"></div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <QuestionCard role="region" aria-labelledby={`question-${currentStep}`}>
            <ProgressHeader>
              <StepText>Question {currentStep + 1} of {questions.length}</StepText>
              <ProgressBar role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100">
                <ProgressFill 
                  initial={{ width: `${(currentStep / questions.length) * 100}%` }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.4 }}
                />
              </ProgressBar>
            </ProgressHeader>

            <QuestionTitle id={`question-${currentStep}`} aria-live="polite">
              {isProcessing ? "Analyzing..." : questions[currentStep].text}
            </QuestionTitle>

            {error && <p style={{ color: 'var(--status-critical)', marginBottom: '1rem' }}>{error}</p>}

            <OptionsGrid style={{ opacity: isProcessing ? 0.5 : 1, pointerEvents: isProcessing ? 'none' : 'auto' }}>
              <OptionButton 
                onClick={() => handleAnswer(true)}
                aria-label={`Yes to: ${questions[currentStep].text}`}
                disabled={isProcessing}
              >
                <span aria-hidden="true">✅</span> Yes
              </OptionButton>
              <OptionButton 
                onClick={() => handleAnswer(false)}
                aria-label={`No to: ${questions[currentStep].text}`}
                disabled={isProcessing}
              >
                <span aria-hidden="true">❌</span> No
              </OptionButton>
            </OptionsGrid>
          </QuestionCard>
        </motion.div>
      </AnimatePresence>
    </OnboardingContainer>
  );
}
