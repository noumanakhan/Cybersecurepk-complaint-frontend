import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/complaints`);
      setComplaints(response.data);
      
      const total = response.data.length;
      const open = response.data.filter(c => c.status === 'OPEN').length;
      const inProgress = response.data.filter(c => c.status === 'IN_PROGRESS').length;
      const resolved = response.data.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
      
      setStats({ total, open, inProgress, resolved });
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN': return <span className="badge badge-open">Open</span>;
      case 'IN_PROGRESS': return <span className="badge badge-progress">In Progress</span>;
      case 'PENDING': return <span className="badge badge-pending">Pending</span>;
      case 'RESOLVED': return <span className="badge badge-resolved">Resolved</span>;
      case 'CLOSED': return <span className="badge badge-closed">Closed</span>;
      case 'ESCALATED': return <span className="badge badge-escalated">Escalated</span>;
      default: return <span className="badge badge-closed">{status}</span>;
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div>
      <div className="page-header-row" style={{ marginBottom: '32px' }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', background: 'rgba(8, 166, 110, 0.1)',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px'
            }}>📊</div>
            <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
          </div>
          <p style={{ marginLeft: '52px', color: '#9ca3af' }}>
            Welcome back, <span style={{color: '#08a66e', fontWeight: '700'}}>{user.name}</span>. Track your active cybersecurity complaints here.
          </p>
        </div>
        {user.role === 'student' && (
          <Link to="/create-complaint" className="btn btn-primary" style={{ boxShadow: '0 4px 14px rgba(8, 166, 110, 0.3)' }}>
            <span>➕</span> Create New Ticket
          </Link>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid-4 mb-20">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--navy)' }}>
          <div className="stat-icon" style={{ background: 'rgba(8, 166, 110, 0.1)', color: 'var(--navy)' }}>📋</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Complaints</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ff851b' }}>
          <div className="stat-icon" style={{ background: 'rgba(255, 133, 27, 0.1)', color: '#ff851b' }}>🔔</div>
          <div className="stat-info">
            <h3>{stats.open}</h3>
            <p>Open Tickets</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #007bff' }}>
          <div className="stat-icon" style={{ background: 'rgba(0, 123, 255, 0.1)', color: '#007bff' }}>⚡</div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #28a745' }}>
          <div className="stat-icon" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}>✅</div>
          <div className="stat-info">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
      </div>
      
      {/* Complaints List */}
      <div className="card" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        <div className="card-header" style={{ padding: '24px 32px', borderBottom: '1.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '24px', background: 'var(--navy)', borderRadius: '4px' }}></div>
            <h2 style={{ margin: 0 }}>Recent Activity</h2>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
            {complaints.length} Records Found
          </div>
        </div>
        
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: '32px' }}>Ticket ID</th>
                <th>Complaint Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Timeline</th>
                <th style={{ textAlign: 'right', paddingRight: '32px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td style={{ paddingLeft: '32px' }}>
                    <span className="ticket-id" style={{ fontWeight: '800', letterSpacing: '0.5px' }}>{complaint.ticketId}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{complaint.subject}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ opacity: 0.7 }}>📍</span> {complaint.subcategory}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {complaint.category}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{new Date(complaint.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(complaint.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '32px' }}>
                    <Link
                      to={`/ticket/${complaint._id}`}
                      className="btn btn-outline btn-sm"
                      style={{ borderRadius: '6px', padding: '6px 16px' }}
                    >
                      View Ticket
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {complaints.length === 0 && (
            <div style={{ padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ 
                width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' 
              }}>📁</div>
              <h3 style={{ color: 'var(--navy-dark)', fontSize: '20px', marginBottom: '8px' }}>No Active Tickets</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                You haven't submitted any complaints yet. Your history will appear here once you create your first ticket.
              </p>
              {user.role === 'student' && (
                <Link to="/create-complaint" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                  🚀 Submit Your First Complaint
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;