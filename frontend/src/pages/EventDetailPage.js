import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { format } from 'date-fns';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI.getEvent(id)
      .then(res => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading event...</div>;
  if (!event) return <div className="empty-state"><h3>Event not found</h3></div>;

  const date = new Date(event.eventDate);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header image / gradient */}
      <div style={{
        height: 300,
        background: event.imageUrl
          ? `linear-gradient(to bottom, transparent 40%, var(--bg)), url(${event.imageUrl}) center/cover`
          : 'linear-gradient(135deg, var(--bg3), var(--surface))',
        display: 'flex',
        alignItems: 'flex-end',
      }}>
        <div className="container" style={{ paddingBottom: 24 }}>
          <Link to="/" style={{ color: 'var(--text3)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
            ← Back to events
          </Link>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            background: 'rgba(233,69,96,0.2)',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {event.category}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', maxWidth: 700 }}>{event.title}</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
          {/* Main content */}
          <div>
            <h2 style={{ marginBottom: 16, fontSize: 20 }}>About this event</h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>

            <div style={{ marginTop: 32, padding: 20, background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: 12, fontSize: 16 }}>Organizer</h3>
              <p style={{ color: 'var(--text2)' }}>{event.organizerName}</p>
              <p style={{ color: 'var(--text3)', fontSize: 14 }}>{event.organizerEmail}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>📅 Date & Time</div>
                  <div style={{ fontWeight: 600 }}>{format(date, 'EEEE, MMMM d, yyyy')}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 14 }}>{format(date, 'h:mm a')}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>📍 Location</div>
                  <div style={{ fontWeight: 500, color: 'var(--text2)' }}>{event.location}</div>
                </div>
                {event.maxAttendees && (
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>👥 Capacity</div>
                    <div style={{ color: 'var(--text2)' }}>{event.maxAttendees} attendees</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
