import React, { useState } from 'react';
import { publicAPI } from '../services/api';
import { format } from 'date-fns';

export default function MyEventsPage() {
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await publicAPI.getMyEvents(email);
      setEvents(res.data);
      setSearched(true);
    } catch (e) {
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <div className="container" style={{ paddingTop: 48, maxWidth: 800 }}>
        <h1 style={{ marginBottom: 8 }}>My Submitted Events</h1>
        <p style={{ color: 'var(--text3)', marginBottom: 32 }}>
          Enter your organizer email to view your event submissions and their status.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your organizer email..."
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {searched && events.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <h3>No events found</h3>
            <p>No submissions found for this email address.</p>
          </div>
        )}

        {events.map(event => (
          <div key={event.id} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: 20,
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h3 style={{ fontSize: 16 }}>{event.title}</h3>
                <span className={`badge badge-${event.status.toLowerCase()}`}>{event.status}</span>
                {!event.emailVerified && event.status === 'PENDING' && (
                  <span style={{ fontSize: 11, color: 'var(--gold)', background: 'rgba(246,201,14,0.1)', padding: '2px 8px', borderRadius: 20 }}>
                    ⚠ Email not verified
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text3)', flexWrap: 'wrap' }}>
                <span>📅 {format(new Date(event.eventDate), 'MMM d, yyyy')}</span>
                <span>📍 {event.location}</span>
                <span>🏷 {event.category}</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
              Submitted {format(new Date(event.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
