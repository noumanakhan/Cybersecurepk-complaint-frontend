import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ collapsed, onToggle, onMobileClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close mobile sidebar when any nav link is tapped
  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '0 20px'
      }}>
        {/* Desktop collapse toggle — hidden on mobile */}
        <button
          onClick={onToggle}
          style={{
            background: 'none', border: 'none', color: '#fff',
            fontSize: '20px', cursor: 'pointer', padding: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '6px', transition: 'background 0.2s',
          }}
          className="sidebar-toggle-btn sidebar-desktop-toggle"
          title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          {collapsed ? '☰' : '✕'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} title="Dashboard" onClick={handleNavClick}>
          <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>📊</span>
          <span className="nav-text">Dashboard</span>
        </Link>

        {user.role === 'student' && (
          <Link to="/create-complaint" className={isActive('/create-complaint') ? 'active' : ''} title="New Complaint" onClick={handleNavClick}>
            <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>📝</span>
            <span className="nav-text">New Complaint</span>
          </Link>
        )}

        {user.role === 'admin' && (
          <Link to="/admin" className={isActive('/admin') ? 'active' : ''} title="Admin Panel" onClick={handleNavClick}>
            <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>⚙️</span>
            <span className="nav-text">Admin Panel</span>
          </Link>
        )}

        {!collapsed && <div className="nav-label">Support</div>}
        <Link to="/dashboard" className={isActive('/my-tickets') ? 'active' : ''} title="My Tickets" onClick={handleNavClick}>
          <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>🎫</span>
          <span className="nav-text">My Tickets</span>
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-info">
          <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '13px' }}>
            {(user.name || user.fullName || 'A').charAt(0)}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name || user.fullName || 'Admin'}
              </div>
              <span className="badge" style={{ fontSize: '9px', padding: '1px 6px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                {user.role}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10, padding: '10px 12px', color: '#ff8a8a',
            background: 'rgba(255, 255, 255, 0.08)', border: 'none', cursor: 'pointer',
            fontSize: collapsed ? '18px' : '13px', fontWeight: 600, width: '100%', borderRadius: 8,
            marginTop: '12px'
          }}
          title="Sign Out"
        >
          <span>🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Navbar;