import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const goals = ['Improve Hydration', 'Sleep Better', 'Build Better Habits', 'Eat Healthier', 'Improve Energy', 'Stay Consistent'];
const activityLevels = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'];

export default function Onboarding() {
  const { setCurrentPage, setUser } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', age: '', gender: '', height: '', weight: '', wakeTime: '07:00', bedTime: '23:00', activity: '', goals: [] });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleGoal = (g) => update('goals', form.goals.includes(g) ? form.goals.filter(x => x !== g) : [...form.goals, g]);

  const steps = [
    <div className="fade-in">
      <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>What's your name?</h2>
      <p style={{ color: '#666680', marginBottom: 28, fontSize: 15 }}>Let's personalize your experience</p>
      <input placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input placeholder="Age" type="number" value={form.age} onChange={e => update('age', e.target.value)} />
        <select value={form.gender} onChange={e => update('gender', e.target.value)}>
          <option value="">Gender</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <input placeholder="Height (cm)" type="number" value={form.height} onChange={e => update('height', e.target.value)} />
        <input placeholder="Weight (kg)" type="number" value={form.weight} onChange={e => update('weight', e.target.value)} />
      </div>
    </div>,

    <div className="fade-in">
      <div style={{ fontSize: 40, marginBottom: 16 }}>🌙</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your daily schedule</h2>
      <p style={{ color: '#666680', marginBottom: 28, fontSize: 15 }}>Help Aurora understand your routine</p>
      <label style={{ color: '#a0a0c0', fontSize: 13, marginBottom: 6, display: 'block' }}>Wake up time</label>
      <input type="time" value={form.wakeTime} onChange={e => update('wakeTime', e.target.value)} style={{ marginBottom: 16 }} />
      <label style={{ color: '#a0a0c0', fontSize: 13, marginBottom: 6, display: 'block' }}>Bedtime</label>
      <input type="time" value={form.bedTime} onChange={e => update('bedTime', e.target.value)} style={{ marginBottom: 16 }} />
      <label style={{ color: '#a0a0c0', fontSize: 13, marginBottom: 10, display: 'block' }}>Activity Level</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {activityLevels.map(a => (
          <span key={a} className={`tag ${form.activity === a ? 'selected' : ''}`} onClick={() => update('activity', a)}>{a}</span>
        ))}
      </div>
    </div>,

    <div className="fade-in">
      <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your health goals</h2>
      <p style={{ color: '#666680', marginBottom: 28, fontSize: 15 }}>Select all that apply</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {goals.map(g => (
          <span key={g} className={`tag ${form.goals.includes(g) ? 'selected' : ''}`} onClick={() => toggleGoal(g)}>{g}</span>
        ))}
      </div>
    </div>
  ];

  const handleFinish = () => {
    const userData = { ...form, hydrationGoal: parseInt(form.weight) * 33 || 2500 };
    localStorage.setItem('aurora_user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('home');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '60px 24px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
          {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ background: 'none', border: 'none', color: '#a0a0c0', fontSize: 24, cursor: 'pointer', marginRight: 16 }}>←</button>}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {steps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? '#6366f1' : '#1e1e3a', transition: 'background 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
        {steps[step]}
      </div>
      <div style={{ marginTop: 32 }}>
        {step < steps.length - 1
          ? <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
          : <button className="btn-primary" onClick={handleFinish}>Start My Journey 🚀</button>
        }
      </div>
    </div>
  );
}
