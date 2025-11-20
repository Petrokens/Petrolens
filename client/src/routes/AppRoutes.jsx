// Application Routes

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { AdminLayout } from '../components/Layout/AdminLayout.jsx';
import { DisciplineLayout } from '../components/Layout/DisciplineLayout.jsx';
import { Login } from '../pages/Login.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { UploadDoc } from '../pages/UploadDoc.jsx';
import { QCReport } from '../pages/QCReport.jsx';
import { Reports } from '../pages/Reports.jsx';
import { History } from '../pages/History.jsx';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function LayoutWrapper({ children, requireAdmin = false }) {
  const { isAdmin } = useAuth();
  const Layout = requireAdmin || isAdmin() ? AdminLayout : DisciplineLayout;
  return <Layout>{children}</Layout>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Dashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <UploadDoc />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <QCReport />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Reports />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <History />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

