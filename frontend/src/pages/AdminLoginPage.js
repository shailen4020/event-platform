import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@eventplatform.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid credentials. Try admin@eventplatform.com / Admin@123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: 24, textDecoration: 'none',
          }}>
            <div style={{
              width: 40, height: 40, background: 'var(--accent)',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff',
            }}>E</div>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Clash Display, sans-serif' }}>EventHub</span>
          </Link>
          <h1 style={{ fontSize: 26, marginBottom: 8 }}>Admin Portal</h1>
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>Sign in to manage event submissions</p>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 32,
        }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@eventplatform.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12, marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{
            marginTop: 20, padding: 12, background: 'var(--surface2)',
            borderRadius: 8, fontSize: 13, color: 'var(--text3)',
          }}>
            <strong style={{ color: 'var(--text2)' }}>Default credentials:</strong><br />
            Email: admin@eventplatform.com<br />
            Password: Admin@123
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/" style={{ color: 'var(--text3)', fontSize: 14 }}>← Back to site</Link>
        </div>
      </div>
    </div>
  );
}
