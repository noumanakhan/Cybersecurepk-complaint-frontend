import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-topbar" style={{ justifyContent: 'center' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '12px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(8, 166, 110, 0.15)'
        }}>
          <img src={logo} alt="Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 style={{ color: '#08a66e' }}>CyberSecure Pakistan</h1>
          <p>National Cybersecurity Awareness & Training Programme</p>
        </div>
      </div>

      <div className="auth-body">
        <div className="auth-form-area" style={{ width: '100%', minHeight: 'calc(100vh - 100px)' }}>
          <div className="auth-form-box" style={{ margin: '40px auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Create Account</h2>
            <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '15px' }}>Fill in your details to get started</p>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Muhammad Ali Khan"
                    required
                    style={{ height: '56px', paddingLeft: '52px', fontSize: '15px', borderRadius: '12px', border: '1px solid #198754', background: '#000', color: '#fff' }}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>📧</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="your@email.com"
                      required
                      style={{ height: '56px', paddingLeft: '52px', fontSize: '15px', borderRadius: '12px', border: '1px solid #198754', background: '#000', color: '#fff' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Program Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-control"
                    style={{ 
                      height: '56px', borderRadius: '12px', border: '1px solid #198754',
                      fontSize: '15px', fontWeight: '600', padding: '0 20px',
                      color: '#fff',
                      appearance: 'none', background: '#000 url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23198754%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E") no-repeat right 20px center',
                      backgroundSize: '12px auto'
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="staff">Program Staff</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '20px', marginBottom: '32px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔑</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Min. 6 chars"
                      required
                      style={{ height: '56px', paddingLeft: '52px', fontSize: '15px', borderRadius: '12px', border: '1px solid #198754', background: '#000', color: '#fff' }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Confirm</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🛡️</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Repeat it"
                      required
                      style={{ height: '56px', paddingLeft: '52px', fontSize: '15px', borderRadius: '12px', border: '1px solid #198754', background: '#000', color: '#fff' }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%', height: '56px', fontSize: '16px', fontWeight: '800',
                  borderRadius: '12px', boxShadow: '0 10px 20px rgba(8, 166, 110, 0.25)',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}
              >
                {loading ? '⏳ Processing...' : '✅ Create Account'}
              </button>
            </form>

            <div className="auth-footer-link" style={{ marginTop: '32px' }}>
              Already have an account? <Link to="/" style={{ color: 'var(--navy)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;