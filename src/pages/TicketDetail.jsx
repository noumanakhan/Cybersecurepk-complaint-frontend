import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { API_URL } from '../config';

const TicketDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
   const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activities, setActivities] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

   useEffect(() => {
    fetchComplaint();
    fetchActivities();
    
    socketRef.current = io(API_URL);
    
    socketRef.current.on('receiveMessage', (message) => {
      setMessages(prev => {
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });
    
    return () => {
      socketRef.current?.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (complaint?.ticketId) {
      socketRef.current.emit('joinTicket', complaint.ticketId);
      fetchMessages();
    }
  }, [complaint]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchComplaint = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/complaints/${id}`);
      setComplaint(response.data);
    } catch (error) {
      console.error('Error fetching complaint:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      if (complaint?.ticketId) {
        const response = await axios.get(`${API_URL}/api/messages/${complaint.ticketId}`);
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
     } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/complaints/${id}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/api/messages`, {
        ticketId: complaint.ticketId,
        message: newMessage
      });
      
      const sentMsg = response.data;
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
      
      socketRef.current?.emit('sendMessage', sentMsg);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/api/complaints/${id}/status`, { status: newStatus });
      setComplaint(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
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
  
  if (!complaint) return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div className="alert alert-error">Ticket not found or you don't have permission to view it.</div>
      <Link to="/dashboard" className="btn btn-primary mt-24">Back to Dashboard</Link>
    </div>
  );

  return (
    <div>
      <div className="page-header-row" style={{ marginBottom: '32px' }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <span className="ticket-id" style={{ fontSize: '15px', padding: '6px 16px', borderRadius: '8px' }}>
              #{complaint.ticketId}
            </span>
            {getStatusBadge(complaint.status)}
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Created {new Date(complaint.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>{complaint.subject}</h1>
        </div>
        <Link to="/dashboard" className="btn btn-outline">
          <span>🔙</span> Back to Tickets
        </Link>
      </div>

      <div className="grid-3" style={{ gap: '32px' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header" style={{ padding: '20px 24px' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>ℹ️</span> Ticket Information
              </h2>
            </div>
            <div className="card-body" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="form-label" style={{ opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Department & Issue</label>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy-dark)', marginTop: '4px' }}>
                    {complaint.category} <span style={{ color: 'var(--text-light)', margin: '0 8px' }}>&raquo;</span> {complaint.subcategory}
                  </div>
                </div>
                
                <div>
                  <label className="form-label" style={{ opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Student Details</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px', fontWeight: '800' }}>
                      {complaint.userId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700' }}>{complaint.userId?.name || 'Unknown Student'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{complaint.userId?.email}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Assigned Support</label>
                  <div style={{ marginTop: '4px' }}>
                    {complaint.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px', background: 'var(--navy)', fontWeight: '800' }}>
                          {complaint.assignedTo.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700' }}>{complaint.assignedTo.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Specialist Assigned</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '12px', borderRadius: '8px', background: '#fff9e6', border: '1px solid #ffeeba', color: '#856404', fontSize: '12px', fontWeight: '600' }}>
                        ⏳ System is matching your ticket...
                      </div>
                    )}
                  </div>
                </div>

                {complaint.attachment && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <label className="form-label" style={{ opacity: 0.6, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Files Provided</label>
                    <a 
                      href={`${API_URL}${complaint.attachment}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ width: '100%', justifyContent: 'center', marginTop: '8px', fontSize: '13px' }}
                    >
                      <span>📎</span> Download Attachment
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(user.role === 'staff' || user.role === 'admin') && (
            <div className="card" style={{ borderTop: '4px solid var(--navy)' }}>
              <div className="card-header">
                <h2 style={{ margin: 0 }}>Specialist Actions</h2>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Set Ticket Status</label>
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="form-control"
                    style={{ height: '44px', fontWeight: '600' }}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PENDING">Pending Info</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ESCALATED">Escalated</option>
                  </select>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Updating status will notify the student and log the change in the history.
                </p>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="card" style={{ marginTop: '24px' }}>
            <div className="card-header" style={{ padding: '20px 24px' }}>
              <h2 style={{ margin: 0, fontSize: '15px' }}>📜 Audit Trail</h2>
            </div>
            <div className="card-body" style={{ padding: '0' }}>
              {activities.length > 0 ? activities.map((act) => (
                <div key={act._id} style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy)' }}>{act.action}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.details}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px' }}>{new Date(act.timestamp).toLocaleString()}</div>
                </div>
              )) : (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>No logs yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Discussion */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
          <div className="card" style={{ height: '700px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="card-header" style={{ background: '#000', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', background: '#28a745', borderRadius: '50%', boxShadow: '0 0 0 4px rgba(40,167,69,0.1)' }}></div>
                <h2 style={{ margin: 0 }}>Resolution Thread</h2>
              </div>
               <span className="badge badge-progress" style={{ fontSize: '10px' }}>Secure Channel</span>
              
              {/* Resolution Controls for Student */}
              {user.role === 'student' && complaint.status === 'RESOLVED' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleStatusChange('CLOSED')} className="btn btn-primary" style={{ background: '#28a745', border: 'none', height: '32px', fontSize: '11px' }}>✅ Accept Solution</button>
                  <button onClick={() => handleStatusChange('IN_PROGRESS')} className="btn btn-outline" style={{ color: '#dc3545', borderColor: '#dc3545', height: '32px', fontSize: '11px' }}>❌ Not Satisfied</button>
                </div>
              )}

              {/* Quick Actions for Staff */}
              {user.role === 'staff' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {complaint.status === 'OPEN' && <button onClick={() => handleStatusChange('IN_PROGRESS')} className="btn btn-outline btn-sm" style={{ height: '32px', fontSize: '11px' }}>🚀 Start Work</button>}
                  {complaint.status !== 'PENDING' && <button onClick={() => handleStatusChange('PENDING')} className="btn btn-outline btn-sm" style={{ height: '32px', fontSize: '11px' }}>❓ Need Info</button>}
                  <button onClick={() => handleStatusChange('RESOLVED')} className="btn btn-primary btn-sm" style={{ height: '32px', fontSize: '11px' }}>✨ Resolve Issue</button>
                </div>
              )}
            </div>
            
            <div className="chat-messages" style={{ flex: 1 }}>
              {/* Initial Problem Statement */}
              <div className="chat-message theirs" style={{ maxWidth: '75%' }}>
                <div className="chat-bubble">
                  <span className="chat-sender">📋 Issue Description</span>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{complaint.description}</p>
                  <span className="chat-time">Original • {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {messages.map((message) => {
                const isMe = message.senderId._id === user._id;
                return (
                  <div key={message._id} className={`chat-message ${isMe ? 'mine' : 'theirs'}`}>
                    <div className="chat-bubble">
                      {!isMe && <span className="chat-sender">{message.senderId.name}</span>}
                      <p style={{ margin: 0 }}>{message.message}</p>
                      <span className="chat-time">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && ' ✓✓'}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  title="Send"
                >
                  {sending ? '⏳' : '➤'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;