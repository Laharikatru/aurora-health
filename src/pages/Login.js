import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const { setCurrentPage, setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = (firebaseUser) => {
    const u = {
      name: firebaseUser.displayName || email.split('@')[0],
      email: firebaseUser.email,
      uid: firebaseUser.uid
    };
    localStorage.setItem('aurora_user', JSON.stringify(u));
    setUser(u);
const isNew = !localStorage.getItem('aurora_onboarded');
  setCurrentPage(isNew ? 'onboarding' : 'home');  };

  const handleEmailAuth = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      const result = isSignUp
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      handleSuccess(result.user);
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(' (auth/invalid-credential).', ''));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      handleSuccess(result.user);
    } catch (err) {
      setError('Google sign in failed. Try email instead.');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', padding: '80px 24px 40px', 
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(135deg, #0F0F1A 0%, #1A1A2E 100%)'
    }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 16, color: '#7C3AED', fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>AURORA</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
          {isSignUp ? 'Create Account ✨' : 'Welcome back 👋'}
        </h1>
        <p style={{ color: '#666680', fontSize: 15 }}>
          {isSignUp ? 'Start your health journey today' : 'Sign in to continue your health journey'}
        </p>
      </div>

      <div style={{ flex: 1 }}>
        {error && (
          <div style={{
            background: 'rgba(255,80,80,0.15)',
            border: '1px solid rgba(255,80,80,0.3)',
            borderRadius: 12, padding: '12px 16px',
            marginBottom: 16, color: '#ff6b6b', fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}

        <label style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 6, display: 'block' }}>Email</label>
        <input
          type="email" placeholder="you@email.com" value={email}
          onChange={e => setEmail(e.target.value)} style={{ marginBottom: 16 }}
        />

        <label style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 6, display: 'block' }}>Password</label>
        <input
          type="password" placeholder="••••••••" value={password}
          onChange={e => setPassword(e.target.value)} style={{ marginBottom: 28 }}
        />

        <button
          className="btn-primary"
          onClick={handleEmailAuth}
          disabled={loading}
          style={{ marginBottom: 12, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <button
          className="btn-secondary"
          onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
        >
          {isSignUp ? 'Already have an account? Sign In' : 'New here? Create Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div style={{ color: '#555570', fontSize: 13, marginBottom: 16 }}>or continue with</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1 }}
              onClick={handleGoogle} disabled={loading}
            >
              🔵 Google
            </button>
            <button
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1, opacity: 0.5 }}
              disabled
            >
              🍎 Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
