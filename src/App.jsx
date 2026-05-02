import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import RoadmapPage from './pages/RoadmapPage';
import HurdlesPage from './pages/HurdlesPage';
import ActionCenter from './pages/ActionCenter';
import Simulation from './pages/Simulation';
import { useStore } from './store/useStore';

function ProtectedRoute({ children }) {
  const isLoggedIn = useStore((state) => state.userProfile.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
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
        </Route>
      </Routes>
    </Router>
  );
}
