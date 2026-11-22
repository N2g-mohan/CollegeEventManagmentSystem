import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
      {/* Hero Section */}
      <div className="hero">
        <h2>Welcome to Campus Event Hub</h2>
        <p>
          Discover exciting college events, technical symposiums, workshops, and cultural fests.
          Students can sign up and register for events with one click.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Student Registration
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '10px 20px' }}>
            Sign In to Portal
          </Link>
        </div>
      </div>

      <div className="page-header">
        <h2>Upcoming College Events</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading upcoming events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#666' }}>No upcoming events scheduled right now.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((evt) => {
            const isFull = evt.isSeatFull;
            return (
              <div key={evt.id} className="event-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="event-category-badge">{evt.eventCategory}</span>
                    {evt.charge && evt.charge > 0 ? (
                      <span className="badge badge-warning">Fee: ₹{evt.charge}</span>
                    ) : (
                      <span className="badge badge-success">Free Entry</span>
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
                  <Link to="/login" className="btn btn-primary btn-sm btn-block">
                    Login to Participate
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;
