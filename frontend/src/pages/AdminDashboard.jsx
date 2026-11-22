import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard({ user }) {
  const [events, setEvents] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    loadEvents();
  }, [user]);

  const loadEvents = () => {
    setLoading(true);
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: 'danger', text: 'Failed to load events.' });
        setLoading(false);
      });
  };

  const handleDelete = async (id, eventName) => {
    if (!window.confirm(`Are you sure you want to delete "${eventName}"?\nAll registrations will also be removed.`)) {
      return;
    }
    setAlert(null);

    try {
      const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: data.message || 'Event deleted.' });
        loadEvents();
      } else {
        setAlert({ type: 'danger', text: data.message || 'Failed to delete event' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Error deleting event.' });
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

  let totalSeats = 0;
  let totalRegs = 0;
  events.forEach((e) => {
    totalSeats += e.totalSeats || 0;
    totalRegs += e.registeredCount || 0;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h2>Admin Events Dashboard</h2>
        <Link to="/add-event" className="btn btn-primary">+ Add New Event</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      {/* Summary Stat Boxes */}
      <div className="stats-row">
        <div className="stat-box">
          <h4>Total Events</h4>
          <p>{events.length}</p>
        </div>
        <div className="stat-box">
          <h4>Total Seats Offered</h4>
          <p>{totalSeats}</p>
        </div>
        <div className="stat-box">
          <h4>Total Registrations</h4>
          <p style={{ color: '#28a745' }}>{totalRegs}</p>
        </div>
      </div>

      {/* Events Table */}
      <div className="card" style={{ padding: '15px' }}>
        <h3 style={{ fontSize: '17px', color: '#1a4f7c', marginBottom: '12px' }}>Managed Events List</h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666', marginBottom: '15px' }}>No events created yet.</p>
            <Link to="/add-event" className="btn btn-primary">+ Create First Event</Link>
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
                  <th>Total Seats</th>
                  <th>Registered</th>
                  <th>Available</th>
                  <th>Last Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt, index) => (
                  <tr key={evt.id}>
                    <td>{index + 1}</td>
                    <td><strong>{evt.eventName}</strong></td>
                    <td><span className="event-category-badge">{evt.eventCategory}</span></td>
                    <td>
                      {formatDate(evt.eventDate)}
                      <br />
                      <small style={{ color: '#666' }}>{evt.eventTime}</small>
                    </td>
                    <td>{evt.eventVenue}</td>
                    <td>
                      {evt.charge && evt.charge > 0 ? (
                        <span className="badge badge-warning">₹{evt.charge}</span>
                      ) : (
                        <span className="badge badge-success">Free</span>
                      )}
                    </td>
                    <td>{evt.totalSeats}</td>
                    <td>
                      <span style={{ fontWeight: 'bold', color: evt.registeredCount > 0 ? '#1a4f7c' : '#888' }}>
                        {evt.registeredCount}
                      </span>
                    </td>
                    <td>{evt.availableSeats}</td>
                    <td>{formatDate(evt.registrationLastDate)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link
                        to={`/registered-students/${evt.id}`}
                        className="btn btn-primary btn-sm"
                        title="View Registered Students"
                      >
                        Students ({evt.registeredCount})
                      </Link>
                      <Link
                        to={`/edit-event/${evt.id}`}
                        className="btn btn-warning btn-sm"
                        style={{ marginLeft: '4px' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(evt.id, evt.eventName)}
                        className="btn btn-danger btn-sm"
                        style={{ marginLeft: '4px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
