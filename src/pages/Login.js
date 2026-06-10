import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { setCurrentPage, setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const saved = localStorage.getItem('aurora_user');
    if (saved) { setUser(JSON.parse(saved)); setCurrentPage('home'); }
    else { const u = { name: email.split('@')[0], email }; localStorage.setItem('aurora_user', JSON.stringify(u)); setUser(u); setCurrentPage('home'); }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px 40px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 16, color: '#6366f1', fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>AURORA</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back 👋</h1>
        <p style={{ color: '#666680', fontSize: 15 }}>Sign in to continue your health journey</p>
      </div>

      <div style={{ flex: 1 }}>
        <label style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 6, display: 'block' }}>Email</label>
        <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 16 }} />
        <label style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 6, display: 'block' }}>Password</label>
        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: 28 }} />
        <button className="btn-primary" onClick={handleLogin} style={{ marginBottom: 12 }}>Sign In</button>
        <button className="btn-secondary" onClick={() => setCurrentPage('onboarding')}>Create new account</button>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{ color: '#555570', fontSize: 13, marginBottom: 16 }}>or continue with</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={handleLogin}>🔵 Google</button>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={handleLogin}>🍎 Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}
