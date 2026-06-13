import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CATEGORY_COLORS = {
  Technology: '#4895ef',
  Business: '#f6c90e',
  Music: '#e94560',
  Art: '#b5838d',
  Sports: '#4cc9f0',
  Food: '#f77f00',
  Workshop: '#7209b7',
  Health: '#40916c',
  Other: '#6c757d',
};

export default function EventCard({ event }) {
  const color = CATEGORY_COLORS[event.category] || '#6c757d';
  const date = new Date(event.eventDate);

  return (
    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
          e.currentTarget.style.borderColor = 'rgba(233,69,96,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      >
        {/* Image / Color header */}
        <div style={{
          height: 160,
          background: event.imageUrl
            ? `url(${event.imageUrl}) center/cover no-repeat`
            : `linear-gradient(135deg, ${color}22, ${color}44)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {!event.imageUrl && (
            <span style={{ fontSize: 48, opacity: 0.5 }}>
              {event.category === 'Music' ? '🎵' :
               event.category === 'Technology' ? '💻' :
               event.category === 'Food' ? '🍴' :
               event.category === 'Sports' ? '⚽' :
               event.category === 'Art' ? '🎨' :
               event.category === 'Workshop' ? '🛠️' : '📅'}
            </span>
          )}

          {/* Date chip */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(10,10,20,0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 8,
            padding: '4px 10px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              {format(date, 'd')}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {format(date, 'MMM')}
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Category */}
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            background: `${color}22`,
            color: color,
            alignSelf: 'flex-start',
          }}>
            {event.category}
          </span>

          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
            {event.title}
          </h3>

          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 'auto' }}>
            📍 {event.location}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTop: '1px solid var(--border)',
            marginTop: 4,
          }}>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>
              🕐 {format(date, 'h:mm a')}
            </span>
            <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
