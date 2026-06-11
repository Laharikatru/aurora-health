import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const slides = [
  { icon: '🌟', title: 'Understand yourself better every day.', sub: 'Welcome to Aurora' },
  { icon: '🤝', title: 'Meet your personal health companion.', sub: 'Always by your side' },
  { icon: '💧', title: 'Track hydration, sleep, habits, and nutrition.', sub: 'All in one place' },
  { icon: '✨', title: 'Receive personalized daily insights.', sub: 'Powered by AI' },
  { icon: '🔥', title: 'Build healthier routines through consistency.', sub: 'Start your streak today' },
];

export default function Splash() {
  const { setCurrentPage } = useApp();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('aurora_user');
    if (savedUser) { setCurrentPage('home'); return; }
    const timer = setInterval(() => {
      setSlide(s => { if (s >= slides.length - 1) { clearInterval(timer); } return Math.min(s + 1, slides.length - 1); });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '60px 24px 50px', background: 'linear-gradient(180deg, #0a0a0f 0%, #13131f 100%)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: '#6366f1', fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>AURORA</div>
        <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #6366f1, #a855f7)', margin: '0 auto', borderRadius: 2 }} />
      </div>

      <div className="fade-in" key={slide} style={{ textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: 80, marginBottom: 32 }}>{slides[slide].icon}</div>
        <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>{slides[slide].sub.toUpperCase()}</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.3, color: 'white' }}>{slides[slide].title}</h1>
      </div>

      <div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {slides.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === slide ? 'active' : ''}`} onClick={() => setSlide(i)} style={{ cursor: 'pointer' }} />
          ))}
        </div>
<button className="btn-primary" style={{ width: 300 }} onClick={() => setCurrentPage('login')}>          Get Started →
        </button>
        <button className="btn-secondary" style={{ width: 300, marginTop: 12 }} onClick={() => setCurrentPage('login')}>
          I already have an account
        </button>
      </div>
    </div>
  );
}
