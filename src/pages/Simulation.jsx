import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GlassCard, PrimaryButton } from '../components/ui/StyledComponents';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 3rem;
  overflow: hidden;

  div {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease;
  }
`;

const GoogleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-dim);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
`;

export default function Simulation() {
  const { simulationState, setSimulationStep, completeSimulation, userProfile, hurdles } = useStore();
  const navigate = useNavigate();
  const { currentStep, completed } = simulationState;

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const hasID = hurdles.find(h => h.id === 'documents')?.completed;
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setSimulationStep(currentStep + 1);
    } else {
      completeSimulation();
    }
  };

  if (completed) {
    return (
      <PageContainer>
        <GlassCard style={{ padding: '4rem' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</h1>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>You are now fully ready</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '3rem' }}>
            You have successfully completed the Voting Day Simulation. You are fully prepared to cast your vote.
          </p>
          <PrimaryButton onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </PrimaryButton>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Voting Day Simulator</h1>
      
      <ProgressBar progress={progress}>
        <div style={{ width: `${progress}%` }} />
      </ProgressBar>

      <GlassCard style={{ position: 'relative', overflow: 'hidden' }} aria-label={`Step ${currentStep + 1} of 4`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && (
              <>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>1. Find Your Booth</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Navigate to your assigned polling location using intelligent routing.</p>
                
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', height: '220px', borderRadius: '16px', margin: '0 0 2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34, 211, 238, 0.3)', boxShadow: '0 0 30px rgba(34, 211, 238, 0.1)' }}>
                  <div style={{ color: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>📍</div>
                    <strong style={{ fontSize: '1.8rem', color: 'var(--accent-cyan)' }}>Distance: 2.4 km</strong><br/>
                    <span style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Traffic: Light • Est: 12 mins via Car</span>
                  </div>
                </div>

                <GoogleBadge>🗺️ Powered by Google Maps (Simulated)</GoogleBadge>
              </>
            )}

            {currentStep === 1 && (
              <>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>2. Schedule Your Visit</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Choose the optimal time to avoid long queues and sync with your schedule.</p>
                
                <div style={{ padding: '3.5rem', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '16px', marginBottom: '2rem', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                  <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem', fontSize: '2.2rem' }}>Optimal Window: 08:30 AM</h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Predictive analysis indicates wait times are lowest during this window.</p>
                </div>

                <GoogleBadge>📅 Sync with Google Calendar (Simulated)</GoogleBadge>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>3. Identity Verification</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Present your documents at the booth for verification.</p>
                
                <div style={{ padding: '3.5rem', background: hasID ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', marginBottom: '2rem', border: `1px solid ${hasID ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                  {hasID ? (
                    <>
                      <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🪪</div>
                      <h3 style={{ color: 'var(--status-success)', fontSize: '2rem', marginBottom: '0.5rem' }}>ID Verified</h3>
                      <p style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>{userProfile.name}'s documents have been authenticated by the system.</p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>⚠️</div>
                      <h3 style={{ color: 'var(--status-critical)', fontSize: '2rem', marginBottom: '0.5rem' }}>Missing ID Documents</h3>
                      <p style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Verification failed. You cannot proceed without valid identification. Please resolve this in your Action Center.</p>
                    </>
                  )}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>4. Cast Your Vote</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>The EVM is ready. Make your voice heard securely.</p>
                
                <div style={{ margin: '2rem 0', padding: '4.5rem', background: 'rgba(124, 58, 237, 0.05)', border: '1px dashed rgba(124, 58, 237, 0.5)', borderRadius: '16px', boxShadow: 'inset 0 0 30px rgba(124, 58, 237, 0.1)' }}>
                  <h3 style={{ color: 'white', fontSize: '1.8rem', letterSpacing: '3px', textAlign: 'center' }}>[ ELECTRONIC VOTING MACHINE ]</h3>
                  <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <div style={{ width: '50px', height: '50px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 15px #ef4444' }}></div>
                    <div style={{ width: '50px', height: '50px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 15px #22c55e' }}></div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton 
            onClick={handleNext}
            aria-label={currentStep === 3 ? "Complete Simulation" : "Next Step"}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            {currentStep === 3 ? "Complete Simulation" : "Next Step"} <span className="arrow">→</span>
          </PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
}
