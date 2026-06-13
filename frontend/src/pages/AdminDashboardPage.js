import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evRes, statsRes] = await Promise.all([
        adminAPI.getEvents(),
        adminAPI.getStats(),
      ]);
      setEvents(evRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await adminAPI.approveEvent(id);
      setMessage('✅ Event approved and organizer notified!');
      setSelectedEvent(null);
      fetchData();
    } catch (e) {
      setMessage('❌ Action failed.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      await adminAPI.rejectEvent(id, rejectReason);
      setMessage('Event rejected and organizer notified.');
      setSelectedEvent(null);
      setRejectReason('');
      fetchData();
    } catch (e) {
      setMessage('❌ Action failed.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const filteredEvents = events.filter(e => filter === 'ALL' ? true : e.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Admin nav */}
      <div style={{
        background: 'var(--bg3)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Clash Display, sans-serif', color: 'var(--accent)' }}>
            EventHub
          </Link>
          <span style={{ color: 'var(--border)', fontSize: 20 }}>|</span>
          <span style={{ color: 'var(--text3)', fontSize: 14 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: 'var(--text2)', fontSize: 14 }}>👤 {admin?.name}</span>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64, flex: 1 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Pending Review', count: stats.pending, color: 'var(--gold)', icon: '⏳' },
            { label: 'Approved', count: stats.approved, color: '#40916c', icon: '✅' },
            { label: 'Rejected', count: stats.rejected, color: '#e57373', icon: '❌' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{ fontSize: 32 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.count}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {message && (
          <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
            {message}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          {[
            { key: 'PENDING', label: `Pending (${stats.pending})` },
            { key: 'APPROVED', label: `Approved (${stats.approved})` },
            { key: 'REJECTED', label: `Rejected (${stats.rejected})` },
            { key: 'ALL', label: 'All Events' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                background: filter === tab.key ? 'var(--accent)' : 'transparent',
                color: filter === tab.key ? '#fff' : 'var(--text3)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event list */}
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <h3>No {filter.toLowerCase()} events</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredEvents.map(event => (
              <div key={event.id} style={{
                background: 'var(--surface)',
                border: `1px solid ${selectedEvent?.id === event.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: 20,
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 16 }}>{event.title}</h3>
                      <span className={`badge badge-${event.status.toLowerCase()}`}>{event.status}</span>
                      {!event.emailVerified && (
                        <span style={{ fontSize: 11, color: 'var(--gold)', background: 'rgba(246,201,14,0.08)', padding: '2px 8px', borderRadius: 20 }}>
                          Email unverified
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text3)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span>📅 {format(new Date(event.eventDate), 'MMM d, yyyy h:mm a')}</span>
                      <span>📍 {event.location}</span>
                      <span>🏷 {event.category}</span>
                      <span>👤 {event.organizerName} ({event.organizerEmail})</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 8, lineHeight: 1.5 }}>
                      {event.description.slice(0, 200)}{event.description.length > 200 ? '...' : ''}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
                    {event.status === 'PENDING' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(event.id)}
                          disabled={actionLoading}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                          disabled={actionLoading}
                        >
                          ✗ Reject
                        </button>
                      </>
                    )}
                    {event.status === 'APPROVED' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                        disabled={actionLoading}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>

                {/* Reject form inline */}
                {selectedEvent?.id === event.id && (
                  <div style={{
                    marginTop: 16,
                    padding: 16,
                    background: 'rgba(155,34,38,0.1)',
                    border: '1px solid rgba(155,34,38,0.2)',
                    borderRadius: 8,
                  }}>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>
                      Rejection reason (will be emailed to organizer):
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      rows={2}
                      placeholder="e.g. Incomplete event details, inappropriate content, etc."
                      style={{ resize: 'vertical', marginBottom: 10 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(event.id)}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Processing...' : 'Confirm Rejection'}
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => { setSelectedEvent(null); setRejectReason(''); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
