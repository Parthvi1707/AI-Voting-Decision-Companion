import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GlassCard, PrimaryButton } from '../components/ui/StyledComponents';
import { useNavigate } from 'react-router-dom';

const GuideContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 5rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Timeline = styled.div`
  position: relative;
  padding-left: 4rem;
  
  &::before {
    content: '';
    position: absolute;
    left: 19px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, var(--action-violet), var(--accent-cyan), transparent);
    opacity: 0.3;
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 4rem;
  opacity: ${props => props.isLocked ? 0.6 : 1};
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -4rem;
  top: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.status === 'complete' ? 'var(--status-success)' : props.status === 'critical' ? 'var(--status-critical)' : 'var(--bg-surface)'};
  border: 2px solid ${props => props.status === 'complete' ? 'var(--status-success)' : props.status === 'critical' ? 'var(--status-critical)' : 'var(--glass-border)'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: ${props => props.status === 'complete' ? '0 0 20px var(--status-success)' : 'none'};
  color: white;
  font-weight: 800;
`;

const StepCard = styled(GlassCard)`
  padding: 2.5rem;
  border-left: 4px solid ${props => props.status === 'complete' ? 'var(--status-success)' : props.status === 'critical' ? 'var(--status-critical)' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(10px);
    border-color: var(--accent-cyan);
  }
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${props => props.type === 'complete' ? 'rgba(34, 197, 94, 0.1)' : props.type === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.type === 'complete' ? 'var(--status-success)' : props.type === 'critical' ? 'var(--status-critical)' : 'var(--text-dim)'};
  border: 1px solid ${props => props.type === 'complete' ? 'var(--status-success)' : props.type === 'critical' ? 'var(--status-critical)' : 'var(--glass-border)'};
`;

const WhyItMatters = styled.div`
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  background: ${props => props.isCritical ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.03)'};
  border-radius: 12px;
  border-left: 3px solid ${props => props.isCritical ? 'var(--status-critical)' : 'var(--glass-border)'};
  font-size: 0.95rem;
  
  strong {
    color: ${props => props.isCritical ? 'var(--status-critical)' : 'var(--text-main)'};
    display: block;
    margin-bottom: 4px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const guideSteps = [
  { 
    id: 'registration', 
    title: "1. Voter Registration", 
    desc: "The legal foundation of your voting rights. Without this, you cannot participate in any election.",
    why: "Ensures you are on the list of eligible citizens allowed to cast a vote.",
    time: "~5 mins"
  },
  { 
    id: 'verification', 
    title: "2. Voter List Verification", 
    desc: "Confirming that your name actually appears in the official electoral roll for your constituency.",
    why: "Missing names on election day is the #1 reason voters are turned away.",
    time: "~2 mins"
  },
  { 
    id: 'logistics', 
    title: "3. Booth Discovery", 
    desc: "Finding your exact assigned polling location and understanding how to get there.",
    why: "You can only vote at your assigned booth. Going to the wrong one causes delays.",
    time: "~1 min"
  },
  { 
    id: 'documents', 
    title: "4. ID Preparation", 
    desc: "Selecting and verifying the mandatory identification documents required for booth entry.",
    why: "Strict legal requirement. No valid ID means no entry to the voting compartment.",
    time: "~3 mins"
  },
  { 
    id: 'awareness', 
    title: "5. Voting Day", 
    desc: "The final step where you visit the booth and cast your vote securely on the EVM.",
    why: "The culmination of the entire process where your voice is finally recorded.",
    time: "Election Day"
  }
];

export default function ElectionGuide() {
  const { hurdles } = useStore();
  const navigate = useNavigate();

  return (
    <GuideContainer>
      <PageHeader>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Election Journey Guide</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>
          Understanding the 5 critical stages of the democratic process.
        </p>
      </PageHeader>

      <Timeline>
        {guideSteps.map((step, index) => {
          const hurdle = hurdles.find(h => h.id === step.id);
          const isComplete = hurdle?.completed;
          const isNext = !isComplete && hurdles.slice(0, index).every(h => h.completed);
          const status = isComplete ? 'complete' : (isNext ? 'critical' : 'pending');

          return (
            <TimelineItem 
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TimelineDot status={status}>
                {isComplete ? '✓' : index + 1}
              </TimelineDot>
              
              <StepCard status={status}>
                <StepHeader>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{step.title}</h2>
                    <p style={{ color: 'var(--text-dim)' }}>{step.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge type={status}>
                      {isComplete ? 'Complete' : (status === 'critical' ? 'Critical' : 'Pending')}
                    </Badge>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      ⏱ {step.time}
                    </div>
                  </div>
                </StepHeader>

                <WhyItMatters isCritical={status === 'critical'}>
                  <strong>Why it matters:</strong>
                  {step.why}
                </WhyItMatters>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <PrimaryButton 
                    onClick={() => navigate(isComplete ? '/dashboard' : '/hurdles')}
                    style={{ fontSize: '0.9rem', padding: '0.8rem 1.5rem' }}
                  >
                    {isComplete ? 'Review Status' : 'Check My Status →'}
                  </PrimaryButton>
                </div>
              </StepCard>
            </TimelineItem>
          );
        })}
      </Timeline>
    </GuideContainer>
  );
}
