import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const quickAmounts = [150, 250, 350, 500];

export default function Hydration() {
  const { hydration, addWater } = useApp();
  const [custom, setCustom] = useState('');
  const pct = Math.min((hydration.current / hydration.goal) * 100, 100);

  return (
    <div className="page fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>💧 Hydration</h2>
      <p style={{ color: '#666680', fontSize: 14, marginBottom: 28 }}>Stay hydrated, stay healthy</p>

      {/* Animated Water Bottle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="water-bottle" style={{ width: 100, height: 180 }}>
            <div className="bottle-cap" style={{ width: 40, height: 16 }} />
            <div className="bottle-body" style={{ width: 80, height: 150 }}>
              <div className="bottle-fill" style={{ height: `${pct}%` }}>
                {pct > 10 && <div className="bottle-wave" />}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 32, fontWeight: 800 }} className="gradient-text">
            {hydration.current}ml
          </div>
          <div style={{ fontSize: 14, color: '#666680' }}>of {hydration.goal}ml goal</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, color: '#6366f1' }}>{Math.round(pct)}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: '#a0a0c0' }}>Daily Progress</span>
          <span style={{ fontSize: 14, color: '#6366f1', fontWeight: 600 }}>{hydration.goal - hydration.current}ml left</span>
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: 8, height: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 8, transition: 'width 1s ease' }} />
        </div>
      </div>

      {/* Quick Add */}
      <div className="card">
        <div style={{ fontSize: 14, color: '#a0a0c0', fontWeight: 600, marginBottom: 14 }}>Quick Add</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {quickAmounts.map(a => (
            <button key={a} className="quick-add-btn" onClick={() => addWater(a)}>+{a}ml</button>
          ))}
        </div>
      </div>

      {/* Custom Add */}
      <div className="card">
        <div style={{ fontSize: 14, color: '#a0a0c0', fontWeight: 600, marginBottom: 14 }}>Custom Amount</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input type="number" placeholder="Enter ml..." value={custom} onChange={e => setCustom(e.target.value)} style={{ flex: 1 }} />
          <button className="btn-primary" style={{ width: 'auto', padding: '14px 20px' }} onClick={() => { if (custom) { addWater(parseInt(custom)); setCustom(''); } }}>Add</button>
        </div>
      </div>

      {/* Tips */}
      <div className="insight-card">
        <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginBottom: 8 }}>💡 HYDRATION TIP</div>
        <p style={{ fontSize: 14, color: '#d0d0f0', lineHeight: 1.6 }}>
          {pct < 30 ? "You're behind on hydration. Try drinking a full glass right now!" : pct < 70 ? "You're making progress! Keep sipping throughout the day." : "Excellent hydration! You're almost at your daily goal. 🎉"}
        </p>
      </div>
    </div>
  );
}
