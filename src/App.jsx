import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateComplaint from './pages/CreateComplaint';
import TicketDetail from './pages/TicketDetail';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Topbar from './components/Topbar';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );

  if (!user) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Layout Wrapper
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  if (!user) return children;

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(prev => !prev);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      {/* Dark overlay backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}
      <Navbar collapsed={sidebarCollapsed} onToggle={toggleSidebar} onMobileClose={closeMobileSidebar} />
      <main className="main-content">
        <Topbar onToggleSidebar={toggleMobileSidebar} />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes without Sidebar/Topbar */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          {/* Routes with Sidebar/Topbar */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-complaint" element={
              <ProtectedRoute allowedRoles={['student']}>
                <CreateComplaint />
              </ProtectedRoute>
            } />
            <Route path="/ticket/:id" element={
              <ProtectedRoute>
                <TicketDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
