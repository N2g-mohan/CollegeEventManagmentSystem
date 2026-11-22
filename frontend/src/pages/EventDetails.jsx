import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EventDetails({ user }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadEvent();
  }, [id, user]);

  const loadEvent = () => {
    setLoading(true);
    fetch(`/api/events/${id}?userId=${user?.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: 'danger', text: 'Failed to load event details.' });
        setLoading(false);
      });
  };

  const handleParticipate = async () => {
    if (!window.confirm('Are you sure you want to participate in this event?')) return;
    setAlert(null);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, eventId: event.id }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: data.message || 'Registered successfully!' });
        loadEvent();
      } else {
        setAlert({ type: 'danger', text: data.message || 'Registration failed' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Error registering for event.' });
      console.error(err);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return;
    setAlert(null);

    try {
      const response = await fetch(`/api/registrations?userId=${user.id}&eventId=${event.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: data.message || 'Registration cancelled.' });
        loadEvent();
      } else {
        setAlert({ type: 'danger', text: data.message || 'Cancellation failed' });
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

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="alert alert-danger">Event not found.</div>
        <Link to="/student-dashboard" className="btn btn-secondary">Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Event Details & Registration</h2>
        <Link to="/student-dashboard" className="btn btn-outline btn-sm">&larr; Back to Events</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '24px', color: '#1a4f7c' }}>{event.eventName}</h3>
          <div>
            <span className="event-category-badge" style={{ fontSize: '13px', padding: '4px 10px' }}>
              {event.eventCategory}
            </span>
            {event.charge && event.charge > 0 ? (
              <span className="badge badge-warning" style={{ fontSize: '13px', padding: '4px 10px', marginLeft: '8px' }}>
                Fee: ₹{event.charge}
              </span>
            ) : (
              <span className="badge badge-success" style={{ fontSize: '13px', padding: '4px 10px', marginLeft: '8px' }}>
                Fee: Free
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', margin: '20px 0', padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Entry Fee</span>
            <strong style={{ fontSize: '15px', color: event.charge && event.charge > 0 ? '#b8860b' : '#28a745' }}>
              {event.charge && event.charge > 0 ? `₹${event.charge} (Offline Payment)` : 'Free Entry'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Date & Time</span>
            <strong style={{ fontSize: '15px', color: '#222' }}>{formatDate(event.eventDate)} at {event.eventTime}</strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Venue</span>
            <strong style={{ fontSize: '15px', color: '#222' }}>{event.eventVenue}</strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Registration Last Date</span>
            <strong style={{ fontSize: '15px', color: '#222' }}>{formatDate(event.registrationLastDate)}</strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Total Seats</span>
            <strong style={{ fontSize: '15px', color: '#222' }}>{event.totalSeats}</strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Registered Students</span>
            <strong style={{ fontSize: '15px', color: '#1a4f7c' }}>{event.registeredCount}</strong>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#666', display: 'block', textTransform: 'uppercase' }}>Available Seats</span>
            <strong style={{ fontSize: '15px', color: '#28a745' }}>{event.availableSeats}</strong>
          </div>
        </div>

        <div style={{ margin: '25px 0' }}>
          <h4 style={{ fontSize: '16px', color: '#333', marginBottom: '8px' }}>Event Description</h4>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {event.eventDescription}
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '25px 0' }} />

        {/* Action Area */}
        <div>
          {event.isUserRegistered ? (
            <div>
              <div className="alert alert-success" style={{ marginBottom: '12px' }}>
                You are registered for this event!
              </div>
              <button onClick={handleCancel} className="btn btn-danger">Cancel Registration</button>
              <Link to="/student-dashboard" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                Back to Events
              </Link>
            </div>
          ) : event.isRegistrationClosed ? (
            <div>
              <div className="alert alert-danger" style={{ marginBottom: '12px' }}>
                Registration deadline passed on {formatDate(event.registrationLastDate)}.
              </div>
              <Link to="/student-dashboard" className="btn btn-secondary">Back to Events</Link>
            </div>
          ) : event.isSeatFull ? (
            <div>
              <div className="alert alert-danger" style={{ marginBottom: '12px' }}>
                All {event.totalSeats} seats have been filled.
              </div>
              <Link to="/student-dashboard" className="btn btn-secondary">Back to Events</Link>
            </div>
          ) : (
            <div>
              <button onClick={handleParticipate} className="btn btn-success" style={{ padding: '10px 24px', fontSize: '16px' }}>
                Participate in Event
              </button>
              <Link to="/student-dashboard" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                Back to Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
