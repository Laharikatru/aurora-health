import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const habitIcons = ['🧘', '🚶', '📚', '💊', '🏋️', '🧹', '✍️', '🎯', '💧', '🌿'];

export default function Habits() {
  const { habits, toggleHabit, addHabit } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🎯');

  const doneCount = habits.filter(h => h.done).length;
  const pct = Math.round((doneCount / habits.length) * 100);

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>✅ Habits</h2>
        <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', borderRadius: 10, padding: '8px 16px', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
      </div>
      <p style={{ color: '#666680', fontSize: 14, marginBottom: 28 }}>Build consistency every day</p>

      {/* Progress */}
      <div className="card card-glow" style={{ textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ fontSize: 48, fontWeight: 800 }} className="gradient-text">{doneCount}/{habits.length}</div>
        <div style={{ fontSize: 14, color: '#666680', marginBottom: 16 }}>habits completed today</div>
        <div style={{ background: '#1a1a2e', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 8, transition: 'width 1s ease' }} />
        </div>
        <div style={{ fontSize: 13, color: '#6366f1', marginTop: 8, fontWeight: 600 }}>{pct}% complete</div>
      </div>

      {/* Habit List */}
      {habits.map(h => (
        <div key={h.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', opacity: h.done ? 0.8 : 1 }} onClick={() => toggleHabit(h.id)}>
          <div className={`habit-check ${h.done ? 'done' : ''}`}>{h.done ? '✓' : ''}</div>
          <div style={{ fontSize: 24 }}>{h.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, textDecoration: h.done ? 'line-through' : 'none', color: h.done ? '#666680' : 'white' }}>{h.name}</div>
            <div style={{ fontSize: 12, color: '#555570', marginTop: 2 }}>🔥 {h.streak} day streak</div>
          </div>
          {h.done && <div style={{ fontSize: 20 }}>⭐</div>}
        </div>
      ))}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add New Habit</h3>
            <input placeholder="Habit name..." value={newName} onChange={e => setNewName(e.target.value)} style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 14, color: '#a0a0c0', marginBottom: 10 }}>Choose an icon</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {habitIcons.map(ic => (
                <span key={ic} onClick={() => setNewIcon(ic)} style={{ fontSize: 24, cursor: 'pointer', padding: 6, borderRadius: 8, background: newIcon === ic ? '#2a2a4a' : 'transparent', border: newIcon === ic ? '2px solid #6366f1' : '2px solid transparent' }}>{ic}</span>
              ))}
            </div>
            <button className="btn-primary" onClick={() => { if (newName) { addHabit(newName, newIcon); setNewName(''); setShowAdd(false); } }}>Add Habit</button>
          </div>
        </div>
      )}
    </div>
  );
}
