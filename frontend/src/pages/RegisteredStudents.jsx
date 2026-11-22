import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function RegisteredStudents({ user }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    loadData();
  }, [id, user]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch(`/api/events/${id}`).then((r) => r.json()),
      fetch(`/api/registrations/event/${id}`).then((r) => r.json()),
    ])
      .then(([eventData, regData]) => {
        setEvent(eventData);
        setRegistrations(regData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: 'danger', text: 'Failed to load registered students.' });
        setLoading(false);
      });
  };

  const handleRemoveStudent = async (registrationId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove "${studentName}" from this event?`)) {
      return;
    }
    setAlert(null);

    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', text: `Removed "${studentName}" successfully.` });
        loadData();
      } else {
        setAlert({ type: 'danger', text: data.message || 'Failed to remove student.' });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'danger', text: 'Error removing student from event.' });
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
        <p>Loading registered students list...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>Event Registered Students</h2>
          {event && (
            <small style={{ color: '#666', fontSize: '13px' }}>
              <strong>{event.eventName}</strong> | {formatDate(event.eventDate)} at {event.eventTime} | Venue: {event.eventVenue}
              {event.charge && event.charge > 0 ? ` | Fee: ₹${event.charge}` : ' | Fee: Free'}
            </small>
          )}
        </div>
        <Link to="/admin-dashboard" className="btn btn-outline btn-sm">&larr; Back to Dashboard</Link>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '17px', color: '#1a4f7c' }}>Registered Students List</h3>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a4f7c' }}>
            Total Registered: {registrations.length} / {event?.totalSeats} seats
          </span>
        </div>

        {registrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#666' }}>No students have registered for this event yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Registration Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, index) => {
                  const student = reg.user;
                  const regTime = reg.registrationDate
                    ? reg.registrationDate.replace('T', ' ').substring(0, 19)
                    : '-';
                  return (
                    <tr key={reg.id}>
                      <td>{index + 1}</td>
                      <td><strong>{student.collegeRollNumber || '-'}</strong></td>
                      <td>{student.fullName}</td>
                      <td>{student.email}</td>
                      <td>{student.department || '-'}</td>
                      <td>{student.academicYear || '-'}</td>
                      <td>{regTime}</td>
                      <td><span className="badge badge-success">{reg.status || 'CONFIRMED'}</span></td>
                      <td>
                        <button
                          onClick={() => handleRemoveStudent(reg.id, student.fullName)}
                          className="btn btn-danger btn-sm"
                          title="Remove student registration"
                        >
                          Remove
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
    </div>
  );
}

export default RegisteredStudents;
