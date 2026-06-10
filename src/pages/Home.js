import React from 'react';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { hydration, sleep, habits, meals, setCurrentPage } = useApp();
  const user = JSON.parse(localStorage.getItem('aurora_user') || '{}');
  const doneHabits = habits.filter(h => h.done).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const hydPct = Math.round((hydration.current / hydration.goal) * 100);

  const insights = [
    hydPct < 50 ? `💧 You've only had ${hydPct}% of your water today. Drink up!` : `💧 Great hydration! You're at ${hydPct}% of your daily goal.`,
    sleep.last > 0 ? `😴 You slept ${sleep.last} hours last night. ${sleep.last >= 7 ? 'Well done!' : 'Try to sleep more tonight.'}` : `😴 Log your sleep to get personalized insights.`,
    doneHabits > 0 ? `✅ You've completed ${doneHabits} of ${habits.length} habits today. Keep going!` : `✅ Start your habits for today to build your streak!`,
  ];

  return (
    <div className="page fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p style={{ color: '#666680', fontSize: 14 }}>{greeting} 👋</p>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>{user.name || 'Friend'}</h1>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {user.name ? user.name[0].toUpperCase() : '👤'}
        </div>
      </div>

      {/* Daily Insight */}
      <div className="insight-card">
        <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>✨ DAILY INSIGHT</div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#d0d0f0' }}>{insights[Math.floor(Math.random() * insights.length)]}</p>
      </div>

      {/* Hydration Card */}
      <div className="card card-glow" onClick={() => setCurrentPage('hydration')} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}>💧 HYDRATION</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{hydration.current}<span style={{ fontSize: 14, color: '#666680' }}>/{hydration.goal}ml</span></div>
          </div>
          <div style={{ position: 'relative', width: 60, height: 60 }}>
            <svg width="60" height="60" className="progress-ring">
              <circle cx="30" cy="30" r="25" fill="none" stroke="#1e1e3a" strokeWidth="4" />
              <circle cx="30" cy="30" r="25" fill="none" stroke="url(#grad)" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * (1 - hydPct / 100)}`}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#6366f1' }}>{hydPct}%</div>
          </div>
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: 8, height: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${hydPct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 8, transition: 'width 1s ease' }} />
        </div>
        <p style={{ fontSize: 13, color: '#666680', marginTop: 8 }}>{hydration.goal - hydration.current}ml remaining today</p>
      </div>

      {/* Sleep + Habits Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div className="card" onClick={() => setCurrentPage('sleep')} style={{ cursor: 'pointer', margin: 0 }}>
          <div style={{ fontSize: 13, color: '#a855f7', fontWeight: 600, marginBottom: 8 }}>😴 SLEEP</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{sleep.last || '--'}<span style={{ fontSize: 13, color: '#666680' }}>h</span></div>
          <div style={{ fontSize: 12, color: '#666680', marginTop: 4 }}>Goal: {user.wakeTime && user.bedTime ? '8h' : '8h'}</div>
        </div>
        <div className="card" onClick={() => setCurrentPage('habits')} style={{ cursor: 'pointer', margin: 0 }}>
          <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, marginBottom: 8 }}>✅ HABITS</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{doneHabits}<span style={{ fontSize: 13, color: '#666680' }}>/{habits.length}</span></div>
          <div style={{ fontSize: 12, color: '#666680', marginTop: 4 }}>Done today</div>
        </div>
      </div>

      {/* Nutrition Card */}
      <div className="card" onClick={() => setCurrentPage('nutrition')} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>🍎 NUTRITION</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{meals.calories}<span style={{ fontSize: 12, color: '#666680' }}>kcal</span></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[['Protein', meals.protein, '#6366f1', 50], ['Carbs', meals.carbs, '#a855f7', 150], ['Fat', meals.fat, '#ec4899', 65]].map(([name, val, color, goal]) => (
            <div key={name}>
              <div style={{ fontSize: 11, color: '#666680', marginBottom: 4 }}>{name}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{val}g</div>
              <div className="macro-bar"><div className="macro-fill" style={{ width: `${Math.min((val / goal) * 100, 100)}%`, background: color }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600, marginBottom: 4 }}>🔥 STREAK</div>
          <div style={{ fontSize: 13, color: '#666680' }}>Keep it up!</div>
        </div>
        <div className="streak-badge">🔥 {Math.max(...habits.map(h => h.streak), 0)} days</div>
      </div>

      {/* AI Companion CTA */}
      <div onClick={() => setCurrentPage('companion')} style={{ background: 'linear-gradient(135deg, #1a1a3e, #2a1a4e)', border: '1px solid #3a3a6a', borderRadius: 20, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>🎙️</div>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Talk to Aurora</div>
          <div style={{ fontSize: 13, color: '#666680' }}>Your AI health companion is ready</div>
        </div>
        <div style={{ marginLeft: 'auto', color: '#6366f1', fontSize: 20 }}>→</div>
      </div>
    </div>
  );
}
