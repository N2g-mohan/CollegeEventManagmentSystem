import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    sessionStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo-area">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h1>College Event Management System</h1>
          </Link>
          <small>Campus Events, Seminars, Workshops & Cultural Activities</small>
        </div>

        <nav>
          {!user ? (
            <>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Student Signup</Link>
            </>
          ) : user.role === 'ADMIN' ? (
            <>
              <Link to="/admin-dashboard" className={location.pathname === '/admin-dashboard' ? 'active' : ''}>Events Dashboard</Link>
              <Link to="/add-event" className={location.pathname === '/add-event' ? 'active' : ''}>+ Add Event</Link>
              <span className="user-badge">Admin: {user.fullName}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/student-dashboard" className={location.pathname === '/student-dashboard' ? 'active' : ''}>Available Events</Link>
              <Link to="/my-events" className={location.pathname === '/my-events' ? 'active' : ''}>My Registrations</Link>
              <span className="user-badge">Student: {user.fullName}</span>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
