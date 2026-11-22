import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddEvent({ user }) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventVenue: '',
    eventCategory: 'Technical',
    totalSeats: 50,
    registrationLastDate: '',
    charge: 0,
  });

  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (parseInt(formData.totalSeats, 10) <= 0) {
      setAlert({ type: 'danger', text: 'Total seats must be greater than 0.' });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalSeats: parseInt(formData.totalSeats, 10),
          charge: parseFloat(formData.charge) || 0.0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: 'Event created successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1200);
      } else {
        setAlert({ type: 'danger', text: data.message || 'Failed to create event.' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Server error. Could not create event.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Create New Event</h2>
        <Link to="/admin-dashboard" className="btn btn-outline btn-sm">&larr; Back to Dashboard</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      <div className="form-container form-wide" style={{ marginTop: '10px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name *</label>
            <input
              type="text"
              id="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="e.g. National Robotics Championship 2026"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventCategory">Event Category *</label>
              <select id="eventCategory" value={formData.eventCategory} onChange={handleChange} required>
                <option value="Technical">Technical</option>
                <option value="Workshop">Workshop</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="eventVenue">Event Venue *</label>
              <input
                type="text"
                id="eventVenue"
                value={formData.eventVenue}
                onChange={handleChange}
                placeholder="e.g. Main Auditorium / CSE Lab 3"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Event Date *</label>
              <input
                type="date"
                id="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="eventTime">Event Time *</label>
              <input
                type="text"
                id="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM or 02:30 PM"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalSeats">Total Seats Available *</label>
              <input
                type="number"
                id="totalSeats"
                min="1"
                max="10000"
                value={formData.totalSeats}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registrationLastDate">Registration Last Date *</label>
              <input
                type="date"
                id="registrationLastDate"
                value={formData.registrationLastDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="charge">Registration Fee / Charge (₹) * (0 for Free)</label>
            <input
              type="number"
              id="charge"
              min="0"
              step="any"
              value={formData.charge}
              onChange={handleChange}
              placeholder="0 for Free, or amount in ₹"
              required
            />
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Note: 0 means Free. If amount is set, student sees the fee and gets an "Offline Paid" note upon registration.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="eventDescription">Event Description *</label>
            <textarea
              id="eventDescription"
              rows="5"
              value={formData.eventDescription}
              onChange={handleChange}
              placeholder="Provide detailed information regarding the event, schedule, rules, and eligibility..."
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, padding: '11px' }}
              disabled={submitting}
            >
              {submitting ? 'Saving Event...' : 'Save & Publish Event'}
            </button>
            <Link to="/admin-dashboard" className="btn btn-secondary" style={{ flex: 1, padding: '11px' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
