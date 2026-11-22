import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAlert(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: data.message || 'Login successful!' });
        sessionStorage.setItem('currentUser', JSON.stringify(data.user));
        setUser(data.user);

        setTimeout(() => {
          if (data.user.role === 'ADMIN') {
            navigate('/admin-dashboard');
          } else {
            navigate('/student-dashboard');
          }
        }, 600);
      } else {
        setAlert({ type: 'danger', text: data.message || 'Invalid email or password' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Server connection error. Make sure backend is running.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ fontSize: '22px', color: '#1a4f7c', textAlign: 'center', marginBottom: '8px' }}>
          Portal Login
        </h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Enter your credentials to access your account
        </p>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@college.edu"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ padding: '10px', fontSize: '15px', marginTop: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#1a4f7c', fontWeight: 'bold', textDecoration: 'none' }}>
            Student Signup
          </Link>
        </div>

        {/* Demo Hint Box */}
        <div
          style={{
            marginTop: '25px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            border: '1px dashed #ced4da',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#555',
          }}
        >
          <strong>Demo Credentials:</strong>
          <br />• <strong>Admin:</strong> <code>admin@college.edu</code> / <code>admin123</code>
          <br />• <strong>Student:</strong> <code>rahul.sharma@college.edu</code> / <code>password123</code> (or register a new student)
        </div>
      </div>
    </div>
  );
}

export default Login;
