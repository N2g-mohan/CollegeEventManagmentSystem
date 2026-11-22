import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function EditEvent({ user }) {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then((data) => {
        setFormData({
          eventName: data.eventName || '',
          eventDescription: data.eventDescription || '',
          eventDate: data.eventDate || '',
          eventTime: data.eventTime || '',
          eventVenue: data.eventVenue || '',
          eventCategory: data.eventCategory || 'Technical',
          totalSeats: data.totalSeats || 50,
          registrationLastDate: data.registrationLastDate || '',
          charge: data.charge !== undefined && data.charge !== null ? data.charge : 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: 'danger', text: 'Failed to load event data.' });
        setLoading(false);
      });
  }, [id, user]);

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
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalSeats: parseInt(formData.totalSeats, 10),
          charge: parseFloat(formData.charge) || 0.0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: 'Event updated successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1200);
      } else {
        setAlert({ type: 'danger', text: data.message || 'Failed to update event.' });
      }
    } catch (err) {
      setAlert({ type: 'danger', text: 'Server error. Could not update event.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading event for editing...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Edit College Event</h2>
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
              required
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            <button
              type="submit"
              className="btn btn-warning"
              style={{ flex: 2, padding: '11px' }}
              disabled={submitting}
            >
              {submitting ? 'Updating Event...' : 'Update Event'}
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

export default EditEvent;
