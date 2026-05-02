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

const RoadmapList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const RoadmapItem = styled(GlassCard)`
  margin-bottom: 2rem;
  margin-left: 3rem;
  position: relative;
  border-color: ${props => props.status === 'done' ? 'rgba(16, 185, 129, 0.3)' : props.status === 'active' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.status === 'done' ? 'rgba(16, 185, 129, 0.05)' : props.status === 'active' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(15, 23, 42, 0.6)'};

  &::before {
    content: '';
    position: absolute;
    left: -42px;
    top: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.status === 'done' ? '#10b981' : props.status === 'active' ? '#3b82f6' : '#475569'};
    border: 4px solid var(--night);
    box-shadow: ${props => props.status === 'active' ? '0 0 15px #3b82f6' : 'none'};
    z-index: 2;
  }
`;

export default function RoadmapPage() {
  const { roadmapSteps } = useStore();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Strategic Roadmap</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Your step-by-step path to election readiness.</p>
      </Header>

      <RoadmapList>
        {roadmapSteps.map((step) => (
          <RoadmapItem key={step.id} status={step.status} hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: step.status === 'done' ? '#10b981' : 'white' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-dim)' }}>{step.desc}</p>
              </div>
              {step.status === 'active' && (
                <PrimaryButton onClick={() => navigate('/action-center')}>
                  Resolve Now →
                </PrimaryButton>
              )}
            </div>
          </RoadmapItem>
        ))}
      </RoadmapList>
    </PageContainer>
  );
}
