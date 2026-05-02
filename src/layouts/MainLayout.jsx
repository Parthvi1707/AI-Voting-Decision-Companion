import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import AiOrb from '../components/AiOrb';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: var(--bg-primary);
  color: var(--text-main);
`;

const Sidebar = styled.nav`
  width: 250px;
  background: var(--bg-surface);
  border-right: 1px solid var(--glass-border);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  color: var(--text-dim);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(124, 58, 237, 0.05);
    color: white;
  }

  &.active {
    background: rgba(124, 58, 237, 0.1);
    color: var(--accent-cyan);
    border-right: 3px solid var(--action-violet);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
`;

export default function MainLayout() {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <h2 style={{ paddingLeft: '1.5rem', marginBottom: '2rem', color: 'white' }}>VoteSense AI</h2>
        <StyledNavLink to="/dashboard">Dashboard</StyledNavLink>
        <StyledNavLink to="/roadmap">Roadmap</StyledNavLink>
        <StyledNavLink to="/hurdles">Critical Hurdles</StyledNavLink>
        <StyledNavLink to="/action-center">Action Center</StyledNavLink>
        <StyledNavLink to="/simulation">Simulator</StyledNavLink>
      </Sidebar>
      
      <MainContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </MainContent>
      
      <AiOrb />
    </LayoutContainer>
  );
}
