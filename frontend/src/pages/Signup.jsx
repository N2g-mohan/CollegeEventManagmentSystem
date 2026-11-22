import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeRollNumber: '',
    department: '',
    academicYear: '',
  });

  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: 'danger', text: 'Passwords do not match!' });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({ type: 'danger', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setSubmitting(true);

    try {
      const studentPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        collegeRollNumber: formData.collegeRollNumber.trim(),
        department: formData.department,
        academicYear: formData.academicYear,
        role: 'STUDENT',
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentPayload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: 'Account created successfully! Redirecting to login...' });
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setAlert({ type: 'danger', text: data.message || 'Signup failed' });
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
      <div className="form-container form-wide">
        <h2 style={{ fontSize: '22px', color: '#1a4f7c', textAlign: 'center', marginBottom: '8px' }}>
          Student Registration
        </h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          Create your student profile to view and register for college events
        </p>

        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">College / Personal Email *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john.doe@college.edu"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="collegeRollNumber">College Roll Number *</label>
              <input
                type="text"
                id="collegeRollNumber"
                value={formData.collegeRollNumber}
                onChange={handleChange}
                placeholder="e.g. 21CS045"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select id="department" value={formData.department} onChange={handleChange} required>
                <option value="">-- Select Department --</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Management Studies (MBA)">Management Studies (MBA)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="academicYear">Academic Year *</label>
              <select id="academicYear" value={formData.academicYear} onChange={handleChange} required>
                <option value="">-- Select Year --</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ padding: '11px', fontSize: '15px', marginTop: '10px' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#555' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#1a4f7c', fontWeight: 'bold', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
