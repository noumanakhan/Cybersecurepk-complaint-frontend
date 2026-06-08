import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);

  const calculateStats = useCallback((data) => {
    const total = data.length;
    const byCategory = {};
    const byStatus = {};
    let escalatedCount = 0;
    let resolvedIn48Hours = 0;

    data.forEach(complaint => {
      byCategory[complaint.category] = (byCategory[complaint.category] || 0) + 1;
      byStatus[complaint.status] = (byStatus[complaint.status] || 0) + 1;
      if (complaint.status === 'ESCALATED') escalatedCount++;
      if (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') {
        const created = new Date(complaint.createdAt);
        const resolved = new Date(complaint.updatedAt || complaint.createdAt);
        const hours = (resolved - created) / (1000 * 60 * 60);
        if (hours <= 48) resolvedIn48Hours++;
      }
    });

    setStats({
      total,
      byCategory,
      byStatus,
      escalatedCount,
      resolvedIn48Hours,
      resolutionRate: total > 0 ? ((resolvedIn48Hours / total) * 100).toFixed(1) : 0
    });
  }, []);

  const fetchAllComplaints = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/complaints/admin/all`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllComplaints();
  }, [fetchAllComplaints]);

  useEffect(() => {
    calculateStats(complaints);
  }, [complaints, calculateStats]);

  const filteredComplaints = useMemo(() => {
    let filtered = complaints;
    if (filters.category) filtered = filtered.filter(c => c.category === filters.category);
    if (filters.status) filtered = filtered.filter(c => c.status === filters.status);
    return filtered;
  }, [complaints, filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const exportToCSV = () => {
    const headers = ['Ticket ID', 'Student', 'Email', 'Category', 'Status', 'Created At'];
    const rows = filteredComplaints.map(c => [
      c.ticketId,
      c.userId.name,
      c.userId.email,
      c.category,
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SCMS_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
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
              width: '40px', height: '40px', background: 'var(--green-light)',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px'
            }}>⚙️</div>
            <h1 style={{ margin: 0 }}>Administrative Oversight</h1>
          </div>
          <p style={{ marginLeft: '52px' }}>Comprehensive monitoring and analytics for the Cybersecurity Program.</p>
        </div>
        <button 
          onClick={exportToCSV} 
          className="btn btn-primary" 
          style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: '700', boxShadow: '0 8px 16px rgba(8, 166, 110, 0.2)' }}
        >
          📥 Export CSV Report
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid-4 mb-20">
        <div className="stat-card" style={{ borderTop: '4px solid var(--navy)' }}>
          <div className="stat-icon" style={{ background: 'rgba(8, 166, 110, 0.1)', color: 'var(--navy)' }}>📊</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Global Tickets</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #dc3545' }}>
          <div className="stat-icon" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}>🚨</div>
          <div className="stat-info">
            <h3>{stats.escalatedCount}</h3>
            <p>Escalated Cases</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #28a745' }}>
          <div className="stat-icon" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745' }}>⏱️</div>
          <div className="stat-info">
            <h3>{stats.resolvedIn48Hours}</h3>
            <p>Resolved &lt;48h</p>
          </div>
        </div>
        <div className="stat-card" style={{ borderTop: '4px solid #007bff' }}>
          <div className="stat-icon" style={{ background: 'rgba(0, 123, 255, 0.1)', color: '#007bff' }}>📈</div>
          <div className="stat-info">
            <h3>{stats.resolutionRate}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      <div className="grid-3 mb-20" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Departmental Stats */}
        <div className="card">
          <div className="card-header" style={{ padding: '20px 24px' }}>
            <h2 style={{ margin: 0, fontSize: '15px' }}>Departmental Volume</h2>
          </div>
          <div className="card-body" style={{ padding: '12px' }}>
            {Object.entries(stats.byCategory || {}).length > 0 ? Object.entries(stats.byCategory || {}).map(([category, count]) => (
              <div key={category} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderRadius: '8px',
                marginBottom: '8px', background: '#111', border: '1px solid #1f2937'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--navy)' }}></div>
                  <span style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>{category}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#08a66e' }}>{count}</span>
              </div>
            )) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>No data available</div>
            )}
          </div>
        </div>

        {/* Filters and List */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header" style={{ padding: '20px 32px' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '15px' }}>Global Ticket Repository</h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-control"
                  style={{ flex: 1, minWidth: '130px', maxWidth: '200px', padding: '8px 12px', fontSize: '13px', fontWeight: '600' }}
                >
                  <option value="">All Departments</option>
                  <option value="Technical">Technical</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="Support">Support</option>
                </select>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="form-control"
                  style={{ flex: 1, minWidth: '130px', maxWidth: '200px', padding: '8px 12px', fontSize: '13px', fontWeight: '600' }}
                >
                  <option value="">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ESCALATED">Escalated</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '32px' }}>Ticket</th>
                  <th>Student Information</th>
                  <th>Department</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '32px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td style={{ paddingLeft: '32px' }}>
                      <span className="ticket-id" style={{ fontWeight: '800' }}>{complaint.ticketId}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{complaint.userId.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{complaint.userId.email}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af' }}>{complaint.category}</span>
                    </td>
                    <td>{getStatusBadge(complaint.status)}</td>
                    <td style={{ textAlign: 'right', paddingRight: '32px' }}>
                      <Link 
                        to={`/ticket/${complaint._id}`} 
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 16px' }}
                      >
                        Audit Ticket
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredComplaints.length === 0 && (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No tickets matching your current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;