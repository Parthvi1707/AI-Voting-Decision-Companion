import styled from 'styled-components';
import { useStore } from '../store/useStore';
import { GlassCard, PrimaryButton } from '../components/ui/StyledComponents';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const RecommendationCard = styled(GlassCard)`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

export default function ActionCenter() {
  const { hurdles, readinessScore, completeHurdle } = useStore();
  const navigate = useNavigate();

  const uncompleted = hurdles.filter(h => !h.completed);
  const nextAction = uncompleted.length > 0 ? uncompleted[0] : null;

  const handleResolve = () => {
    if (nextAction) {
      completeHurdle(nextAction.id);
      navigate('/dashboard');
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Recommended Action Center</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
          Your personalized next steps based on AI analysis.
        </p>
      </Header>

      {nextAction ? (
        <RecommendationCard>
          <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '20px', fontWeight: 'bold', marginBottom: '2rem' }}>
            Top Priority
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{nextAction.act}</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '3rem' }}>
            Complete this to reach {Math.min(100, readinessScore + Math.round(100 / hurdles.length))}% readiness.
          </p>
          <PrimaryButton style={{ margin: '0 auto', fontSize: '1.2rem', padding: '1rem 2.5rem' }} onClick={handleResolve}>
            Resolve Now →
          </PrimaryButton>
        </RecommendationCard>
      ) : (
        <RecommendationCard>
          <h2 style={{ fontSize: '2rem', color: '#10b981', marginBottom: '1rem' }}>You're fully prepared!</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '3rem' }}>
            No further actions required. Enter the simulator to practice.
          </p>
          <PrimaryButton style={{ margin: '0 auto', fontSize: '1.2rem', padding: '1rem 2.5rem' }} onClick={() => navigate('/simulation')}>
            Start Simulation →
          </PrimaryButton>
        </RecommendationCard>
      )}
    </PageContainer>
  );
}
