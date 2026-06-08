import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    subject: '',
    description: '',
    attachment: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = {
    'Technical': ['Software Issues', 'Hardware Problems', 'Network Issues', 'Account Access'],
    'Accounts': ['Fee Payment', 'Refund Request', 'Financial Aid', 'Billing Inquiry'],
    'Scholarship': ['Application Help', 'Eligibility Check', 'Document Submission', 'Status Update'],
    'Support': ['General Inquiry', 'Academic Advising', 'Career Services', 'Other']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { subcategory: '' })
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachment: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('description', formData.description);
      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment);
      }

      await axios.post(`${API_URL}/api/complaints`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '100%', padding: '0 20px' }}>
      <div className="page-header-row" style={{ marginBottom: '40px', alignItems: 'flex-start' }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{
              width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '24px', color: '#fff',
              boxShadow: '0 8px 16px rgba(8, 166, 110, 0.2)'
            }}>✍️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>Lodge a Complaint</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
                Our specialized team is here to assist you with any program-related issues.
              </p>
            </div>
          </div>
        </div>
        <Link to="/dashboard" className="btn btn-outline" style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: '700' }}>
          <span>🔙</span> Dashboard
        </Link>
      </div>
      
      <div className="card" style={{ 
        boxShadow: '0 20px 50px rgba(0,0,0,0.05)', 
        borderRadius: '20px', 
        border: '1px solid rgba(8, 166, 110, 0.1)',
        width: '100%',
        margin: '0 auto'
      }}>
        <div className="card-header" style={{ 
          background: '#161b22', 
          padding: '32px 40px', 
          borderBottom: '1px solid #198754',
          borderRadius: '20px 20px 0 0'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>Ticket Information</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>Please be as descriptive as possible to help us help you.</p>
          </div>
          <div style={{ 
            background: 'rgba(220, 53, 69, 0.08)', color: '#dc3545', 
            padding: '6px 14px', borderRadius: '8px', fontSize: '11px', 
            fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' 
          }}>
            Required Fields
          </div>
        </div>
        
        <div className="card-body" style={{ padding: '40px' }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '32px', borderRadius: '12px' }}>
              <span>⚠️</span> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className="grid-2" style={{ gap: '32px', marginBottom: '32px' }}>
              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.name || ''}
                  disabled
                  style={{ 
                    width: '100%', height: '56px', padding: '0 20px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600', border: '1px solid #198754', background: '#111', color: '#fff'
                  }}
                />
              </div>
              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                  Student ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={user?._id?.substring(0, 8).toUpperCase() || ''}
                  disabled
                  style={{ 
                    width: '100%', height: '56px', padding: '0 20px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600', border: '1px solid #198754', background: '#111', color: '#fff'
                  }}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '32px', marginBottom: '32px' }}>
              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                  Department Selection <span>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  required
                  style={{ 
                    width: '100%', height: '56px', padding: '0 20px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600', border: '1px solid #198754',
                    appearance: 'none', background: '#000 url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23198754%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E") no-repeat right 20px center',
                    backgroundSize: '12px auto',
                    color: '#fff'
                  }}
                >
                  <option value="">Choose Department</option>
                  {Object.keys(categories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <p className="form-text" style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>Routing depends on this selection</p>
              </div>
              
              <div className="form-group" style={{ width: '100%' }}>
                <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                  Problem Type <span>*</span>
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="form-control"
                  required
                  disabled={!formData.category}
                  style={{ 
                    width: '100%', height: '56px', padding: '0 20px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: '600', border: '1px solid #198754',
                    appearance: 'none', background: '#000 url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23198754%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E") no-repeat right 20px center',
                    backgroundSize: '12px auto',
                    color: '#fff'
                  }}
                >
                  <option value="">Select Category First</option>
                  {formData.category && categories[formData.category].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <p className="form-text" style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>Narrow down the issue for faster support</p>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '32px', width: '100%' }}>
              <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                Ticket Subject <span>*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-control"
                placeholder="Briefly summarize your request (e.g., Unable to submit scholarship documents)"
                required
                style={{ 
                  width: '100%', height: '56px', padding: '0 20px', borderRadius: '12px',
                  fontSize: '15px', border: '1px solid #198754', background: '#000', color: '#fff', transition: 'all 0.2s'
                }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '32px', width: '100%' }}>
              <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                Detailed Description <span>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Provide a thorough explanation. Include any error messages, dates, and steps you've already taken. More detail results in faster resolution."
                required
                style={{ 
                  width: '100%', minHeight: '280px', padding: '24px', borderRadius: '16px',
                  fontSize: '16px', border: '1px solid #198754', lineHeight: '1.8',
                  background: '#000', color: '#fff', resize: 'vertical'
                }}
              ></textarea>
              <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '11px', color: 'var(--text-light)', fontWeight: '600' }}>
                MINIMUM 20 CHARACTERS RECOMMENDED
              </div>
            </div>
            
            <div className="form-group" style={{ width: '100%' }}>
              <label className="form-label" style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                Supporting Media / Documents
              </label>
              <div style={{
                width: '100%',
                border: '2px dashed #198754',
                borderRadius: '16px',
                padding: '40px 20px',
                textAlign: 'center',
                background: '#000',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--navy)';
                e.currentTarget.style.background = 'rgba(25, 135, 84, 0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#198754';
                e.currentTarget.style.background = '#000';
              }}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
                  <div style={{ 
                    width: '64px', height: '64px', background: 'var(--green-light)', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', margin: '0 auto 20px',
                    fontSize: '28px'
                  }}>
                    {formData.attachment ? '📄' : '☁️'}
                  </div>
                  <div style={{ fontWeight: '800', color: 'var(--navy-dark)', fontSize: '16px' }}>
                    {formData.attachment ? formData.attachment.name : 'Upload Screenshots or Logs'}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Drag and drop your file here or <span style={{ color: 'var(--navy)', fontWeight: '700', textDecoration: 'underline' }}>Browse Device</span>
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-light)', background: '#f5f5f5', padding: '4px 10px', borderRadius: '4px' }}>MAX 10MB</div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-light)', background: '#f5f5f5', padding: '4px 10px', borderRadius: '4px' }}>PDF, PNG, JPG</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div style={{
              marginTop: '48px',
              paddingTop: '32px',
              borderTop: '2px solid #f9fbf9',
              display: 'flex',
              gap: '20px',
              justifyContent: 'flex-end',
              width: '100%'
            }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
                style={{ padding: '14px 40px', borderRadius: '12px', border: '2px solid #eee', color: '#666' }}
                disabled={loading}
              >
                Discard Ticket
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ 
                  padding: '14px 60px', borderRadius: '12px', fontSize: '16px', 
                  fontWeight: '800', boxShadow: '0 12px 24px rgba(8, 166, 110, 0.25)',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
              >
                {loading ? '🚀 Initializing...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '40px', padding: '24px 32px', borderRadius: '16px', 
        background: 'linear-gradient(135deg, #06754e 0%, #08a66e 100%)', 
        color: '#fff', display: 'flex', gap: '20px', alignItems: 'center', 
        boxShadow: '0 10px 30px rgba(6, 117, 78, 0.15)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ fontSize: '32px', opacity: 0.9 }}>🔒</div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700' }}>End-to-End Encrypted Submission</h4>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.85, lineHeight: '1.6' }}>
            Your privacy is our priority. All complaints are securely transmitted to authorized program coordinators. 
            You can track real-time updates and chat with assigned specialists directly from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;