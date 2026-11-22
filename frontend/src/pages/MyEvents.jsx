import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MyEvents({ user }) {
  const [registrations, setRegistrations] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadRegistrations();
  }, [user]);

  const loadRegistrations = () => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/registrations/student/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRegistrations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: 'danger', text: 'Failed to load registrations.' });
        setLoading(false);
      });
  };

  const handleCancel = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) return;
    setAlert(null);

    try {
      const response = await fetch(`/api/registrations?userId=${user.id}&eventId=${eventId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: data.message || 'Registration cancelled.' });
        loadRegistrations();
      } else {
        setAlert({ type: 'danger', text: data.message || 'Failed to cancel registration' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Error cancelling registration.' });
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>My Registered Events</h2>
        <Link to="/student-dashboard" className="btn btn-outline btn-sm">&larr; Available Events</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading your registered events...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '15px' }}>
            You have not registered for any events yet.
          </p>
          <Link to="/student-dashboard" className="btn btn-primary">
            Browse Available Events
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, index) => {
                const evt = reg.event;
                return (
                  <tr key={reg.id}>
                    <td>{index + 1}</td>
                    <td><strong>{evt.eventName}</strong></td>
                    <td><span className="event-category-badge">{evt.eventCategory}</span></td>
                    <td>{formatDate(evt.eventDate)} at {evt.eventTime}</td>
                    <td>{evt.eventVenue}</td>
                    <td>
                      {evt.charge && evt.charge > 0 ? (
                        <span className="badge badge-warning">₹{evt.charge}</span>
                      ) : (
                        <span className="badge badge-success">Free</span>
                      )}
                    </td>
                    <td><span className="badge badge-success">{reg.status || 'CONFIRMED'}</span></td>
                    <td>
                      <Link to={`/event-details/${evt.id}`} className="btn btn-outline btn-sm">
                        View
                      </Link>
                      <button
                        onClick={() => handleCancel(evt.id)}
                        className="btn btn-danger btn-sm"
                        style={{ marginLeft: '6px' }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyEvents;
