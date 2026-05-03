import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { PrimaryButton, SecondaryButton, GlassCard } from '../components/ui/StyledComponents';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { getAIInsights } from '../utils/aiAssistant';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 4rem;
`;

const MicroInsightsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const MicroInsight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: ${props => props.status === 'complete' ? 'var(--status-success)' : props.status === 'pending' ? 'var(--status-warning)' : 'var(--text-dim)'};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const HeroSection = styled(GlassCard)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(17, 24, 39, 0.9) 100%);
  border-left: 4px solid var(--action-violet);
  position: relative;
  overflow: hidden;
  padding: 3.5rem;
  margin-bottom: 1rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1.5px;
    border-radius: 24px;
    background: linear-gradient(to bottom right, rgba(124, 58, 237, 0.4), rgba(34, 211, 238, 0.4));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.6;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
`;

const ScoreWrapper = styled.div`
  width: 220px;
  height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PulseRing = styled(motion.div)`
  position: absolute;
  inset: -10px;
  border: 2px solid var(--accent-cyan);
  border-radius: 50%;
  opacity: 0.3;
`;

const HeroInfo = styled.div`
  flex: 1;
`;

const BigPercentage = styled.span`
  font-size: 5rem;
  font-weight: 800;
  background: linear-gradient(to bottom, #fff, var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
  line-height: 1;
`;

const StatusTag = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-main);
  opacity: 0.8;
`;

const AiCommandCard = styled(GlassCard)`
  background: rgba(124, 58, 237, 0.05);
  border: 1px solid rgba(124, 58, 237, 0.2);
  position: relative;
  overflow: hidden;
  padding: 3rem;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: 24px;
    background: linear-gradient(to bottom right, var(--accent-cyan), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.5;
  }
`;

const AiEngineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: var(--accent-cyan);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--accent-cyan);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent-cyan);
  animation: pulseDot 1.5s infinite;

  @keyframes pulseDot {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const TypingText = styled(motion.p)`
  color: var(--text-dim);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const UrgencyIcon = styled(motion.span)`
  display: inline-flex;
  margin-right: 8px;
  color: var(--status-critical);
`;

export default function Dashboard() {
  const navigate = useNavigate();
  const state = useStore();
  
  // Guard clauses for missing state
  if (!state) return <div style={{ color: 'white', padding: '2rem' }}>Error: System state unavailable. Please refresh.</div>;

  const { readinessScore, estimatedTimeRemaining, hurdles, userProfile } = state;
  const [displayScore, setDisplayScore] = useState(0);

  // Memoize deterministic computations
  const insights = useMemo(() => getAIInsights(state), [state]);
  const uncompletedHurdles = useMemo(() => (hurdles || []).filter(h => !h.completed), [hurdles]);

  useEffect(() => {
    let start = 0;
    const end = readinessScore || 0;
    const duration = 1500;
    const stepTime = Math.max(10, Math.floor(duration / (end || 1)));
    
    if (end === 0) {
      setDisplayScore(0);
      return;
    }

    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [readinessScore]);

  // Fallback for empty hurdles
  if (!hurdles || hurdles.length === 0) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading system checks...</div>;
  }

  return (
    <DashboardGrid role="main" aria-label="Voter Readiness Dashboard">
      <HeroSection role="region" aria-label="Readiness Overview">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ScoreWrapper aria-label={`${displayScore} percent election ready`}>
            <PulseRing 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              aria-hidden="true"
            />
            <CircularProgressbar
              value={displayScore}
              text={`${displayScore}%`}
              styles={buildStyles({
                pathColor: displayScore === 100 ? 'var(--status-success)' : 'var(--action-violet)',
                textColor: '#fff',
                trailColor: 'rgba(255,255,255,0.05)',
                pathTransitionDuration: 0.1,
                strokeLinecap: 'round'
              })}
            />
          </ScoreWrapper>
          
          <MicroInsightsRow role="group" aria-label="Key Readiness Indicators">
            {hurdles.slice(0, 3).map(h => {
              let label = h.title.split(' ')[0];
              if (h.id === 'registration') label = h.completed ? 'Registered' : 'Registration Pending';
              if (h.id === 'verification') label = h.completed ? 'Verified' : 'Verification Pending';
              if (h.id === 'logistics') label = h.completed ? 'Booth Located' : 'Booth Not Found';
              
              return (
                <MicroInsight key={h.id} status={h.completed ? 'complete' : 'pending'} role="status" aria-label={label}>
                  {h.completed ? '✔' : '⚠'} {label}
                </MicroInsight>
              );
            })}
            <MicroInsight role="status" aria-label={`${estimatedTimeRemaining} minutes estimated time remaining`}>
              <span aria-hidden="true">⏱</span> {estimatedTimeRemaining}m left
            </MicroInsight>
          </MicroInsightsRow>
        </div>

        <HeroInfo>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem' }}>
            <BigPercentage aria-hidden="true">{displayScore}%</BigPercentage>
            <StatusTag style={{ fontSize: '1.5rem', opacity: 1, color: 'var(--accent-cyan)' }}>Election Ready</StatusTag>
          </div>
          
          <div role="status" aria-live="polite">
            <p style={{ 
              color: uncompletedHurdles.length > 0 ? 'var(--status-warning)' : 'var(--status-success)', 
              fontSize: '1.2rem', 
              marginTop: '1.5rem', 
              fontWeight: '600',
              display: 'flex', 
              alignItems: 'center' 
            }}>
              {uncompletedHurdles.length > 0 ? (
                <>
                  <UrgencyIcon 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ duration: 1, repeat: Infinity }}
                    aria-hidden="true"
                  >
                    ⚠️
                  </UrgencyIcon>
                  <span aria-label={`You have ${uncompletedHurdles.length} steps remaining`}>
                    You're just {uncompletedHurdles.length} {uncompletedHurdles.length === 1 ? 'step' : 'steps'} away from being fully ready.
                  </span>
                </>
              ) : (
                "✅ All systems go! You're 100% prepared."
              )}
            </p>
          </div>
          
          <p style={{ fontSize: '1rem', color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '2rem', maxWidth: '500px', lineHeight: '1.6' }}>
            {uncompletedHurdles.length > 0 
              ? "We've analyzed your profile and identified key actions to ensure a seamless voting experience."
              : "Great work! You've cleared all critical blockers. Run the simulator to stay sharp."}
          </p>

          <PrimaryButton 
            onClick={() => navigate(uncompletedHurdles.length > 0 ? '/hurdles' : '/simulation')}
            style={{ padding: '1.4rem 3rem', fontSize: '1.2rem' }}
            aria-label={uncompletedHurdles.length > 0 ? "Fix critical issues now" : "Start voting simulation"}
          >
            {uncompletedHurdles.length > 0 ? "Fix This Now →" : "Start Simulation →"}
          </PrimaryButton>
        </HeroInfo>
      </HeroSection>

      <GlassCard 
        onClick={() => navigate('/guide')}
        style={{ 
          cursor: 'pointer', 
          padding: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          marginTop: '-2rem',
          marginBottom: '1rem',
          border: '1px dashed var(--glass-border)'
        }}
        role="button"
        aria-label="Open Election Journey Guide"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">🧭</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Election Journey Progress</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              {uncompletedHurdles.length > 0 
                ? `You are at: Step ${5 - uncompletedHurdles.length + 1} / 5 (${uncompletedHurdles[0].title.split(' ')[0]})`
                : "You have completed all 5 steps of the journey!"}
            </p>
          </div>
        </div>
        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Open Guide →</span>
      </GlassCard>

      <AiCommandCard role="complementary" aria-label="AI Insights and Recommendations">
        <AiEngineHeader>
          <PulseDot aria-hidden="true" /> AI Insight System
        </AiEngineHeader>
        
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1.2rem', color: '#fff' }}>
          {insights.message}
        </h3>
        
        <TypingText
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '700px' }}
        >
          {insights.reason}
        </TypingText>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <PrimaryButton 
            onClick={() => navigate(insights.route)}
            style={{ padding: '1.1rem 2.2rem' }}
            aria-label={insights.suggestedAction}
          >
            {insights.suggestedAction}
          </PrimaryButton>
          
          {uncompletedHurdles.length > 0 && (
            <SecondaryButton 
              onClick={() => navigate('/roadmap')} 
              style={{ padding: '1.1rem 2.2rem' }}
              aria-label="View election roadmap"
            >
              View My Roadmap
            </SecondaryButton>
          )}
        </div>
      </AiCommandCard>
    </DashboardGrid>
  );
}
