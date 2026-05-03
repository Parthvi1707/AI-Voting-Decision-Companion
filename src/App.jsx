import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';
import { useStore } from './store/useStore';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const HurdlesPage = lazy(() => import('./pages/HurdlesPage'));
const ActionCenter = lazy(() => import('./pages/ActionCenter'));
const Simulation = lazy(() => import('./pages/Simulation'));
const ElectionGuide = lazy(() => import('./pages/ElectionGuide'));

function ProtectedRoute({ children }) {
  const isLoggedIn = useStore((state) => state.userProfile.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ background: '#0a0a0a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          
          {/* Protected Routes inside MainLayout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/hurdles" element={<HurdlesPage />} />
            <Route path="/action-center" element={<ActionCenter />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/guide" element={<ElectionGuide />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
