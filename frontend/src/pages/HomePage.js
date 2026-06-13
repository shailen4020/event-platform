import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Technology', 'Business', 'Music', 'Art', 'Sports', 'Food', 'Workshop', 'Health', 'Other'];

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [searchInput, setSearchInput] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await publicAPI.getEvents(params);
      setEvents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, var(--bg3) 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '60px 24px 40px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(233,69,96,0.12)',
            border: '1px solid rgba(233,69,96,0.2)',
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 12,
            color: 'var(--accent)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 20,
          }}>
            ✦ Bengaluru & Beyond
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.1 }}>
            Discover Events<br />
            <span style={{ color: 'var(--accent)' }}>Worth Attending</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Find the best local events — from tech meetups to music festivals — or share your own.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, maxWidth: 560, margin: '0 auto' }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search events, venues, organizers..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Category filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: category === cat ? 'var(--accent)' : 'var(--surface)',
                color: category === cat ? '#fff' : 'var(--text2)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, color: 'var(--text2)', fontWeight: 500 }}>
            {loading ? 'Loading...' : `${events.length} event${events.length !== 1 ? 's' : ''} found`}
          </h2>
          {(search || category !== 'All') && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setSearch(''); setSearchInput(''); setCategory('All'); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3>No events found</h3>
            <p>Try different search terms or <a href="/submit" style={{ color: 'var(--accent)' }}>add an event</a></p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
