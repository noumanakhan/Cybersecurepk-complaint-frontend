import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import loginBg from '../assets/login.jpg';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ 
      minHeight: '100vh', 
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: `linear-gradient(rgba(6, 9, 15, 0.9), rgba(6, 9, 15, 0.9)), url(${loginBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="auth-topbar" style={{ borderBottom: 'none' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '12px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(8, 166, 110, 0.15)'
        }}>
          <img src={logo} alt="Logo" style={{ width: '60px', height: '25px', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 style={{ color: '#08a66e' }}>Complaint Cell</h1>
          <p>National Cybersecurity Awareness & Training Programme</p>
        </div>
      </div>

      <div className="auth-body" style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px 20px',
        overflowY: 'auto'
      }}>
        <div className="auth-form-area" style={{ width: '100%', maxWidth: '560px' }}>
          <div className="auth-form-box" style={{ margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '15px' }}>Sign in to your account to continue</p>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '24px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
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

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔑</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="••••••••"
                    required
                    style={{ height: '56px', paddingLeft: '52px', fontSize: '15px', borderRadius: '12px', border: '1px solid #198754', background: '#000', color: '#fff' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%', height: '56px', fontSize: '16px', fontWeight: '800',
                  borderRadius: '12px', boxShadow: '0 10px 20px rgba(8, 166, 110, 0.25)',
                  marginTop: '8px'
                }}
              >
                {loading ? '⏳ Signing In...' : '🔐 Sign In'}
              </button>
            </form>

            {/* <div className="auth-footer-link" style={{ marginTop: '32px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--navy)', fontWeight: '700', textDecoration: 'none' }}>Create Account</Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;