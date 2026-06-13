import React, { useState } from 'react';
import { publicAPI } from '../services/api';

const CATEGORIES = ['Technology', 'Business', 'Music', 'Art', 'Sports', 'Food', 'Workshop', 'Health', 'Other'];

export default function SubmitEventPage() {
  const [step, setStep] = useState(1); // 1=form, 2=verify, 3=success
  const [submittedEventId, setSubmittedEventId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    eventDate: '',
    organizerName: '',
    organizerEmail: '',
    imageUrl: '',
    maxAttendees: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location || !form.eventDate || !form.organizerName || !form.organizerEmail) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        eventDate: new Date(form.eventDate).toISOString().slice(0, 19),
        maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null,
      };
      const res = await publicAPI.submitEvent(payload);
      setSubmittedEventId(res.data.data.id);
      setStep(2);
    } catch (e) {
      setError(e.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code from your email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await publicAPI.verifyCode(submittedEventId, verificationCode);
      setStep(3);
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text)',
    padding: '10px 14px',
    width: '100%',
    fontSize: 15,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <div className="container" style={{ paddingTop: 40, maxWidth: 700 }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
          {['Event Details', 'Verify Email', 'Submitted'].map((label, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700,
                  background: step > i + 1 ? 'var(--accent)' : step === i + 1 ? 'var(--accent)' : 'var(--surface2)',
                  color: step >= i + 1 ? '#fff' : 'var(--text3)',
                  border: step === i + 1 ? '2px solid var(--accent)' : '2px solid transparent',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, color: step === i + 1 ? 'var(--accent)' : 'var(--text3)', whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1, height: 2,
                  background: step > i + 1 ? 'var(--accent)' : 'var(--border)',
                  marginBottom: 24, marginLeft: -2, marginRight: -2,
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 32 }}>
          {step === 1 && (
            <>
              <h2 style={{ marginBottom: 8 }}>Submit Your Event</h2>
              <p style={{ color: 'var(--text3)', marginBottom: 24, fontSize: 14 }}>
                Fill in the details below. A verification code will be sent to your email.
              </p>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Event Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Bengaluru Tech Meetup 2025" />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    rows={4} placeholder="Tell attendees what your event is about..." style={{ resize: 'vertical' }} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date & Time *</label>
                    <input type="datetime-local" name="eventDate" value={form.eventDate} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. The Lalit Ashok, Bengaluru" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Organizer Name *</label>
                    <input name="organizerName" value={form.organizerName} onChange={handleChange} placeholder="Your name or org name" />
                  </div>
                  <div className="form-group">
                    <label>Organizer Email *</label>
                    <input type="email" name="organizerEmail" value={form.organizerEmail} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Image URL</label>
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                  </div>
                  <div className="form-group">
                    <label>Max Attendees</label>
                    <input type="number" name="maxAttendees" value={form.maxAttendees} onChange={handleChange} placeholder="Leave blank for unlimited" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', marginTop: 8 }}>
                  {loading ? 'Submitting...' : 'Submit Event →'}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ marginBottom: 8 }}>Check Your Email</h2>
              <p style={{ color: 'var(--text2)', marginBottom: 24 }}>
                We've sent a 6-digit verification code to <strong>{form.organizerEmail}</strong>.
                Enter it below to confirm your submission.
              </p>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleVerify}>
                <input
                  value={verificationCode}
                  onChange={e => { setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  style={{
                    textAlign: 'center', fontSize: 28, letterSpacing: 12,
                    fontWeight: 700, padding: '16px', marginBottom: 16,
                  }}
                />
                <button type="submit" className="btn btn-primary" disabled={loading || verificationCode.length !== 6} style={{ width: '100%', padding: '12px' }}>
                  {loading ? 'Verifying...' : 'Verify & Submit'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline"
                  style={{ width: '100%', marginTop: 12 }}>
                  ← Go Back
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2 style={{ marginBottom: 8 }}>Submission Received!</h2>
              <p style={{ color: 'var(--text2)', marginBottom: 24, lineHeight: 1.7 }}>
                Your event has been submitted and is now <strong style={{ color: 'var(--gold)' }}>pending review</strong>.
                Our admin team will review it shortly and notify you via email once a decision is made.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <a href="/" className="btn btn-primary">Browse Events</a>
                <a href="/submit" className="btn btn-outline">Submit Another</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
