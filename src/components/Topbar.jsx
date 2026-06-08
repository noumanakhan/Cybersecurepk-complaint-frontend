import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import { API_URL } from '../config';

const PORTAL_LABELS = {
  admin: 'Admin Portal',
  staff: 'Staff Portal',
  student: 'Student Portal',
};

const Topbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await axios.put(`${API_URL}/api/notifications/${notification._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
      }
      setShowDropdown(false);
      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  if (!user) return null;

  const portalName = PORTAL_LABELS[user.role] || 'Student Portal';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="topbar">
      <div className="topbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            display: 'none', // Hidden on desktop, shown on mobile via CSS
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            marginRight: '4px'
          }}
          className="mobile-menu-toggle-btn"
          title="Toggle Sidebar"
        >
          ☰
        </button>
        <img
          src={logo}
          alt="Portal Logo"
          style={{
            width: '42px',
            height: '42px',
            objectFit: 'contain',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '5px',
            flexShrink: 0,
            boxShadow: '0 0 15px rgba(8, 166, 110, 0.15)'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: 0 }}>{portalName}</h1>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>National Cyber Security Cell</p>
        </div>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Notifications Dropdown */}
        <div className="notifications-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ 
              background: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: 'white', 
              width: '38px', 
              height: '38px', 
              borderRadius: '10px', 
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              transition: 'all 0.2s'
            }}
            title="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ff4d4f',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #06090f'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              width: '320px',
              background: '#0d1117',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              border: '1px solid #30363d',
              overflow: 'hidden',
              zIndex: 1000,
              color: '#fff'
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #30363d', fontWeight: 'bold', fontSize: '14px', background: '#161b22' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#8b949e', fontSize: '13px' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => handleNotificationClick(notif)}
                      style={{ 
                        padding: '14px 18px', 
                        borderBottom: '1px solid #30363d', 
                        cursor: 'pointer',
                        background: notif.isRead ? 'transparent' : 'rgba(8, 166, 110, 0.05)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#161b22'}
                      onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(8, 166, 110, 0.05)'}
                    >
                      <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px', color: notif.isRead ? '#fff' : '#08a66e' }}>{notif.title}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>{notif.message}</div>
                      <div style={{ fontSize: '10px', color: '#484f58', marginTop: '8px' }}>{new Date(notif.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-info-text" style={{ textAlign: 'right' }}>
          <div className="name" style={{ fontSize: '13px', fontWeight: 600 }}>{user.name || user.fullName || 'Admin'}</div>
          <span className="badge" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{user.role}</span>
        </div>
        <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {(user.name || user.fullName || 'A').charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
