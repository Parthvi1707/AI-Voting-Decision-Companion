import styled from 'styled-components';
import { useStore } from '../store/useStore';
import { GlassCard, PrimaryButton } from '../components/ui/StyledComponents';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const HurdleCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 4px solid var(--saffron);
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(245, 158, 11, 0.2);
  color: var(--saffron);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export default function HurdlesPage() {
  const { hurdles, completeHurdle } = useStore();
  const navigate = useNavigate();

  const uncompleted = hurdles.filter(h => !h.completed);

  return (
    <PageContainer>
      <Header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Critical Hurdles</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
          Resolve these issues to secure your voting eligibility.
        </p>
      </Header>

      {uncompleted.length === 0 ? (
        <GlassCard style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>All Clear!</h2>
          <p style={{ color: 'var(--text-dim)' }}>You have no critical hurdles remaining.</p>
        </GlassCard>
      ) : (
        <Grid>
          {uncompleted.map((hurdle) => (
            <HurdleCard key={hurdle.id} hoverable>
              <div>
                <Badge>Critical Blocker</Badge>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{hurdle.title}</h3>
                <p style={{ color: 'white', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚠️ <span style={{ color: 'var(--saffron)' }}>{hurdle.impact}</span>
                </p>
                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⏱️ Takes ~{hurdle.time}
                </p>
              </div>
              <PrimaryButton onClick={() => {
                // Simulate action resolution for now
                completeHurdle(hurdle.id);
                navigate('/dashboard');
              }}>
                Resolve Now →
              </PrimaryButton>
            </HurdleCard>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}
