import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' };

const quickMeals = {
  breakfast: [{ name: 'Oats + Milk', cal: 350, p: 12, c: 60, f: 7 }, { name: 'Eggs + Toast', cal: 320, p: 18, c: 30, f: 12 }],
  lunch: [{ name: 'Rice + Dal', cal: 450, p: 15, c: 80, f: 8 }, { name: 'Chapati + Sabzi', cal: 380, p: 12, c: 65, f: 10 }],
  dinner: [{ name: 'Khichdi', cal: 300, p: 10, c: 55, f: 6 }, { name: 'Roti + Paneer', cal: 420, p: 20, c: 50, f: 16 }],
  snacks: [{ name: 'Banana', cal: 90, p: 1, c: 23, f: 0 }, { name: 'Nuts (30g)', cal: 180, p: 6, c: 8, f: 15 }],
};

export default function Nutrition() {
  const { meals, logMeal } = useApp();
  const [active, setActive] = useState(null);

  const totalGoal = 2000;
  const calPct = Math.min((meals.calories / totalGoal) * 100, 100);

  return (
    <div className="page fade-in">
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🍎 Nutrition</h2>
      <p style={{ color: '#666680', fontSize: 14, marginBottom: 28 }}>Awareness of what you eat</p>

      {/* Calories */}
      <div className="card card-glow" style={{ textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600, marginBottom: 8 }}>TODAY'S CALORIES</div>
        <div style={{ fontSize: 52, fontWeight: 800 }} className="gradient-text">{meals.calories}</div>
        <div style={{ fontSize: 14, color: '#666680', marginBottom: 16 }}>of {totalGoal} kcal</div>
        <div style={{ background: '#1a1a2e', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${calPct}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: 8, transition: 'width 1s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
          {[['Protein', meals.protein + 'g', '#6366f1'], ['Carbs', meals.carbs + 'g', '#a855f7'], ['Fat', meals.fat + 'g', '#ec4899']].map(([n, v, c]) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 12, color: '#666680' }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Cards */}
      {mealTypes.map(type => (
        <div key={type}>
          <div className="meal-card" onClick={() => setActive(active === type ? null : type)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{mealIcons[type]}</span>
              <div>
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{type}</div>
                <div style={{ fontSize: 12, color: '#666680' }}>{meals[type] || 'Not logged yet'}</div>
              </div>
            </div>
            <div style={{ color: '#6366f1', fontSize: 20 }}>{active === type ? '↑' : '↓'}</div>
          </div>
          {active === type && (
            <div className="card slide-up" style={{ marginTop: -8 }}>
              <div style={{ fontSize: 13, color: '#a0a0c0', marginBottom: 12 }}>Quick log:</div>
              {quickMeals[type].map(m => (
                <div key={m.name} onClick={() => { logMeal(type, m.name, m.cal, m.p, m.c, m.f); setActive(null); }}
                  style={{ background: '#1a1a2e', borderRadius: 10, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>{m.name}</span>
                  <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>{m.cal} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
