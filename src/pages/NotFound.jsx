import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '120px',
        fontWeight: '900',
        color: 'var(--navy)',
        lineHeight: '1',
        marginBottom: '20px',
        opacity: 0.1,
        position: 'absolute',
        zIndex: -1
      }}>
        404
      </div>
      
      <div style={{ 
        fontSize: '80px', 
        marginBottom: '24px',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
      }}>
        🕵️‍♂️
      </div>
      
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: '800', 
        color: 'var(--navy-dark)',
        marginBottom: '16px' 
      }}>
        Route Not Found
      </h1>
      
      <p style={{ 
        color: 'var(--text-muted)', 
        maxWidth: '400px', 
        lineHeight: '1.6',
        marginBottom: '32px',
        fontSize: '16px'
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        to="/dashboard" 
        className="btn btn-primary"
        style={{
          padding: '14px 40px',
          borderRadius: '12px',
          fontWeight: '700',
          textDecoration: 'none',
          boxShadow: '0 10px 20px rgba(8, 166, 110, 0.2)'
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
