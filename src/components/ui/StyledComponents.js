import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  20%, 100% { transform: translateX(100%); }
`;

export const PrimaryButton = styled.button.attrs({
  role: 'button',
  tabIndex: 0
})`
  background: linear-gradient(135deg, var(--action-violet) 0%, #5b21b6 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 0 25px rgba(34, 211, 238, 0.6);
    
    span.arrow {
      transform: translateX(4px);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--accent-cyan);
    outline-offset: 2px;
  }

  span.arrow {
    transition: transform 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    animation: ${shimmer} 3s infinite;
  }
`;

export const SecondaryButton = styled.button.attrs({
  role: 'button',
  tabIndex: 0
})`
  background: rgba(124, 58, 237, 0.1);
  color: var(--text-main);
  border: 1px solid rgba(124, 58, 237, 0.3);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(124, 58, 237, 0.2);
    color: var(--accent-cyan);
    border-color: var(--accent-cyan);
    box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-cyan);
    outline-offset: 2px;
  }
`;

export const GlassCard = styled.section.attrs(props => ({
  role: props.role || 'region',
  'aria-label': props['aria-label']
}))`
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.hoverable && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      border-color: rgba(34, 211, 238, 0.3);
    }
  `}
`;

export const PulseCircle = styled.div`
  width: ${props => props.size || '12px'};
  height: ${props => props.size || '12px'};
  background: ${props => props.color || '#10b981'};
  border-radius: 50%;
  box-shadow: 0 0 10px ${props => props.color || '#10b981'};
  animation: ${pulse} 2s infinite;
`;
