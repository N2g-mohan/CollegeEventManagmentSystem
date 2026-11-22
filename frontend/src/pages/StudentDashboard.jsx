import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function StudentDashboard({ user }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [user]);

  const fetchEvents = () => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/events?userId=${user.id}`)
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

  const handleQuickParticipate = async (eventId) => {
    if (!window.confirm('Confirm your participation in this event?')) return;
    setAlert(null);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, eventId }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: data.message || 'Registered successfully!' });
        fetchEvents();
      } else {
        setAlert({ type: 'danger', text: data.message || 'Participation failed' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Error participating in event.' });
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

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.eventName.toLowerCase().includes(search.toLowerCase()) ||
      evt.eventVenue.toLowerCase().includes(search.toLowerCase()) ||
      evt.eventDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'ALL' || evt.eventCategory === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Available College Events</h2>
          {user && (
            <small style={{ color: '#555', fontSize: '14px' }}>
              Welcome, {user.fullName} ({user.department} - {user.academicYear})
            </small>
          )}
        </div>
        <div>
          <Link to="/my-events" className="btn btn-primary btn-sm">
            View My Registrations
          </Link>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      {/* Search & Filter */}
      <div className="card" style={{ padding: '15px', marginBottom: '25px' }}>
        <div className="form-row" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="searchEvent">Search by Event Name / Venue</label>
            <input
              type="text"
              id="searchEvent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type event name or venue..."
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, maxWidth: '250px' }}>
            <label htmlFor="filterCategory">Filter by Category</label>
            <select
              id="filterCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Workshop">Workshop</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading available events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((evt) => {
            const isReg = evt.isUserRegistered;
            const isClosed = evt.isRegistrationClosed;
            const isFull = evt.isSeatFull;

            return (
              <div key={evt.id} className="event-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span className="event-category-badge">{evt.eventCategory}</span>
                      {evt.charge && evt.charge > 0 ? (
                        <span className="badge badge-warning" style={{ marginLeft: '6px' }}>₹{evt.charge}</span>
                      ) : (
                        <span className="badge badge-success" style={{ marginLeft: '6px' }}>Free</span>
                      )}
                    </div>
                    {isReg ? (
                      <span className="badge badge-success">Registered</span>
                    ) : isClosed ? (
                      <span className="badge badge-danger">Registration Closed</span>
                    ) : isFull ? (
                      <span className="badge badge-secondary">Seats Full</span>
                    ) : (
                      <span className="badge badge-success">Open</span>
                    )}
                  </div>

                  <h3>{evt.eventName}</h3>
                  <div className="event-meta">
                    📅 <strong>Date:</strong> {formatDate(evt.eventDate)} at {evt.eventTime}
                  </div>
                  <div className="event-meta">
                    📍 <strong>Venue:</strong> {evt.eventVenue}
                  </div>
                  <div className="event-meta">
                    ⏳ <strong>Last Date:</strong> {formatDate(evt.registrationLastDate)}
                  </div>
                  <div className={`seats-pill ${isFull ? 'seats-full' : 'seats-available'}`}>
                    {isFull ? '0 Seats Left (Full)' : `${evt.availableSeats} of ${evt.totalSeats} Seats Available`}
                  </div>
                  <p className="event-desc">
                    {evt.eventDescription && evt.eventDescription.length > 120
                      ? evt.eventDescription.substring(0, 120) + '...'
                      : evt.eventDescription}
                  </p>
                </div>

                <div style={{ marginTop: '15px' }}>
                  {isReg ? (
                    <Link to={`/event-details/${evt.id}`} className="btn btn-primary btn-sm btn-block">
                      View Details
                    </Link>
                  ) : isClosed || isFull ? (
                    <Link to={`/event-details/${evt.id}`} className="btn btn-secondary btn-sm btn-block">
                      View Details
                    </Link>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/event-details/${evt.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                        Details
                      </Link>
                      <button
                        onClick={() => handleQuickParticipate(evt.id)}
                        className="btn btn-success btn-sm"
                        style={{ flex: 1 }}
                      >
                        Participate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
