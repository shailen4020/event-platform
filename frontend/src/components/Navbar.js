import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: {
    background: 'rgba(10,10,20,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  logoMark: {
    width: 32,
    height: 32,
    background: 'var(--accent)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 900,
    color: '#fff',
    fontFamily: 'Clash Display, sans-serif',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: 'Clash Display, sans-serif',
    color: 'var(--text)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text2)',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
};

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Discover' },
    { to: '/submit', label: '+ Add Event' },
    { to: '/my-events', label: 'My Events' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <div style={styles.logoMark}>E</div>
          <span style={styles.logoText}>EventHub</span>
        </Link>
        <div style={styles.links}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.link,
                ...(location.pathname === link.to ? {
                  background: 'rgba(233,69,96,0.12)',
                  color: 'var(--accent)',
                } : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            style={{
              ...styles.link,
              marginLeft: 8,
              border: '1px solid var(--border)',
              color: 'var(--text3)',
              fontSize: 12,
            }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
