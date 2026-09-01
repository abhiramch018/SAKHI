import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AWWLayout } from './components/layout/AWWLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// AWW Pages
import { AWWDashboard } from './pages/aww/AWWDashboard';
import { BeneficiariesPage } from './pages/aww/BeneficiariesPage';
import { CounsellingFlowPage } from './pages/aww/CounsellingFlowPage';
import { AWWReportsPage } from './pages/aww/AWWReportsPage';
import { AWWLearningPage } from './pages/aww/AWWLearningPage';
import { AWWMilestonesPage } from './pages/aww/AWWMilestonesPage';
import { AWWAskPage } from './pages/aww/AWWAskPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AWWMonitoringPage } from './pages/admin/AWWMonitoringPage';
import { AWWDetailPage } from './pages/admin/AWWDetailPage';
import { DecisionRulesPage } from './pages/admin/DecisionRulesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminPerformancePage } from './pages/admin/AdminPerformancePage';
import { AdminMilestonesPage } from './pages/admin/AdminMilestonesPage';
import { AdminLearningPage } from './pages/admin/AdminLearningPage';

// Route Guard component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRole?: 'AWW' | 'ADMIN';
}> = ({ children, allowedRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading SAKHI...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and doesn't match
  if (allowedRole && user.role !== allowedRole) {
    // If admin is visiting aww, let them access, but if AWW is visiting admin, redirect to aww dashboard
    if (user.role === 'AWW' && allowedRole === 'ADMIN') {
      return <Navigate to="/aww/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Marketing & Auth routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* AWW Application Routes */}
      <Route
        path="/aww"
        element={
          <ProtectedRoute>
            <AWWLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/aww/dashboard" replace />} />
        <Route path="dashboard" element={<AWWDashboard />} />
        <Route path="beneficiaries" element={<BeneficiariesPage />} />
        <Route path="counselling/new" element={<CounsellingFlowPage />} />
        <Route path="reports" element={<AWWReportsPage />} />
        <Route path="learning" element={<AWWLearningPage />} />
        <Route path="milestones" element={<AWWMilestonesPage />} />
        <Route path="ask" element={<AWWAskPage />} />
      </Route>

      {/* Admin Application Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="awws" element={<AWWMonitoringPage />} />
        <Route path="awws/:id" element={<AWWDetailPage />} />
        <Route path="rules" element={<DecisionRulesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="performance" element={<AdminPerformancePage />} />
        <Route path="milestones" element={<AdminMilestonesPage />} />
        <Route path="learning" element={<AdminLearningPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;

